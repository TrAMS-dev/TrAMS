'use client'

import { useState } from 'react'
import { Dialog, Button, Stack, Box, Text, Textarea, Flex } from '@chakra-ui/react'
import type { Tables } from '@/types/supabase'
import { toaster } from '@/components/ui/toaster'

export type ParticipantComment = Tables<'ParticipantComments'>

interface ParticipantCommentsDialogProps {
    participant: Tables<'EventParticipants'> | null
    comments: ParticipantComment[]
    currentUserId: string | null
    onClose: () => void
    onAdded: (comment: ParticipantComment) => void
    onDeleted: (commentId: number) => void
}

export default function ParticipantCommentsDialog({
    participant,
    comments,
    currentUserId,
    onClose,
    onAdded,
    onDeleted,
}: ParticipantCommentsDialogProps) {
    const [draft, setDraft] = useState('')
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleClose = () => {
        setDraft('')
        onClose()
    }

    const handleSubmit = async () => {
        if (!participant || !draft.trim()) return

        setSaving(true)
        try {
            const res = await fetch('/api/admin/event-participants/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId: participant.id, body: draft }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
                comment?: ParticipantComment
            }

            if (!res.ok || !payload.comment) {
                throw new Error(payload.error || 'Kunne ikke lagre kommentar')
            }

            onAdded(payload.comment)
            setDraft('')
        } catch (e) {
            console.error('Error adding comment:', e)
            toaster.create({
                title: 'Kunne ikke lagre kommentar',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 5000,
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (commentId: number) => {
        if (!window.confirm('Slette denne kommentaren?')) return

        setDeletingId(commentId)
        try {
            const res = await fetch('/api/admin/event-participants/comments', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId }),
            })
            const payload = (await res.json().catch(() => ({}))) as { error?: string }

            if (!res.ok) {
                throw new Error(payload.error || 'Kunne ikke slette kommentar')
            }

            onDeleted(commentId)
        } catch (e) {
            console.error('Error deleting comment:', e)
            toaster.create({
                title: 'Kunne ikke slette kommentar',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 5000,
            })
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Dialog.Root
            open={participant !== null}
            onOpenChange={({ open: isOpen }) => !isOpen && handleClose()}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="lg">
                    <Dialog.Header>
                        <Dialog.Title>
                            Kommentarer: {participant?.name?.trim() || participant?.email || 'Deltaker'}
                        </Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <Dialog.Body>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                            Kommentarer er kun synlige for administratorer, ikke for deltakeren.
                        </Text>

                        <Stack gap={3} mb={4} maxH="50vh" overflowY="auto">
                            {comments.length === 0 && (
                                <Text color="gray.500" fontSize="sm">
                                    Ingen kommentarer enda.
                                </Text>
                            )}
                            {comments.map((c) => (
                                <Box key={c.id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                                    <Flex justify="space-between" align="baseline" gap={2} mb={1}>
                                        <Text fontSize="sm" fontWeight="semibold">
                                            {c.author_name || 'Ukjent'}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {new Date(c.created_at).toLocaleString('nb-NO')}
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" whiteSpace="pre-wrap">
                                        {c.body}
                                    </Text>
                                    {currentUserId && c.author_id === currentUserId && (
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            colorPalette="red"
                                            mt={1}
                                            loading={deletingId === c.id}
                                            disabled={deletingId !== null}
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            Slett
                                        </Button>
                                    )}
                                </Box>
                            ))}
                        </Stack>

                        <Textarea
                            placeholder="Skriv en kommentar…"
                            value={draft}
                            maxLength={2000}
                            rows={3}
                            onChange={(e) => setDraft(e.target.value)}
                        />
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={handleClose}>
                            Lukk
                        </Button>
                        <Button
                            colorPalette="blue"
                            loading={saving}
                            disabled={!draft.trim() || saving}
                            onClick={handleSubmit}
                        >
                            Legg til kommentar
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
