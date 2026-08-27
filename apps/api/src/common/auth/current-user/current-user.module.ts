import { Module } from "@nestjs/common";
import { CurrentUserService } from "./current-user.service.js";

@Module({
  providers: [CurrentUserService],
  exports: [CurrentUserService],
})
export class CurrentUserModule {}
