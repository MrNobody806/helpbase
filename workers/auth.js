// auth.js - Consolidated Cloudflare Worker
import { createClient } from "@supabase/supabase-js";
const authAPI = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    // const corsHeaders = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    //   "Access-Control-Allow-Headers": "Content-Type, Authorization, *",
    // };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

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
  },
};

async function handleSignup(request, env) {
  // Create a server-side Supabase client instance
  // The service role key is required for admin actions and to bypass RLS.
  const supabase = createClient(
    env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );

  try {
    const { full_name, company_name, email, password } = await request.json();

    if (!full_name || !company_name || !email || !password) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    // Step 1: Create Supabase Auth user using the admin API
    // `auth.admin.createUser` requires the service role key.
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, company_name },
      });

    if (authError) {
      console.error("❌ Supabase auth error:", authError);
      return jsonResponse({ error: authError.message }, 500);
    }

    const userId = authData.user.id;
    console.log("👤 User created with ID:", userId);

    // Step 2: Create user record in the 'users' table
    const { error: dbError } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name,
      company_name,
      role: "administrator",
    });

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return jsonResponse({ error: "Failed to create user record" }, 500);
    }

    // Step 3: Create starter subscription
    const { error: subError } = await supabase.from("subscriptions").insert({
      user_id: userId,
      plan: "starter",
      status: "active",
    });

    if (subError) {
      console.error("❌ Subscription error:", subError);
      return jsonResponse({ error: "Failed to create subscription" }, 500);
    }

    console.log("💬 Creating Chatwoot account...");

    // Steps 4-6: Create Chatwoot account, user, and link.
    // Assuming these helper functions are defined elsewhere and use `fetch`.
    const accountName = company_name;
    const accountResp = await createChatwootAccount(accountName, email, env);
    const accountId = Number(accountResp?.id || accountResp?.data?.id);

    if (!accountId) {
      throw new Error(
        "Failed to create Chatwoot account: No account ID returned"
      );
    }

    console.log("✅ Chatwoot account created:", accountId);

    const userResp = await createChatwootPlatformUser(
      full_name,
      email,
      password,
      env
    );
    const platformUserId = Number(userResp?.id || userResp?.data?.id);

    if (!platformUserId) {
      throw new Error("Failed to create Chatwoot user: No user ID returned");
    }

    console.log("✅ Chatwoot user created:", platformUserId);

    await createAccountUserLink(accountId, platformUserId, env);
    console.log("🔗 Linked Chatwoot account and user");

    // Step 7: Store the Chatwoot mapping in Supabase
    const { error: mappingError } = await supabase
      .from("chatwoot_mappings")
      .insert({
        user_id: userId,
        account_id: accountId,
        user_account_id: platformUserId,
      });

    if (mappingError) {
      console.error("❌ Mapping error:", mappingError);
      return jsonResponse({ error: "Failed to store user mapping" }, 500);
    }

    console.log("🗺️ User mapping stored successfully");

    // Step 8: Generate SSO URL and return
    const ssoUrl = await generateChatwootSSO(platformUserId, env);
    const dashboardUrl = `${env.DASHBOARD_URL}/app/accounts/${accountId}/dashboard`;

    console.log("🎉 Signup successful!");

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
    console.log("🔐 Login process started");

    const { access_token } = await request.json();

    // Verify user session
    const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    const { user, error } = await userResponse.json();
    if (error || !user) throw new Error("Invalid session");

    console.log("✅ User verified:", user.email);

    // Get Chatwoot mapping
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
    if (!mapping || mapping.length === 0) {
      throw new Error("Chatwoot account not found for user");
    }

    const { account_id, user_account_id } = mapping[0];

    // Generate SSO URL using the corrected function signature
    const ssoUrl = await generateChatwootSSO(user_account_id, env);
    const dashboardUrl = `${env.DASHBOARD_URL}/app/accounts/${account_id}/dashboard`;

    console.log("✅ Login successful, redirecting to dashboard");

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

// Chatwoot helper functions (matching your Next.js implementation)
async function createChatwootAccount(companyName, email, env) {
  try {
    console.log("🏢 Creating Chatwoot account:", companyName);
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
          domain: `${companyName
            .toLowerCase()
            .replace(/\s+/g, "-")}.helpbase.co`,
          support_email: email,
          status: "active",
          limits: {},
          custom_attributes: {},
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Chatwoot Account API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ Chatwoot account response:", data);
    return data;
  } catch (error) {
    console.error("❌ Chatwoot account error:", error);
    throw error;
  }
}

async function createChatwootPlatformUser(name, email, password, env) {
  try {
    console.log("👤 Creating Chatwoot user:", email);
    const response = await fetch(
      `${env.CHATWOOT_BASE_URL}/platform/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          custom_attributes: {},
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Chatwoot User API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ Chatwoot user response:", data);
    return data;
  } catch (error) {
    console.error("❌ Chatwoot user error:", error);
    throw error;
  }
}

async function createAccountUserLink(accountId, userId, env) {
  try {
    console.log("🔗 Linking account", accountId, "to user", userId);
    const response = await fetch(
      `${env.CHATWOOT_BASE_URL}/platform/api/v1/accounts/${accountId}/account_users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: env.CHATWOOT_PLATFORM_TOKEN,
        },
        body: JSON.stringify({
          user_id: userId,
          role: "administrator",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Chatwoot Account User API error: ${response.status} ${errorText}`
      );
    }

    console.log("✅ Account linked successfully");
    return await response.json();
  } catch (error) {
    console.error("❌ Account linking error:", error);
    throw error;
  }
}

// CORRECTED SSO FUNCTION - Matching your Next.js implementation
async function generateChatwootSSO(userId, env) {
  try {
    console.log("🔑 Generating SSO for user:", userId);
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Chatwoot SSO API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ SSO URL generated:", data.url);
    return data.url;
  } catch (error) {
    console.error("❌ SSO generation error:", error);
    throw error;
  }
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
