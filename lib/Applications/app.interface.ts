import { Types } from "mongoose";

export interface IApplication {
  jobId: Types.ObjectId;

  userId: Types.ObjectId;

  userCV: {
    secure_url: string;
    public_id: string;
  };

  status: string;
}
