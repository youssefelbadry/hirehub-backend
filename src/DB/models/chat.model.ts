import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

import { IApplication } from "lib/Applications/app.interface";
import { applicationStatus } from "src/common/enums/app.enum";

export type HChatDocument = Chat & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Chat {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  senderId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  receiverId: Types.ObjectId;

  @Prop({
    type: [
      {
        message: { type: String, required: true },
        senderId: { type: Types.ObjectId, ref: "User", required: true },
      },
    ],
    default: [],
  })
  messages: {
    message: string;
    senderId: Types.ObjectId;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export type HChatDoc = HydratedDocument<Chat>;
export const ChatModel = MongooseModule.forFeature([
  {
    name: Chat.name,
    schema: ChatSchema,
  },
]);
