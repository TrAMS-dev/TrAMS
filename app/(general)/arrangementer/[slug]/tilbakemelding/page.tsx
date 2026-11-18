import type { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { Text } from '@chakra-ui/react'
import { PageContainer } from '@/components/PageContainer'
import { ContentCard } from '@/components/ContentCard'
import { PageHeading } from '@/components/Typography'
import EventFeedbackForm from '@/components/EventFeedbackForm'
import { formatEventDate, isEventPast } from '@/lib/eventDate'
import { parseFeedbackQuestions } from '@/lib/eventFeedback'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
    title: 'Tilbakemelding',
    robots: { index: false, follow: false },
}

/** Feedback form for an event. Participants get the link by email after the event. */
export default async function EventFeedbackPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: event } = await supabase
        .from('Events')
        .select(
            'id, title, slug, start_datetime, end_datetime, date_unspecified, planned_month, feedback_questions'
        )
        .eq('slug', slug)
        .maybeSingle()
    if (!event) notFound()

    const questions = parseFeedbackQuestions(event.feedback_questions)
    const title = event.title?.trim() || 'Arrangement'

    let body: React.ReactNode
    if (questions.length === 0) {
        body = <Text color="fg.muted">Dette arrangementet har ikke tilbakemeldingsskjema.</Text>
    } else if (!isEventPast(event)) {
        body = (
            <Text color="fg.muted">
                Tilbakemeldingsskjemaet åpner når arrangementet er ferdig.
            </Text>
        )
    } else {
        body = <EventFeedbackForm eventId={event.id} questions={questions} />
    }

    return (
        <PageContainer narrow maxW="720px">
            <ContentCard>
                <Text fontSize="sm" color="fg.muted" mb={1}>
                    Tilbakemelding
                </Text>
                <PageHeading mb={1}>{title}</PageHeading>
                <Text color="fg.muted" mb={8}>
                    {formatEventDate(event, { style: 'long' })} ·{' '}
                    <NextLink
                        href={`/arrangementer/${encodeURIComponent(slug)}`}
                        style={{ textDecoration: 'underline' }}
                    >
                        Se arrangementet
                    </NextLink>
                </Text>
                {body}
            </ContentCard>
        </PageContainer>
    )
}
