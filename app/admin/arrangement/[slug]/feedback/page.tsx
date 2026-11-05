'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Heading,
    Text,
    Stack,
    Button,
    Spinner,
    Flex,
    Badge,
    HStack,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    FEEDBACK_TYPE_LABELS,
    FEEDBACK_RATING_VALUES,
    parseFeedbackQuestions,
    type FeedbackAnswers,
    type FeedbackQuestion,
} from '@/lib/eventFeedback'

type FeedbackRow = {
    id: number
    created_at: string
    answers: FeedbackAnswers
}

function asAnswers(raw: unknown): FeedbackAnswers {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        return raw as FeedbackAnswers
    }
    return {}
}

function csvCell(value: string | number | boolean | undefined): string {
    const s = value === undefined ? '' : String(value)
    return `"${s.replace(/"/g, '""')}"`
}

export default function AdminFeedbackPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [eventTitle, setEventTitle] = useState('')
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [questions, setQuestions] = useState<FeedbackQuestion[]>([])
    const [responses, setResponses] = useState<FeedbackRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()

            const { data: event, error: eventError } = await supabase
                .from('Events')
                .select('id, title, feedback_open, feedback_questions')
                .eq('slug', slug)
                .single()

            if (eventError || !event) {
                console.error('Error fetching event:', eventError)
                setLoading(false)
                return
            }

            setEventTitle(event.title || 'Arrangement')
            setFeedbackOpen(Boolean(event.feedback_open))
            setQuestions(parseFeedbackQuestions(event.feedback_questions))

            const { data, error } = await supabase
                .from('EventFeedback')
                .select('id, created_at, answers')
                .eq('eventId', event.id)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching feedback:', error)
            } else {
                setResponses(
                    (data ?? []).map((r) => ({
                        id: r.id,
                        created_at: r.created_at,
                        answers: asAnswers(r.answers),
                    }))
                )
            }
            setLoading(false)
        }

        fetchData()
    }, [slug])

    const summaries = useMemo(() => {
        return questions.map((question) => {
            const values = responses
                .map((r) => r.answers[question.id])
                .filter((v) => v !== undefined && v !== null && v !== '')

            if (question.type === 'rating') {
                const nums = values
                    .map((v) => (typeof v === 'number' ? v : Number(v)))
                    .filter((n) => Number.isFinite(n))
                const avg =
                    nums.length > 0
                        ? nums.reduce((a, b) => a + b, 0) / nums.length
                        : null
                const distribution = FEEDBACK_RATING_VALUES.map((score) => ({
                    score,
                    count: nums.filter((n) => n === score).length,
                }))
                return { question, kind: 'rating' as const, count: nums.length, avg, distribution }
            }

            if (question.type === 'yesno') {
                const yes = values.filter((v) => v === true || v === 'true').length
                const no = values.filter((v) => v === false || v === 'false').length
                return { question, kind: 'yesno' as const, count: yes + no, yes, no }
            }

            const texts = responses
                .map((r) => ({
                    createdAt: r.created_at,
                    text:
                        typeof r.answers[question.id] === 'string'
                            ? (r.answers[question.id] as string).trim()
                            : '',
                }))
                .filter((t) => t.text !== '')
            return { question, kind: 'text' as const, count: texts.length, texts }
        })
    }, [questions, responses])

    const handleExport = () => {
        const headers = ['Tidspunkt', ...questions.map((q) => q.label)]
        const lines = [
            headers.map(csvCell).join(','),
            ...responses.map((r) =>
                [
                    csvCell(new Date(r.created_at).toLocaleString('nb-NO')),
                    ...questions.map((q) => {
                        const v = r.answers[q.id]
                        if (v === undefined || v === null) return csvCell('')
                        if (typeof v === 'boolean') return csvCell(v ? 'Ja' : 'Nei')
                        return csvCell(v)
                    }),
                ].join(',')
            ),
        ]
        const blob = new Blob([lines.join('\n')], {
            type: 'text/csv;charset=utf-8;',
        })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${slug}-tilbakemeldinger.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" />
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6} gap={4} wrap="wrap">
                <Box>
                    <Button
                        size="sm"
                        variant="ghost"
                        mb={2}
                        onClick={() => router.push('/admin')}
                    >
                        &larr; Tilbake til oversikt
                    </Button>
                    <Heading size="lg">Tilbakemeldinger: {eventTitle}</Heading>
                    <Text color="gray.600" mt={1}>
                        {responses.length} {responses.length === 1 ? 'svar' : 'svar'}
                    </Text>
                </Box>
                <Button
                    onClick={handleExport}
                    variant="outline"
                    disabled={responses.length === 0 || questions.length === 0}
                >
                    Eksporter CSV
                </Button>
            </Flex>

            {questions.length === 0 ? (
                <Box p={6} bg="white" rounded="lg" shadow="sm">
                    <Text color="gray.600">
                        Dette arrangementet har ingen tilbakemeldingsspørsmål. Legg til spørsmål
                        under «Rediger».
                    </Text>
                </Box>
            ) : (
                <Stack gap={4}>
                    {!feedbackOpen && (
                        <Box
                            p={4}
                            borderWidth="1px"
                            borderColor="orange.200"
                            bg="orange.50"
                            rounded="md"
                        >
                            <Text fontSize="sm" color="gray.700">
                                Tilbakemeldingsskjemaet er ikke åpent. Deltakere ser det ikke på
                                arrangementssiden før du skrur det på under «Rediger».
                            </Text>
                        </Box>
                    )}

                    {responses.length === 0 && (
                        <Box p={6} bg="white" rounded="lg" shadow="sm">
                            <Text color="gray.600">Ingen tilbakemeldinger enda.</Text>
                        </Box>
                    )}

                    {summaries.map((summary) => (
                        <Box
                            key={summary.question.id}
                            p={5}
                            bg="white"
                            rounded="lg"
                            shadow="sm"
                        >
                            <Flex justify="space-between" align="baseline" gap={3} wrap="wrap">
                                <Heading size="md">{summary.question.label}</Heading>
                                <Badge colorPalette="gray">
                                    {FEEDBACK_TYPE_LABELS[summary.question.type]}
                                </Badge>
                            </Flex>
                            <Text fontSize="sm" color="gray.500" mt={1} mb={3}>
                                {summary.count} {summary.count === 1 ? 'svar' : 'svar'}
                            </Text>

                            {summary.kind === 'rating' && (
                                <Stack gap={2}>
                                    <Text fontWeight="semibold">
                                        Snitt:{' '}
                                        {summary.avg != null
                                            ? summary.avg.toFixed(1)
                                            : '–'}
                                    </Text>
                                    <Stack gap={1}>
                                        {summary.distribution.map((d) => (
                                            <HStack key={d.score} gap={3}>
                                                <Text w="1.5rem" fontSize="sm">
                                                    {d.score}
                                                </Text>
                                                <Box
                                                    flex="1"
                                                    h="8px"
                                                    bg="gray.100"
                                                    rounded="full"
                                                    overflow="hidden"
                                                >
                                                    <Box
                                                        h="full"
                                                        bg="var(--color-primary)"
                                                        w={
                                                            summary.count > 0
                                                                ? `${(d.count / summary.count) * 100}%`
                                                                : '0%'
                                                        }
                                                    />
                                                </Box>
                                                <Text
                                                    w="2rem"
                                                    fontSize="sm"
                                                    color="gray.600"
                                                    textAlign="right"
                                                >
                                                    {d.count}
                                                </Text>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {summary.kind === 'yesno' && (
                                <HStack gap={6}>
                                    <Text>
                                        <Text as="span" fontWeight="semibold" color="green.700">
                                            Ja:
                                        </Text>{' '}
                                        {summary.yes}
                                    </Text>
                                    <Text>
                                        <Text as="span" fontWeight="semibold" color="orange.800">
                                            Nei:
                                        </Text>{' '}
                                        {summary.no}
                                    </Text>
                                </HStack>
                            )}

                            {summary.kind === 'text' && (
                                <Stack gap={2}>
                                    {summary.texts.length === 0 && (
                                        <Text color="gray.500" fontSize="sm">
                                            Ingen svar.
                                        </Text>
                                    )}
                                    {summary.texts.map((t, i) => (
                                        <Box
                                            key={i}
                                            p={3}
                                            bg="gray.50"
                                            rounded="md"
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                        >
                                            <Text whiteSpace="pre-wrap">{t.text}</Text>
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                {new Date(t.createdAt).toLocaleString('nb-NO')}
                                            </Text>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    )
}
