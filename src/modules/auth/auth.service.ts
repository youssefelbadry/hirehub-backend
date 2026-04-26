import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { UserRepository } from "src/DB/repositories/user.repository";
import {
  ChangePasswordDto,
  ConfirmOtpDto,
  CreateUserDto,
  ForgetPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RequestChangePasswordDto,
  ResetOtpDto,
  ResetPasswordDto,
  GoogleAuthUserDto,
  SetPasswordDto,
} from "./dto/create-auth.dto";
import { Types } from "mongoose";
import { EmailEventEnum } from "src/common/utils/email/emailSubjectEnum";
import { OtpRepository } from "src/DB/repositories/otp.repository";
import { generateOtp } from "src/common/utils/email/otp.email";
import { comparePassword } from "src/common/utils/hash/hash.util";
import { TokenService } from "src/common/utils/token/signToken.util";
import { Provider } from "src/common/enums/user.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly _userModel: UserRepository,
    private readonly _otpModel: OtpRepository,
    private readonly _tokenService: TokenService,
  ) {}

  private async generateUserTokens(user: {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    role: string;
  }) {
    return this._tokenService.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      password: user.password ?? "",
      role: user.role,
    });
  }

  private sanitizeUser<T extends { toObject?: () => any; password?: string }>(
    user: T,
  ) {
    const plainUser = user?.toObject ? user.toObject() : { ...user };
    delete plainUser.password;
    return plainUser;
  }

  async createOtp(
    userId: Types.ObjectId,
    type: EmailEventEnum = EmailEventEnum.ConfirmEmail,
  ) {
    const otp = await this._otpModel.create({
      data: {
        createdBy: userId,
        code: generateOtp(),
        expiredAt: new Date(Date.now() + 1 * 60 * 1000),
        type,
      },
    });

    if (!otp) throw new BadRequestException("OTP not sent");

    return otp;
  }

  async createUser(createUserDTO: CreateUserDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      provider,
      gender,
      DOB,
      mobileNumber,
      profilePic,
      coverPic,
      role,
    } = createUserDTO;

    const checkUser = await this._userModel.findOne({ filter: { email } });

    if (checkUser) {
      throw new ConflictException("User already exists");
    }

    if (DOB) {
      const age = new Date().getFullYear() - new Date(DOB).getFullYear();

      if (age < 16) {
        throw new BadRequestException("You must be at least 16 years old");
      }
    }

    const user = await this._userModel.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        provider,
        gender,
        DOB,
        mobileNumber,
        profilePic: profilePic
          ? { secure_url: profilePic, public_id: "" }
          : undefined,
        coverPic: coverPic
          ? { secure_url: coverPic, public_id: "" }
          : undefined,
        role,
      },
    });

    if (!user) throw new BadRequestException("Signup failed");

    if (user.provider !== Provider.Google) {
      await this.createOtp(user._id, EmailEventEnum.ConfirmEmail);
    }

    return {
      message: "User created successfully",
      user,
    };
  }

  async resetOtp(resetOtpDto: ResetOtpDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: resetOtpDto.email },
    });

    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: resetOtpDto.type,
        expiredAt: { $gt: new Date() },
      },
    });

    if (checkOtp) {
      throw new BadRequestException("OTP already sent");
    }

    await this.createOtp(checkUser._id, resetOtpDto.type);

    return { message: "OTP sent successfully" };
  }
  async confirmEmail(confirmEmailDto: ConfirmOtpDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: confirmEmailDto.email, isConfirmed: false },
    });

    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.ConfirmEmail,
        expiredAt: { $gt: new Date() },
      },
    });

    if (!checkOtp) {
      throw new BadRequestException("OTP not found");
    }

    const isMatch = await comparePassword(checkOtp.code, confirmEmailDto.otp);

    if (!isMatch) {
      throw new BadRequestException("Invalid OTP");
    }

    await this._otpModel.deleteOne({ filter: { _id: checkOtp._id } });

    const confirmUser = await this._userModel.findByIdAndUpdate({
      id: checkUser._id.toString(),
      update: { isConfirmed: true },
      options: { new: true },
    });

    if (!confirmUser) throw new BadRequestException("Email is not confirmed");

    await this.createOtp(checkUser._id, EmailEventEnum.Welcome);

    return { message: "Email confirmed successfully" };
  }
  async requestChangePassword(requestChangePassword: RequestChangePasswordDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: requestChangePassword.email, isConfirmed: true },
    });

    if (!checkUser) throw new NotFoundException("User not found");
    if (!checkUser.password) {
      throw new BadRequestException(
        "This account uses Google login. Set a password first to use this action",
      );
    }

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.ChangePassword,
        expiredAt: { $gt: new Date() },
      },
    });

    if (checkOtp) {
      throw new BadRequestException("OTP already sent");
    }

    await this.createOtp(checkUser._id, EmailEventEnum.ChangePassword);

    return { message: "OTP sent successfully" };
  }
  async changePassword(changePassword: ChangePasswordDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: changePassword.email },
    });

    if (!checkUser) throw new NotFoundException("User not found");
    if (!checkUser.password) {
      throw new BadRequestException(
        "This account uses Google login. Set a password first to use this action",
      );
    }

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.ChangePassword,
        expiredAt: { $gt: new Date() },
      },
    });

    if (!checkOtp) {
      throw new BadRequestException("OTP not found");
    }

    const isMatchOtp = await comparePassword(checkOtp.code, changePassword.otp);

    if (!isMatchOtp) {
      throw new BadRequestException("Invalid OTP");
    }

    const isOldPasswordCorrect = await comparePassword(
      checkUser.password,
      changePassword.oldPassword,
    );

    if (!isOldPasswordCorrect) {
      throw new BadRequestException("Old password incorrect");
    }

    if (changePassword.newPassword === changePassword.oldPassword) {
      throw new BadRequestException(
        "New password should be different from old password",
      );
    }

    await this._otpModel.deleteOne({ filter: { _id: checkOtp._id } });

    const updateUser = await this._userModel.findByIdAndUpdate({
      id: checkUser._id.toString(),
      update: { password: changePassword.newPassword },
      options: { new: true },
    });

    if (!updateUser) throw new BadRequestException("Password not changed");

    return {
      message: "Password changed successfully",
      password: updateUser.password,
    };
  }
  async forgetPassword(forgetPassword: ForgetPasswordDto) {
    const checkUser = await this._userModel.findOne({
      filter: {
        email: forgetPassword.email,
        isConfirmed: true,
      },
    });

    if (!checkUser) throw new NotFoundException("User not found");
    if (!checkUser.password) {
      throw new BadRequestException(
        "This account uses Google login. Password reset is unavailable",
      );
    }

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.ResetPassword,
        expiredAt: { $gt: new Date() },
      },
    });

    if (checkOtp) {
      throw new BadRequestException("OTP already sent");
    }

    await this.createOtp(checkUser._id, EmailEventEnum.ResetPassword);

    return { message: "OTP sent successfully" };
  }
  async resetPassword(resetPassword: ResetPasswordDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: resetPassword.email, isConfirmed: true },
    });

    if (!checkUser) throw new NotFoundException("User not found");
    if (!checkUser.password) {
      throw new BadRequestException(
        "This account uses Google login. Password reset is unavailable",
      );
    }

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.ResetPassword,
        expiredAt: { $gt: new Date() },
      },
    });

    if (!checkOtp) {
      throw new BadRequestException("OTP not found");
    }

    const isMatch = await comparePassword(checkOtp.code, resetPassword.otp);

    if (!isMatch) {
      throw new BadRequestException("Invalid OTP");
    }

    await this._otpModel.deleteOne({ filter: { _id: checkOtp._id } });

    const updateUser = await this._userModel.findByIdAndUpdate({
      id: checkUser._id.toString(),
      update: { password: resetPassword.password },
      options: { new: true },
    });

    if (!updateUser) throw new BadRequestException("Password not updated");

    return {
      message: "Password updated successfully",
    };
  }

  async login(loginDto: LoginDto) {
    const checkUser = await this._userModel.findOne({
      filter: { email: loginDto.email, isConfirmed: true },
    });

    if (!checkUser) throw new NotFoundException("User not found");
    if (!checkUser.password) {
      throw new BadRequestException(
        "This account uses Google login. Continue with Google sign-in",
      );
    }

    const isMatch = await comparePassword(
      checkUser.password,
      loginDto.password,
    );

    if (!isMatch) throw new BadRequestException("Invalid password");

    const token = await this.generateUserTokens(checkUser);

    return {
      message: "Login successful",
      token,
    };
  }

  async setPassword(setPasswordDto: SetPasswordDto) {
    const user = await this._userModel.findOne({
      filter: {
        email: setPasswordDto.email,
        isConfirmed: true,
        password: { $exists: false },
        provider: Provider.Google,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.password) {
      throw new ConflictException(
        "Password already exists. Use change password instead",
      );
    }

    user.password = setPasswordDto.password;
    user.changeCredentialTime = new Date();
    await user.save();

    return {
      message: "Password created successfully",
    };
  }

  async googleLogin(googleUser: GoogleAuthUserDto) {
    if (!googleUser?.email || !googleUser?.googleId) {
      throw new UnauthorizedException("Google authentication failed");
    }

    let user = await this._userModel.findOne({
      filter: {
        $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
    });

    if (!user) {
      user = await this._userModel.create({
        data: {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          googleId: googleUser.googleId,
          provider: Provider.Google,
          isConfirmed: true,
          profilePic: googleUser.profilePic
            ? { secure_url: googleUser.profilePic, public_id: "" }
            : undefined,
        },
      });
    } else if (!user.googleId || user.provider !== Provider.Google) {
      user = await this._userModel.findOneAndUpdate({
        filter: { _id: user._id },
        update: {
          googleId: googleUser.googleId,
          provider: Provider.Google,
          isConfirmed: true,
          firstName: user.firstName || googleUser.firstName,
          lastName: user.lastName || googleUser.lastName,
          profilePic:
            user.profilePic ||
            (googleUser.profilePic
              ? { secure_url: googleUser.profilePic, public_id: "" }
              : undefined),
        },
      });
    }

    if (!user) {
      throw new BadRequestException("Google login failed");
    }

    const token = await this.generateUserTokens(user);

    return {
      message: "Google login successful",
      token,
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const decodedToken = await this._tokenService.generateTokens(
      refreshTokenDto.refreshToken,
    );

    return {
      message: "Token refreshed successfully",
      token: decodedToken,
    };
  }
}
