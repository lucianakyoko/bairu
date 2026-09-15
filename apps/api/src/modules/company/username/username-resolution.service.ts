import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service.js";

@Injectable()
export class UsernameResolutionService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(username: string) {
    // Resolution logic will be implemented in the following subtasks.
    console.log(username);
  }
}
