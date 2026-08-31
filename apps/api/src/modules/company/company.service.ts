import { HttpStatus, Injectable } from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service.js";
import {
  getPrismaConstraintFields,
  isPrismaKnownRequestError,
} from "../../common/database/prisma-error.utils.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { ErrorCode } from "../../common/errors/error-codes.js";
import { AppException } from "../../common/errors/app.exception.js";
import { UpdateCompanyDto } from "./dto/update-company.dto.js";
import { CompanyStatus } from "./enums/company-status.enum.js";

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

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new AppException(
        ErrorCode.COMPANY_NOT_FOUND,
        "Company not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    return company;
  }

  async update(companyId: string, ownerUserId: string, dto: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({
        where: {
          id: companyId,
          ownerUserId,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (isPrismaKnownRequestError(error) && error.code === "P2025") {
        throw new AppException(
          ErrorCode.COMPANY_NOT_FOUND,
          "Company not found.",
          HttpStatus.NOT_FOUND,
        );
      }

      throw error;
    }
  }

  async archive(companyId: string, ownerUserId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: companyId,
        ownerUserId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!company) {
      throw new AppException(
        ErrorCode.COMPANY_NOT_FOUND,
        "Company not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      company.status !== CompanyStatus.ACTIVE &&
      company.status !== CompanyStatus.INACTIVE
    ) {
      throw new AppException(
        ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
        "Company cannot be archived from its current status.",
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        status: CompanyStatus.ARCHIVED,
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  async deactivate(companyId: string, ownerUserId: string) {
    const result = await this.prisma.company.updateMany({
      where: {
        id: companyId,
        ownerUserId,
        status: "ACTIVE",
      },
      data: {
        status: "INACTIVE",
      },
    });

    if (result.count === 1) {
      return this.prisma.company.findUniqueOrThrow({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          status: true,
        },
      });
    }

    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        status: true,
      },
    });

    if (!company) {
      throw new AppException(
        ErrorCode.COMPANY_NOT_FOUND,
        "Company not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    throw new AppException(
      ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
      "Company cannot be deactivated from its current status.",
      HttpStatus.CONFLICT,
    );
  }

  async reactivate(companyId: string, ownerUserId: string) {
    const result = await this.prisma.company.updateMany({
      where: {
        id: companyId,
        ownerUserId,
        status: CompanyStatus.INACTIVE,
      },
      data: {
        status: CompanyStatus.ACTIVE,
      },
    });

    if (result.count === 1) {
      return this.prisma.company.findUniqueOrThrow({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          status: true,
        },
      });
    }

    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        status: true,
      },
    });

    if (!company) {
      throw new AppException(
        ErrorCode.COMPANY_NOT_FOUND,
        "Company not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    throw new AppException(
      ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
      "Company cannot be reactivated from its current status.",
      HttpStatus.CONFLICT,
    );
  }

  async suspend(companyId: string) {
    const result = await this.prisma.company.updateMany({
      where: {
        id: companyId,
        status: {
          in: [CompanyStatus.ACTIVE, CompanyStatus.INACTIVE],
        },
      },
      data: {
        status: CompanyStatus.SUSPENDED,
      },
    });

    if (result.count === 1) {
      return this.prisma.company.findUniqueOrThrow({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          status: true,
        },
      });
    }

    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        status: true,
      },
    });

    if (!company) {
      throw new AppException(
        ErrorCode.COMPANY_NOT_FOUND,
        "Company not found.",
        HttpStatus.NOT_FOUND,
      );
    }

    throw new AppException(
      ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
      "Company cannot be suspended from its current status.",
      HttpStatus.CONFLICT,
    );
  }

  async restore(companyId: string) {
    try {
      const company = await this.prisma.company.update({
        where: {
          id: companyId,
          status: {
            in: ["SUSPENDED", "ARCHIVED"],
          },
        },
        data: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          status: true,
        },
      });

      return company;
    } catch (error) {
      if (isPrismaKnownRequestError(error) && error.code === "P2025") {
        const company = await this.prisma.company.findUnique({
          where: {
            id: companyId,
          },
          select: {
            id: true,
            status: true,
          },
        });

        if (!company) {
          throw new AppException(
            ErrorCode.COMPANY_NOT_FOUND,
            "Company not found.",
            HttpStatus.NOT_FOUND,
          );
        }

        throw new AppException(
          ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
          "Company cannot be restored from its current status.",
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  }
}
