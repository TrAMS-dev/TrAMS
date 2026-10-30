import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.WEB_NOTIFY_EMAIL ?? 'web@trams.no';

const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface WebsiteFeedbackPayload {
  message: string;
  email?: string;
  /** Path of the page the feedback was sent from */
  page?: string;
  /** Hidden honeypot field, only filled in by bots */
  website?: string;
}

function getFeedbackHtml(message: string, email: string, page: string): string {
  const rows = [
    page && `
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; width: 80px;">Side:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(page)}</td>
          </tr>`,
    `
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; width: 80px;">E-post:</td>
            <td style="padding: 8px 0; color: #333;">${email ? escapeHtml(email) : 'Ikke oppgitt'}</td>
          </tr>`,
  ]
    .filter(Boolean)
    .join('');

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
      <h1 style="color: white; margin: 0; font-size: 20px;">TrAMS – tilbakemelding på nettsiden</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
      <p style="color: #333; line-height: 1.6; margin-top: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
      <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #e0e0e0;">
        <tbody>${rows}
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
    const body: WebsiteFeedbackPayload = await request.json();

    // Bots fill in the hidden field; pretend it worked so they don't retry
    if (typeof body.website === 'string' && body.website.trim()) {
      return Response.json({ success: true });
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const page = typeof body.page === 'string' ? body.page.trim().slice(0, 500) : '';

    if (!message) {
      return Response.json({ error: 'Skriv en tilbakemelding' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Tilbakemeldingen kan være maks ${MAX_MESSAGE_LENGTH} tegn` },
        { status: 400 }
      );
    }
    if (email && (email.length > 320 || !EMAIL_RE.test(email))) {
      return Response.json({ error: 'Ugyldig e-post' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'TrAMS <web@trams.no>',
      to: [NOTIFY_EMAIL],
      ...(email && { replyTo: email }),
      subject: 'Tilbakemelding på nettsiden',
      html: getFeedbackHtml(message, email, page),
    });

    if (result.error) {
      console.error('Failed to send website feedback:', result.error);
      return Response.json({ error: 'Kunne ikke sende tilbakemeldingen' }, { status: 500 });
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Website feedback error:', error);
    return Response.json({ error: 'Kunne ikke sende tilbakemeldingen' }, { status: 500 });
  }
}
