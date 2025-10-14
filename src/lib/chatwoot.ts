// lib/chatwoot.ts
export async function createChatwootAccount(
  companyName: string,
  email: string
) {
  try {
    const response = await fetch(
      `${process.env.CHATWOOT_BASE_URL}/platform/api/v1/accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CHATWOOT_PLATFORM_TOKEN!,
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

    return await response.json();
  } catch (error) {
    console.error("Error creating Chatwoot account:", error);
    throw error;
  }
}

export async function createChatwootPlatformUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(
      `${process.env.CHATWOOT_BASE_URL}/platform/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CHATWOOT_PLATFORM_TOKEN!,
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

    return await response.json();
  } catch (error) {
    console.error("Error creating Chatwoot platform user:", error);
    throw error;
  }
}

export async function createAccountUserLink(accountId: number, userId: number) {
  try {
    const response = await fetch(
      `${process.env.CHATWOOT_BASE_URL}/platform/api/v1/accounts/${accountId}/account_users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CHATWOOT_PLATFORM_TOKEN!,
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

    return await response.json();
  } catch (error) {
    console.error("Error creating account user link:", error);
    throw error;
  }
}

// CORRECTED SSO FUNCTION - Takes both accountId and userId
export async function generateChatwootSSO(accountId: number, userId: number) {
  try {
    const response = await fetch(
      `${process.env.CHATWOOT_BASE_URL}/platform/api/v1/users/${userId}/login`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CHATWOOT_PLATFORM_TOKEN!,
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
    console.log("url", data);
    return data.url;
  } catch (error) {
    console.error("Error generating Chatwoot SSO:", error);
    throw error;
  }
}
