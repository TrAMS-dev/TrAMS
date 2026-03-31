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

export type EventSignupEmailKind = 'confirmed' | 'waitlist'

export interface EventSignupEmailContext {
    recipientName: string
    recipientEmail: string
    eventTitle: string
    eventSlug: string | null
    startDatetime: string | null
    location: string | null
    regDeadline: string | null
    /** When set and valid, used as Resend Reply-To so attendees can reach the organizer. */
    contactEmail: string | null
}

function formatNbDate(iso: string | null): string | null {
    if (!iso) return null
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString('nb-NO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function eventPageUrl(slug: string | null): string | null {
    if (!slug) return null
    const base = SITE_ORIGIN.replace(/\/$/, '')
    return `${base}/arrangementer/${encodeURIComponent(slug)}`
}

/** Replace subjects and HTML bodies below when you have final copy. */
const SUBJECT_CONFIRMED = (title: string) => `Du er påmeldt: ${title}`

const SUBJECT_WAITLIST = (title: string) => `Du står på venteliste: ${title}`

function confirmedEmailHtml(ctx: EventSignupEmailContext): string {
    const name = escapeHtml(ctx.recipientName.trim())
    const title = escapeHtml(ctx.eventTitle.trim())
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const deadline = formatNbDate(ctx.regDeadline)
    const link = eventPageUrl(ctx.eventSlug)
    const whenRow = when
        ? `<tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Tid</td><td style="padding:8px 0;color:#333;">${escapeHtml(when)}</td></tr>`
        : ''
    const whereRow = where
        ? `<tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Sted</td><td style="padding:8px 0;color:#333;">${where}</td></tr>`
        : ''
    const deadlineRow = deadline
        ? `<tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Påmeldingsfrist</td><td style="padding:8px 0;color:#333;">${escapeHtml(deadline)}</td></tr>`
        : ''
    const linkBlock = link
        ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(link)}" style="color:#c41e3a;">Se arrangementet på trams.no</a></p>`
        : ''

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#c41e3a;padding:20px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Påmelding bekreftet</h1>
    </div>
    <div style="background-color:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      <p style="color:#555;line-height:1.6;margin-top:0;">Hei ${name},</p>
      <p style="color:#555;line-height:1.6;">Takk for din påmelding! Du er registrert som deltaker på <strong>${title}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">${whenRow}${whereRow}${deadlineRow}</table>
      ${linkBlock}
      <p style="color:#888;font-size:13px;margin-top:24px;line-height:1.5;">Med vennlig hilsen<br/>TrAMS</p>
    </div>
  </div>
</body>
</html>`
}

function waitlistEmailHtml(ctx: EventSignupEmailContext): string {
    const name = escapeHtml(ctx.recipientName.trim())
    const title = escapeHtml(ctx.eventTitle.trim())
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const link = eventPageUrl(ctx.eventSlug)
    const whenRow = when
        ? `<tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Tid</td><td style="padding:8px 0;color:#333;">${escapeHtml(when)}</td></tr>`
        : ''
    const whereRow = where
        ? `<tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Sted</td><td style="padding:8px 0;color:#333;">${where}</td></tr>`
        : ''
    const linkBlock = link
        ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(link)}" style="color:#c41e3a;">Se arrangementet på trams.no</a></p>`
        : ''

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#c41e3a;padding:20px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Du står på venteliste</h1>
    </div>
    <div style="background-color:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      <p style="color:#555;line-height:1.6;margin-top:0;">Hei ${name},</p>
      <p style="color:#555;line-height:1.6;">Takk for din påmelding til <strong>${title}</strong>. Arrangementet er fulltegnet, så du er satt på <strong>venteliste</strong>. Vi tar kontakt på e-post dersom det blir ledig plass.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">${whenRow}${whereRow}</table>
      ${linkBlock}
      <p style="color:#888;font-size:13px;margin-top:24px;line-height:1.5;">Med vennlig hilsen<br/>TrAMS</p>
    </div>
  </div>
</body>
</html>`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendEventSignupEmail(
    kind: EventSignupEmailKind,
    ctx: EventSignupEmailContext
): Promise<void> {
    const to = ctx.recipientEmail.trim().toLowerCase()
    if (!to || to.length > 320 || !EMAIL_RE.test(to)) {
        console.error('sendEventSignupEmail: invalid recipient')
        return
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn('sendEventSignupEmail: RESEND_API_KEY missing, skipping')
        return
    }

    const subject =
        kind === 'confirmed'
            ? SUBJECT_CONFIRMED(ctx.eventTitle.trim())
            : SUBJECT_WAITLIST(ctx.eventTitle.trim())
    const html = kind === 'confirmed' ? confirmedEmailHtml(ctx) : waitlistEmailHtml(ctx)

    const replyToRaw = ctx.contactEmail?.trim().toLowerCase()
    const replyTo =
        replyToRaw && replyToRaw.length <= 320 && EMAIL_RE.test(replyToRaw)
            ? ctx.contactEmail!.trim()
            : undefined

    const result = await resend.emails.send({
        from: 'TrAMS <web@trams.no>',
        to: [to],
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
    })

    if (result.error) {
        console.error('sendEventSignupEmail: Resend error', result.error)
    }
}
