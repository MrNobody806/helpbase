export const config = {
  workerUrl: "http://127.0.0.1:8787",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  dashboardUrl: process.env.DASHBOARD_URL!,
} as const;

export const getConfig = () => {
  return config;
};
