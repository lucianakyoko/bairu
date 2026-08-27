import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";

export class CreateCompanyDto {
  @IsString()
  @Length(2, 150)
  name!: string;

  @IsString()
  @Length(3, 30)
  username!: string;

  @IsEnum(CompanyPersonType)
  personType!: CompanyPersonType;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID()
  profileMediaId?: string;

  @IsOptional()
  @IsUUID()
  coverMediaId?: string;
}
