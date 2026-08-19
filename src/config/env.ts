import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 5000),

  supabaseUrl: required("SUPABASE_URL"),

  supabaseServiceRoleKey: required(
    "SUPABASE_SERVICE_ROLE_KEY"
  ),

  openaiApiKey: required(
    "OPENAI_API_KEY"
  ),

  frontendUrl:
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
};
