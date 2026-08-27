import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config.js";
import { HealthModule } from "./modules/health/health.module.js";
import { DatabaseModule } from "./database/database.module.js";
import { CompanyModule } from "./modules/company/company.module.js";
import { SecurityModule } from "./common/security/security.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    SecurityModule,
    HealthModule,
    DatabaseModule,
    CompanyModule,
  ],
})
export class AppModule {}
