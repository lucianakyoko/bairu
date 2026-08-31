import { IsEmail, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { AtLeastOneField } from "../../../common/validation/decorators/at-least-one-field.decorator.js";

@AtLeastOneField([
  "name",
  "description",
  "phone",
  "email",
  "profileMediaId",
  "coverMediaId",
])
export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsUUID()
  profileMediaId?: string | null;

  @IsOptional()
  @IsUUID()
  coverMediaId?: string | null;
}
