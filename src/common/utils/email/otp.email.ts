// import { Types } from "mongoose";
// import { EmailEventEnum } from "./emailSubjectEnum";

export const generateOtp = (): string => {
  return String(Math.floor(Math.random() * (900000 - 100000) + 100000));
};
// export async function createOtp(
//   userId: Types.ObjectId,
//   type: EmailEventEnum = EmailEventEnum.ConfirmEmail,
// ) {
//   await this._otpModel.create({
//     data: {
//       createdBy: userId,
//       code: generateOtp(),
//       expiredAt: new Date(Date.now() + 2 * 60 * 1000),
//       type,
//     },
//   });
// }
