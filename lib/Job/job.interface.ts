import { Types } from "mongoose";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "src/common/enums/job,enum";

export interface IJob {
  jobTitle: string;
  jobLocation: jobLocation;
  workingTime: workingTime;
  seniorityLevel: seniorityLevel;
  jobDescription: string;
  technicalSkills: string[];
  softSkills: string[];
  addedBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  closed: boolean;
  companyId: Types.ObjectId;
}
