import { CanActivate, ForbiddenException, Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service.js";
import { CurrentUserService } from "../../auth/current-user/current-user.service.js";
import { UserRole } from "../../../modules/user/enums/user-role.enum.js";
import { UserStatus } from "../../../modules/user/enums/user-status.enum.js";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async canActivate(): Promise<boolean> {
    const userId = this.currentUserService.getUserId();

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
        status: true,
      },
    });

    if (
      !user ||
      user.role !== UserRole.ADMIN ||
      user.status !== UserStatus.ACTIVE
    ) {
      throw new ForbiddenException();
    }

    return true;
  }
}
