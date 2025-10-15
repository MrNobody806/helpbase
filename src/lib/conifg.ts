export const config = {
  development: {
    // workerUrl: "https://api.helpbase.co",
    workerUrl: "http://127.0.0.1:8787",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL!,
  },
  production: {
    workerUrl: "https://api.helpbase.co",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL!,
  },
} as const;

export const getConfig = () => {
  if (process.env.NODE_ENV === "development") {
    return config.development;
  }
  return config.production;
};
