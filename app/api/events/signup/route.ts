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

        const nameStr = typeof name === 'string' ? name.trim() : ''
        const emailStr = typeof email === 'string' ? email.trim() : ''
        const kullStr =
            kull !== undefined && kull !== null && String(kull).trim() !== ''
                ? String(kull).trim()
                : ''
        const eventIdNum = Number(eventId)

        // Validate required fields (kull can be 0 in theory; do not use !kull)
        if (!nameStr || !emailStr || !kullStr || !Number.isInteger(eventIdNum) || eventIdNum < 1) {
            return NextResponse.json(
                { error: 'Navn, e-post, kull og eventId er påkrevd' },
                { status: 400 }
            )
        }

        const kullNum = Number.parseInt(kullStr, 10)
        if (!Number.isFinite(kullNum)) {
            return NextResponse.json({ error: 'Ugyldig kull' }, { status: 400 })
        }

        const supabase = await createClient()

        // Check if event exists and get details
        const { data: event, error: eventError } = await supabase
            .from('Events')
            .select('*')
            .eq('id', eventIdNum)
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

        const { data: existingParticipant } = await supabase
            .from('EventParticipants')
            .select('id, status')
            .eq('eventId', eventIdNum)
            .eq('email', emailStr)
            .maybeSingle()

        if (existingParticipant) {
            if (existingParticipant.status !== 'waitlist') {
                return NextResponse.json(
                    { error: 'Du er allerede påmeldt dette arrangementet' },
                    { status: 400 }
                )
            }

            if (event.max_attendees) {
                const { count, error: countError } = await confirmedParticipantsQuery(
                    supabase,
                    eventIdNum
                )
                if (countError) {
                    console.error('Error counting participants (promote):', countError)
                }
                if (count !== null && count >= event.max_attendees) {
                    return NextResponse.json(
                        {
                            error: 'Arrangementet er fortsatt fullt. Du står fortsatt på venteliste.',
                        },
                        { status: 400 }
                    )
                }
            }

            const { data: waitlistRows, error: waitlistError } = await supabase
                .from('EventParticipants')
                .select('id')
                .eq('eventId', eventIdNum)
                .eq('status', 'waitlist')
                .order('created_at', { ascending: true })

            if (waitlistError) {
                console.error('Error loading waitlist:', waitlistError)
                return NextResponse.json(
                    { error: 'Kunne ikke verifisere venteliste. Prøv igjen senere.' },
                    { status: 500 }
                )
            }

            if (!waitlistRows?.length) {
                return NextResponse.json(
                    { error: 'Kunne ikke verifisere venteliste. Prøv igjen senere.' },
                    { status: 500 }
                )
            }

            if (waitlistRows[0].id !== existingParticipant.id) {
                return NextResponse.json(
                    {
                        error: 'Du er ikke først på ventelisten. Vent til det er din tur.',
                    },
                    { status: 400 }
                )
            }

            const allergiesValue =
                typeof allergies === 'string' && allergies.trim() !== ''
                    ? allergies.trim()
                    : null

            const { data: participant, error: updateError } = await supabase
                .from('EventParticipants')
                .update({
                    name: nameStr,
                    email: emailStr,
                    kull: kullNum,
                    allergies: allergiesValue,
                    status: 'confirmed',
                })
                .eq('id', existingParticipant.id)
                .select()
                .single()

            if (updateError) {
                console.error('Error promoting from waitlist:', updateError)
                return NextResponse.json(
                    { error: 'Kunne ikke bekrefte plassen. Prøv igjen senere.' },
                    { status: 500 }
                )
            }

            try {
                await sendEventSignupEmail('confirmed', {
                    recipientName: nameStr,
                    recipientEmail: emailStr,
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
                registrationStatus: 'confirmed' as const,
            })
        }

        let status: 'confirmed' | 'waitlist' = 'confirmed'

        if (event.max_attendees) {
            const { count, error: countError } = await confirmedParticipantsQuery(
                supabase,
                eventIdNum
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
                name: nameStr,
                email: emailStr,
                kull: kullNum,
                allergies:
                    typeof allergies === 'string' && allergies.trim() !== ''
                        ? allergies.trim()
                        : null,
                eventId: eventIdNum,
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
                recipientName: nameStr,
                recipientEmail: emailStr,
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
