import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "src/DB/repositories/user.repository";
import { SoftDeleteDto, UpdateUserDateDto } from "./dto/update-user.dto";
import { comparePassword, hashPassword } from "src/common/utils/hash/hash.util";
import { decrypt } from "src/common/utils/encrypt/encrypt.util";
import { AuthService } from "../auth/auth.service";
import { EmailEventEnum } from "src/common/utils/email/emailSubjectEnum";
import { OtpRepository } from "src/DB/repositories/otp.repository";
import {
  deleteFile,
  uploadBuffer,
} from "src/common/utils/cloudinary/cloudinary.util";

@Injectable()
export class UsersService {
  constructor(
    private _userModel: UserRepository,
    private _otpModel: OtpRepository,
    private readonly _AuthService: AuthService,
  ) {}
  async updateUser(req: any, updateUserDto: UpdateUserDateDto) {
    const userId = req.user._id;

    const checkUser = await this._userModel.findOne({
      filter: {
        _id: userId.toString(),
        email: req.user.email,
      },
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    if (
      updateUserDto.firstName == checkUser.firstName ||
      updateUserDto.lastName == checkUser.lastName
    )
      throw new BadRequestException("First name or last name cannot be same");
    const checkDataSame = await this._userModel.findOne({
      filter: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        DOB: updateUserDto.DOB,
        gender: updateUserDto.Gender,
        _id: { $ne: userId },
      },
    });

    if (checkDataSame) {
      throw new BadRequestException(
        "User with this name, DOB and gender already exists",
      );
    }

    const update = await this._userModel.findByIdAndUpdate({
      id: userId.toString(),
      update: {
        ...updateUserDto,
      },
      options: {
        new: true,
      },
    });

    if (!update) {
      throw new BadRequestException("Failed to update user");
    }

    return {
      message: "User updated successfully",
      user: update,
    };
  }

  async getUserById(req: any) {
    const user = await this._userModel.findById({
      id: req.user._id,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      message: "User found successfully",
      user,
    };
  }

  async uploadProfilePic(userId: string, profilePic: Express.Multer.File) {
    if (!profilePic) {
      throw new BadRequestException("Profile image is required");
    }

    const user = await this._userModel.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const uploadResult: any = await uploadBuffer(profilePic.buffer, {
      folder: `hirehub/users/${userId}/profile`,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
    });

    if (user.profilePic?.public_id) {
      await deleteFile(user.profilePic.public_id, "image");
    }

    const updatedUser = await this._userModel.findByIdAndUpdate({
      id: userId,
      update: {
        profilePic: {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      },
      options: { new: true },
    });

    if (!updatedUser) {
      throw new BadRequestException("Failed to upload profile image");
    }

    return {
      message: "Profile image uploaded successfully",
      user: updatedUser,
    };
  }

  async getUserByAnother(req: any, userId: string) {
    if (req.user._id === userId) {
      throw new BadRequestException("You cannot view your own profile");
    }

    const user = await this._userModel.findOne({
      filter: { _id: userId },
      select: "firstName lastName mobileNumber profilePic coverPic",
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      message: "User found successfully",
      user,
    };
  }

  async requestSoftDelete(req: any) {
    const checkUser = await this._userModel.findOne({
      filter: {
        _id: req.user._id,
      },
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const sendOtp = await this._AuthService.createOtp(
      checkUser._id,
      EmailEventEnum.DeleteAccount,
    );

    if (!sendOtp) {
      throw new BadRequestException("Failed to send OTP");
    }

    return {
      message: "OTP sent successfully",
    };
  }

  async softDelete(req: any, softDelete: SoftDeleteDto) {
    const checkUser = await this._userModel.findOne({
      filter: {
        _id: req.user._id,
        email: softDelete.email,
      },
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser._id,
        type: EmailEventEnum.DeleteAccount,
        expiredAt: { $gt: new Date() },
      },
    });

    if (!checkOtp) {
      throw new BadRequestException("Invalid OTP or OTP expired");
    }
    const isMatch = await comparePassword(checkOtp.code, softDelete.otp);
    if (!isMatch) {
      throw new BadRequestException("Invalid OTP");
    }
    const deletedUser = await this._userModel.findByIdAndUpdate({
      id: req.user._id,
      update: {
        deletedAt: new Date(),
      },
      options: {
        new: true,
      },
    });

    if (!deletedUser) {
      throw new BadRequestException("Failed to delete user");
    }

    return {
      message: "User deleted successfully",
      deletedAt: deletedUser.deletedAt,
    };
  }
}
