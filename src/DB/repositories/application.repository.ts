import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HApplicationDoc, Application } from "../models/application.model";

@Injectable()
export class ApplicationRepository extends DataBaseRepository<HApplicationDoc> {
  constructor(
    @InjectModel(Application.name)
    protected readonly model: Model<HApplicationDoc>,
  ) {
    super(model);
  }
}
