import { z } from "zod";

const EnvSchema = z.object({
  BASE_URL: z.string().optional(),
});

let env: z.infer<typeof EnvSchema>;

try {
  // biome-ignore lint: Only place where we grab it directly
  const clientEnv = process.env;
  env = EnvSchema.parse({
    BASE_URL: clientEnv.NEXT_PUBLIC_BASE_URL,
  });
} catch (e) {
  const error = e as z.ZodError;

  console.error("🚫 Invalid client environment variables:");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
