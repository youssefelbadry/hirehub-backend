import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { Role } from "src/common/enums/user.enum";
import { Roles } from "src/common/decorators/role.decorator";
import * as reqInterface from "src/common/interfaces/req.interface";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post("apply/:jobId")
  @Roles(Role.User)
  @UseInterceptors(MulterInterceptor.uploadSinglePdfMemory("resume"))
  applyJob(
    @Req() req: reqInterface.AuthRequest,
    @Param("jobId") jobId: string,
    @UploadedFile() resume: Express.Multer.File,
  ) {
    const userId = req.user._id.toString();
    if (!resume) {
      throw new BadRequestException("Resume PDF is required");
    }
    return this.applicationsService.applyJob(userId, jobId, resume);
  }

  @Patch("accept-or-reject/:jobId/:applicationId")
  @Roles(Role.User)
  acceptOrRejectApplication(
    @Req() req: reqInterface.AuthRequest,
    @Param("jobId") jobId: string,
    @Param("applicationId") applicationId: string,
    @Body(new ValidationPipe()) updateApplicationDto: UpdateApplicationDto,
  ) {
    const userId = req.user._id.toString();
    return this.applicationsService.acceptOrRejectApplication(
      userId,
      jobId,
      applicationId,
      updateApplicationDto,
    );
  }
}
