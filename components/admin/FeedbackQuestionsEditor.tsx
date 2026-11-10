'use client'

import { Box, Button, Checkbox, Field, Flex, Input, NativeSelect, Stack } from '@chakra-ui/react'
import {
    FEEDBACK_QUESTION_TYPES,
    FEEDBACK_TYPE_LABELS,
    MAX_FEEDBACK_QUESTIONS,
    newFeedbackQuestionId,
    type FeedbackQuestion,
    type FeedbackQuestionType,
} from '@/lib/eventFeedback'

export function newFeedbackQuestion(): FeedbackQuestion {
    return { id: newFeedbackQuestionId(), label: '', type: 'rating', required: false }
}

interface FeedbackQuestionsEditorProps {
    value: FeedbackQuestion[]
    onChange: (value: FeedbackQuestion[]) => void
}

export function FeedbackQuestionsEditor({ value, onChange }: FeedbackQuestionsEditorProps) {
    const update = (id: string, patch: Partial<FeedbackQuestion>) =>
        onChange(value.map((q) => (q.id === id ? { ...q, ...patch } : q)))

    return (
        <Box>
            <Stack gap={3}>
                {value.map((q, index) => (
                    <Box key={q.id} p={3} borderWidth="1px" borderColor="gray.200" rounded="md">
                        <Flex gap={3} wrap="wrap" mb={3}>
                            <Field.Root flex="1 1 260px">
                                <Field.Label fontSize="sm">Spørsmål {index + 1}</Field.Label>
                                <Input
                                    value={q.label}
                                    onChange={(e) => update(q.id, { label: e.target.value })}
                                    placeholder="F.eks. Hvordan opplevde du arrangementet?"
                                />
                            </Field.Root>
                            <Field.Root flex="0 1 220px">
                                <Field.Label fontSize="sm">Svartype</Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={q.type}
                                        onChange={(e) =>
                                            update(q.id, {
                                                type: e.target.value as FeedbackQuestionType,
                                            })
                                        }
                                    >
                                        {FEEDBACK_QUESTION_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {FEEDBACK_TYPE_LABELS[t]}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        </Flex>
                        <Flex gap={2} align="center">
                            <Checkbox.Root
                                size="sm"
                                flex="1"
                                checked={q.required}
                                onCheckedChange={(details) =>
                                    update(q.id, { required: !!details.checked })
                                }
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Påkrevd</Checkbox.Label>
                            </Checkbox.Root>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(value.filter((x) => x.id !== q.id))}
                            >
                                Fjern
                            </Button>
                        </Flex>
                    </Box>
                ))}
            </Stack>

            <Button
                type="button"
                variant="outline"
                size="sm"
                mt={value.length > 0 ? 3 : 0}
                disabled={value.length >= MAX_FEEDBACK_QUESTIONS}
                onClick={() => onChange([...value, newFeedbackQuestion()])}
            >
                Legg til spørsmål
            </Button>
        </Box>
    )
}
