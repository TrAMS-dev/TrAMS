'use client'

import { useState } from 'react'
import {
    Box,
    Dialog,
    Textarea,
    Button,
    NativeSelect,
    Field,
    Text,
    HStack,
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import {
    FEEDBACK_RATING_VALUES,
    type FeedbackAnswers,
    type FeedbackQuestion,
} from '@/lib/eventFeedback'

interface EventFeedbackDialogProps {
    open: boolean
    onClose: () => void
    eventId: number
    eventTitle: string
    questions: FeedbackQuestion[]
    onSuccess?: () => void
}

type DraftValue = number | string | boolean | undefined

export default function EventFeedbackDialog({
    open,
    onClose,
    eventId,
    eventTitle,
    questions,
    onSuccess,
}: EventFeedbackDialogProps) {
    const [answers, setAnswers] = useState<Record<string, DraftValue>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const setAnswer = (id: string, value: DraftValue) => {
        setAnswers((prev) => ({ ...prev, [id]: value }))
    }

    const resetForm = () => setAnswers({})

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

            toaster.create({
                title: 'Takk for tilbakemeldingen!',
                type: 'success',
                description: `Svaret ditt for ${eventTitle} er registrert.`,
                duration: 6000,
            })

            resetForm()
            onSuccess?.()
            onClose()
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

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Tilbakemelding: {eventTitle}</Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <form onSubmit={handleSubmit}>
                        <Dialog.Body display="flex" flexDirection="column" gap={5}>
                            <Text fontSize="sm" color="fg.muted">
                                Svarene er anonyme.
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

                            {questions.length === 0 && (
                                <Box>
                                    <Text color="fg.muted">
                                        Ingen spørsmål er lagt til for dette arrangementet.
                                    </Text>
                                </Box>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer gap={3}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Avbryt
                            </Button>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={questions.length === 0}
                                bg="var(--color-primary)"
                                color="white"
                            >
                                Send tilbakemelding
                            </Button>
                        </Dialog.Footer>
                    </form>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
