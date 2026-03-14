import { BadRequestException } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (data: Mail.Options) => {
  if (!data.html && !data.attachments && data.text)
    throw new BadRequestException("Missing to send email");

  const transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.PASS as string,
    },
  });

  const info = await transport.sendMail({
    ...data,
    from: `Rout Academy <${process.env.EMAIL}>`,
  });

  console.log("Email sent : ", info.messageId);
};
