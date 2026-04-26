import { applicationStatus } from "src/common/enums/app.enum";

export const template = (
  code: number | null,
  username: string,
  subject: string,
  expiresIn: string = "1 minute",
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HireHub Verification</title>

<style>
body{
  margin:0;
  padding:60px 20px;
  background:#eef2f8;
  font-family:Arial, Helvetica, sans-serif;
  color:#2d2d2d;
}

.wrapper{
  max-width:680px;
  margin:auto;
}

.card{
  background:#ffffff;
  border-radius:14px;
  padding:50px 45px;
  box-shadow:0 12px 30px rgba(0,0,0,0.07);
  text-align:center;
}

.logo{
  font-size:30px;
  font-weight:700;
  color:#2563eb;
  margin-bottom:20px;
}

.title{
  font-size:24px;
  font-weight:600;
  margin-bottom:10px;
}

.subtitle{
  font-size:16px;
  color:#6b7280;
  line-height:1.7;
  margin-bottom:35px;
}

.code-box{
  background:#f3f6ff;
  border-radius:12px;
  padding:35px;
  margin:30px auto;
  max-width:420px;
}

.code{
  font-size:44px;
  letter-spacing:10px;
  font-weight:700;
  color:#1e3a8a;
}

.note{
  font-size:14px;
  color:#6b7280;
  line-height:1.6;
  margin-top:25px;
}

.footer{
  margin-top:40px;
  padding-top:20px;
  border-top:1px solid #e5e7eb;
  font-size:13px;
  color:#9ca3af;
}

.brand{
  color:#2563eb;
  font-weight:600;
}
</style>
</head>

<body>

<div class="wrapper">

<div class="card">

<div class="logo">HireHub</div>

<!-- OTP FIRST -->
${
  code
    ? `<div class="code-box">
        <div class="code">${code}</div>
      </div>`
    : ""
}

<div class="title">
Hello ${username}
</div>

<div class="subtitle">
${subject}
</div>

${
  code
    ? `<div class="note">
This code will expire in <strong>${expiresIn}</strong>.<br>
If you didn’t request this action, you can safely ignore this email.
</div>`
    : `<div class="note">
If you didn’t request this action, you can safely ignore this email.
</div>`
}

<div class="footer">
© 2026 <span class="brand">HireHub</span> — Connecting talent with opportunity
</div>

</div>

</div>

</body>
</html>`;

export const applicationTemplate = (
  username: string,
  subject: string,
  jobTitle?: string,
  companyName?: string,
  status?: applicationStatus,
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HireHub Notification</title>

<style>
body{
  margin:0;
  padding:60px 20px;
  background:#eef2f8;
  font-family:Arial, Helvetica, sans-serif;
  color:#2d2d2d;
}

.wrapper{
  max-width:680px;
  margin:auto;
}

.card{
  background:#ffffff;
  border-radius:14px;
  padding:50px 45px;
  box-shadow:0 12px 30px rgba(0,0,0,0.07);
  text-align:center;
}

.logo{
  font-size:30px;
  font-weight:700;
  color:#2563eb;
  margin-bottom:20px;
}

.title{
  font-size:24px;
  font-weight:600;
  margin-bottom:10px;
}

.subtitle{
  font-size:16px;
  color:#6b7280;
  line-height:1.7;
  margin-bottom:35px;
}

.info-box{
  background:#f3f6ff;
  border-radius:12px;
  padding:25px;
  margin:30px auto;
  max-width:420px;
  text-align:left;
}

.info{
  font-size:16px;
  margin:10px 0;
}

.status{
  font-weight:700;
  font-size:20px;
  margin-top:15px;
  color:${
    status === "accepted"
      ? "#16a34a"
      : status === "rejected"
        ? "#dc2626"
        : "#2563eb"
  };
}

.note{
  font-size:14px;
  color:#6b7280;
  line-height:1.6;
  margin-top:25px;
}

.footer{
  margin-top:40px;
  padding-top:20px;
  border-top:1px solid #e5e7eb;
  font-size:13px;
  color:#9ca3af;
}

.brand{
  color:#2563eb;
  font-weight:600;
}
</style>
</head>

<body>

<div class="wrapper">

<div class="card">

<div class="logo">HireHub</div>

<div class="title">
Hello ${username}
</div>

<div class="subtitle">
${subject}
</div>

<div class="info-box">
  ${jobTitle ? `<div class="info"><strong>Job:</strong> ${jobTitle}</div>` : ""}
  ${
    companyName
      ? `<div class="info"><strong>Company:</strong> ${companyName}</div>`
      : ""
  }

  ${
    status
      ? `<div class="status">
        ${
          status === applicationStatus.accepted
            ? "🎉 Accepted"
            : status === applicationStatus.rejected
              ? "❌ Rejected"
              : "📩 New Application"
        }
      </div>`
      : ""
  }
</div>

<div class="note">
You are receiving this email because of activity on your HireHub account.
If this wasn’t you, please ignore this email.
</div>

<div class="footer">
© 2026 <span class="brand">HireHub</span> — Connecting talent with opportunity
</div>

</div>

</div>

</body>
</html>`;

export const companyApprovalTemplate = (
  username: string,
  subject: string,
  companyName?: string,
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HireHub Notification</title>

<style>
body{
  margin:0;
  padding:60px 20px;
  background:#eef2f8;
  font-family:Arial, Helvetica, sans-serif;
  color:#2d2d2d;
}

.wrapper{
  max-width:680px;
  margin:auto;
}

.card{
  background:#ffffff;
  border-radius:14px;
  padding:50px 45px;
  box-shadow:0 12px 30px rgba(0,0,0,0.07);
  text-align:center;
}

.logo{
  font-size:30px;
  font-weight:700;
  color:#2563eb;
  margin-bottom:20px;
}

.title{
  font-size:24px;
  font-weight:600;
  margin-bottom:10px;
}

.subtitle{
  font-size:16px;
  color:#6b7280;
  line-height:1.7;
  margin-bottom:35px;
}

.info-box{
  background:#f3f6ff;
  border-radius:12px;
  padding:25px;
  margin:30px auto;
  max-width:420px;
  text-align:left;
}

.info{
  font-size:16px;
  margin:10px 0;
}

.note{
  font-size:14px;
  color:#6b7280;
  line-height:1.6;
  margin-top:25px;
}

.footer{
  margin-top:40px;
  padding-top:20px;
  border-top:1px solid #e5e7eb;
  font-size:13px;
  color:#9ca3af;
}

.brand{
  color:#2563eb;
  font-weight:600;
}
</style>
</head>

<body>

<div class="wrapper">

<div class="card">

<div class="logo">HireHub</div>

<div class="title">
Hello ${username}
</div>

<div class="subtitle">
${subject}
</div>

<div class="info-box">
  ${
    companyName
      ? `<div class="info"><strong>Company:</strong> ${companyName}</div>`
      : ""
  }
  <div class="info"><strong>Status:</strong> Approved</div>
</div>

<div class="note">
You can now post jobs and manage hiring on HireHub.
</div>

<div class="footer">
© 2026 <span class="brand">HireHub</span> — Connecting talent with opportunity
</div>

</div>

</div>

</body>
</html>`;
