import { IsMongoId, IsObject, IsOptional, IsEnum } from "class-validator";
import { applicationStatus } from "src/common/enums/app.enum";

export class CreateApplicationDto {
  @IsMongoId()
  jobId: string;

  @IsMongoId()
  userId: string;

  @IsObject()
  userCV: {
    secure_url: string;
    public_id: string;
  };

  @IsEnum(applicationStatus)
  @IsOptional()
  status?: applicationStatus;
}
