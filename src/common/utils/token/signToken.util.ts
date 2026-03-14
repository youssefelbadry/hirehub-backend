import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(
      { payload },
      {
        secret: process.env.ACCESS_TOKEN,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRED),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { payload },
      {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRED),
      },
    );

    return {
      credentials: {
        accessToken,
        refreshToken,
      },
    };
  }
}
