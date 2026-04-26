import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HCompanyDoc, Company } from "../models/company.model";

@Injectable()
export class CompanyRepository extends DataBaseRepository<HCompanyDoc> {
  constructor(
    @InjectModel(Company.name)
    protected readonly model: Model<HCompanyDoc>,
  ) {
    super(model);
  }
}
