import { Controller, Get, Param } from "@nestjs/common";

import { UsernameResolutionService } from "./username-resolution.service.js";

@Controller("companies/username")
export class UsernameResolutionController {
  constructor(
    private readonly usernameResolutionService: UsernameResolutionService,
  ) {}

  @Get(":username")
  async resolveByUsername(@Param("username") username: string) {
    return this.usernameResolutionService.resolve(username);
  }
}
