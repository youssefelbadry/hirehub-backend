import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HOtpDoc, Otp } from "../models/otp.model";

@Injectable()
export class OtpRepository extends DataBaseRepository<HOtpDoc> {
  constructor(
    @InjectModel(Otp.name)
    protected readonly model: Model<HOtpDoc>,
  ) {
    super(model);
  }
}
