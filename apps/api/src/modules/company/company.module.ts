import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller.js";
import { CompanyService } from "./company.service.js";
import { DatabaseModule } from "../../database/database.module.js";
import { CurrentUserModule } from "../../common/auth/current-user/current-user.module.js";
import { AdminCompanyController } from "./admin/admin-company.controller.js";

@Module({
  imports: [DatabaseModule, CurrentUserModule],
  controllers: [CompanyController, AdminCompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
