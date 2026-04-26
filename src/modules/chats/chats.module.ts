import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsController } from "./chats.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatModel } from "src/DB/models/chat.model";
import { UserModel } from "src/DB/models/user.model";
import { ChatRepository } from "src/DB/repositories/chat.repository";
import { UserRepository } from "src/DB/repositories/user.repository";

@Module({
  imports: [ChatModel, UserModel],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway, ChatRepository, UserRepository],
})
export class ChatsModule {}
