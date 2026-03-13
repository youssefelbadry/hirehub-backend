import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
// import { EmailEvent } from "src/common/utils/email/emailSubjectEnum";
// import { emailEvents } from "src/common/utils/events/email.event";
// import { generateHash } from "src/common/utils/hash/hash.util";

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

  //   @Prop({
  //     type: String,
  //     enum: EmailEvent,
  //     required: true,
  //   })
  //   type: EmailEvent;
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
// OtpSchema.pre<HOtpDoc>(
//   "save",
//   async function (this: HOtpDoc & { wasNew: boolean; plainOtp: string }) {
//     this.wasNew = this.isNew;
//     if (this.isModified("code")) {
//       this.plainOtp = this.code;
//       this.code = await generateHash(this.code);
//       await this.populate("createdBy");
//     }
//   },
// );

// OtpSchema.post<HOtpDoc>("save", async function (doc, next) {
//   const that = this as HOtpDoc & { wasNew: boolean; plainOtp: string };
//   if (that.wasNew && that.plainOtp) {
//     emailEvents.emit(EmailEvent.ConfirmEmail, {
//       to: (that.createdBy as any).email,
//       otp: that.plainOtp,
//       firstName: (that.createdBy as any).firstName,
//     });
//   }
// });
