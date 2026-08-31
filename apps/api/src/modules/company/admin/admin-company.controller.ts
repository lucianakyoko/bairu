import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";

import { CompanyService } from "../company.service.js";
import { AdminGuard } from "../../../common/security/guards/admin.guard.js";
import { CompanyStatusResponseDto } from "../dto/company-status-response.dto.js";
import { plainToInstance } from "class-transformer";

@Controller("admin/companies")
@UseGuards(AdminGuard)
export class AdminCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post(":id/suspend")
  async suspend(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CompanyStatusResponseDto> {
    const company = await this.companyService.suspend(id);

    return plainToInstance(CompanyStatusResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  @Post(":id/restore")
  async restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.companyService.restore(id);
  }
}
