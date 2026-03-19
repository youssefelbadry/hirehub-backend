import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/DB/repositories/user.repository";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _usermodel: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization header is required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN,
      });

      const user = await this._usermodel.findOne({
        filter: {
          id: payload.userId,
          // isActive: true,
        },
        select: { password: 0 },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (user.bannedAt) {
        throw new UnauthorizedException("User is banned");
      }

      if (user.deletedAt) {
        throw new UnauthorizedException("User is deleted");
      }

      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
