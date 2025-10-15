export const config = {
  development: {
    workerUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  production: {
    workerUrl: "https://auth-api.helpbase.co",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export const getConfig = () => {
  if (process.env.NODE_ENV === "development") {
    return config.development;
  }
  return config.production;
};
