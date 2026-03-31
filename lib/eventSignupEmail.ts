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

export type EventSignupEmailKind = 'confirmed' | 'waitlist' | 'promotedFromWaitlist'

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

/** Kurs + dato + sted fragment: «på/til <strong>tittel</strong> <dato> på <strong>sted</strong>». */
function courseWhenWhereFragment(
    title: string,
    when: string | null,
    where: string | null,
    preposition: 'på' | 'til'
): string {
    const t = escapeHtml(title.trim())
    const whenPart = when ? ` ${escapeHtml(when)}` : ''
    const wherePart = where ? ` på <strong>${where}</strong>` : ''
    return `${preposition} <strong>${t}</strong>${whenPart}${wherePart}`
}

function linkParagraph(link: string | null): string {
    if (!link) {
        return '<p style="color:#555;line-height:1.6;">Her er lenke med informasjon om arrangementet: (lenke er ikke tilgjengelig)</p>'
    }
    const safe = escapeHtml(link)
    return `<p style="color:#555;line-height:1.6;">Her er lenke med informasjon om arrangementet: <a href="${safe}" style="color:#c41e3a;">${safe}</a></p>`
}

function emailShell(inner: string): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#f9f9f9;padding:24px;border-radius:8px;border:1px solid #e0e0e0;">
      ${inner}
      <p style="color:#888;font-size:13px;margin-top:24px;line-height:1.5;">Med akuttmedisinsk hilsen,<br/>TrAMS</p>
    </div>
  </div>
</body>
</html>`
}

const SUBJECT_CONFIRMED = (title: string) => `Plass på kurs: ${title}`

const SUBJECT_WAITLIST = (title: string) => `Venteliste: ${title}`

const SUBJECT_PROMOTED = (title: string) => `Plass fra venteliste: ${title}`

function confirmedEmailHtml(ctx: EventSignupEmailContext): string {
    const title = ctx.eventTitle.trim()
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const link = eventPageUrl(ctx.eventSlug)
    const detail = courseWhenWhereFragment(title, when, where, 'på')

    const body = `<p style="color:#555;line-height:1.6;margin-top:0;">Hei! Du som har fått denne mailen har fått plass ${detail}.</p>
${linkParagraph(link)}
<p style="color:#555;line-height:1.6;">Vi gleder oss til å se dere på kurs!</p>
<p style="color:#555;line-height:1.6;">Dersom du ikke kan komme på kurset ønsker vi at du gir beskjed på denne mailen så fort som mulig for å kunne gi plass til de som står på evt. venteliste, og informerer om at du vil bli nedprioritert på fremtidige TrAMS kurs dersom du gir beskjed senere enn et døgn før kurset.</p>`

    return emailShell(body)
}

function waitlistEmailHtml(ctx: EventSignupEmailContext): string {
    const title = ctx.eventTitle.trim()
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const link = eventPageUrl(ctx.eventSlug)
    const detail = courseWhenWhereFragment(title, when, where, 'til')

    const body = `<p style="color:#555;line-height:1.6;margin-top:0;">Hei! Du som har fått denne mailen er satt på venteliste ${detail}.</p>
<p style="color:#555;line-height:1.6;">Dersom det åpner seg plass på kurset vil du få umiddelbar beskjed slik at du kan få mulighet til å delta på kurset!</p>
${linkParagraph(link)}`

    return emailShell(body)
}

function promotedFromWaitlistEmailHtml(ctx: EventSignupEmailContext): string {
    const title = ctx.eventTitle.trim()
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const link = eventPageUrl(ctx.eventSlug)
    const detail = courseWhenWhereFragment(title, when, where, 'på')

    const body = `<p style="color:#555;line-height:1.6;margin-top:0;">Hei! Du som har fått denne mailen har fått plass ${detail} da det har åpnet seg plasser fra ventelisten. Vi ønsker at du melder deg på så fort som mulig om du kan delta på kurset, ellers vil plassen gå til nestemann på listen.</p>
${linkParagraph(link)}
<p style="color:#555;line-height:1.6;">Vi gleder oss til å se deg på kurs!</p>`

    return emailShell(body)
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
            : kind === 'waitlist'
              ? SUBJECT_WAITLIST(ctx.eventTitle.trim())
              : SUBJECT_PROMOTED(ctx.eventTitle.trim())

    const html =
        kind === 'confirmed'
            ? confirmedEmailHtml(ctx)
            : kind === 'waitlist'
              ? waitlistEmailHtml(ctx)
              : promotedFromWaitlistEmailHtml(ctx)

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
