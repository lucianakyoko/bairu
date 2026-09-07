import { Exclude, Expose } from "class-transformer";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";
import { CompanyStatus } from "../enums/company-status.enum.js";

@Exclude()
export class CompanyResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  personType!: CompanyPersonType;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  phone!: string | null;

  @Expose()
  email!: string | null;

  @Expose()
  profileMediaId!: string | null;

  @Expose()
  coverMediaId!: string | null;

  @Expose()
  status!: CompanyStatus;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
