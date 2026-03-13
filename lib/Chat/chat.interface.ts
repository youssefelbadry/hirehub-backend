import { Types } from "mongoose";

export interface IChatMessage {
  message: string;
  senderId: Types.ObjectId;
}

export interface IChat {
  senderId: Types.ObjectId;

  receiverId: Types.ObjectId;

  messages: IChatMessage[];
}
