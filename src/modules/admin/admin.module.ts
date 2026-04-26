import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserModel } from "src/DB/models/user.model";
import { CompanyModel } from "src/DB/models/company.model";
// import { AdminResolver } from './admin.resolver';
import { AdminController } from "./admin.controller";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/utils/token/signToken.util";
import { UserRepository } from "src/DB/repositories/user.repository";
import { CompanyRepository } from "src/DB/repositories/company.repository";

@Module({
  imports: [UserModel, CompanyModel],
  controllers: [AdminController],

  providers: [
    AdminService,
    JwtService,
    TokenService,
    UserRepository,
    CompanyRepository,
  ],
})
export class AdminModule {}
