import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModel } from "src/DB/models/user.model";
import { OtpModel } from "src/DB/models/otp.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { OtpRepository } from "src/DB/repositories/otp.repository";
import { TokenService } from "src/common/utils/token/signToken.util";
import { JwtService } from "@nestjs/jwt";
import { OtpCleanupService } from "../../common/services/otp.service";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [PassportModule.register({ session: false }), UserModel, OtpModel],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    OtpRepository,
    TokenService,
    JwtService,
    GoogleStrategy,
  ],
})
export class AuthModule {}
