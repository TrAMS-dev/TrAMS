import { createAdminClient } from '@/utils/supabase/admin'
import { sendBulkEventSignupEmails } from '@/lib/eventSignupEmail'
import { NextResponse } from 'next/server'

/**
 * Kjøres hvert kvarter av Vercel Schedules (se vercel.json). Sender bekreftet- eller
 * venteliste-e-post til alle deltakere på arrangementer der admin har valgt å vente
 * med bekreftelse til påmeldingsfristen går ut (`confirmation_email_timing =
 * 'on_deadline'`) eller til et valgt tidspunkt (`'scheduled'`,
 * `confirmation_email_send_at`). Dette gir admin tid til å flytte deltakere mellom
 * bekreftet og venteliste (f.eks. for å prioritere eldre kull) før noen får beskjed.
 * `confirmation_emails_sent_at` sørger for at hvert arrangement bare får denne
 * utsendingen én gang.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 401 })
    }

    const admin = createAdminClient()
    if (!admin) {
        console.error('Event signup confirmations: SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json({ error: 'Ikke konfigurert' }, { status: 500 })
    }

    const now = new Date()
    const nowIso = now.toISOString()

    const { data: events, error: eventsError } = await admin
        .from('Events')
        .select('id, title, slug, start_datetime, location, contact_email')
        .is('confirmation_emails_sent_at', null)
        .or(
            `and(confirmation_email_timing.eq.on_deadline,reg_deadline.lte.${nowIso}),` +
                `and(confirmation_email_timing.eq.scheduled,confirmation_email_send_at.lte.${nowIso})`
        )

    if (eventsError) {
        console.error('Event signup confirmations: fetch events', eventsError)
        return NextResponse.json({ error: 'Kunne ikke hente arrangementer' }, { status: 500 })
    }

    const results: { eventId: number; sent: number; error?: string }[] = []

    for (const event of events ?? []) {
        // Reserver arrangementet før utsending så overlappende kjøringer ikke sender dobbelt
        const { data: claimed, error: claimError } = await admin
            .from('Events')
            .update({ confirmation_emails_sent_at: nowIso })
            .eq('id', event.id)
            .is('confirmation_emails_sent_at', null)
            .select('id')

        if (claimError) {
            console.error('Event signup confirmations: claim', event.id, claimError)
            results.push({ eventId: event.id, sent: 0, error: 'claim' })
            continue
        }
        if (!claimed || claimed.length === 0) continue

        try {
            const { data: participants, error: participantsError } = await admin
                .from('EventParticipants')
                .select('name, email, status')
                .eq('eventId', event.id)
                .order('created_at', { ascending: true })

            if (participantsError) throw participantsError

            const ctx = {
                eventId: event.id,
                eventTitle: event.title || 'Arrangement',
                eventSlug: event.slug,
                startDatetime: event.start_datetime,
                location: event.location,
                contactEmail: event.contact_email,
            }

            const confirmed = (participants ?? []).filter((p) => p.status !== 'waitlist' && p.email)
            const waitlisted = (participants ?? []).filter((p) => p.status === 'waitlist' && p.email)

            const sentConfirmed = await sendBulkEventSignupEmails(
                'confirmed',
                ctx,
                confirmed.map((p) => ({ name: p.name ?? '', email: p.email! }))
            )
            const sentWaitlist = await sendBulkEventSignupEmails(
                'waitlist',
                ctx,
                waitlisted.map((p, i) => ({
                    name: p.name ?? '',
                    email: p.email!,
                    waitlistQueuePosition: i + 1,
                }))
            )

            results.push({ eventId: event.id, sent: sentConfirmed + sentWaitlist })
        } catch (e) {
            console.error('Event signup confirmations: send', event.id, e)
            // Frigi arrangementet så neste kjøring kan prøve igjen
            await admin.from('Events').update({ confirmation_emails_sent_at: null }).eq('id', event.id)
            results.push({ eventId: event.id, sent: 0, error: 'send' })
        }
    }

    return NextResponse.json({ results })
}
