// Environment configuration
export const config = {
  development: {
    workerUrl: "http://localhost:8787",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  production: {
    workerUrl: "https://api.helpbase.co",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  test: {
    workerUrl: "https://api.helpbase.co",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export const getConfig = () => {
  if (process.env.NODE_ENV === "development") {
    return config.development;
  }
  if (process.env.NODE_ENV === "test") {
    return config.test;
  }
  return config.production;
};
