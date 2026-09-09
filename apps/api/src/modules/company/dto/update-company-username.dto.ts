import { IsString } from "class-validator";

export class UpdateCompanyUsernameDto {
  @IsString()
  username!: string;
}
