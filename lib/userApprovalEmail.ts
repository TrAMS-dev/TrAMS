import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no'

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function loginUrl(): string {
    const base = SITE_ORIGIN.replace(/\/$/, '')
    return `${base}/admin/login`
}

function approvalEmailHtml(recipientName: string): string {
    const trimmed = recipientName.trim()
    const greeting = trimmed
        ? `Hei ${escapeHtml(trimmed)}!`
        : 'Hei!'
    const link = escapeHtml(loginUrl())
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#f9f9f9;padding:24px;border-radius:8px;border:1px solid #e0e0e0;">
      <p style="color:#555;line-height:1.6;margin-top:0;">${greeting}</p>
      <p style="color:#555;line-height:1.6;">En administrator har <strong>godkjent</strong> kontoen din i TrAMS. Du kan nå logge inn og bruke systemet.</p>
      <p style="color:#555;line-height:1.6;">Logg inn her: <a href="${link}" style="color:#c41e3a;">${link}</a></p>
      <p style="color:#888;font-size:13px;margin-top:24px;line-height:1.5;">Med akuttmedisinsk hilsen,<br/>TrAMS</p>
    </div>
  </div>
</body>
</html>`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendUserApprovedEmail(params: {
    recipientEmail: string
    recipientName: string
}): Promise<void> {
    const to = params.recipientEmail.trim().toLowerCase()
    if (!to || to.length > 320 || !EMAIL_RE.test(to)) {
        console.error('sendUserApprovedEmail: invalid recipient')
        return
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn('sendUserApprovedEmail: RESEND_API_KEY missing, skipping')
        return
    }

    const result = await resend.emails.send({
        from: 'TrAMS <web@trams.no>',
        to: [to],
        subject: 'Kontoen din er godkjent – TrAMS',
        html: approvalEmailHtml(params.recipientName),
    })

    if (result.error) {
        console.error('sendUserApprovedEmail: Resend error', result.error)
    }
}
