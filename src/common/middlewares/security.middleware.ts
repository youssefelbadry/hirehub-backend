import { INestApplication } from "@nestjs/common";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function setupSecurity(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "no-referrer" },
    }),
  );

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests, please try again later",
    }),
  );
}
