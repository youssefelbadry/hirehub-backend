import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Gender, Provider, Role } from "src/common/enums/user.enum";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  DOB: Date;

  @IsString()
  @Matches(/^[0-9]{10,15}$/)
  mobileNumber: string;

  @IsString()
  @IsOptional()
  profilePic?: string;

  @IsString()
  @IsOptional()
  coverPic?: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;

  @IsOptional()
  deletedAt?: Date;

  @IsOptional()
  bannedAt?: Date;

  @IsOptional()
  updatedBy?: string;
}
