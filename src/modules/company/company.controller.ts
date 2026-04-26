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
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, HrDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/user.enum";
import * as reqInterface from "src/common/interfaces/req.interface";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("add-company")
  @Roles(Role.User)
  addCompany(
    @Req() req: reqInterface.AuthRequest,
    @Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto,
  ) {
    const userId = req.user._id.toString();
    return this.companyService.addCompany(userId, createCompanyDto);
  }

  @Post("add-hr/:companyId")
  @Roles(Role.User)
  addHr(
    @Req() req: reqInterface.AuthRequest,

    @Param("companyId") companyId: string,
    @Body(new ValidationPipe()) addHrDto: HrDto,
  ) {
    const userId = req.user._id.toString();

    return this.companyService.addHr(userId, companyId, addHrDto);
  }

  @Delete("delete-hr/:companyId")
  @Roles(Role.User)
  deleteHr(
    @Req() req: reqInterface.AuthRequest,

    @Param("companyId") companyId: string,
    @Body(new ValidationPipe()) deleteHrDto: HrDto,
  ) {
    const userId = req.user._id.toString();

    return this.companyService.removeHr(userId, companyId, deleteHrDto);
  }

  @Patch("update-company/:companyId")
  @Roles(Role.User)
  updateCompany(
    @Req() req: reqInterface.AuthRequest,
    @Body(new ValidationPipe()) updateCompanyDto: UpdateCompanyDto,
    @Param("companyId") companyId: string,
  ) {
    const userId = req.user._id.toString();
    return this.companyService.updateCompany(
      userId,
      updateCompanyDto,
      companyId,
    );
  }

  @Patch("upload-legal/:companyId")
  @Roles(Role.User)
  @UseInterceptors(MulterInterceptor.uploadSinglePdfMemory("legalAttachment"))
  uploadLegalAttachment(
    @Req() req: reqInterface.AuthRequest,
    @Param("companyId") companyId: string,
    @UploadedFile() legalAttachment: Express.Multer.File,
  ) {
    const userId = req.user._id.toString();
    if (!legalAttachment) {
      throw new BadRequestException("Legal PDF is required");
    }
    return this.companyService.uploadLegalAttachment(
      userId,
      companyId,
      legalAttachment,
    );
  }

  @Delete("delete-company/:companyId")
  @Roles(Role.User)
  deleteCompany(
    @Req() req: reqInterface.AuthRequest,
    @Param("companyId") companyId: string,
  ) {
    const userId = req.user._id.toString();
    return this.companyService.softDeleteCompany(userId, companyId);
  }

  @Get("get-company/:companyId")
  @Roles(Role.User)
  getComapny(@Param("companyId") companyId: string) {
    return this.companyService.getCompany(companyId);
  }
  @Get("search-company")
  @Roles(Role.User)
  searchCompany(
    @Query("name") name: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.companyService.searchCompany(name, page, limit);
  }
}
