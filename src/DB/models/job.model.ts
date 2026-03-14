import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument, Types } from "mongoose";
import { IJob } from "lib/Job/job.interface";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "src/common/enums/job,enum";
import { Application } from "./application.model";

export type HJobDocument = Job & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Job implements IJob {
  @Prop({ required: true, trim: true })
  jobTitle: string;

  @Prop({
    type: String,
    enum: jobLocation,
    required: true,
  })
  jobLocation: jobLocation;

  @Prop({
    type: String,
    enum: workingTime,
    required: true,
  })
  workingTime: workingTime;

  @Prop({
    type: String,
    enum: seniorityLevel,
    required: true,
  })
  seniorityLevel: seniorityLevel;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ type: [String], default: [] })
  technicalSkills: string[];

  @Prop({ type: [String], default: [] })
  softSkills: string[];

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  addedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
  })
  updatedBy: Types.ObjectId;

  @Prop({ default: false })
  closed: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: "Company",
    required: true,
  })
  companyId: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
export type HJobDoc = HydratedDocument<Job>;
export const JobModel = MongooseModule.forFeature([
  {
    name: Job.name,
    schema: JobSchema,
  },
]);

JobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

JobSchema.pre("deleteOne", { document: false, query: true }, async function () {
  const jobId = this.getFilter()._id;
  const ApplicationModel = mongoose.model(Application.name);
  await ApplicationModel.deleteMany({ jobId });
});
