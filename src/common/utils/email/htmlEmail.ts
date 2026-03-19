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
