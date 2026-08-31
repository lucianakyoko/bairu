import { Exclude, Expose } from "class-transformer";

import { CompanyStatus } from "../enums/company-status.enum.js";

@Exclude()
export class CompanyStatusResponseDto {
  @Expose()
  id!: string;

  @Expose()
  status!: CompanyStatus;
}
