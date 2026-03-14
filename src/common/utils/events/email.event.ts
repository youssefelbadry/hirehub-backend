import { EventEmitter } from "node:events";
import { template } from "../email/htmlEmail";
import { sendEmail } from "../email/sendEmail";
import { EmailEventEnum, EmailSubjectEnum } from "../email/emailSubjectEnum";

export const emailEvents = new EventEmitter();

emailEvents.on(EmailEventEnum.ConfirmEmail, async (data) => {
  try {
    data.subject = EmailSubjectEnum.ConfirmEmail;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log("Fail to send email", error);
  }
});
emailEvents.on(EmailEventEnum.ResetPassword, async (data) => {
  try {
    data.subject = EmailSubjectEnum.ResetPassword;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send reset password email", error);
  }
});

emailEvents.on(EmailEventEnum.Welcome, async (data) => {
  try {
    data.subject = EmailSubjectEnum.Welcome;
    data.html = template(null as any, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send welcome email", error);
  }
});
emailEvents.on(EmailEventEnum.ChangePassword, async (data) => {
  try {
    data.subject = EmailSubjectEnum.ChangePassword;
    data.html = template(null as any, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send change password email", error);
  }
});
