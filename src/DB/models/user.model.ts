import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import { IUser } from "lib/Users/user.interface";
import mongoose, { Document, HydratedDocument, Types } from "mongoose";
import { Gender, Provider, Role } from "src/common/enums/user.enum";
import { HOtpDoc, Otp } from "./otp.model";
import { hashPassword } from "src/common/utils/hash/hash.util";
import { decrypt, encrypt } from "src/common/utils/encrypt/encrypt.util";
import { Application } from "./application.model";
import { Chat } from "./chat.model";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret.id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret.id;
      delete ret.__v;
      return ret;
    },
  },
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
  })
  mobileNumberHash: string;

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

  @Virtual()
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
UserSchema.virtual("otp", {
  localField: "_id",
  foreignField: "createdBy",
  ref: Otp.name,
});

UserSchema.virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
    this.changeCredentialTime = new Date();
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt(this.mobileNumber);
    this.mobileNumberHash = await hashPassword(this.mobileNumber);
  }
  next;
});

UserSchema.post(["findOne", "find"], async function (doc) {
  try {
    if (doc) {
      doc.mobileNumber = decrypt(doc.mobileNumber);
    }
  } catch (error) {
    console.error("Error decrypting mobile number:", error);
  }
});

UserSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const userId = this.getFilter()._id;

    const ApplicationModel = mongoose.model(Application.name);
    const ChatModel = mongoose.model(Chat.name);

    await ApplicationModel.deleteMany({ userId });

    await ChatModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  },
);
