import { defineConfig } from "drizzle-kit";
import serverEnv from "@/env/server";

export default defineConfig({
  schema: "./src/db/schemas/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  strict: true,
});
