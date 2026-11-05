import { createClient } from '@/utils/supabase/server'
import { sendEventFollowupEmails } from '@/lib/eventSignupEmail'
import { certificateUrl, isCertificateSigningConfigured } from '@/lib/certificate'
import { isEventPast } from '@/lib/eventDate'
import { parseFeedbackQuestions } from '@/lib/eventFeedback'
import { NextResponse } from 'next/server'

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no').replace(/\/$/, '')

/**
 * Sender e-post etter arrangementet til deltakere registrert som «Møtt», med lenke til
 * tilbakemeldingsskjemaet og/eller et personlig kursbevis.
 *
 * Body: { eventId, sendFeedback, sendCertificate, resendAll? }
 * Som standard sendes det bare til de som ikke har fått e-posten før (`followup_sent_at`).
 * Med `resendAll` sendes det til alle som har møtt.
 */
export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as {
        eventId?: unknown
        sendFeedback?: unknown
        sendCertificate?: unknown
        resendAll?: unknown
    }
    const eventId = Number(o.eventId)
    if (!Number.isInteger(eventId) || eventId < 1) {
        return NextResponse.json({ error: 'Ugyldig arrangement' }, { status: 400 })
    }
    const sendFeedback = o.sendFeedback === true
    const sendCertificate = o.sendCertificate === true
    const resendAll = o.resendAll === true
    if (!sendFeedback && !sendCertificate) {
        return NextResponse.json(
            { error: 'Velg tilbakemeldingsskjema, kursbevis eller begge' },
            { status: 400 }
        )
    }

    const supabase = await createClient()
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .single()
    if (profileError || !profile?.approved) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 403 })
    }

    const { data: event, error: eventError } = await supabase
        .from('Events')
        .select(
            'id, title, slug, start_datetime, end_datetime, date_unspecified, planned_month, location, contact_email, feedback_questions'
        )
        .eq('id', eventId)
        .single()
    if (eventError || !event) {
        return NextResponse.json({ error: 'Fant ikke arrangementet' }, { status: 404 })
    }

    if (!isEventPast(event)) {
        return NextResponse.json(
            { error: 'Arrangementet er ikke ferdig ennå' },
            { status: 400 }
        )
    }

    if (sendFeedback) {
        if (!event.slug) {
            return NextResponse.json({ error: 'Arrangementet mangler lenke' }, { status: 400 })
        }
        if (parseFeedbackQuestions(event.feedback_questions).length === 0) {
            return NextResponse.json(
                {
                    error: 'Arrangementet har ikke tilbakemeldingsskjema. Legg det til under «Rediger».',
                },
                { status: 400 }
            )
        }
    }

    if (sendCertificate && !isCertificateSigningConfigured()) {
        console.error('Followup: CERTIFICATE_SECRET / SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json(
            { error: 'Kursbevis er ikke konfigurert på serveren' },
            { status: 500 }
        )
    }

    let query = supabase
        .from('EventParticipants')
        .select('id, name, email')
        .eq('eventId', eventId)
        .eq('attended', true)
    if (!resendAll) query = query.is('followup_sent_at', null)

    const { data: participants, error: participantsError } = await query
    if (participantsError) {
        console.error('Followup: fetch participants', participantsError)
        return NextResponse.json({ error: 'Kunne ikke hente deltakere' }, { status: 500 })
    }

    if (!participants?.length) {
        return NextResponse.json({ sent: 0, participantIds: [], sentAt: null })
    }

    const feedbackUrl = sendFeedback
        ? `${SITE_ORIGIN}/arrangementer/${encodeURIComponent(event.slug!)}?tilbakemelding`
        : null

    const sentAt = new Date().toISOString()
    const markSent = async (ids: number[]) => {
        const { error } = await supabase
            .from('EventParticipants')
            .update({ followup_sent_at: sentAt })
            .in('id', ids)
        if (error) console.error('Followup: could not mark as sent', error)
    }

    let sentIds: number[]
    try {
        sentIds = await sendEventFollowupEmails(
            {
                eventId,
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
                certificateUrl: sendCertificate ? certificateUrl(p.id) : null,
            })),
            markSent
        )
    } catch (e) {
        console.error('Followup: send failed', e)
        return NextResponse.json(
            { error: 'Kunne ikke sende e-post. Noen kan ha fått den allerede; prøv igjen for å sende til resten.' },
            { status: 502 }
        )
    }

    return NextResponse.json({ sent: sentIds.length, participantIds: sentIds, sentAt })
}
