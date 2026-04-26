import {
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsEnum,
} from "class-validator";
import { Gender } from "src/common/enums/user.enum";

export class UpdateUserDateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsDateString()
  DOB: string;

  @IsEnum(Gender)
  Gender: Gender;
}

export class SoftDeleteDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
