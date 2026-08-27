import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller.js";
import { CompanyService } from "./company.service.js";
import { DatabaseModule } from "../../database/database.module.js";
import { CurrentUserModule } from "../../common/auth/current-user/current-user.module.js";

@Module({
  imports: [DatabaseModule, CurrentUserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
