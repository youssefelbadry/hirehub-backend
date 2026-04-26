import { IsMongoId, IsString } from "class-validator";

export class SendMessageDto {
  @IsMongoId()
  applicationId: string;

  @IsString()
  message: string;
}
