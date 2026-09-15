import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service.js";
import { normalizeUsername } from "./username.normalizer.js";

@Injectable()
export class UsernameResolutionService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(username: string) {
    const normalizedUsername = normalizeUsername(username);

    const currentCompany = await this.prisma.company.findUnique({
      where: {
        username: normalizedUsername,
      },
    });

    if (currentCompany) {
      return {
        type: "CURRENT" as const,
        company: currentCompany,
      };
    }

    const history = await this.prisma.companyUsernameHistory.findFirst({
      where: {
        username: normalizedUsername,
      },
      orderBy: {
        releasedAt: "desc",
      },
    });

    if (history) {
      return {
        type: "HISTORY" as const,
        history,
      };
    }

    return null;
  }
}
