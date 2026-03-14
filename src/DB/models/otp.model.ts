import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { EmailEventEnum } from "src/common/utils/email/emailSubjectEnum";
import { emailEvents } from "src/common/utils/events/email.event";
import { hashPassword } from "src/common/utils/hash/hash.util";
import { HUserDoc } from "./user.model";
@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "User",
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: EmailEventEnum,
    required: true,
  })
  type: EmailEventEnum;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type HOtpDoc = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
    schema: OtpSchema,
  },
]);

OtpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
OtpSchema.pre<HOtpDoc>(
  "save",
  async function (this: HOtpDoc & { wasNew: boolean; plainOtp: string }) {
    this.wasNew = this.isNew;
    if (this.isModified("code")) {
      this.plainOtp = this.code;
      this.code = await hashPassword(this.code);
      await this.populate("createdBy");
    }
  },
);

OtpSchema.post<HOtpDoc>("save", async function (doc, next) {
  const that = this as HOtpDoc & { wasNew: boolean; plainOtp: string };
  if (that.wasNew && that.plainOtp) {
    let event: EmailEventEnum;
    switch (that.type) {
      case EmailEventEnum.ConfirmEmail:
        event = EmailEventEnum.ConfirmEmail;
        break;
      case EmailEventEnum.ResetPassword:
        event = EmailEventEnum.ResetPassword;
        break;
      case EmailEventEnum.Welcome:
        event = EmailEventEnum.Welcome;
        break;
      case EmailEventEnum.ChangePassword:
        event = EmailEventEnum.ChangePassword;
        break;
    }
    emailEvents.emit(event, {
      to: (that.createdBy as unknown as HUserDoc).email,
      otp: that.plainOtp,
      firstName: (that.createdBy as unknown as HUserDoc).firstName,
    });
  }
});
