import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'o')
        .replace(/å/g, 'a')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            title,
            description,
            start_datetime,
            end_datetime,
            location,
            image,
            max_attendees,
            reg_deadline,
            author,
        } = body

        // Validate required fields
        if (!title || !start_datetime || !end_datetime || !location) {
            return NextResponse.json(
                { error: 'Tittel, start, slutt og lokasjon er påkrevd' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Generate unique slug
        let slug = generateSlug(title)
        let slugSuffix = 0

        // Check if slug exists and make it unique
        while (true) {
            const testSlug = slugSuffix === 0 ? slug : `${slug}-${slugSuffix}`
            const { data: existing } = await supabase
                .from('Events')
                .select('id')
                .eq('slug', testSlug)
                .single()

            if (!existing) {
                slug = testSlug
                break
            }
            slugSuffix++
        }

        // Insert event
        const { data: event, error: insertError } = await supabase
            .from('Events')
            .insert({
                title,
                description: description || null,
                start_datetime,
                end_datetime,
                location,
                image: image || null,
                max_attendees: max_attendees || null,
                reg_deadline: reg_deadline || null,
                author: author || null,
                slug,
            })
            .select()
            .single()

        if (insertError) {
            console.error('Error inserting event:', insertError)
            return NextResponse.json(
                { error: 'Kunne ikke opprette arrangement. Prøv igjen senere.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            event,
        })
    } catch (error) {
        console.error('Error in create event API:', error)
        return NextResponse.json(
            { error: 'En uventet feil oppstod' },
            { status: 500 }
        )
    }
}
