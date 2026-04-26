import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { GoogleAuthUserDto } from "../dto/create-auth.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(
        new UnauthorizedException("Google account email is required"),
        false,
      );
    }

    const user: GoogleAuthUserDto = {
      googleId: profile.id,
      email,
      firstName: profile.name?.givenName || profile.displayName || "Google",
      lastName: profile.name?.familyName || "User",
      profilePic: profile.photos?.[0]?.value,
    };

    done(null, user);
  }
}
