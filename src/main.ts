import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as express from "express";
import { setupSecurity } from "./common/middlewares/security.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });
  setupSecurity(app);
  const logger = new Logger("Bootstrap");
  const port = process.env.PORT ?? 3000;
  app.use("/uploads", express.static("./src/uploads"));
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
