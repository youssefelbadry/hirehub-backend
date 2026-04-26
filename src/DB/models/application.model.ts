import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { IApplication } from "lib/Applications/app.interface";
import { applicationStatus } from "src/common/enums/app.enum";
export type HApplicationDocument = Application & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Application implements IApplication {
  @Prop({
    type: Types.ObjectId,
    ref: "Job",
    required: true,
  })
  jobId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: {
      secure_url: String,
      public_id: String,
    },
    required: true,
  })
  userCV: {
    secure_url: string;
    public_id: string;
  };

  @Prop({
    type: String,
    enum: applicationStatus,
    default: applicationStatus.pending,
  })
  status: applicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
export type HApplicationDoc = HydratedDocument<Application>;
export const ApplicationModel = MongooseModule.forFeature([
  {
    name: Application.name,
    schema: ApplicationSchema,
  },
]);
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
ApplicationSchema.index({ status: 1 });
