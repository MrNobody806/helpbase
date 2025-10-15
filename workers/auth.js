const authAPI = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (path === "/api/auth/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }

    if (path === "/api/auth/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (path === "/api/health" && request.method === "GET") {
      return jsonResponse({
        status: "ok",
        environment: env.ENVIRONMENT || "production",
      });
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
};

async function handleSignup(request, env) {
  try {
    const { full_name, company_name, email, password } = await request.json();

    if (!full_name || !company_name || !email || !password) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    // Create Supabase user
    const authResponse = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apiKey: env.SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, company_name },
        }),
      }
    );

    const authData = await authResponse.json();
    if (authData.error) throw new Error(authData.error.message);

    const userId = authData.user.id;

    // Create user record
    await fetch(`${env.SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apiKey: env.SUPABASE_SERVICE_ROLE_KEY,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: userId,
        email,
        full_name,
        company_name,
        role: "administrator",
      }),
    });

    // Create Chatwoot account
    const account = await createChatwootAccount(company_name, email, env);
    const accountId = account.id;

    // Create Chatwoot user
    const user = await createChatwootUser(full_name, email, password, env);
    const platformUserId = user.id;

    // Link account and user
    await linkChatwootAccount(accountId, platformUserId, env);

    // Store mapping
    await fetch(`${env.SUPABASE_URL}/rest/v1/chatwoot_mappings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apiKey: env.SUPABASE_SERVICE_ROLE_KEY,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        account_id: accountId,
        user_account_id: platformUserId,
      }),
    });

    // Generate SSO URL
    const ssoUrl = await generateChatwootSSO(accountId, platformUserId, env);
    const dashboardUrl = `${env.DASHBOARD_URL}/app/accounts/${accountId}/dashboard`;

    return jsonResponse({
      success: true,
      user_id: userId,
      email,
      dashboardUrl,
      ssoUrl,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}

async function handleLogin(request, env) {
  try {
    const { access_token } = await request.json();

    // Verify user
    const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        apiKey: env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    const { user, error } = await userResponse.json();
    if (error || !user) throw new Error("Invalid session");

    // Get Chatwoot mapping
    const mappingResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/chatwoot_mappings?user_id=eq.${user.id}&select=account_id,user_account_id`,
      {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apiKey: env.SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    const mapping = await mappingResponse.json();
    if (!mapping || mapping.length === 0) {
      throw new Error("Chatwoot account not found");
    }

    const { account_id, user_account_id } = mapping[0];
    const ssoUrl = await generateChatwootSSO(account_id, user_account_id, env);
    const dashboardUrl = `${env.DASHBOARD_URL}/app/accounts/${account_id}/dashboard`;

    return jsonResponse({
      success: true,
      ssoUrl,
      dashboardUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Chatwoot helpers
async function createChatwootAccount(name, email, env) {
  const response = await fetch(`${env.CHATWOOT_URL}/api/v1/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
    },
    body: JSON.stringify({ name, locale: "en" }),
  });
  return response.json();
}

async function createChatwootUser(name, email, password, env) {
  const response = await fetch(`${env.CHATWOOT_URL}/api/v1/platform/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      platform_access_token: env.CHATWOOT_PLATFORM_TOKEN,
    },
    body: JSON.stringify({ name, email, password, custom_attributes: {} }),
  });
  return response.json();
}

async function linkChatwootAccount(accountId, userId, env) {
  await fetch(
    `${env.CHATWOOT_URL}/api/v1/accounts/${accountId}/account_users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
      },
      body: JSON.stringify({ user_id: userId, role: "administrator" }),
    }
  );
}

async function generateChatwootSSO(accountId, userId, env) {
  const response = await fetch(`${env.CHATWOOT_URL}/api/v1/platform/sso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      platform_access_token: env.CHATWOOT_PLATFORM_TOKEN,
    },
    body: JSON.stringify({ account_id: accountId, user_id: userId }),
  });
  const data = await response.json();
  return data.sso_url;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default authAPI;
