'use client'

import { useState } from 'react'
import { Button, Dialog, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'

interface DeleteEventButtonProps {
    eventId: number
    eventTitle: string
    participantCount: number
}

export function DeleteEventButton({ eventId, eventTitle, participantCount }: DeleteEventButtonProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch('/api/events/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }),
            })
            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                toaster.create({
                    title: 'Kunne ikke slette arrangement',
                    description: data.error,
                    type: 'error',
                    duration: 5000,
                })
                return
            }

            toaster.create({
                title: 'Arrangement slettet',
                type: 'success',
                duration: 5000,
            })
            setOpen(false)
            router.refresh()
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Button size="xs" variant="outline" colorPalette="red" onClick={() => setOpen(true)}>
                Slett
            </Button>

            <Dialog.Root
                open={open}
                onOpenChange={({ open: isOpen }) => !isOpen && !isDeleting && setOpen(false)}
                role="alertdialog"
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="md">
                        <Dialog.Header>
                            <Dialog.Title>Slette arrangement?</Dialog.Title>
                            <Dialog.CloseTrigger />
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Er du sikker på at du vil slette <strong>{eventTitle}</strong>?
                                Dette kan ikke angres.
                            </Text>
                            {participantCount > 0 && (
                                <Text mt={3} color="red.600">
                                    Arrangementet har {participantCount} påmeldte. Alle påmeldinger
                                    slettes også, og deltakerne får ikke beskjed automatisk.
                                </Text>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                                Avbryt
                            </Button>
                            <Button colorPalette="red" onClick={handleDelete} loading={isDeleting}>
                                Slett arrangement
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}
