import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import { ICompany } from "lib/Comoany/company.interface";
import { Document, HydratedDocument, Types } from "mongoose";
import { CompanySize } from "src/common/enums/company.enum";
import mongoose from "mongoose";
import { Job } from "./job.model";
import { Application } from "./application.model";

export type HCompanyDocument = Company & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Company implements ICompany {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  companyName: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Job" }],
    default: [],
  })
  jobs: Types.ObjectId[];

  @Prop({
    type: String,
    required: true,
  })
  industry: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  numberOfEmployees: CompanySize;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  companyEmail: string;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: {
      secure_url: String,
      public_id: String,
    },
  })
  logo: {
    secure_url: string;
    public_id: string;
  };

  @Prop({
    type: {
      secure_url: String,
      public_id: String,
    },
  })
  coverPic: {
    secure_url: string;
    public_id: string;
  };

  @Prop({
    type: [{ type: Types.ObjectId, ref: "User" }],
    default: [],
  })
  HRs: Types.ObjectId[];

  @Prop({
    type: Date,
  })
  bannedAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;

  @Prop({
    type: {
      secure_url: String,
      public_id: String,
    },
  })
  legalAttachment: {
    secure_url: string;
    public_id: string;
  };

  @Prop({
    type: Boolean,
    default: false,
  })
  approvedByAdmin: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export type HCompanyDoc = HydratedDocument<Company>;
export const CompanyModel = MongooseModule.forFeature([
  {
    name: Company.name,
    schema: CompanySchema,
  },
]);
CompanySchema.virtual("Jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});
CompanySchema.index({
  companyName: "text",
});
CompanySchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const companyId = this.getFilter()._id;

    const JobModel = mongoose.model(Job.name);
    const ApplicationModel = mongoose.model(Application.name);

    const jobs = await JobModel.find({ companyId });

    const jobIds = jobs.map((job: any) => job._id);

    await ApplicationModel.deleteMany({
      jobId: { $in: jobIds },
    });

    await JobModel.deleteMany({ companyId });
  },
);
