import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import { IUser } from "lib/Users/user.interface";
import { Document, HydratedDocument, Mongoose, Types } from "mongoose";
import { Gender, Provider, Role } from "src/common/enums/user.enum";
import { HOtpDoc } from "./otp.model";
// import { AuthProvider, Gender, Role } from "src/common/enums/user.enum";

// import { generateHash } from "src/common/utils/hash/hash.util";
// import { HOtpDoc, Otp } from "./otp.model";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: Provider,
    default: Provider.System,
  })
  provider: Provider;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender: Gender;

  @Prop({
    type: Date,
    required: true,
  })
  DOB: Date;

  @Prop({
    type: String,
    required: true,
  })
  mobileNumber: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Prop({
    type: Boolean,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: Date,
  })
  deletedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
  })
  bannedBy: Types.ObjectId;
  @Prop({
    type: Date,
  })
  bannedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
  })
  updatedBy: Types.ObjectId;

  @Prop({
    type: Date,
  })
  changeCredentialTime: Date;

  @Prop({
    type: {
      secure_url: String,
      public_id: String,
    },
  })
  profilePic: {
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

  OTP: HOtpDoc[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type HUserDoc = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
// UserSchema.virtual("otp", {
//   localField: "_id",
//   foreignField: "createdBy",
//   ref: Otp.name,
// });

UserSchema.virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

// UserSchema.pre<HUserDoc>("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await generateHash(this.password);
//   }
// });
