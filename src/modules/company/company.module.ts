import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UserModel } from "src/DB/models/user.model";
import { CompanyModel } from "src/DB/models/company.model";
import { AuthGuard } from "src/common/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/utils/token/signToken.util";

@Module({
  imports: [UserModel, CompanyModel],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepository,
    UserRepository,
    AuthGuard,
    JwtService,
    TokenService,
  ],
})
export class CompanyModule {}
