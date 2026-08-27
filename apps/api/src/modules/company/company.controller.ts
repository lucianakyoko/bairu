import { Body, Controller, Post } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { CompanyService } from "./company.service.js";
import { CurrentUserService } from "../../common/auth/current-user/current-user.service.js";

@Controller("companies")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    const ownerUserId = this.currentUserService.getUserId();
    return this.companyService.create(ownerUserId, dto);
  }
}
