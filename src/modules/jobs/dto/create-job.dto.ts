import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "src/common/enums/job.enum";
import { IJob } from "lib/Job/job.interface";
import { Type } from "class-transformer";

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
  companyId: string;
}

export class GetJobsFilterDto {
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(seniorityLevel, { each: true })
  seniorityLevel?: seniorityLevel[];

  @IsOptional()
  @IsArray()
  @IsEnum(jobLocation, { each: true })
  jobLocation?: jobLocation[];

  @IsOptional()
  @IsArray()
  @IsEnum(workingTime, { each: true })
  workingTime?: workingTime[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technicalSkills?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
