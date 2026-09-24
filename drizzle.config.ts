import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Use the direct (non-pooled) connection for migrations when available.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
});
