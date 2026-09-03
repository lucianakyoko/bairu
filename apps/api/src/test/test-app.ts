import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "../app.module.js";
import { GlobalExceptionFilter } from "../common/errors/global-exception.filter.js";
import { ExpressAdapter } from "@nestjs/platform-express";

export async function createTestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  return app;
}
