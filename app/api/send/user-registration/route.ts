import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.WEB_NOTIFY_EMAIL ?? 'web@trams.no';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface NewUserRegistrationPayload {
  fullName: string;
  email: string;
}

function getNewUserNotificationHtml(payload: NewUserRegistrationPayload): string {
  const name = escapeHtml(payload.fullName.trim());
  const email = escapeHtml(payload.email.trim());
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #c41e3a; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 20px;">TrAMS – ny brukerregistrering</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
      <p style="color: #555; line-height: 1.6; margin-top: 0;">
        En ny bruker har registrert seg og venter på godkjenning i admin.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Navn:</td>
            <td style="padding: 8px 0; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">E-post:</td>
            <td style="padding: 8px 0; color: #333;">${email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body: NewUserRegistrationPayload = await request.json();

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!fullName || fullName.length > 200) {
      return Response.json({ error: 'Ugyldig navn' }, { status: 400 });
    }
    if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Ugyldig e-post' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'TrAMS <web@trams.no>',
      to: [NOTIFY_EMAIL],
      replyTo: email,
      subject: `Ny brukerregistrering: ${fullName}`,
      html: getNewUserNotificationHtml({ fullName, email }),
    });

    if (result.error) {
      console.error('Failed to send new-user notification:', result.error);
      return Response.json({ error: 'Kunne ikke sende varsel' }, { status: 500 });
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('New-user notification error:', error);
    return Response.json({ error: 'Kunne ikke sende e-post' }, { status: 500 });
  }
}
