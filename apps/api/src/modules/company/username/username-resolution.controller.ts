import { Controller, Get, Param } from "@nestjs/common";

@Controller("companies/username")
export class UsernameResolutionController {
  @Get(":username")
  async resolveByUsername(@Param("username") username: string) {
    // Resolution logic will be implemented in the following subtasks.
    return { username };
  }
}
