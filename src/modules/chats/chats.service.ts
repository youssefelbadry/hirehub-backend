import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { ChatRepository } from "src/DB/repositories/chat.repository";
import { UserRepository } from "src/DB/repositories/user.repository";

@Injectable()
export class ChatsService {
  constructor(
    private readonly _chatModel: ChatRepository,
    private readonly _userModel: UserRepository,
  ) {}

  private async ensureActiveUser(userId: string) {
    const user = await this._userModel.findById({ id: userId });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.deletedAt) {
      throw new BadRequestException("User is deleted");
    }

    if (user.bannedAt) {
      throw new BadRequestException("User is banned");
    }

    return user;
  }

  private buildChatFilter(userA: string, userB: string) {
    const a = new Types.ObjectId(userA);
    const b = new Types.ObjectId(userB);
    return {
      $or: [
        { senderId: a, receiverId: b },
        { senderId: b, receiverId: a },
      ],
    };
  }

  async createMessage({
    applicationId,
    senderId,
    content,
  }: {
    applicationId: string;
    senderId: string;
    content: string;
  }) {
    if (!content?.trim()) {
      throw new BadRequestException("message is required");
    }

    await this.ensureActiveUser(senderId);

    const messageItem = {
      message: content,
      senderId: new Types.ObjectId(senderId),
    };

    let chat = await this._chatModel.findOne({
      filter: { applicationId: new Types.ObjectId(applicationId) },
    });

    if (!chat) {
      chat = await this._chatModel.create({
        data: {
          applicationId: new Types.ObjectId(applicationId),
          messages: [messageItem],
        },
      });
    } else {
      chat = await this._chatModel.findByIdAndUpdate({
        id: chat._id.toString(),
        update: { $push: { messages: messageItem } },
        options: { new: true },
      });
    }

    return {
      chatId: chat?._id || null,
      senderId,
      applicationId,
      message: content,
    };
  }

  async getChatBetweenUsers(userId: string, otherUserId: string) {
    await this.ensureActiveUser(userId);
    await this.ensureActiveUser(otherUserId);

    const chat = await this._chatModel.findOne({
      filter: this.buildChatFilter(userId, otherUserId),
    });

    if (!chat) {
      throw new NotFoundException("Chat not found");
    }

    return {
      message: "Chat fetched successfully",
      chat,
    };
  }
}
