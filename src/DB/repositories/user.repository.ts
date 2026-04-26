import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HUserDoc, User } from "../models/user.model";

@Injectable()
export class UserRepository extends DataBaseRepository<HUserDoc> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<HUserDoc>,
  ) {
    super(model);
  }
}
