import { Resend } from 'resend'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'
import { getEmailContent } from '@/lib/email/content'
import { emailShell, buttonLink, mailtoLink, urlLink, P_STYLE } from '@/lib/email/layout'
import { escapeHtml, renderEmailText, renderPlainText, type EmailText } from '@/lib/email/portableText'

const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no'

const FROM_ADDRESS = 'web@trams.no'
const FROM = `TrAMS <${FROM_ADDRESS}>`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Resend tillater maks 100 e-poster per batch-kall. */
const RESEND_BATCH_LIMIT = 100

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
    waitlistQueuePosition?: number | null
}

interface EventDetails {
    eventTitle: string
    eventSlug: string | null
    startDatetime: string | null
    location: string | null
    contactEmail: string | null
}

type EventEmailDocType =
    | 'emailSignupConfirmed'
    | 'emailSignupWaitlist'
    | 'emailWaitlistPromoted'
    | 'emailMovedToWaitlist'
    | 'emailParticipantRemoved'
    | 'emailEventReminder'

function formatNbDate(iso: string | null): string | null {
    if (!iso) return null
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString('nb-NO', {
        timeZone: APP_TIME_ZONE,
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

function validRecipient(email: string): string | null {
    const to = email.trim().toLowerCase()
    return to && to.length <= 320 && EMAIL_RE.test(to) ? to : null
}

function replyToFor(contactEmail: string | null): string | undefined {
    const raw = contactEmail?.trim().toLowerCase()
    return raw && raw.length <= 320 && EMAIL_RE.test(raw) ? contactEmail!.trim() : undefined
}

/**
 * Plassholdere som kan brukes i alle e-poster om et arrangement.
 * {kontakt} er arrangementets kontaktadresse, ellers web@trams.no, som også er Reply-To.
 */
function eventTokens(ctx: EventDetails, recipientName: string, extra: Record<string, string | null> = {}) {
    const title = escapeHtml(ctx.eventTitle.trim())
    const when = formatNbDate(ctx.startDatetime)
    const where = ctx.location?.trim() ? escapeHtml(ctx.location.trim()) : ''
    const link = eventPageUrl(ctx.eventSlug)
    return {
        navn: escapeHtml((recipientName || '').trim()),
        tittel: title,
        dato: when ? escapeHtml(when) : '',
        sted: where,
        arrangement: `<strong>${title}</strong>${when ? ` ${escapeHtml(when)}` : ''}${where ? ` på <strong>${where}</strong>` : ''}`,
        lenke: link ? urlLink(link) : '(lenke er ikke tilgjengelig)',
        kontakt: mailtoLink(replyToFor(ctx.contactEmail) ?? FROM_ADDRESS),
        ...extra,
    }
}

function queuePositionToken(position: number | null | undefined): string | null {
    return position ? `<strong>${position}</strong>` : null
}

/** Bygger emne og HTML for én e-post om et arrangement, med tekst fra Sanity. */
async function buildEventEmail(
    type: EventEmailDocType,
    ctx: EventDetails,
    recipientName: string,
    options: { extraTokens?: Record<string, string | null>; bodyField?: 'body' | 'bodyWaitlist' } = {}
): Promise<{ subject: string; html: string }> {
    const { content, settings } = await getEmailContent(type)
    const text = (content as unknown as Record<string, EmailText>)[options.bodyField ?? 'body']
    const inner = renderEmailText(text, {
        tokens: eventTokens(ctx, recipientName, options.extraTokens),
        paragraphStyle: P_STYLE,
    })
    return {
        subject: renderPlainText(content.subject, { tittel: ctx.eventTitle.trim() }),
        html: emailShell(inner, settings),
    }
}

/** Sender én hendelses-e-post fra web@trams.no. Logger og hopper over ved ugyldig mottaker eller manglende nøkkel. */
async function sendSingleEventEmail(
    label: string,
    type: EventEmailDocType,
    ctx: EventSignupEmailContext,
    options: Parameters<typeof buildEventEmail>[3] = {}
): Promise<void> {
    const to = validRecipient(ctx.recipientEmail)
    if (!to) {
        console.error(`${label}: invalid recipient`)
        return
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn(`${label}: RESEND_API_KEY missing, skipping`)
        return
    }

    const { subject, html } = await buildEventEmail(type, ctx, ctx.recipientName, options)
    const replyTo = replyToFor(ctx.contactEmail)

    const result = await resend.emails.send({
        from: FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
    })

    if (result.error) {
        console.error(`${label}: Resend error`, result.error)
    }
}

export async function sendEventSignupEmail(
    kind: EventSignupEmailKind,
    ctx: EventSignupEmailContext
): Promise<void> {
    if (kind === 'confirmed') {
        await sendSingleEventEmail('sendEventSignupEmail', 'emailSignupConfirmed', ctx)
    } else {
        await sendSingleEventEmail('sendEventSignupEmail', 'emailSignupWaitlist', ctx, {
            extraTokens: { plass: queuePositionToken(ctx.waitlistQueuePosition) },
        })
    }
}

/** E-post til en deltaker som er flyttet opp fra venteliste til bekreftet plass av en admin. */
export async function sendWaitlistPromotedEmail(ctx: EventSignupEmailContext): Promise<void> {
    await sendSingleEventEmail('sendWaitlistPromotedEmail', 'emailWaitlistPromoted', ctx)
}

/** E-post til en deltaker som er flyttet fra bekreftet plass til venteliste av en admin. */
export async function sendMovedToWaitlistEmail(ctx: EventSignupEmailContext): Promise<void> {
    await sendSingleEventEmail('sendMovedToWaitlistEmail', 'emailMovedToWaitlist', ctx, {
        extraTokens: { plass: queuePositionToken(ctx.waitlistQueuePosition) },
    })
}

/** E-post til en deltaker som er fjernet fra et arrangement (bekreftet plass eller venteliste) av en admin. */
export async function sendParticipantRemovedEmail(
    ctx: EventSignupEmailContext,
    wasWaitlisted: boolean
): Promise<void> {
    await sendSingleEventEmail('sendParticipantRemovedEmail', 'emailParticipantRemoved', ctx, {
        bodyField: wasWaitlisted ? 'bodyWaitlist' : 'body',
    })
}

export interface EventSignupBatchContext {
    eventId: number
    eventTitle: string
    eventSlug: string | null
    startDatetime: string | null
    location: string | null
    contactEmail: string | null
}

export interface EventSignupBatchRecipient {
    name: string
    email: string
    waitlistQueuePosition?: number | null
}

/**
 * Sender bekreftet- eller venteliste-e-post til mange mottakere samtidig, brukt av
 * cron-jobben som sender utsatte påmeldingsbekreftelser (`confirmation_email_timing`
 * `on_deadline`) etter at påmeldingsfristen har gått ut. Returnerer antall e-poster
 * Resend tok imot. Kaster ved feil fra Resend.
 */
export async function sendBulkEventSignupEmails(
    kind: EventSignupEmailKind,
    ctx: EventSignupBatchContext,
    recipients: EventSignupBatchRecipient[]
): Promise<number> {
    if (!process.env.RESEND_API_KEY) {
        console.warn('sendBulkEventSignupEmails: RESEND_API_KEY missing, skipping')
        return 0
    }

    const valid = uniqueValidRecipients(recipients)
    const replyTo = replyToFor(ctx.contactEmail)
    const type: EventEmailDocType = kind === 'confirmed' ? 'emailSignupConfirmed' : 'emailSignupWaitlist'
    const { content, settings } = await getEmailContent(type)
    const subject = renderPlainText(content.subject, { tittel: ctx.eventTitle.trim() })
    let sent = 0

    for (let i = 0; i < valid.length; i += RESEND_BATCH_LIMIT) {
        const chunk = valid.slice(i, i + RESEND_BATCH_LIMIT)
        const result = await resend.batch.send(
            chunk.map((r) => ({
                from: FROM,
                to: [r.email],
                subject,
                html: emailShell(
                    renderEmailText(content.body, {
                        tokens: eventTokens(ctx, r.name, {
                            plass: queuePositionToken(r.waitlistQueuePosition),
                        }),
                        paragraphStyle: P_STYLE,
                    }),
                    settings
                ),
                ...(replyTo ? { replyTo } : {}),
            })),
            // Hindrer dobbel utsending hvis samme batch blir sendt på nytt
            { idempotencyKey: `event-signup-${kind}-${ctx.eventId}-${i / RESEND_BATCH_LIMIT}` }
        )

        if (result.error) {
            throw new Error(`Resend batch error: ${result.error.message}`)
        }
        sent += chunk.length
    }

    return sent
}

export interface EventReminderRecipient {
    name: string
    email: string
}

export interface EventReminderContext {
    eventId: number
    eventTitle: string
    eventSlug: string | null
    startDatetime: string | null
    location: string | null
    contactEmail: string | null
}

/** Fjerner ugyldige og dupliserte adresser. Adressene returneres i små bokstaver. */
function uniqueValidRecipients<T extends { email: string }>(recipients: T[]): T[] {
    const seen = new Set<string>()
    const valid: T[] = []
    for (const r of recipients) {
        const to = validRecipient(r.email)
        if (!to || seen.has(to)) continue
        seen.add(to)
        valid.push({ ...r, email: to })
    }
    return valid
}

/**
 * Sender påminnelse til alle bekreftede deltakere på et arrangement.
 * Returnerer antall e-poster Resend tok imot. Kaster ved feil fra Resend.
 */
export async function sendEventReminderEmails(
    ctx: EventReminderContext,
    recipients: EventReminderRecipient[]
): Promise<number> {
    if (!process.env.RESEND_API_KEY) {
        console.warn('sendEventReminderEmails: RESEND_API_KEY missing, skipping')
        return 0
    }

    const valid = uniqueValidRecipients(recipients)
    const replyTo = replyToFor(ctx.contactEmail)
    const { content, settings } = await getEmailContent('emailEventReminder')
    const subject = renderPlainText(content.subject, { tittel: ctx.eventTitle.trim() })
    let sent = 0

    for (let i = 0; i < valid.length; i += RESEND_BATCH_LIMIT) {
        const chunk = valid.slice(i, i + RESEND_BATCH_LIMIT)
        const result = await resend.batch.send(
            chunk.map((r) => ({
                from: FROM,
                to: [r.email],
                subject,
                html: emailShell(
                    renderEmailText(content.body, { tokens: eventTokens(ctx, r.name), paragraphStyle: P_STYLE }),
                    settings
                ),
                ...(replyTo ? { replyTo } : {}),
            })),
            // Hindrer dobbel utsending hvis samme batch blir sendt på nytt
            { idempotencyKey: `event-reminder-${ctx.eventId}-${i / RESEND_BATCH_LIMIT}` }
        )

        if (result.error) {
            throw new Error(`Resend batch error: ${result.error.message}`)
        }
        sent += chunk.length
    }

    return sent
}

export interface EventFollowupContext {
    eventId: number
    eventTitle: string
    eventSlug: string | null
    startDatetime: string | null
    location: string | null
    contactEmail: string | null
    /** Lenke til tilbakemeldingsskjemaet, eller null for å utelate den. */
    feedbackUrl: string | null
}

export interface EventFollowupRecipient {
    participantId: number
    name: string
    email: string
    /** Personlig lenke til kursbevis, eller null for å utelate den. */
    certificateUrl: string | null
}

/**
 * Sender e-post etter arrangementet med lenke til tilbakemeldingsskjema og/eller kursbevis.
 * Returnerer id-ene til deltakerne Resend tok imot e-post for. Kaster ved feil fra Resend
 * (deltakere i tidligere, vellykkede batcher er da allerede sendt, se `onBatchSent`).
 */
export async function sendEventFollowupEmails(
    ctx: EventFollowupContext,
    recipients: EventFollowupRecipient[],
    onBatchSent?: (participantIds: number[]) => Promise<void>
): Promise<number[]> {
    if (!process.env.RESEND_API_KEY) {
        console.warn('sendEventFollowupEmails: RESEND_API_KEY missing, skipping')
        return []
    }

    const valid = uniqueValidRecipients(recipients)
    const replyTo = replyToFor(ctx.contactEmail)
    const { content, settings } = await getEmailContent('emailEventFollowup')
    const subject = renderPlainText(content.subject, { tittel: ctx.eventTitle.trim() })

    const followupHtml = (r: EventFollowupRecipient) => {
        const tokens = eventTokens(ctx, r.name)
        const section = (text: EmailText, url: string | null, label: string) =>
            url
                ? `${renderEmailText(text, { tokens, paragraphStyle: P_STYLE, trimFirstMargin: false })}\n${buttonLink(url, label, settings.buttonFallbackText)}`
                : ''
        const inner = renderEmailText(content.body, {
            tokens,
            blockTokens: {
                tilbakemelding: section(content.feedbackText, ctx.feedbackUrl, content.feedbackButton),
                kursbevis: section(content.certificateText, r.certificateUrl, content.certificateButton),
            },
            paragraphStyle: P_STYLE,
        })
        return emailShell(inner, settings)
    }

    const sentIds: number[] = []

    for (let i = 0; i < valid.length; i += RESEND_BATCH_LIMIT) {
        const chunk = valid.slice(i, i + RESEND_BATCH_LIMIT)
        const result = await resend.batch.send(
            chunk.map((r) => ({
                from: FROM,
                to: [r.email],
                subject,
                html: followupHtml(r),
                ...(replyTo ? { replyTo } : {}),
            }))
        )

        if (result.error) {
            throw new Error(`Resend batch error: ${result.error.message}`)
        }
        const ids = chunk.map((r) => r.participantId)
        sentIds.push(...ids)
        await onBatchSent?.(ids)
    }

    return sentIds
}
