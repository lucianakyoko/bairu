import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  environment: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3001),
}));
