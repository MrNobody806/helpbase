// auth.js - Consolidated Cloudflare Worker
const authAPI = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, *",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === "/auth/signup" && request.method === "POST") {
        return handleSignup(request, env);
      }

      if (path === "/auth/login" && request.method === "POST") {
        return handleLogin(request, env);
      }

      if (path === "/api/health" && request.method === "GET") {
        return jsonResponse({
          status: "ok",
          environment: "production",
          message: "Auth worker is running correctly",
        });
      }

      return jsonResponse({ error: "Endpoint not found" }, 404);
    } catch (error) {
      console.error("💥 Unexpected error:", error);
      return jsonResponse(
        { error: error.message || "Internal Server Error" },
        500
      );
    }
  },
};

async function handleSignup(request, env) {
  try {
    const { full_name, company_name, email, password } = await request.json();

    if (!full_name || !company_name || !email || !password) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    // 1️⃣ Create Supabase Auth user
    const authResponse = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
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
    console.log("✅ Supabase auth response:", authData);

    if (!authData.id) {
      console.error("❌ Supabase returned invalid user:", authData);
      throw new Error("Invalid Supabase user returned");
    }

    const userId = authData.id;
    console.log("👤 User created with ID:", userId);

    // 2️⃣ Create user in database
    const dbResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
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

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error("❌ Database error:", errorText);
      throw new Error("Failed to create user record");
    }

    // 3️⃣ Create starter subscription
    const subResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          user_id: userId,
          plan: "starter",
          status: "active",
          current_period_end: null,
        }),
      }
    );

    if (!subResponse.ok) {
      const errorText = await subResponse.text();
      console.error("❌ Subscription error:", errorText);
      throw new Error("Failed to create subscription");
    }

    // 4️⃣ Create Chatwoot account
    const accountResp = await createChatwootAccount(company_name, email, env);
    const accountId = Number(accountResp?.id || accountResp?.data?.id);

    if (!accountId)
      throw new Error(
        "Failed to create Chatwoot account: No account ID returned"
      );
    console.log("✅ Chatwoot account created:", accountId);

    // 5️⃣ Create Chatwoot platform user
    const userResp = await createChatwootPlatformUser(
      full_name,
      email,
      password,
      env
    );
    const platformUserId = Number(userResp?.id || userResp?.data?.id);

    if (!platformUserId)
      throw new Error("Failed to create Chatwoot user: No user ID returned");
    console.log("✅ Chatwoot user created:", platformUserId);

    // 6️⃣ Link user to Chatwoot account
    await createAccountUserLink(accountId, platformUserId, env);
    console.log("🔗 Linked Chatwoot account and user");

    // 7️⃣ Store mapping
    const mappingResp = await fetch(
      `${env.SUPABASE_URL}/rest/v1/chatwoot_mappings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          user_id: userId,
          account_id: accountId,
          user_account_id: platformUserId,
        }),
      }
    );

    if (!mappingResp.ok) {
      const errorText = await mappingResp.text();
      console.error("❌ Mapping error:", errorText);
      throw new Error("Failed to store user mapping");
    }

    console.log("🗺️ User mapping stored successfully");

    // 8️⃣ Generate SSO URL
    const ssoUrl = await generateChatwootSSO(platformUserId, env);
    const dashboardUrl = `${env.DASHBOARD_URL}/app/accounts/${accountId}/dashboard`;

    console.log("🎉 Signup successful!", { dashboardUrl, ssoUrl });

    return jsonResponse({
      success: true,
      user_id: userId,
      email,
      dashboardUrl,
      ssoUrl,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("💥 Signup error:", error);
    return jsonResponse(
      {
        error: error.message || "Signup failed",
        details: "Check server logs for more information",
      },
      500
    );
  }
}

async function handleLogin(request, env) {
  try {
    const { access_token } = await request.json();

    const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    const { user, error } = await userResponse.json();
    if (error || !user) throw new Error("Invalid session");

    const mappingResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/chatwoot_mappings?user_id=eq.${user.id}&select=account_id,user_account_id`,
      {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    const mapping = await mappingResponse.json();
    if (!mapping || mapping.length === 0)
      throw new Error("Chatwoot account not found for user");

    const { account_id, user_account_id } = mapping[0];
    const ssoUrl = await generateChatwootSSO(user_account_id, env);
    const dashboardBase = env.DASHBOARD_URL || "https://app.helpbase.co";
    const dashboardUrl = `${dashboardBase}/app/accounts/${account_id}/dashboard`;

    return jsonResponse({
      success: true,
      ssoUrl,
      dashboardUrl,
      message: "Login successful",
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// --- Chatwoot helpers ---
async function createChatwootAccount(companyName, email, env) {
  const response = await fetch(
    `${env.CHATWOOT_BASE_URL}/platform/api/v1/accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
      },
      body: JSON.stringify({
        name: companyName,
        locale: "en",
        domain: `${companyName.toLowerCase().replace(/\s+/g, "-")}.helpbase.co`,
        support_email: email,
        status: "active",
        limits: {},
        custom_attributes: {},
      }),
    }
  );

  if (!response.ok)
    throw new Error(
      `Chatwoot Account API error: ${response.status} ${await response.text()}`
    );
  return response.json();
}

async function createChatwootPlatformUser(name, email, password, env) {
  const response = await fetch(
    `${env.CHATWOOT_BASE_URL}/platform/api/v1/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
      },
      body: JSON.stringify({ name, email, password, custom_attributes: {} }),
    }
  );

  if (!response.ok)
    throw new Error(
      `Chatwoot User API error: ${response.status} ${await response.text()}`
    );
  return response.json();
}

async function createAccountUserLink(accountId, userId, env) {
  const response = await fetch(
    `${env.CHATWOOT_BASE_URL}/platform/api/v1/accounts/${accountId}/account_users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
      },
      body: JSON.stringify({ user_id: userId, role: "administrator" }),
    }
  );

  if (!response.ok)
    throw new Error(
      `Chatwoot Account User API error: ${
        response.status
      } ${await response.text()}`
    );
  return response.json();
}

async function generateChatwootSSO(userId, env) {
  const response = await fetch(
    `${env.CHATWOOT_BASE_URL}/platform/api/v1/users/${userId}/login`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
      },
    }
  );

  if (!response.ok)
    throw new Error(
      `Chatwoot SSO API error: ${response.status} ${await response.text()}`
    );
  const data = await response.json();
  if (!data.url) throw new Error("SSO URL not returned");
  return data.url;
}

// --- JSON helper ---
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, *",
    },
  });
}

// Export default
export default {
  async fetch(request, env) {
    return authAPI.fetch(request, env);
  },
};
