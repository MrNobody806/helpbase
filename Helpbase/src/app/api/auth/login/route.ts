// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateChatwootSSO } from "@/lib/chatwoot";

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    // Verify the Supabase session
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(access_token);
    if (error || !user) {
      throw new Error("Invalid session");
    }

    // Get the Chatwoot mapping for this user
    const { data: mapping, error: mappingError } = await supabaseAdmin
      .from("chatwoot_mappings")
      .select("account_id, user_account_id")
      .eq("user_id", user.id)
      .single();

    if (mappingError || !mapping) {
      throw new Error("Chatwoot account not found. Please contact support.");
    }

    // Generate SSO URL with both accountId and user_account_id
    const ssoUrl = await generateChatwootSSO(
      mapping.account_id,
      mapping.user_account_id
    );

    const dashboardUrl = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/app/accounts/${mapping.account_id}/dashboard`;

    return NextResponse.json({
      success: true,
      ssoUrl,
      dashboardUrl,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error.message || "Authentication failed",
      },
      { status: 500 }
    );
  }
}
