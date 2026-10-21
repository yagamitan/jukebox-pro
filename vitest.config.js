import { loadEnvFile } from "node:process";
import { defineConfig } from "vitest/config";

loadEnvFile();

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  },
});
