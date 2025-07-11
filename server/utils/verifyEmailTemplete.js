const verificationEmailTemplate = (username, otp) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f4f6; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f4f6">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <tr>
            <td align="center" bgcolor="#4f46e5" style="padding: 30px 20px; color:#ffffff; font-size:24px; font-weight:bold;">
              Verify Your Email
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px; color:#333333; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px 0;">Hello <strong>${username}</strong>,</p>
              <p style="margin:0 0 16px 0;">Thank you for registering! To complete your registration, please use the following One-Time Password (OTP):</p>
              
              <p style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; font-size:28px; color:#4f46e5; font-weight:bold; letter-spacing:2px;">
                  ${otp}
                </span>
              </p>
              
              <p style="margin:0 0 16px 0;">This OTP is valid for the next <strong>10 minutes</strong>.</p>
              <p style="margin:0 0 16px 0;">If you did not request this verification, you can safely ignore this email.</p>
              <p style="margin:30px 0 0 0;">Best regards,<br/><strong>Mart Ai Grocery Store</strong></p>
            </td>
          </tr>
          
        </table>
        <p style="font-size:12px; color:#999999; margin-top:20px;">
          &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
`;
    }

    export default verificationEmailTemplate;