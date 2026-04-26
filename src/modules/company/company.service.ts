import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCompanyDto, HrDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { UserRepository } from "src/DB/repositories/user.repository";
import { Types } from "mongoose";
import {
  deleteFile,
  uploadBuffer,
} from "src/common/utils/cloudinary/cloudinary.util";

@Injectable()
export class CompanyService {
  constructor(
    private readonly _companyModel: CompanyRepository,
    private readonly _userModel: UserRepository,
  ) {}
  async addCompany(userId: string, createCompanyDto: CreateCompanyDto) {
    const {
      companyName,
      companyEmail,
      description,
      numberOfEmployees,
      industry,
      address,
    } = createCompanyDto;

    const checkUser = await this._userModel.findById({
      id: userId,
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const checkCompany = await this._companyModel.findOne({
      filter: {
        createdBy: userId as any,
        $or: [{ companyName }, { companyEmail }],
      },
    });

    if (checkCompany) {
      throw new ConflictException("Company name or email already exists");
    }

    const company = await this._companyModel.create({
      data: {
        companyName,
        companyEmail,
        description,
        numberOfEmployees,
        industry,
        address,
        createdBy: checkUser._id,
      },
    });

    if (!company) {
      throw new BadRequestException("Failed to create company");
    }

    return {
      message: "Company created successfully",
      company,
    };
  }

  async addHr(userId: string, companyId: string, addHrDto: HrDto) {
    const { HRs } = addHrDto;

    const hrIds = [...new Set((HRs ?? []).map((id) => id.toString()))];
    if (hrIds.length === 0) {
      throw new BadRequestException("HRs are required");
    }

    const company = await this._companyModel.findOne({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
    });

    if (!company) {
      throw new NotFoundException("Company not found or not authorized");
    }

    const existingUsers = await this._userModel.find({
      filter: {
        _id: { $in: hrIds.map((id) => new Types.ObjectId(id)) },
        deletedAt: { $exists: false },
      },
      select: { _id: 1 },
    });

    if (existingUsers.length !== hrIds.length) {
      throw new BadRequestException("Some HR users not found");
    }

    // 2. add HRs
    const updatedCompany = await this._companyModel.findOneAndUpdate({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
      update: {
        $addToSet: {
          HRs: { $each: hrIds },
        },
      },
      options: { new: true },
    });

    if (!updatedCompany) {
      throw new BadRequestException("Failed to add HR");
    }

    return {
      message: "HR added successfully",
      company: updatedCompany,
    };
  }
  async removeHr(userId: string, companyId: string, removeHrDto: HrDto) {
    const { HRs } = removeHrDto;

    const hrIds = [...new Set((HRs ?? []).map((id) => id.toString()))];
    if (hrIds.length === 0) {
      throw new BadRequestException("HRs are required");
    }

    const company = await this._companyModel.findOne({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
    });

    if (!company) {
      throw new NotFoundException("Company not found or not authorized");
    }

    const companyHrIds = (company.HRs ?? []).map((id: any) => id.toString());
    const toRemove = hrIds.filter((id) => companyHrIds.includes(id));
    if (toRemove.length === 0) {
      throw new BadRequestException("No matching HRs to remove");
    }

    // 2. remove HRs
    const updatedCompany = await this._companyModel.findOneAndUpdate({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
      update: {
        $pull: {
          HRs: { $in: toRemove },
        },
      },
      options: { new: true },
    });

    if (!updatedCompany) {
      throw new BadRequestException("Failed to remove HR");
    }

    return {
      message: "HR removed successfully",
      company: updatedCompany,
    };
  }

  async updateCompany(
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
    companyId: string,
  ) {
    const checkUser = await this._userModel.findById({
      id: userId,
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const company = await this._companyModel.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    if (!company.createdBy.equals(userId)) {
      throw new BadRequestException("You are not the owner of this company");
    }

    const updatedCompany = await this._companyModel.findOneAndUpdate({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
      update: updateCompanyDto,
      options: { new: true },
    });

    if (!updatedCompany) {
      throw new BadRequestException("Company not found or not authorized");
    }

    return {
      message: "Company updated successfully",
      company: updatedCompany,
    };
  }

  async uploadLegalAttachment(
    userId: string,
    companyId: string,
    legalAttachment: Express.Multer.File,
  ) {
    if (!legalAttachment) {
      throw new BadRequestException("Legal PDF is required");
    }

    const company = await this._companyModel.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    if (!company.createdBy.equals(userId)) {
      throw new BadRequestException("You are not the owner of this company");
    }

    const uploadResult: any = await uploadBuffer(legalAttachment.buffer, {
      folder: `hirehub/companies/${companyId}/legal`,
      resource_type: "raw",
      use_filename: true,
      unique_filename: true,
    });

    if (company.legalAttachment?.public_id) {
      await deleteFile(company.legalAttachment.public_id);
    }

    const updatedCompany = await this._companyModel.findOneAndUpdate({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
      update: {
        legalAttachment: {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      },
      options: { new: true },
    });

    if (!updatedCompany) {
      throw new BadRequestException("Failed to upload legal attachment");
    }

    return {
      message: "Legal attachment uploaded successfully",
      company: updatedCompany,
    };
  }

  async softDeleteCompany(userId: string, companyId: string) {
    const checkUser = await this._userModel.findById({
      id: userId,
    });

    if (!checkUser) {
      throw new NotFoundException("User not found");
    }

    const company = await this._companyModel.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    if (!company.createdBy.equals(userId)) {
      throw new BadRequestException("You are not the owner of this company");
    }

    if (company.deletedAt) {
      throw new BadRequestException("Company already deleted");
    }

    const deletedCompany = await this._companyModel.findOneAndUpdate({
      filter: {
        _id: companyId,
        createdBy: userId as any,
        deletedAt: { $exists: false },
      },
      update: { deletedAt: new Date() },
      options: { new: true },
    });

    if (!deletedCompany) {
      throw new BadRequestException("Failed to delete company");
    }

    return {
      message: "Company deleted successfully",
      company: deletedCompany,
    };
  }

  async getCompany(companyId: string) {
    const company = await this._companyModel.findOne({
      filter: {
        _id: companyId,
        deletedAt: { $exists: false },
      },
      select: {
        companyName: 1,
        companyEmail: 1,
        description: 1,
        industry: 1,
        address: 1,
        numberOfEmployees: 1,
      },
      options: {
        populate: [
          {
            path: "Jobs",
            select: "jobTitle jobLocation workingTime seniorityLevel createdAt",
          },
        ],
      },
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    return {
      message: "Company fetched successfully",
      company,
    };
  }
  async searchCompany(name: string, page = 1, limit = 10) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException("Search keyword is required");
    }

    if (page < 1) {
      throw new BadRequestException("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException("Limit must be between 1 and 100");
    }

    const keyword = name.trim();
    const skip = (page - 1) * limit;

    const companies = await this._companyModel.find({
      filter: {
        $or: [
          { $text: { $search: keyword } },
          {
            companyName: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
        deletedAt: { $exists: false },
      },
      select: {
        companyName: 1,
        companyEmail: 1,
        industry: 1,
        address: 1,
        score: { $meta: "textScore" },
      },
      options: {
        sort: { score: { $meta: "textScore" } },
        skip,
        limit,
        populate: [
          {
            path: "Jobs",
            select: "jobTitle jobLocation workingTime seniorityLevel createdAt",
          },
        ],
      },
    });

    const total = await this._companyModel.count({
      $text: { $search: keyword },
      deletedAt: { $exists: false },
    });

    return {
      message: "Companies fetched successfully",
      results: companies.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      companies,
    };
  }
}
