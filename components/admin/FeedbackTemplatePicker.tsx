'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { Field, NativeSelect } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import {
    type FeedbackQuestion,
    newFeedbackQuestionId,
    parseFeedbackQuestions,
} from '@/lib/eventFeedback'

interface Template {
    id: number
    name: string
    questions: FeedbackQuestion[]
}

interface FeedbackTemplatePickerProps {
    /** The event's current questions, to ask before replacing them. */
    currentQuestions: FeedbackQuestion[]
    onApply: (questions: FeedbackQuestion[]) => void
}

/** Copies a saved template's questions into the event's feedback form. */
export function FeedbackTemplatePicker({ currentQuestions, onApply }: FeedbackTemplatePickerProps) {
    const [templates, setTemplates] = useState<Template[] | null>(null)

    useEffect(() => {
        createClient()
            .from('FeedbackTemplates')
            .select('id, name, questions')
            .order('name')
            .then(({ data, error }) => {
                if (error) console.error('Error loading feedback templates:', error)
                setTemplates(
                    (data ?? []).map((t) => ({
                        ...t,
                        questions: parseFeedbackQuestions(t.questions),
                    }))
                )
            })
    }, [])

    const apply = (id: string) => {
        const template = templates?.find((t) => String(t.id) === id)
        if (!template) return
        const hasWritten = currentQuestions.some((q) => q.label.trim() !== '')
        if (
            hasWritten &&
            !window.confirm(`Erstatte spørsmålene med malen «${template.name}»?`)
        ) {
            return
        }
        // New ids so the event's questions are its own copy
        onApply(template.questions.map((q) => ({ ...q, id: newFeedbackQuestionId() })))
    }

    return (
        <Field.Root>
            <Field.Label>Start fra mal</Field.Label>
            <NativeSelect.Root disabled={!templates || templates.length === 0}>
                <NativeSelect.Field
                    value=""
                    onChange={(e) => apply(e.target.value)}
                >
                    <option value="">
                        {templates === null
                            ? 'Henter maler …'
                            : templates.length === 0
                              ? 'Ingen maler ennå'
                              : 'Velg en mal …'}
                    </option>
                    {templates?.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name} ({t.questions.length} spørsmål)
                        </option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.HelperText>
                Kopierer spørsmålene inn her, så du kan tilpasse dem for dette arrangementet.{' '}
                <NextLink
                    href="/admin/tilbakemeldingsmaler"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                >
                    Lag eller rediger maler
                </NextLink>
            </Field.HelperText>
        </Field.Root>
    )
}
