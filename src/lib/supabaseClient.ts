import { createClient } from "@supabase/supabase-js";
import { getConfig } from "@/lib/conifg";

const { supabaseUrl, supabaseKey } = getConfig();

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
