'use client'

import { Box, Button, Checkbox, Field, Flex, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import {
    MAX_SIGNUP_QUESTIONS,
    SIGNUP_QUESTION_TYPES,
    SIGNUP_QUESTION_TYPE_LABELS,
    type SignupQuestion,
    type SignupQuestionType,
    cleanOptions,
    isChoiceQuestion,
} from '@/lib/signupQuestions'

/** Spørsmål slik det redigeres i skjemaet; alternativene skrives ett per linje. */
export type SignupQuestionDraft = Omit<SignupQuestion, 'options'> & { optionsText: string }

export function questionToDraft(q: SignupQuestion): SignupQuestionDraft {
    const { options, ...rest } = q
    return { ...rest, optionsText: options.join('\n') }
}

export function draftToQuestion(d: SignupQuestionDraft): SignupQuestion {
    const { optionsText, ...rest } = d
    return {
        ...rest,
        label: d.label.trim(),
        options: isChoiceQuestion(d.type) ? cleanOptions(optionsText.split('\n')) : [],
    }
}

function newDraft(): SignupQuestionDraft {
    return { id: crypto.randomUUID(), type: 'checkbox', label: '', required: false, optionsText: '' }
}

const PLACEHOLDERS: Record<SignupQuestionType, string> = {
    checkbox: 'F.eks. Har du deltatt på kurset tidligere?',
    text: 'F.eks. Hvem deler du bil med?',
    single_choice: 'F.eks. Hvilken gruppe er du i?',
    multi_choice: 'F.eks. Hvilke stasjoner vil du være med på?',
}

interface SignupQuestionsEditorProps {
    value: SignupQuestionDraft[]
    onChange: (value: SignupQuestionDraft[]) => void
}

export function SignupQuestionsEditor({ value, onChange }: SignupQuestionsEditorProps) {
    const update = (index: number, change: Partial<SignupQuestionDraft>) =>
        onChange(value.map((q, i) => (i === index ? { ...q, ...change } : q)))

    const move = (index: number, offset: -1 | 1) => {
        const next = [...value]
        const [q] = next.splice(index, 1)
        next.splice(index + offset, 0, q)
        onChange(next)
    }

    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
                Spørsmål ved påmelding
            </Text>
            <Text fontSize="xs" color="fg.muted" mb={3}>
                Valgfritt. Deltakerne svarer på spørsmålene når de melder seg på, og svarene vises
                i deltakerlisten.
            </Text>

            <Stack gap={3}>
                {value.map((q, index) => (
                    <Box key={q.id} p={3} borderWidth="1px" borderColor="gray.200" rounded="md">
                        <Flex gap={3} wrap="wrap" mb={3}>
                            <Field.Root flex="1 1 260px">
                                <Field.Label fontSize="sm">Spørsmål {index + 1}</Field.Label>
                                <Input
                                    value={q.label}
                                    onChange={(e) => update(index, { label: e.target.value })}
                                    placeholder={PLACEHOLDERS[q.type]}
                                />
                            </Field.Root>
                            <Field.Root flex="0 1 220px">
                                <Field.Label fontSize="sm">Svartype</Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={q.type}
                                        onChange={(e) =>
                                            update(index, {
                                                type: e.target.value as SignupQuestionType,
                                            })
                                        }
                                    >
                                        {SIGNUP_QUESTION_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {SIGNUP_QUESTION_TYPE_LABELS[type]}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>
                        </Flex>

                        {isChoiceQuestion(q.type) && (
                            <Field.Root mb={3}>
                                <Field.Label fontSize="sm">Alternativer</Field.Label>
                                <Textarea
                                    value={q.optionsText}
                                    onChange={(e) => update(index, { optionsText: e.target.value })}
                                    placeholder={'Gruppe 1\nGruppe 2\nGruppe 3'}
                                    rows={4}
                                />
                                <Field.HelperText>Ett alternativ per linje.</Field.HelperText>
                            </Field.Root>
                        )}

                        <Flex gap={2} align="center" wrap="wrap">
                            <Checkbox.Root
                                size="sm"
                                flex="1"
                                checked={q.required}
                                onCheckedChange={(details) =>
                                    update(index, { required: !!details.checked })
                                }
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>
                                    {q.type === 'checkbox'
                                        ? 'Må krysses av for å melde seg på'
                                        : 'Påkrevd'}
                                </Checkbox.Label>
                            </Checkbox.Root>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={index === 0}
                                onClick={() => move(index, -1)}
                                aria-label={`Flytt spørsmål ${index + 1} opp`}
                            >
                                ↑
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={index === value.length - 1}
                                onClick={() => move(index, 1)}
                                aria-label={`Flytt spørsmål ${index + 1} ned`}
                            >
                                ↓
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(value.filter((_, i) => i !== index))}
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
                disabled={value.length >= MAX_SIGNUP_QUESTIONS}
                onClick={() => onChange([...value, newDraft()])}
            >
                Legg til spørsmål
            </Button>
        </Box>
    )
}
