import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import {
    parseFeedbackQuestions,
    validateFeedbackSubmission,
} from '@/lib/eventFeedback'
import type { Json } from '@/types/supabase'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { eventId, answers } = body as {
            eventId?: unknown
            answers?: unknown
        }

        const eventIdNum = Number(eventId)
        if (!Number.isInteger(eventIdNum) || eventIdNum < 1) {
            return NextResponse.json({ error: 'Ugyldig arrangement' }, { status: 400 })
        }

        const supabase = await createClient()

        const { data: event, error: eventError } = await supabase
            .from('Events')
            .select('id, feedback_open, feedback_questions')
            .eq('id', eventIdNum)
            .single()

        if (eventError || !event) {
            return NextResponse.json(
                { error: 'Arrangement ikke funnet' },
                { status: 404 }
            )
        }

        if (!event.feedback_open) {
            return NextResponse.json(
                { error: 'Tilbakemeldingsskjemaet er ikke åpent' },
                { status: 400 }
            )
        }

        const questions = parseFeedbackQuestions(event.feedback_questions)
        const validation = validateFeedbackSubmission(questions, answers)
        if (!validation.ok) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        const { error: insertError } = await supabase.from('EventFeedback').insert({
            eventId: eventIdNum,
            answers: validation.answers as unknown as Json,
        })

        if (insertError) {
            console.error('Error inserting event feedback:', insertError)
            return NextResponse.json(
                { error: 'Kunne ikke lagre tilbakemeldingen. Prøv igjen senere.' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in feedback API:', error)
        return NextResponse.json(
            { error: 'En uventet feil oppstod' },
            { status: 500 }
        )
    }
}
