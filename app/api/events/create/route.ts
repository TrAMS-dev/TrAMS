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
            reg_opens,
            author,
            contact_email,
            date_unspecified,
            signup_undecided,
            planned_month,
            has_food,
            custom_question,
            require_phone,
            allowed_kull,
        } = body

        const isDateUnspecified = Boolean(date_unspecified)
        const isSignupUndecided = Boolean(signup_undecided)
        const hideSignup = isDateUnspecified || isSignupUndecided

        if (!title) {
            return NextResponse.json(
                { error: 'Tittel er påkrevd' },
                { status: 400 }
            )
        }

        if (isDateUnspecified) {
            if (!planned_month) {
                return NextResponse.json(
                    { error: 'Planlagt måned er påkrevd når dato ikke er spesifisert' },
                    { status: 400 }
                )
            }
        } else if (!start_datetime || !end_datetime || !location) {
            return NextResponse.json(
                { error: 'Tittel, start, slutt og lokasjon er påkrevd' },
                { status: 400 }
            )
        } else if (new Date(end_datetime) < new Date(start_datetime)) {
            return NextResponse.json(
                { error: 'Sluttidspunkt kan ikke være før starttidspunkt' },
                { status: 400 }
            )
        }

        const allowedKull =
            !isSignupUndecided && Array.isArray(allowed_kull)
                ? allowed_kull.filter((k: unknown): k is number => Number.isInteger(k))
                : []

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
                start_datetime: isDateUnspecified ? null : start_datetime,
                end_datetime: isDateUnspecified ? null : end_datetime,
                location: isDateUnspecified ? null : (location || null),
                image: image || null,
                max_attendees: hideSignup ? null : (max_attendees || null),
                reg_deadline: hideSignup ? null : (reg_deadline || null),
                reg_opens: hideSignup ? null : (reg_opens || null),
                author: author || null,
                contact_email: contact_email?.trim() || null,
                date_unspecified: isDateUnspecified,
                signup_undecided: isSignupUndecided,
                planned_month: isDateUnspecified ? planned_month : null,
                slug,
                has_food: Boolean(has_food),
                custom_question: isSignupUndecided ? null : (custom_question || null),
                require_phone: !isSignupUndecided && require_phone === true,
                allowed_kull: allowedKull.length > 0 ? allowedKull : null,
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
