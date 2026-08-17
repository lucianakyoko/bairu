import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const environment = process.env.NODE_ENV ?? "development";

const envFiles = {
  development: ".env",
  test: ".env.test",
} as const;

if (!(environment in envFiles)) {
  throw new Error(
    `Unsupported NODE_ENV "${environment}". Supported environments: development, test.`,
  );
}

const envFile = envFiles[environment as keyof typeof envFiles];

dotenv.config({ path: envFile });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `DATABASE_URL is not defined for environment "${environment}"`,
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seeds.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
