import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from "class-validator";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "src/common/enums/job,enum";
import { IJob } from "lib/Job/job.interface";

export class CreateJobDto {
  @IsString()
  jobTitle: string;

  @IsEnum(jobLocation)
  jobLocation: jobLocation;

  @IsEnum(workingTime)
  workingTime: workingTime;

  @IsEnum(seniorityLevel)
  seniorityLevel: seniorityLevel;

  @IsString()
  jobDescription: string;

  @IsArray()
  @IsString({ each: true })
  technicalSkills: string[];

  @IsArray()
  @IsString({ each: true })
  softSkills: string[];

  @IsMongoId()
  addedBy: string;

  @IsMongoId()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  closed?: boolean;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
