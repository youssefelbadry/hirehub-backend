import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { OtpRepository } from "src/DB/repositories/otp.repository";

@Injectable()
export class OtpCleanupService {
  constructor(private readonly _otpModel: OtpRepository) {}

  @Cron("*/1 * * * *")
  async deleteExpiredOtps() {
    console.log("OTP cleanup job running...");
    const now = new Date();

    const result = await this._otpModel.deleteMany({
      expiresAt: { $lt: now },
    });

    console.log(`Deleted ${result.deletedCount} expired OTPs`);
  }
}
