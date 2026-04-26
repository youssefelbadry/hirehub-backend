import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateJobDto, GetJobsFilterDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { UserRepository } from "src/DB/repositories/user.repository";
import { JobRepository } from "src/DB/repositories/job.repository";
import { Types } from "mongoose";
import { paginate } from "src/common/interfaces/pagination.interface";

@Injectable()
export class JobsService {
  constructor(
    private readonly _companyModel: CompanyRepository,
    private readonly _userModel: UserRepository,
    private readonly _jobModel: JobRepository,
  ) {}

  private async checkCompanyOwnership(companyId: string, userId: string) {
    const company = await this._companyModel.findById({ id: companyId });
    if (!company) {
      throw new NotFoundException("Company not found");
    }
    if (company.deletedAt) {
      throw new BadRequestException("Company is deleted");
    }
    const isOwner = company.createdBy.toString() === userId.toString();
    const isHR = company.HRs?.some((hr) => hr.toString() === userId.toString());
    if (!isOwner && !isHR) {
      throw new UnauthorizedException("You are not authorized to this company");
    }
    return company;
  }
  async addJob(userId: string, companyId: string, createJobDto: CreateJobDto) {
    const {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    } = createJobDto;

    const company = await this._companyModel.findById({ id: companyId });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    if (company.deletedAt) {
      throw new BadRequestException("Company is deleted");
    }

    const isOwner = company.createdBy.toString() === userId;

    const isHR = company.HRs?.some((hr) => hr.toString() === userId);

    if (!isOwner && !isHR) {
      throw new UnauthorizedException(
        "You are not authorized to add jobs to this company",
      );
    }

    const job = await this._jobModel.create({
      data: {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId: company._id,
        addedBy: new Types.ObjectId(userId),
      },
    });

    if (!job) {
      throw new BadRequestException("Job not created");
    }

    return {
      message: "Job created successfully",
      job,
    };
  }

  async updateJob(
    userId: string,
    companyId: string,
    jobId: string,
    updateJobDto: UpdateJobDto,
  ) {
    await this.checkCompanyOwnership(companyId, userId);

    const checkJob = await this._jobModel.findOne({
      filter: {
        _id: jobId,
      },
    });
    if (!checkJob) throw new NotFoundException("Job not found in this company");
    const update = await this._jobModel.findByIdAndUpdate({
      id: checkJob._id.toString(),
      update: updateJobDto,
      options: { new: true },
    });

    if (!update) {
      throw new BadRequestException("Job not updated");
    }

    return {
      message: "Job updated successfully",
      job: update,
    };
  }

  async deleteJob(userId: string, companyId: string, jobId: string) {
    await this.checkCompanyOwnership(companyId, userId);

    const checkJob = await this._jobModel.findById({ id: jobId });
    if (!checkJob) throw new NotFoundException("Job not found in this company");
    if (checkJob.companyId.toString() !== companyId.toString()) {
      throw new NotFoundException("Job not found in this company");
    }

    const deleted = await this._jobModel.findByIdAndDelete(
      checkJob._id.toString(),
    );

    if (!deleted) {
      throw new BadRequestException("Job not deleted");
    }

    return {
      message: "Job deleted successfully",
    };
  }

  async getJobs(userId: string, companyId: string) {
    await this.checkCompanyOwnership(companyId, userId);

    const { page = 1, limit = 10, search } = {} as any;

    const filter: any = {
      companyId: new Types.ObjectId(companyId),
    };

    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { jobDescription: { $regex: search, $options: "i" } },
      ];
    }

    const result = await paginate({
      model: this._jobModel.getModel(),
      filter,
      page,
      limit,
      sort: { createdAt: -1 },
    });

    return {
      message: "Jobs fetched successfully",
      data: {
        jobs: result.data,
        pagination: result.pagination,
      },
    };
  }
  async getSpecificJobs(filters: GetJobsFilterDto) {
    const {
      jobTitle,
      seniorityLevel,
      jobLocation,
      workingTime,
      technicalSkills,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const filter: any = {
      closed: false,
    };

    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: "i" };
    }

    if (seniorityLevel?.length) {
      filter.seniorityLevel = { $in: seniorityLevel };
    }

    if (jobLocation?.length) {
      filter.jobLocation = { $in: jobLocation };
    }

    if (workingTime?.length) {
      filter.workingTime = { $in: workingTime };
    }

    if (technicalSkills?.length) {
      filter.technicalSkills = { $in: technicalSkills };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const result = await paginate({
      model: this._jobModel.getModel(),
      filter,
      page,
      limit,
      sort,
      populate: [
        { path: "companyId", select: "companyName logo industry address" },
        { path: "addedBy", select: "firstName lastName email" },
      ],
      select: {
        jobTitle: 1,
        jobLocation: 1,
        workingTime: 1,
        seniorityLevel: 1,
        jobDescription: 1,
        technicalSkills: 1,
        softSkills: 1,
        companyId: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    return {
      message: "Jobs fetched successfully",
      data: {
        jobs: result.data,
        pagination: result.pagination,
        filters: {
          applied: {
            jobTitle,
            seniorityLevel,
            jobLocation,
            workingTime,
            technicalSkills,
          },
        },
      },
    };
  }
}
