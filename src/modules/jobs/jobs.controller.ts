import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto, GetJobsFilterDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/user.enum";
import * as reqInterface from "src/common/interfaces/req.interface";

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("company/:companyId/jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("add-job")
  @Roles(Role.User)
  addJob(
    @Req() req: reqInterface.AuthRequest,
    @Param("companyId") companyId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    const userId = req.user._id.toString();
    return this.jobsService.addJob(userId, companyId, createJobDto);
  }

  @Patch("update-job/:jobId")
  @Roles(Role.User)
  updateJob(
    @Req() req: reqInterface.AuthRequest,
    @Param("companyId") companyId: string,
    @Param("jobId") jobId: string,
    @Body(new ValidationPipe()) updateJobDto: UpdateJobDto,
  ) {
    const userId = req.user._id.toString();
    return this.jobsService.updateJob(userId, companyId, jobId, updateJobDto);
  }
  @Delete("delete-job/:jobId")
  @Roles(Role.User)
  deleteJob(
    @Req() req: reqInterface.AuthRequest,

    @Param("companyId") companyId: string,
    @Param("jobId") jobId: string,
  ) {
    const userId = req.user._id.toString();
    return this.jobsService.deleteJob(userId, companyId, jobId);
  }

  @Get()
  @Roles(Role.User)
  getJobs(
    @Req() req: reqInterface.AuthRequest,
    @Param("companyId") companyId: string,
  ) {
    const userId = req.user._id.toString();
    return this.jobsService.getJobs(userId, companyId);
  }

  // @Get(':id')
  // findOne(@Param('companyId') companyId: string, @Param('id') id: string) {
  //   return this.jobsService.findOne(companyId, +id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobsService.remove(+id);
  // }
}

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("jobs")
export class JobsPublicController {
  constructor(private readonly jobsService: JobsService) {}

  @Get("all")
  @Roles(Role.User) // Or remove this if you want it to be public
  getSpecificJobs(@Query(new ValidationPipe()) filters: GetJobsFilterDto) {
    return this.jobsService.getSpecificJobs(filters);
  }
}
