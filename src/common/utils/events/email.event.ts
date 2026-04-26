import { EventEmitter } from "node:events";
import {
  applicationTemplate,
  companyApprovalTemplate,
  template,
} from "../email/htmlEmail";
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
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send change password email", error);
  }
});

emailEvents.on(EmailEventEnum.DeleteAccount, async (data) => {
  try {
    data.subject = EmailSubjectEnum.DeleteAccount;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send delete account email", error);
  }
});

emailEvents.on(EmailEventEnum.ApplyJob, async (data) => {
  try {
    data.subject = EmailSubjectEnum.ApplyJob;
    data.html = applicationTemplate(
      data.firstName,
      data.subject,
      data.jobTitle,
      data.companyName,
      data.applicationStatus,
    );
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send apply job email", error);
  }
});

emailEvents.on(EmailEventEnum.AcceptApplication, async (data) => {
  try {
    data.subject = EmailSubjectEnum.AcceptApplication;
    data.html = applicationTemplate(
      data.firstName,
      data.subject,
      data.jobTitle,
      data.companyName,
      data.applicationStatus,
    );
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send accept application email", error);
  }
});

emailEvents.on(EmailEventEnum.RejectApplication, async (data) => {
  try {
    data.subject = EmailSubjectEnum.RejectApplication;
    data.html = applicationTemplate(
      data.firstName,
      data.subject,
      data.jobTitle,
      data.companyName,
      data.applicationStatus,
    );
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send reject application email", error);
  }
});

emailEvents.on(EmailEventEnum.ApproveCompany, async (data) => {
  try {
    data.subject = EmailSubjectEnum.ApproveCompany;
    data.html = companyApprovalTemplate(
      data.firstName,
      data.subject,
      data.companyName,
    );
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send company approval email", error);
  }
});
