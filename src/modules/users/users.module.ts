import { OtpModel } from "src/DB/models/otp.model";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UserModel } from "src/DB/models/user.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";
import { OtpRepository } from "src/DB/repositories/otp.repository";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "src/common/utils/token/signToken.util";

@Module({
  imports: [UserModel, OtpModel],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    UserRepository,
    JwtService,
    AuthGuard,
    OtpRepository,
    TokenService,
  ],
})
export class UsersModule {}
