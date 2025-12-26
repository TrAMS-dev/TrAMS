import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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

        // Check registration deadline
        if (event.reg_deadline) {
            const deadline = new Date(event.reg_deadline)
            const now = new Date()
            if (now > deadline) {
                return NextResponse.json(
                    { error: 'Påmeldingsfristen har gått ut' },
                    { status: 400 }
                )
            }
        }

        // Check if event is full
        if (event.max_attendees) {
            const { count, error: countError } = await supabase
                .from('EventParticipants')
                .select('*', { count: 'exact', head: true })
                .eq('eventId', eventId)

            if (countError) {
                console.error('Error counting participants:', countError)
            } else if (count !== null && count >= event.max_attendees) {
                return NextResponse.json(
                    { error: 'Arrangementet er fullt' },
                    { status: 400 }
                )
            }
        }

        // Check if user is already registered
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

        // Insert participant
        const { data: participant, error: insertError } = await supabase
            .from('EventParticipants')
            .insert({
                name,
                email,
                kull,
                allergies: allergies || null,
                eventId,
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

        return NextResponse.json({
            success: true,
            participant,
        })
    } catch (error) {
        console.error('Error in signup API:', error)
        return NextResponse.json(
            { error: 'En uventet feil oppstod' },
            { status: 500 }
        )
    }
}
