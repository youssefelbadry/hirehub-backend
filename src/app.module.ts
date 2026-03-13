import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { ChatsModule } from "./modules/chats/chats.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve("./config/dev.env"),
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DB_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on("connected", () =>
          console.log("MongoDB connected successfully"),
        );
        return connection;
      },
    }),

    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
