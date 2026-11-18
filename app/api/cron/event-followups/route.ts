import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import {
    AUTO_FOLLOWUP_WINDOW_DAYS,
    FOLLOWUP_EVENT_COLUMNS,
    autoFollowupContent,
    isInAutoFollowupWindow,
    sendFollowup,
} from '@/lib/eventFollowup'

/**
 * Kjøres daglig av Vercel Cron (se vercel.json). Sender e-posten etter arrangementet
 * (tilbakemeldingsskjema og kursbevis) til deltakere som er registrert som «Møtt», men
 * ikke har fått den ennå. Dekker de som ble registrert før arrangementet var ferdig;
 * de som registreres etterpå får e-posten med en gang (se attendance-ruten).
 * Bare arrangementer som sluttet de siste AUTO_FOLLOWUP_WINDOW_DAYS dagene tas med.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 401 })
    }

    const admin = createAdminClient()
    if (!admin) {
        console.error('Event followups: SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json({ error: 'Ikke konfigurert' }, { status: 500 })
    }

    const now = new Date()
    const windowStart = new Date(now.getTime() - AUTO_FOLLOWUP_WINDOW_DAYS * 24 * 60 * 60 * 1000)

    const { data: events, error: eventsError } = await admin
        .from('Events')
        .select(FOLLOWUP_EVENT_COLUMNS)
        .eq('date_unspecified', false)
        .gt('end_datetime', windowStart.toISOString())
        .lt('end_datetime', now.toISOString())

    if (eventsError) {
        console.error('Event followups: fetch events', eventsError)
        return NextResponse.json({ error: 'Kunne ikke hente arrangementer' }, { status: 500 })
    }

    const results: { eventId: number; sent: number; error?: string }[] = []

    for (const event of events ?? []) {
        if (!isInAutoFollowupWindow(event, now)) continue
        const content = autoFollowupContent(event)
        if (!content.sendFeedback && !content.sendCertificate) continue

        const { data: participants, error: participantsError } = await admin
            .from('EventParticipants')
            .select('id, name, email')
            .eq('eventId', event.id)
            .eq('attended', true)
            .is('followup_sent_at', null)

        if (participantsError) {
            console.error('Event followups: fetch participants', event.id, participantsError)
            results.push({ eventId: event.id, sent: 0, error: 'participants' })
            continue
        }
        if (!participants?.length) continue

        try {
            const { sentIds } = await sendFollowup(admin, event, participants, content)
            results.push({ eventId: event.id, sent: sentIds.length })
        } catch (e) {
            // Those not marked as sent are picked up by the next run
            console.error('Event followups: send', event.id, e)
            results.push({ eventId: event.id, sent: 0, error: 'send' })
        }
    }

    return NextResponse.json({ results })
}
