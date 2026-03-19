import { Controller, Post, Body, Patch } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ChangePasswordDto,
  ConfirmOtpDto,
  CreateUserDto,
  LoginDto,
  RefreshTokenDto,
  RequestChangePasswordDto,
  ResetOtpDto,
  ResetPasswordDto,
} from "./dto/create-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post("resend-otp")
  resendVerification(@Body() resetOtpDto: ResetOtpDto) {
    return this.authService.resetOtp(resetOtpDto);
  }

  @Post("confirm-email")
  confirmEmail(@Body() confirmOtpDto: ConfirmOtpDto) {
    return this.authService.confirmEmail(confirmOtpDto);
  }

  @Post("request-change-password")
  requestChangePassword(
    @Body() requestChangePassword: RequestChangePasswordDto,
  ) {
    return this.authService.requestChangePassword(requestChangePassword);
  }

  @Patch("change-password")
  changePassword(@Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(changePassword);
  }

  @Post("forget-password")
  forgetPassword(@Body() forgetPassword: ResetOtpDto) {
    return this.authService.forgetPassword(forgetPassword);
  }

  @Post("reset-password")
  resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(resetPassword);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh-token")
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
