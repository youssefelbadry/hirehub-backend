import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminInput } from "./dto/create-admin.input";
import { UpdateAdminInput } from "./dto/update-admin.input";
import { UserRepository } from "src/DB/repositories/user.repository";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { Role } from "src/common/enums/user.enum";
import { SendEmailAction } from "src/common/utils/events/sendEmailAction";

@Injectable()
export class AdminService {
  constructor(
    private readonly _userModel: UserRepository,
    private readonly _companyModel: CompanyRepository,
  ) {}

  async banOrUnbanUser(userId: string) {
    const user = await this._userModel.findById({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isBanned = !!user.bannedAt;
    const banAction = isBanned
      ? { $unset: { bannedAt: 1 } }
      : { $set: { bannedAt: new Date() } };

    const updatedUser = await this._userModel.findByIdAndUpdate({
      id: userId,
      update: banAction,
      options: { new: true, select: "-password" },
    });

    return {
      message: isBanned
        ? "User unbanned successfully"
        : "User banned successfully",
      user: updatedUser,
    };
  }

  async banOrUnbanCompany(companyId: string) {
    const company = await this._companyModel.findById({ id: companyId });
    if (!company) {
      throw new NotFoundException("Company not found");
    }

    const isBanned = !!company.bannedAt;
    const banAction = isBanned
      ? { $unset: { bannedAt: 1 } }
      : { $set: { bannedAt: new Date() } };

    const updatedCompany = await this._companyModel.findByIdAndUpdate({
      id: companyId,
      update: banAction,
      options: { new: true, select: "-password" },
    });

    return {
      message: isBanned
        ? "Company unbanned successfully"
        : "Company banned successfully",
      company: updatedCompany,
    };
  }

  async approveCompany(companyId: string) {
    const company = await this._companyModel.findById({ id: companyId });
    if (!company) {
      throw new NotFoundException("Company not found");
    }
    if (company.bannedAt) {
      throw new NotFoundException("Company is banned");
    }
    if (!company.legalAttachment) {
      throw new NotFoundException("Company legal attachment not found");
    }
    if (company.approvedByAdmin) {
      throw new NotFoundException("Company is already approved");
    }

    const updatedCompany = await this._companyModel.findByIdAndUpdate({
      id: companyId,
      update: { $set: { approvedByAdmin: true } },
      options: { new: true },
    });

    if (updatedCompany?.companyEmail) {
      const emailAction = new SendEmailAction();
      await emailAction.sendCompanyApprovalEmail(
        updatedCompany.companyEmail,
        updatedCompany.companyName,
      );
    }

    return {
      message: "Company approved successfully",
      company: updatedCompany,
    };
  }
}
