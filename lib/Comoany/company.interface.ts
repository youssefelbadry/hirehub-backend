import { Types } from "mongoose";

export interface ICompany {
  companyName: string;

  description: string;

  industry: string;

  address: string;

  numberOfEmployees: string;

  companyEmail: string;

  createdBy: Types.ObjectId;

  logo?: {
    secure_url: string;
    public_id: string;
  };

  coverPic?: {
    secure_url: string;
    public_id: string;
  };

  HRs: Types.ObjectId[];

  bannedAt?: Date;

  deletedAt?: Date;

  legalAttachment: {
    secure_url: string;
    public_id: string;
  };

  approvedByAdmin: boolean;
}
