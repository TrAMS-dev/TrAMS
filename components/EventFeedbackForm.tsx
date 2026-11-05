'use client'

import { useState } from 'react'
import { Textarea, Button, NativeSelect, Field, Text, HStack, Stack } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import {
    FEEDBACK_RATING_VALUES,
    type FeedbackAnswers,
    type FeedbackQuestion,
} from '@/lib/eventFeedback'

interface EventFeedbackFormProps {
    eventId: number
    questions: FeedbackQuestion[]
}

type DraftValue = number | string | boolean | undefined

/** The event's feedback form, shown on /arrangementer/<slug>/tilbakemelding. */
export default function EventFeedbackForm({ eventId, questions }: EventFeedbackFormProps) {
    const [answers, setAnswers] = useState<Record<string, DraftValue>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const setAnswer = (id: string, value: DraftValue) => {
        setAnswers((prev) => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        for (const question of questions) {
            if (!question.required) continue
            const value = answers[question.id]
            const missing =
                value === undefined ||
                value === '' ||
                (question.type === 'text' &&
                    typeof value === 'string' &&
                    value.trim() === '')
            if (missing) {
                toaster.create({
                    title: 'Fyll ut alle påkrevde felt',
                    description: `«${question.label}» må besvares.`,
                    type: 'error',
                    duration: 5000,
                })
                return
            }
        }

        setIsSubmitting(true)
        try {
            const payload: FeedbackAnswers = {}
            for (const question of questions) {
                const value = answers[question.id]
                if (value === undefined || value === '') continue
                payload[question.id] = value
            }

            const response = await fetch('/api/events/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, answers: payload }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    typeof data.error === 'string' && data.error
                        ? data.error
                        : 'Kunne ikke sende tilbakemelding'
                )
            }

            setSubmitted(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            toaster.create({
                title: 'Kunne ikke sende tilbakemelding',
                type: 'error',
                description:
                    error instanceof Error ? error.message : 'Noe gikk galt',
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <Stack gap={2}>
                <Text fontSize="lg" fontWeight="semibold">
                    Takk for tilbakemeldingen!
                </Text>
                <Text color="fg.muted">Svaret ditt er registrert.</Text>
            </Stack>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap={6}>
                <Text fontSize="sm" color="fg.muted">
                    Svarene er anonyme. Spørsmål merket med * må besvares.
                </Text>

                {questions.map((question) => {
                    const value = answers[question.id]

                    if (question.type === 'rating') {
                        return (
                            <Field.Root key={question.id} required={question.required}>
                                <Field.Label>
                                    {question.label}
                                    {question.required ? ' *' : ''}
                                </Field.Label>
                                <HStack gap={2}>
                                    {FEEDBACK_RATING_VALUES.map((n) => (
                                        <Button
                                            key={n}
                                            type="button"
                                            size="sm"
                                            variant={value === n ? 'solid' : 'outline'}
                                            bg={
                                                value === n
                                                    ? 'var(--color-primary)'
                                                    : undefined
                                            }
                                            color={value === n ? 'white' : undefined}
                                            onClick={() => setAnswer(question.id, n)}
                                        >
                                            {n}
                                        </Button>
                                    ))}
                                </HStack>
                                <Field.HelperText>
                                    1 = dårligst, 5 = best
                                </Field.HelperText>
                            </Field.Root>
                        )
                    }

                    if (question.type === 'yesno') {
                        return (
                            <Field.Root key={question.id} required={question.required}>
                                <Field.Label>
                                    {question.label}
                                    {question.required ? ' *' : ''}
                                </Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={
                                            value === true
                                                ? 'true'
                                                : value === false
                                                  ? 'false'
                                                  : ''
                                        }
                                        onChange={(e) => {
                                            const v = e.target.value
                                            setAnswer(
                                                question.id,
                                                v === '' ? undefined : v === 'true'
                                            )
                                        }}
                                    >
                                        <option value="">Velg …</option>
                                        <option value="true">Ja</option>
                                        <option value="false">Nei</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        )
                    }

                    return (
                        <Field.Root key={question.id} required={question.required}>
                            <Field.Label>
                                {question.label}
                                {question.required ? ' *' : ''}
                            </Field.Label>
                            <Textarea
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) =>
                                    setAnswer(question.id, e.target.value)
                                }
                                rows={3}
                                placeholder="Skriv svaret ditt …"
                            />
                        </Field.Root>
                    )
                })}

                <Button
                    type="submit"
                    loading={isSubmitting}
                    alignSelf="flex-start"
                    bg="var(--color-primary)"
                    color="white"
                >
                    Send tilbakemelding
                </Button>
            </Stack>
        </form>
    )
}
