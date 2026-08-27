import { Global, Module } from "@nestjs/common";
import { PasswordService } from "./password.service.js";

@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class SecurityModule {}
