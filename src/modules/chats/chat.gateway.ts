import { ValidationPipe } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SendMessageDto } from "./dto/create-chat.dto";
import { ChatRepository } from "src/DB/repositories/chat.repository";
import { ChatsService } from "./chats.service";

@WebSocketGateway({
  namespace: "/chats",
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatModel: ChatRepository,
    private readonly chatService: ChatsService,
  ) {}

  handleConnection(client: Socket) {
    client.emit("connected", { id: client.id });
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage("join_chat")
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; applicationId: string },
  ) {
    const { userId, applicationId } = payload;

    if (!userId || !applicationId) {
      throw new WsException("userId and applicationId are required");
    }

    client.data.userId = userId;

    client.join(this.chatRoom(applicationId));

    return {
      event: "joined",
      data: { applicationId },
    };
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe({ whitelist: true, transform: true }))
    dto: SendMessageDto,
  ) {
    const senderId = client.data?.userId;

    if (!senderId) {
      throw new WsException("Unauthorized");
    }

    const message = await this.chatService.createMessage({
      senderId,
      applicationId: dto.applicationId,
      content: dto.message,
    });

    this.server
      .to(this.chatRoom(dto.applicationId))
      .emit("new_message", message);

    return {
      event: "message_sent",
      data: message,
    };
  }

  private chatRoom(applicationId: string) {
    return `chat:${applicationId}`;
  }
}
