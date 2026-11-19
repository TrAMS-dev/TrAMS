import { Resend } from 'resend';
import { getEmailContent } from '@/lib/email/content';
import { bannerShell } from '@/lib/email/layout';
import { escapeHtml, renderEmailText, renderPlainText } from '@/lib/email/portableText';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.WEB_NOTIFY_EMAIL ?? 'web@trams.no';

export interface NewUserRegistrationPayload {
  fullName: string;
  email: string;
}

async function getNewUserNotificationEmail(payload: NewUserRegistrationPayload) {
  const { content } = await getEmailContent('emailNewUser');
  const name = escapeHtml(payload.fullName.trim());
  const email = escapeHtml(payload.email.trim());
  const inner = `${renderEmailText(content.intro, { paragraphStyle: 'color: #555; line-height: 1.6;' })}
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
      </table>`;
  return {
    subject: renderPlainText(content.subject, { navn: payload.fullName.trim() }),
    html: bannerShell(content.heading, inner),
  };
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

    // Only @trams.no accounts can be approved. Deny others silently:
    // report success but don't notify admins.
    if (!email.endsWith('@trams.no')) {
      return Response.json({ success: true });
    }

    const { subject, html } = await getNewUserNotificationEmail({ fullName, email });
    const result = await resend.emails.send({
      from: 'TrAMS <web@trams.no>',
      to: [NOTIFY_EMAIL],
      replyTo: email,
      subject,
      html,
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
