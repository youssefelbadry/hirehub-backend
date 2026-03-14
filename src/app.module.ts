import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { ChatsModule } from "./modules/chats/chats.module";
import { UsersModule } from "./modules/users/users.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { CompanyModule } from "./modules/company/company.module";

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
    UsersModule,
    ChatsModule,
    JobsModule,
    AuthModule,
    ApplicationsModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
