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

const SUBJECT_WAITLIST_SPOTS_OPENED = (title: string, spotsOpened: number) =>
    spotsOpened === 1
        ? `Ledig plass – venteliste: ${title}`
        : `Ledige plasser – venteliste: ${title}`

function waitlistSpotsOpenedGuideHtml(
    ctx: EventSignupEmailContext,
    spotsOpened: number
): string {
    const title = ctx.eventTitle.trim()
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location ? escapeHtml(ctx.location.trim()) : null
    const link = eventPageUrl(ctx.eventSlug)
    const detail = courseWhenWhereFragment(title, when, where, 'på')
    const name = (ctx.recipientName || '').trim()
    const greeting = name
        ? `Hei ${escapeHtml(name)}!`
        : 'Hei!'

    const spotsPhrase =
        spotsOpened === 1
            ? 'Det har åpnet seg <strong>minst én bekreftet plass</strong>'
            : `Det har åpnet seg <strong>${spotsOpened} bekreftede plasser</strong>`

    const batchNote =
        spotsOpened === 1
            ? '<p style="color:#555;line-height:1.6;">Du står først blant dem på ventelisten som nå får beskjed om å kunne bekrefte plass.</p>'
            : `<p style="color:#555;line-height:1.6;">Du er blant de <strong>${spotsOpened} første</strong> på ventelisten som får denne e-posten, fordi flere plasser ble ledige samtidig. Alle får samme veiledning.</p>`

    const steps = `<ol style="color:#555;line-height:1.7;padding-left:1.25rem;margin:0 0 1rem 0;">
<li>Gå til arrangementsiden (lenke under).</li>
<li>Klikk <strong>«Meld deg på»</strong>.</li>
<li>Fyll ut skjemaet – bruk <strong>samme e-postadresse</strong> som da du meldte deg på ventelisten.</li>
<li>Send inn. Da flyttes du til bekreftet plass når det er <strong>din tur</strong> og det fortsatt er ledig kapasitet.</li>
</ol>`

    const orderNote = `<p style="color:#555;line-height:1.6;margin-bottom:0;"><strong>Viktig om rekkefølgen:</strong> Ventelisten følger tidspunktet du meldte deg på. Bare den som står <strong>først</strong> i køen kan fullføre bekreftelsen først. Når vedkommende har bekreftet, kan nestemann gjøre det samme, og så videre. Får du melding om at du ikke er først på listen, vent til de foran deg har bekreftet (eller prøv igjen senere).</p>`

    const body = `<p style="color:#555;line-height:1.6;margin-top:0;">${greeting} ${spotsPhrase} ${detail}.</p>
${batchNote}
<p style="color:#555;line-height:1.6;">Slik bekrefter du plassen:</p>
${steps}
${linkParagraph(link)}
${orderNote}`

    return emailShell(body)
}

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
<p style="color:#555;line-height:1.6;">Dersom det åpner seg plass, får du e-post med veiledning for hvordan du bekrefter plassen på nettsiden.</p>
${linkParagraph(link)}`

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
            : SUBJECT_WAITLIST(ctx.eventTitle.trim())

    const html =
        kind === 'confirmed' ? confirmedEmailHtml(ctx) : waitlistEmailHtml(ctx)

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

/** Veilednings-e-post til venteliste, sendt manuelt av admin fra deltakeroversikten. */
export async function sendWaitlistSpotsOpenedGuideEmail(
    spotsOpened: number,
    ctx: EventSignupEmailContext
): Promise<void> {
    if (spotsOpened < 1) return

    const to = ctx.recipientEmail.trim().toLowerCase()
    if (!to || to.length > 320 || !EMAIL_RE.test(to)) {
        console.error('sendWaitlistSpotsOpenedGuideEmail: invalid recipient')
        return
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn('sendWaitlistSpotsOpenedGuideEmail: RESEND_API_KEY missing, skipping')
        return
    }

    const subject = SUBJECT_WAITLIST_SPOTS_OPENED(ctx.eventTitle.trim(), spotsOpened)
    const html = waitlistSpotsOpenedGuideHtml(ctx, spotsOpened)

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
        console.error('sendWaitlistSpotsOpenedGuideEmail: Resend error', result.error)
    }
}
