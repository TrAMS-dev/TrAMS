import { createAdminClient } from '@/utils/supabase/admin'
import { sendEventReminderEmails } from '@/lib/eventSignupEmail'
import { datetimeLocalToUtcIso, utcIsoToDatetimeLocalValue } from '@/lib/datetimeLocal'
import { NextResponse } from 'next/server'

/** Påminnelsen sendes for arrangementer som starter om to kalenderdager (Oslo-tid). */
const REMINDER_DAYS_BEFORE = 2

/** Deltakere må melde avbud senest 24 t før, så det er ingen vits å minne på senere enn det. */
const MIN_HOURS_BEFORE_START = 24

/** UTC-tidspunktet for midnatt (Oslo) `days` dager etter dagens Oslo-dato. */
function osloMidnightInDays(now: Date, days: number): string | null {
    const [datePart] = utcIsoToDatetimeLocalValue(now.toISOString()).split('T')
    const [y, mo, da] = datePart.split('-').map(Number)
    const target = new Date(Date.UTC(y, mo - 1, da + days))
    return datetimeLocalToUtcIso(`${target.toISOString().slice(0, 10)}T00:00`)
}

/**
 * Kjøres daglig av Vercel Cron (se vercel.json). Sender påminnelse til alle med
 * bekreftet plass på arrangementer som starter om to dager. Arrangementer som ble
 * opprettet sent eller ble hoppet over tas også med, så lenge det er mer enn 24 t
 * til start. `reminder_sent_at` sørger for at hvert arrangement bare får én påminnelse.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 401 })
    }

    const admin = createAdminClient()
    if (!admin) {
        console.error('Event reminders: SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json({ error: 'Ikke konfigurert' }, { status: 500 })
    }

    const now = new Date()
    const windowStart = new Date(now.getTime() + MIN_HOURS_BEFORE_START * 60 * 60 * 1000)
    const windowEnd = osloMidnightInDays(now, REMINDER_DAYS_BEFORE + 1)
    if (!windowEnd) {
        return NextResponse.json({ error: 'Kunne ikke beregne tidsvindu' }, { status: 500 })
    }

    const { data: events, error: eventsError } = await admin
        .from('Events')
        .select('id, title, slug, start_datetime, location, contact_email')
        .eq('date_unspecified', false)
        .is('reminder_sent_at', null)
        .gt('start_datetime', windowStart.toISOString())
        .lt('start_datetime', windowEnd)

    if (eventsError) {
        console.error('Event reminders: fetch events', eventsError)
        return NextResponse.json({ error: 'Kunne ikke hente arrangementer' }, { status: 500 })
    }

    const results: { eventId: number; sent: number; error?: string }[] = []

    for (const event of events ?? []) {
        // Reserver arrangementet før utsending så overlappende kjøringer ikke sender dobbelt
        const { data: claimed, error: claimError } = await admin
            .from('Events')
            .update({ reminder_sent_at: now.toISOString() })
            .eq('id', event.id)
            .is('reminder_sent_at', null)
            .select('id')

        if (claimError) {
            console.error('Event reminders: claim', event.id, claimError)
            results.push({ eventId: event.id, sent: 0, error: 'claim' })
            continue
        }
        if (!claimed || claimed.length === 0) continue

        const { data: participants, error: participantsError } = await admin
            .from('EventParticipants')
            .select('name, email')
            .eq('eventId', event.id)
            .eq('status', 'confirmed')

        try {
            if (participantsError) throw participantsError

            const sent = await sendEventReminderEmails(
                {
                    eventId: event.id,
                    eventTitle: event.title || 'Arrangement',
                    eventSlug: event.slug,
                    startDatetime: event.start_datetime,
                    location: event.location,
                    contactEmail: event.contact_email,
                },
                (participants ?? [])
                    .filter((p) => p.email)
                    .map((p) => ({ name: p.name ?? '', email: p.email! }))
            )
            results.push({ eventId: event.id, sent })
        } catch (e) {
            console.error('Event reminders: send', event.id, e)
            // Frigi arrangementet så neste kjøring kan prøve igjen
            await admin.from('Events').update({ reminder_sent_at: null }).eq('id', event.id)
            results.push({ eventId: event.id, sent: 0, error: 'send' })
        }
    }

    return NextResponse.json({ results })
}
