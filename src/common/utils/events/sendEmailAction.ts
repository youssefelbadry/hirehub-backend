import { applicationStatus } from "src/common/enums/app.enum";
import {
  EmailEventEnum,
  EmailSubjectEnum,
} from "src/common/utils/email/emailSubjectEnum";
import { emailEvents } from "src/common/utils/events/email.event";

export class SendEmailAction {
  public async sendCompanyApprovalEmail(
    email: string,
    companyName: string,
  ) {
    emailEvents.emit(EmailEventEnum.ApproveCompany, {
      to: email,
      firstName: companyName,
      subject: EmailSubjectEnum.ApproveCompany,
      companyName,
    });
  }

  public async sendApplicationStatusEmail(
    email: string,
    username: string,
    jobTitle: string,
    companyName: string,
    status: applicationStatus,
  ) {
    const config = this.getEmailConfig(status);
    if (!config) return;

    await this.sendApplicationEmail(
      config.event,
      email,
      username,
      config.subject,
      jobTitle,
      companyName,
      status,
    );
  }

  private async sendApplicationEmail(
    emailEvent: EmailEventEnum,
    email: string,
    username: string,
    subject: EmailSubjectEnum,
    jobTitle: string,
    companyName: string,
    status: applicationStatus,
  ) {
    emailEvents.emit(emailEvent, {
      to: email,
      firstName: username,
      subject,
      jobTitle,
      companyName,
      applicationStatus: status,
    });
  }

  private getEmailConfig(status: applicationStatus) {
    const map: Partial<
      Record<
        applicationStatus,
        { event: EmailEventEnum; subject: EmailSubjectEnum }
      >
    > = {
      [applicationStatus.pending]: {
        event: EmailEventEnum.ApplyJob,
        subject: EmailSubjectEnum.ApplyJob,
      },
      [applicationStatus.accepted]: {
        event: EmailEventEnum.AcceptApplication,
        subject: EmailSubjectEnum.AcceptApplication,
      },
      [applicationStatus.rejected]: {
        event: EmailEventEnum.RejectApplication,
        subject: EmailSubjectEnum.RejectApplication,
      },
    };

    return map[status];
  }
}
