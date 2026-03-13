import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { CompanySize } from "src/common/enums/company.enum";

export class CreateCompanyDto {
  @IsString()
  companyName: string;

  @IsString()
  description: string;

  @IsString()
  industry: string;

  @IsString()
  address: string;

  @IsEnum(CompanySize)
  numberOfEmployees: CompanySize;
  @IsEmail()
  companyEmail: string;

  @IsMongoId()
  createdBy: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  HRs?: string[];

  @IsObject()
  @IsOptional()
  logo?: {
    secure_url: string;
    public_id: string;
  };

  @IsObject()
  @IsOptional()
  coverPic?: {
    secure_url: string;
    public_id: string;
  };

  @IsObject()
  legalAttachment: {
    secure_url: string;
    public_id: string;
  };

  @IsBoolean()
  @IsOptional()
  approvedByAdmin?: boolean;
}
