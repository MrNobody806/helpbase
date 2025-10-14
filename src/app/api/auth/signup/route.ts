// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createChatwootAccount,
  createChatwootPlatformUser,
  createAccountUserLink,
  generateChatwootSSO,
} from "@/lib/chatwoot";

// const getStripe = () => {
//   if (process.env.STRIPE_SECRET_KEY) {
//     const Stripe = require("stripe");
//     return new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: "2023-10-16",
//     });
//   }
//   return null;
// };

type Body = {
  full_name: string;
  company_name: string;
  email: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { full_name, company_name, email, password } = body;

    if (!full_name || !company_name || !email || !password) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: full_name, company_name, email, and password",
        },
        { status: 400 }
      );
    }

    // Step 1: Create Supabase Auth user
    const createUser = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name, company_name },
    });

    if (createUser.error) throw createUser.error;
    const authUser = createUser.data.user;
    if (!authUser || !authUser.id) {
      throw new Error("Could not create auth user");
    }

    const userId = authUser.id;

    // // Step 2: Create Stripe customer
    // let stripeCustomerId = null;
    // const stripe = getStripe();

    // if (stripe) {
    //   try {
    //     const customer = await stripe.customers.create({
    //       email,
    //       name: full_name,
    //       metadata: {
    //         supabase_user_id: userId,
    //         company_name: company_name,
    //       },
    //     });
    //     stripeCustomerId = customer.id;
    //   } catch (stripeError) {
    //     console.error("Stripe customer creation failed:", stripeError);
    //   }
    // }

    // Step 3: Create user in public.users
    const upsertUser = await supabaseAdmin.from("users").insert({
      id: userId,
      email,
      full_name,
      company_name,
      role: "administrator",
      // stripe_customer_id: stripeCustomerId,
    });

    if (upsertUser.error) {
      console.error("Database error:", upsertUser.error);
      throw upsertUser.error;
    }

    // Step 4: Create starter subscription
    const subResp = await supabaseAdmin.from("subscriptions").insert({
      user_id: userId,
      plan: "starter",
      status: "active",
      current_period_end: null,
    });

    if (subResp.error) throw subResp.error;

    // Step 5: Create Chatwoot Account and User
    const accountName = company_name;
    const accountResp = await createChatwootAccount(accountName, email);
    const accountId = Number(accountResp?.id || accountResp?.data?.id);

    if (!accountId) {
      throw new Error(
        "Failed to create Chatwoot account: No account ID returned"
      );
    }

    // Create Chatwoot platform user
    const userResp = await createChatwootPlatformUser(
      full_name,
      email,
      password
    );
    const platformUserId = Number(userResp?.id || userResp?.data?.id);

    if (!platformUserId) {
      throw new Error("Failed to create Chatwoot user: No user ID returned");
    }

    // Associate platform user to account as administrator
    await createAccountUserLink(accountId, platformUserId);

    // Step 6: Store the mapping
    const mappingResp = await supabaseAdmin.from("chatwoot_mappings").insert({
      user_id: userId,
      account_id: accountId,
      user_account_id: platformUserId,
    });

    if (mappingResp.error) throw mappingResp.error;

    // Step 7: Generate SSO URL with both accountId and platformUserId
    const ssoUrl = await generateChatwootSSO(accountId, platformUserId);

    const dashboardUrl = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/app/accounts/${accountId}/dashboard`;

    return NextResponse.json({
      success: true,
      user_id: userId,
      email,
      dashboardUrl,
      ssoUrl,
    });
  } catch (err: any) {
    console.error("signup error:", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
