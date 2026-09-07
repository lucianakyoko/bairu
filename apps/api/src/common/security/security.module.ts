import { Global, Module } from "@nestjs/common";
import { PasswordService } from "./password.service.js";
import { AdminGuard } from "./guards/admin.guard.js";
import { CompanyOwnershipGuard } from "./guards/company-ownership.guard.js";
import { DatabaseModule } from "../../database/database.module.js";
import { CurrentUserModule } from "../auth/current-user/current-user.module.js";

@Global()
@Module({
  imports: [DatabaseModule, CurrentUserModule],
  providers: [PasswordService, AdminGuard, CompanyOwnershipGuard],
  exports: [PasswordService, AdminGuard, CompanyOwnershipGuard],
})
export class SecurityModule {}
