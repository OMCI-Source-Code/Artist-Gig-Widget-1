import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: ".env.development" });


const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}


export async function sendGigMadeEmail(gig) {

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: "joshua.deirish@canadianmusicians.coop",
    subject: "🎵 New Gig Awaiting Approval",
    //designed with ai cuz i'm lazy
    html: `
  <body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;color:#f9fafb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background-color:#111827;">
      <tr>
        <td align="center">

          <table role="presentation" width="600" cellspacing="0" cellpadding="0"
            style="background:#1f2937;border-radius:16px;overflow:hidden;border:1px solid #374151;">

            <!-- Header -->
            <tr>
              <td style="padding:32px;text-align:center;background-color: #d9ae4c;">
                <h1 style="margin:0;font-size:30px;color:#ffffff;">
                  🎵 New Gig Submitted
                </h1>
                <p style="margin:10px 0 0;color:#e5e7eb;font-size:16px;">
                  A new gig is waiting for your approval.
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px;">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                  style="background:#111827;border-radius:10px;border:1px solid #374151;">
                  <tr>
                    <td style="padding:20px;">

                      <p style="margin:0 0 18px;font-size:15px;color:#9ca3af;">
                        <strong style="color:#ffffff;">Title</strong><br>
                        ${gig.title}
                      </p>

                      <p style="margin:0;font-size:15px;color:#9ca3af;">
                        <strong style="color:#ffffff;">Date</strong><br>
                        ${gig.date_time}
                      </p>

                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center;margin-top:32px;">
                  <a href="https://artist-gig-widget.vercel.app/dashboard"
                    style="
                      display:inline-block;
                      background:#d9ae4c;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      font-size:16px;
                      font-weight:bold;
                    ">
                    Review Gig
                  </a>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px;text-align:center;border-top:1px solid #374151;color:#6b7280;font-size:13px;">
                GigBoard • Admin Notification
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>`
  };
  try {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log('Error sending email: ', error);
      } else {
        console.log("Admin notification sent for gig:", gig.id);
      }
    });
  } catch (err) {
    console.error('Error sending email:', err);
  }

}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  console.log(resetLink);
  //const resetLink = `https://artist-gig-widget.vercel.app/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "🔐 Reset Your Password",
    html: `
  <body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;color:#f9fafb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background-color:#111827;">
      <tr>
        <td align="center">

          <table role="presentation" width="600" cellspacing="0" cellpadding="0"
            style="background:#1f2937;border-radius:16px;overflow:hidden;border:1px solid #374151;">

            <!-- Header -->
            <tr>
              <td style="padding:32px;text-align:center;background-color:#d9ae4c;">
                <h1 style="margin:0;font-size:30px;color:#ffffff;">
                  🔐 Password Reset Request
                </h1>
                <p style="margin:10px 0 0;color:#e5e7eb;font-size:16px;">
                  We received a request to reset your password.
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px;">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                  style="background:#111827;border-radius:10px;border:1px solid #374151;">
                  <tr>
                    <td style="padding:20px;">

                      <p style="margin:0 0 18px;font-size:15px;color:#9ca3af;line-height:1.6;">
                        If you requested a password reset, click the button below to create a new password.
                      </p>

                      <p style="margin:0;font-size:15px;color:#9ca3af;line-height:1.6;">
                        This link will expire in <strong style="color:#ffffff;">1 hour</strong> for your security.
                      </p>

                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center;margin-top:32px;">
                  <a href="${resetLink}"
                    style="
                      display:inline-block;
                      background:#d9ae4c;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      font-size:16px;
                      font-weight:bold;
                    ">
                    Reset Password
                  </a>
                </div>

                <p style="margin-top:28px;font-size:14px;color:#9ca3af;line-height:1.6;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>

                <p style="margin-top:10px;font-size:13px;word-break:break-all;color:#d1d5db;">
                  ${resetLink}
                </p>

                <p style="margin-top:28px;font-size:14px;color:#9ca3af;line-height:1.6;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px;text-align:center;border-top:1px solid #374151;color:#6b7280;font-size:13px;">
                GigBoard • Password Security
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>`
  };
try {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log('Error sending email: ', error);
      }
    });
  } catch (err) {
    console.error('Error sending email:', err);
  }

}

