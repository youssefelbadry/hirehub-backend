import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JobsController, JobsPublicController } from "./jobs.controller";
import { UserModel } from "src/DB/models/user.model";
import { JobModel } from "src/DB/models/job.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/utils/token/signToken.util";
import { JobRepository } from "src/DB/repositories/job.repository";
import { CompanyModel } from "src/DB/models/company.model";

@Module({
  imports: [UserModel, JobModel, CompanyModel],
  controllers: [JobsController, JobsPublicController],
  providers: [
    JobsService,
    UserRepository,
    CompanyRepository,
    JwtService,
    TokenService,
    JobRepository,
  ],
})
export class JobsModule {}
