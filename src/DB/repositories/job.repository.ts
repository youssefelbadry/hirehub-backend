import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HJobDoc, Job } from "../models/job.model";

@Injectable()
export class JobRepository extends DataBaseRepository<HJobDoc> {
  constructor(
    @InjectModel(Job.name)
    protected readonly model: Model<HJobDoc>,
  ) {
    super(model);
  }
}
