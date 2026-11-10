import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/types/supabase'
import { sendEventFollowupEmails } from '@/lib/eventSignupEmail'
import { certificateUrl, isCertificateSigningConfigured } from '@/lib/certificate'
import { isEventPast } from '@/lib/eventDate'
import { parseFeedbackQuestions } from '@/lib/eventFeedback'

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no').replace(/\/$/, '')

/**
 * Automatic follow-up emails only go out for events that ended this recently, so
 * fixing attendance on old events doesn't email people long after the fact.
 */
export const AUTO_FOLLOWUP_WINDOW_DAYS = 14

/** Columns needed from Events to send the follow-up email. */
export const FOLLOWUP_EVENT_COLUMNS =
    'id, title, slug, start_datetime, end_datetime, date_unspecified, planned_month, location, contact_email, feedback_questions, certificate_enabled'

export type FollowupEvent = Pick<
    Tables<'Events'>,
    | 'id'
    | 'title'
    | 'slug'
    | 'start_datetime'
    | 'end_datetime'
    | 'date_unspecified'
    | 'planned_month'
    | 'location'
    | 'contact_email'
    | 'feedback_questions'
    | 'certificate_enabled'
>

export type FollowupParticipant = Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'email'>

export interface FollowupContent {
    sendFeedback: boolean
    sendCertificate: boolean
}

/** The event has a feedback form whose link can be sent. */
export function hasFeedbackForm(event: FollowupEvent): boolean {
    return Boolean(event.slug) && parseFeedbackQuestions(event.feedback_questions).length > 0
}

/** What the automatic email contains: the feedback link and the certificate, where the event uses them. */
export function autoFollowupContent(event: FollowupEvent): FollowupContent {
    return {
        sendFeedback: hasFeedbackForm(event),
        sendCertificate: event.certificate_enabled && isCertificateSigningConfigured(),
    }
}

/** The event has ended, and not longer ago than AUTO_FOLLOWUP_WINDOW_DAYS. */
export function isInAutoFollowupWindow(event: FollowupEvent, now = new Date()): boolean {
    if (event.date_unspecified || !isEventPast(event, now)) return false
    const end = event.end_datetime ?? event.start_datetime
    if (!end) return false
    const windowMs = AUTO_FOLLOWUP_WINDOW_DAYS * 24 * 60 * 60 * 1000
    return now.getTime() - new Date(end).getTime() <= windowMs
}

/**
 * Sends the follow-up email to the given participants and sets `followup_sent_at`
 * for each batch Resend accepts. Throws if Resend fails; earlier batches stay marked as sent.
 */
export async function sendFollowup(
    supabase: SupabaseClient<Database>,
    event: FollowupEvent,
    participants: FollowupParticipant[],
    content: FollowupContent
): Promise<{ sentIds: number[]; sentAt: string }> {
    const sentAt = new Date().toISOString()
    if (participants.length === 0) return { sentIds: [], sentAt }

    const feedbackUrl =
        content.sendFeedback && event.slug
            ? `${SITE_ORIGIN}/arrangementer/${encodeURIComponent(event.slug)}/tilbakemelding`
            : null

    const markSent = async (ids: number[]) => {
        const { error } = await supabase
            .from('EventParticipants')
            .update({ followup_sent_at: sentAt })
            .in('id', ids)
        if (error) console.error('Followup: could not mark as sent', error)
    }

    const sentIds = await sendEventFollowupEmails(
        {
            eventId: event.id,
            eventTitle: event.title || 'Arrangement',
            eventSlug: event.slug,
            startDatetime: event.start_datetime,
            location: event.location,
            contactEmail: event.contact_email,
            feedbackUrl,
        },
        participants.map((p) => ({
            participantId: p.id,
            name: (p.name ?? '').trim(),
            email: p.email ?? '',
            certificateUrl: content.sendCertificate ? certificateUrl(p.id) : null,
        })),
        markSent
    )
    return { sentIds, sentAt }
}
