import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service.js";
import { normalizeUsername } from "./username.normalizer.js";

@Injectable()
export class UsernameResolutionService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(username: string) {
    const normalizedUsername = normalizeUsername(username);

    return this.prisma.company.findUnique({
      where: {
        username: normalizedUsername,
      },
    });
  }
}
