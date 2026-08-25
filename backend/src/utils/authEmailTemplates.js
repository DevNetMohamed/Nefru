function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailShell({ preheader, eyebrow, title, content, action, footer }) {
  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;padding:0;background:#f7f4ef;color:#0f2d4e;font-family:Arial,sans-serif">
        <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</span>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f4ef;padding:32px 16px">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5dccd;border-radius:18px;overflow:hidden">
                <tr>
                  <td style="padding:34px 34px 12px;text-align:center">
                    <div style="font-family:Georgia,serif;font-size:30px;font-weight:700;letter-spacing:5px;color:#0f2d4e">NEFRU</div>
                    <div style="margin-top:6px;font-size:11px;font-weight:700;letter-spacing:2px;color:#b27b21">UNVEILING EGYPT</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 34px 34px">
                    <p style="margin:0 0 8px;text-align:center;color:#b27b21;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
                    <h1 style="margin:0 0 18px;text-align:center;color:#0f2d4e;font-size:28px;line-height:1.2">${escapeHtml(title)}</h1>
                    ${content}
                    ${
                      action
                        ? `<p style="margin:26px 0;text-align:center"><a href="${escapeHtml(action.url)}" style="display:inline-block;padding:14px 24px;background:#0f2d4e;color:#ffffff;text-decoration:none;border-radius:9px;font-size:15px;font-weight:700">${escapeHtml(action.label)}</a></p>`
                        : ""
                    }
                    ${footer || ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function buildVerificationEmail({ verifyUrl }) {
  const safeUrl = escapeHtml(verifyUrl);

  return {
    subject: "Verify your email to activate Nefru",
    message: [
      "Verify your Nefru email address to activate your account.",
      `Open this link: ${verifyUrl}`,
      "The link expires in 30 minutes.",
      "If the email is not in your inbox, check your Spam or Junk folder and mark Nefru as not spam.",
    ].join("\n\n"),
    html: emailShell({
      preheader: "Your Nefru verification link expires in 30 minutes.",
      eyebrow: "Email verification",
      title: "Activate your Nefru account",
      content: `
        <p style="margin:0;color:#4c5b70;font-size:15px;line-height:1.7;text-align:center">Confirm your email address before signing in to Nefru.</p>
        <p style="margin:18px 0 0;padding:13px 15px;background:#fff8e9;border-radius:9px;color:#775719;font-size:13px;line-height:1.6;text-align:center">This verification link expires in 30 minutes.</p>
      `,
      action: { url: verifyUrl, label: "Verify email address" },
      footer: `
        <p style="margin:0 0 8px;color:#667085;font-size:12px;line-height:1.6">If the button does not work, copy and paste this link into your browser:</p>
        <p style="margin:0 0 20px;word-break:break-all;font-size:12px;line-height:1.5"><a href="${safeUrl}" style="color:#9a6818">${safeUrl}</a></p>
        <p style="margin:0;padding-top:18px;border-top:1px solid #eee7dc;color:#667085;font-size:12px;line-height:1.6"><strong>Cannot find this email?</strong> Check your Spam or Junk folder and mark Nefru as “Not spam”. If you did not create this account, you can ignore this message.</p>
      `,
    }),
  };
}

export function buildWelcomeEmail({ fullName, role, loginUrl }) {
  const roleCopy =
    role === "guide"
      ? "Your guide account is active. Sign in and continue to Guide Verification so our team can review your application."
      : "Your traveler account is active. Sign in to discover trips, save experiences, and manage your bookings.";

  return {
    subject: "Welcome to Nefru — your email is verified",
    message: [
      `Welcome to Nefru${fullName ? `, ${fullName}` : ""}. Your email is verified and your account is active.`,
      `Sign in here: ${loginUrl}`,
    ].join("\n\n"),
    html: emailShell({
      preheader: "Your Nefru email is verified and your account is active.",
      eyebrow: "Account activated",
      title: `Welcome${fullName ? `, ${fullName}` : ""}`,
      content: `<p style="margin:0;color:#4c5b70;font-size:15px;line-height:1.7;text-align:center">${roleCopy}</p>`,
      action: { url: loginUrl, label: "Sign in to Nefru" },
      footer:
        '<p style="margin:0;color:#667085;font-size:12px;line-height:1.6;text-align:center">You can keep this email for quick access to the Nefru login page.</p>',
    }),
  };
}
