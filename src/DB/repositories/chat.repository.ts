import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DB.repository";
import { HChatDocument, Chat } from "../models/chat.model";

@Injectable()
export class ChatRepository extends DataBaseRepository<HChatDocument> {
  constructor(
    @InjectModel(Chat.name)
    protected readonly model: Model<HChatDocument>,
  ) {
    super(model);
  }
}
