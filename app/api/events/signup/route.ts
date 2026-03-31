import { createClient } from '@/utils/supabase/server'
import { sendEventSignupEmail } from '@/lib/eventSignupEmail'
import { NextResponse } from 'next/server'

/** Rows that count toward max_attendees (excludes waitlist). */
function confirmedParticipantsQuery(
    supabase: Awaited<ReturnType<typeof createClient>>,
    eventId: number
) {
    return supabase
        .from('EventParticipants')
        .select('*', { count: 'exact', head: true })
        .eq('eventId', eventId)
        .or('status.eq.confirmed,status.is.null')
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, kull, allergies, eventId } = body

        // Validate required fields
        if (!name || !email || !kull || !eventId) {
            return NextResponse.json(
                { error: 'Navn, e-post, kull og eventId er påkrevd' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if event exists and get details
        const { data: event, error: eventError } = await supabase
            .from('Events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (eventError || !event) {
            return NextResponse.json(
                { error: 'Arrangement ikke funnet' },
                { status: 404 }
            )
        }

        const now = new Date()

        if (event.reg_opens) {
            const opensAt = new Date(event.reg_opens)
            if (now < opensAt) {
                return NextResponse.json(
                    { error: 'Påmeldingen er ikke åpnet ennå' },
                    { status: 400 }
                )
            }
        }

        // Check registration deadline
        if (event.reg_deadline) {
            const deadline = new Date(event.reg_deadline)
            if (now > deadline) {
                return NextResponse.json(
                    { error: 'Påmeldingsfristen har gått ut' },
                    { status: 400 }
                )
            }
        }

        // Check if user is already registered (confirmed or waitlist)
        const { data: existingParticipant } = await supabase
            .from('EventParticipants')
            .select('id')
            .eq('eventId', eventId)
            .eq('email', email)
            .single()

        if (existingParticipant) {
            return NextResponse.json(
                { error: 'Du er allerede påmeldt dette arrangementet' },
                { status: 400 }
            )
        }

        let status: 'confirmed' | 'waitlist' = 'confirmed'

        if (event.max_attendees) {
            const { count, error: countError } = await confirmedParticipantsQuery(
                supabase,
                eventId
            )

            if (countError) {
                console.error('Error counting participants:', countError)
            } else if (count !== null && count >= event.max_attendees) {
                status = 'waitlist'
            }
        }

        // Insert participant
        const { data: participant, error: insertError } = await supabase
            .from('EventParticipants')
            .insert({
                name,
                email,
                kull,
                allergies: allergies || null,
                eventId,
                status,
            })
            .select()
            .single()

        if (insertError) {
            console.error('Error inserting participant:', insertError)
            return NextResponse.json(
                { error: 'Kunne ikke melde deg på. Prøv igjen senere.' },
                { status: 500 }
            )
        }

        try {
            await sendEventSignupEmail(status, {
                recipientName: name,
                recipientEmail: email,
                eventTitle: event.title || 'Arrangement',
                eventSlug: event.slug,
                startDatetime: event.start_datetime,
                location: event.location,
                regDeadline: event.reg_deadline,
                contactEmail: event.contact_email,
            })
        } catch (mailErr) {
            console.error('Event signup confirmation email failed:', mailErr)
        }

        return NextResponse.json({
            success: true,
            participant,
            registrationStatus: status,
        })
    } catch (error) {
        console.error('Error in signup API:', error)
        return NextResponse.json(
            { error: 'En uventet feil oppstod' },
            { status: 500 }
        )
    }
}
