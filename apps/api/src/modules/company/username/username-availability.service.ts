import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service.js";
import { normalizeUsername } from "./username.normalizer.js";

export type UsernameAvailabilityStatus =
  "AVAILABLE" | "CURRENTLY_TAKEN" | "IN_COOLDOWN";

export interface UsernameAvailabilityResult {
  status: UsernameAvailabilityStatus;
}

@Injectable()
export class UsernameAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(username: string): Promise<UsernameAvailabilityResult> {
    const normalizedUsername = normalizeUsername(username);

    const currentCompany = await this.prisma.company.findUnique({
      where: {
        username: normalizedUsername,
      },
      select: {
        id: true,
      },
    });

    if (currentCompany) {
      return {
        status: "CURRENTLY_TAKEN",
      };
    }

    const now = new Date();

    const activeHistory = await this.prisma.companyUsernameHistory.findFirst({
      where: {
        username: normalizedUsername,
        claimedByCompanyId: null,
        cooldownUntil: {
          gt: now,
        },
      },
      orderBy: {
        releasedAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (activeHistory) {
      return {
        status: "IN_COOLDOWN",
      };
    }

    return {
      status: "AVAILABLE",
    };
  }
}
