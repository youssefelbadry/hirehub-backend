import { IsMongoId, IsString } from "class-validator";

export class SendMessageDto {
  @IsMongoId()
  receiverId: string;

  @IsString()
  message: string;
}
