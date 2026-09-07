import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { isUUID } from "class-validator";

import { PrismaService } from "../../../database/prisma.service.js";
import { CurrentUserService } from "../../auth/current-user/current-user.service.js";

interface RequestWithParams {
  params: {
    id?: string;
  };
}

@Injectable()
export class CompanyOwnershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithParams>();
    const companyId = request.params.id;

    if (!companyId || !isUUID(companyId)) {
      throw new BadRequestException("Validation failed (uuid is expected)");
    }

    const userId = this.currentUserService.getUserId();

    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        ownerUserId: true,
      },
    });

    if (!company || company.ownerUserId !== userId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
