import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_URL: z.string().url(),
});

let serverEnv: z.infer<typeof EnvSchema>;

try {
  // biome-ignore lint: Only place where we grab it directly
  serverEnv = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as z.ZodError;

  console.error("🚫 Invalid server environment variables:");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default serverEnv;
