import { IsOptional, IsEnum, IsString, IsNotEmpty, ValidateIf } from "class-validator";
import { applicationStatus } from "src/common/enums/app.enum";

export class CreateApplicationDto {
  @ValidateIf((o) => o.questios === undefined)
  @IsString()
  @IsNotEmpty()
  questions?: string;

  @ValidateIf((o) => o.questions === undefined)
  @IsString()
  @IsNotEmpty()
  questios?: string;

  @IsEnum(applicationStatus)
  @IsOptional()
  status?: applicationStatus;
}
