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
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { RolesGuard } from "src/common/guards/role-auth.guard";
import { AuthGuard } from "src/common/guards/auth.guard";
import { SoftDeleteDto, UpdateUserDateDto } from "./dto/update-user.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/user.enum";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post("change-user-info")
  @Roles(Role.User)
  updateUser(
    @Body(new ValidationPipe()) updateAuthDto: UpdateUserDateDto,
    @Req() req: any,
  ) {
    return this.usersService.updateUser(req, updateAuthDto);
  }

  @Patch("upload-profile-pic")
  @Roles(Role.User)
  @UseInterceptors(MulterInterceptor.uploadSingleImageMemory("profilePic"))
  uploadProfilePic(
    @Req() req: any,
    @UploadedFile() profilePic: Express.Multer.File,
  ) {
    if (!profilePic) {
      throw new BadRequestException("Profile image is required");
    }
    return this.usersService.uploadProfilePic(req.user._id, profilePic);
  }

  @Get("get-user-info")
  @Roles(Role.User)
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserById(req);
  }

  @Get("get-user-by-another/:userId")
  @Roles(Role.User)
  getUserByAnother(@Req() req: any, @Param("userId") userId: string) {
    return this.usersService.getUserByAnother(req, userId);
  }

  @Post("request-soft-delete")
  @Roles(Role.User)
  requestSoftDelete(@Req() req: any) {
    return this.usersService.requestSoftDelete(req);
  }

  @Delete("soft-delete")
  @Roles(Role.User)
  softDelete(@Req() req: any, @Body() softDelete: SoftDeleteDto) {
    return this.usersService.softDelete(req, softDelete);
  }
}
