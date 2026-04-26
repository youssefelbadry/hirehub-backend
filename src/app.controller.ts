import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { join } from "node:path";
import type { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("google-oauth-test")
  getGoogleOauthTestPage(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), "google-oauth-test.html"));
  }
}
