import { HttpStatus, Injectable } from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service.js";
import {
  getPrismaConstraintFields,
  isPrismaKnownRequestError,
} from "../../common/database/prisma-error.utils.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { ErrorCode } from "../../common/errors/error-codes.js";
import { AppException } from "../../common/errors/app.exception.js";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerUserId: string, dto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          ownerUserId,
          name: dto.name,
          username: dto.username,
          personType: dto.personType,
          document: dto.document ?? null,
          phone: dto.phone ?? null,
          email: dto.email ?? null,
          description: dto.description ?? null,
        },
      });
    } catch (error) {
      if (
        isPrismaKnownRequestError(error) &&
        error.code === "P2002" &&
        getPrismaConstraintFields(error).includes("username")
      ) {
        throw new AppException(
          ErrorCode.COMPANY_USERNAME_ALREADY_IN_USE,
          "Username is already in use.",
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  }
}
