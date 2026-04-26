import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { JobRepository } from "src/DB/repositories/job.repository";
import { ApplicationRepository } from "src/DB/repositories/application.repository";
import { UserRepository } from "src/DB/repositories/user.repository";
import { CompanyRepository } from "src/DB/repositories/company.repository";
import { applicationStatus } from "src/common/enums/app.enum";
import { Types } from "mongoose";
import { uploadBuffer } from "src/common/utils/cloudinary/cloudinary.util";
import { SendEmailAction } from "src/common/utils/events/sendEmailAction";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly _jobModel: JobRepository,
    private readonly _applicationModel: ApplicationRepository,
    private readonly _userModel: UserRepository,
    private readonly _companyModel: CompanyRepository,
  ) {}

  private readonly emailAction = new SendEmailAction();
  async applyJob(userId: string, jobId: string, resume: Express.Multer.File) {
    if (!resume) {
      throw new BadRequestException("Resume PDF is required");
    }

    const job = await this._jobModel.findById({ id: jobId });
    if (!job) {
      throw new NotFoundException("Job not found");
    }

    if (job.closed) {
      throw new BadRequestException("This job is closed");
    }

    if (job.addedBy.toString() === userId.toString()) {
      throw new BadRequestException("You cannot apply to your own job");
    }

    const existingApplication = await this._applicationModel.findOne({
      filter: {
        jobId: job._id,
        userId,
      },
    });

    if (existingApplication) {
      throw new ConflictException("You have already applied for this job");
    }
    const company = await this._companyModel.findById({ id: job.companyId });

    if (company?.HRs?.includes(new Types.ObjectId(userId))) {
      throw new BadRequestException("HR cannot apply to jobs");
    }

    const resumeUpload: any = await uploadBuffer(resume.buffer, {
      folder: `hirehub/resumes/${userId}`,
      resource_type: "raw",
      use_filename: true,
      unique_filename: true,
    });

    const application = await this._applicationModel.create({
      data: {
        jobId: job._id,
        userId: new Types.ObjectId(userId),
        userCV: {
          secure_url: resumeUpload.secure_url,
          public_id: resumeUpload.public_id,
        },
      },
    });

    const user = await this._userModel.findById({
      id: userId,
      select: "email firstName lastName",
    });

    if (!company?.HRs?.length) {
      return {
        message: "Application submitted successfully",
        application,
      };
    }

    const hrUsers = await this._userModel.find({
      filter: {
        _id: { $in: company.HRs },
        deletedAt: { $exists: false },
      },
      select: "email firstName lastName",
    });

    hrUsers.forEach((hr: any) => {
      if (!hr?.email) return { message: "HR email not found" };

      this.emailAction.sendApplicationStatusEmail(
        hr.email,
        `${hr.firstName} ${hr.lastName}`,
        job.jobTitle,
        company.companyName,
        applicationStatus.pending,
      );
    });

    return {
      message: "Application submitted successfully",
      application,
    };
  }
  async acceptOrRejectApplication(
    userId: string,
    jobId: string,
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    const { status } = updateApplicationDto;

    if (!status) {
      throw new BadRequestException("Status is required");
    }

    const allowedStatuses = [
      applicationStatus.accepted,
      applicationStatus.rejected,
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        "Status must be either 'accepted' or 'rejected'",
      );
    }

    // 🟢 1. get application
    const application = await this._applicationModel.findOne({
      filter: {
        _id: applicationId,
        jobId: new Types.ObjectId(jobId),
      },
    });

    if (!application) {
      throw new NotFoundException("Application not found");
    }

    // 🟢 2. get job
    const job = await this._jobModel.findById({ id: jobId });
    if (!job) {
      throw new NotFoundException("Job not found");
    }

    // 🟢 3. check HR
    const company = await this._companyModel.findOne({
      filter: {
        _id: job.companyId,
        HRs: userId,
      },
    });

    if (!company)
      throw new UnauthorizedException(
        "You are not authorized to take action on this job",
      );
    if (new Types.ObjectId(userId).equals(application.userId)) {
      throw new UnauthorizedException(
        "You are not authorized to take action on this application",
      );
    }

    // 🟢 4. update status
    const updated = await this._applicationModel.findByIdAndUpdate({
      id: applicationId,
      update: { status },
      options: { new: true },
    });

    const user = await this._userModel.findById({
      id: application.userId,
      select: "email firstName lastName",
    });

    if (user?.email) {
      await this.emailAction.sendApplicationStatusEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        job.jobTitle,
        company.companyName,
        status,
      );
    }

    return {
      message: `Application ${status} successfully`,
      application: updated,
    };
  }
}
