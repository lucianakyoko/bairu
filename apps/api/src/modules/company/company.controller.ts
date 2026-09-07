import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { CompanyService } from "./company.service.js";
import { CurrentUserService } from "../../common/auth/current-user/current-user.service.js";
import { CompanyResponseDto } from "./dto/company-response.dto.js";
import { plainToInstance } from "class-transformer";
import { UpdateCompanyDto } from "./dto/update-company.dto.js";
import { CompanyStatusResponseDto } from "./dto/company-status-response.dto.js";
import { CompanyOwnershipGuard } from "../../common/security/guards/company-ownership.guard.js";

@Controller("companies")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const ownerUserId = this.currentUserService.getUserId();
    const company = await this.companyService.create(ownerUserId, dto);

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyService.findById(id);

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(CompanyOwnershipGuard)
  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const ownerUserId = this.currentUserService.getUserId();

    const company = await this.companyService.update(id, ownerUserId, dto);

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(CompanyOwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":id/archive")
  async archive(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CompanyStatusResponseDto> {
    const ownerUserId = this.currentUserService.getUserId();

    const company = await this.companyService.archive(id, ownerUserId);

    return plainToInstance(CompanyStatusResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(CompanyOwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":id/deactivate")
  async deactivate(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CompanyStatusResponseDto> {
    const ownerUserId = this.currentUserService.getUserId();

    const company = await this.companyService.deactivate(id, ownerUserId);

    return plainToInstance(CompanyStatusResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(CompanyOwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":id/reactivate")
  async reactivate(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CompanyStatusResponseDto> {
    const ownerUserId = this.currentUserService.getUserId();

    const company = await this.companyService.reactivate(id, ownerUserId);

    return plainToInstance(CompanyStatusResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }
}
