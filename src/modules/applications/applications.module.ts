import { Module } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { ApplicationsController } from "./applications.controller";
import { ApplicationModel } from "src/DB/models/application.model";
import { JobModel } from "src/DB/models/job.model";
import { UserModel } from "src/DB/models/user.model";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/utils/token/signToken.util";
import { UserRepository } from "src/DB/repositories/user.repository";
import { ApplicationRepository } from "src/DB/repositories/application.repository";
import { JobRepository } from "src/DB/repositories/job.repository";
import { CompanyModel } from "src/DB/models/company.model";
import { CompanyRepository } from "src/DB/repositories/company.repository";

@Module({
  imports: [UserModel, ApplicationModel, JobModel, CompanyModel],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    JwtService,
    TokenService,
    UserRepository,
    ApplicationRepository,
    JobRepository,
    CompanyRepository,
  ],
})
export class ApplicationsModule {}
