import { Request } from "express";
import { HUserDoc } from "src/DB/models/user.model";

export interface AuthRequest extends Request {
  user: HUserDoc;
}
