import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/user.enum";
import * as reqInterface from "src/common/interfaces/req.interface";

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch("toggle-ban/users/:userId")
  @Roles(Role.Admin)
  async banOrUnbanUser(@Param("userId") userId: string) {
    return this.adminService.banOrUnbanUser(userId);
  }

  @Patch("toggle-ban/companies/:companyId")
  @Roles(Role.Admin)
  async banOrUnbanCompany(
    @Param("companyId") companyId: string,
    @Req() req: reqInterface.AuthRequest,
  ) {
    return this.adminService.banOrUnbanCompany(companyId);
  }

  @Patch("approve-company/company/:companyId")
  @Roles(Role.Admin)
  async approveCompany(@Param("companyId") companyId: string) {
    return this.adminService.approveCompany(companyId);
  }
}
