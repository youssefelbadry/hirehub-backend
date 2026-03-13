import { Types } from "mongoose";
import { HOtpDoc } from "src/DB/models/otp.model";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  provider: string;

  gender?: string;

  DOB: Date;

  mobileNumber: string;

  role: string;

  isConfirmed: boolean;

  deletedAt?: Date;

  bannedAt?: Date;

  updatedBy?: Types.ObjectId;

  changeCredentialTime?: Date;

  profilePic?: {
    secure_url: string;
    public_id: string;
  };

  coverPic?: {
    secure_url: string;
    public_id: string;
  };

  OTP?: HOtpDoc[];
}
