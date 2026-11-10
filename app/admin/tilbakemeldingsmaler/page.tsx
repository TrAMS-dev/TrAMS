'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Field, Flex, Heading, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toaster } from '@/components/ui/toaster'
import type { Json } from '@/types/supabase'
import { FEEDBACK_TYPE_LABELS, type FeedbackQuestion, parseFeedbackQuestions } from '@/lib/eventFeedback'
import {
    FeedbackQuestionsEditor,
    newFeedbackQuestion,
} from '@/components/admin/FeedbackQuestionsEditor'

interface Template {
    id: number
    name: string
    questions: FeedbackQuestion[]
}

async function fetchTemplates(): Promise<Template[] | null> {
    const { data, error } = await createClient()
        .from('FeedbackTemplates')
        .select('id, name, questions')
        .order('name')
    if (error) {
        console.error('Error loading feedback templates:', error)
        toaster.create({ title: 'Kunne ikke hente maler', type: 'error', duration: 5000 })
        return null
    }
    return (data ?? []).map((t) => ({ ...t, questions: parseFeedbackQuestions(t.questions) }))
}

/** Which template is open for editing: a saved one by id, or 'new'. */
type Editing = { id: number | 'new'; name: string; questions: FeedbackQuestion[] } | null

/** Reusable feedback question sets that can be picked in the event form. */
export default function FeedbackTemplatesPage() {
    const router = useRouter()
    const { isAuthenticated, isApproved, isLoading: authLoading } = useAuth()
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Editing>(null)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isApproved)) router.push('/admin/login')
    }, [authLoading, isAuthenticated, isApproved, router])

    const reload = useCallback(() => {
        void fetchTemplates().then((list) => {
            if (list) setTemplates(list)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (authLoading || !isAuthenticated || !isApproved) return
        void fetchTemplates().then((list) => {
            if (list) setTemplates(list)
            setLoading(false)
        })
    }, [authLoading, isAuthenticated, isApproved])

    const save = async () => {
        if (!editing) return
        const name = editing.name.trim()
        const questions = parseFeedbackQuestions(editing.questions)
        if (!name) {
            toaster.create({ title: 'Gi malen et navn', type: 'error', duration: 5000 })
            return
        }
        if (questions.length === 0) {
            toaster.create({
                title: 'Legg til minst ett spørsmål',
                description: 'Spørsmål uten tekst blir ikke lagret.',
                type: 'error',
                duration: 5000,
            })
            return
        }

        setSaving(true)
        const supabase = createClient()
        const row = { name, questions: questions as unknown as Json }
        const { error } =
            editing.id === 'new'
                ? await supabase.from('FeedbackTemplates').insert(row)
                : await supabase
                      .from('FeedbackTemplates')
                      .update({ ...row, updated_at: new Date().toISOString() })
                      .eq('id', editing.id)
        setSaving(false)

        if (error) {
            console.error('Error saving feedback template:', error)
            toaster.create({ title: 'Kunne ikke lagre malen', type: 'error', duration: 5000 })
            return
        }
        toaster.create({ title: 'Malen er lagret', type: 'success', duration: 3000 })
        setEditing(null)
        reload()
    }

    const remove = async (template: Template) => {
        if (!window.confirm(`Slette malen «${template.name}»? Arrangementer som har brukt den, beholder spørsmålene sine.`)) {
            return
        }
        setDeletingId(template.id)
        const { error } = await createClient().from('FeedbackTemplates').delete().eq('id', template.id)
        setDeletingId(null)
        if (error) {
            console.error('Error deleting feedback template:', error)
            toaster.create({ title: 'Kunne ikke slette malen', type: 'error', duration: 5000 })
            return
        }
        setTemplates((prev) => prev.filter((t) => t.id !== template.id))
    }

    if (authLoading || loading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" />
            </Flex>
        )
    }
    if (!isAuthenticated || !isApproved) return null

    return (
        <Box maxW="800px" mx="auto">
            <Flex justify="space-between" align="center" gap={4} mb={2} wrap="wrap">
                <Heading size="lg">Maler for tilbakemelding</Heading>
                {!editing && (
                    <Button
                        bg="var(--color-primary)"
                        color="white"
                        onClick={() =>
                            setEditing({ id: 'new', name: '', questions: [newFeedbackQuestion()] })
                        }
                    >
                        Ny mal
                    </Button>
                )}
            </Flex>
            <Text color="fg.muted" mb={6}>
                Velg en mal under «Etter arrangementet» når du oppretter eller redigerer et
                arrangement. Spørsmålene kopieres inn i arrangementet, så endringer i en mal påvirker
                ikke arrangementer som allerede har brukt den.
            </Text>

            {editing && (
                <Box bg="white" p={6} rounded="lg" shadow="sm" mb={6}>
                    <Heading size="md" mb={4}>
                        {editing.id === 'new' ? 'Ny mal' : 'Rediger mal'}
                    </Heading>
                    <Stack gap={5}>
                        <Field.Root>
                            <Field.Label>Navn *</Field.Label>
                            <Input
                                value={editing.name}
                                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                placeholder="F.eks. Standard kursevaluering"
                                maxLength={100}
                            />
                        </Field.Root>
                        <FeedbackQuestionsEditor
                            value={editing.questions}
                            onChange={(questions) => setEditing({ ...editing, questions })}
                        />
                        <Flex justify="flex-end" gap={3}>
                            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
                                Avbryt
                            </Button>
                            <Button
                                loading={saving}
                                bg="var(--color-primary)"
                                color="white"
                                onClick={save}
                            >
                                Lagre mal
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            )}

            {templates.length === 0 && !editing ? (
                <Box bg="white" p={6} rounded="lg" shadow="sm">
                    <Text color="fg.muted">Ingen maler ennå. Klikk «Ny mal» for å lage den første.</Text>
                </Box>
            ) : (
                <Stack gap={3}>
                    {templates.map((t) => (
                        <Box key={t.id} bg="white" p={5} rounded="lg" shadow="sm">
                            <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
                                <Box flex="1" minW="240px">
                                    <Text fontWeight="semibold">{t.name}</Text>
                                    <Stack as="ol" gap={1} mt={2} pl={5} listStyleType="decimal">
                                        {t.questions.map((q) => (
                                            <Text as="li" key={q.id} fontSize="sm" color="gray.700">
                                                {q.label}
                                                <Text as="span" color="fg.muted">
                                                    {' '}
                                                    · {FEEDBACK_TYPE_LABELS[q.type]}
                                                    {q.required ? ', påkrevd' : ''}
                                                </Text>
                                            </Text>
                                        ))}
                                    </Stack>
                                </Box>
                                <Flex gap={2}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={editing !== null}
                                        onClick={() =>
                                            setEditing({ id: t.id, name: t.name, questions: t.questions })
                                        }
                                    >
                                        Rediger
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorPalette="red"
                                        loading={deletingId === t.id}
                                        disabled={editing !== null}
                                        onClick={() => remove(t)}
                                    >
                                        Slett
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    )
}
