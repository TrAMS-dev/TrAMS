'use client'

import { Dialog, Button, Badge, Wrap, Text, Box, Stack } from '@chakra-ui/react'
import type { Tables } from '@/types/supabase'

export type PublicParticipantRow = Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'kull'>

interface EventParticipantListDialogProps {
    open: boolean
    onClose: () => void
    confirmedParticipants: PublicParticipantRow[]
    waitlistParticipants: PublicParticipantRow[]
}

function formatParticipantLabel(p: PublicParticipantRow) {
    const name = (p.name ?? 'Uten navn').trim() || 'Uten navn'
    const kull = p.kull != null ? ` - kull ${p.kull}` : ''
    return `${name}${kull}`
}

export default function EventParticipantListDialog({
    open,
    onClose,
    confirmedParticipants,
    waitlistParticipants,
}: EventParticipantListDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={({ open: isOpen }) => !isOpen && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="lg">
                    <Dialog.Header>
                        <Dialog.Title>Påmeldte og venteliste</Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <Dialog.Body>
                        <Box maxH="60vh" overflowY="auto" pr={1}>
                            <Stack gap={6}>
                                {confirmedParticipants.length > 0 && (
                                    <Box>
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color="gray.500"
                                            textTransform="uppercase"
                                            letterSpacing="0.05em"
                                            mb={2}
                                        >
                                            Påmeldte
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" mb={3}>
                                            Bekreftede plasser.
                                        </Text>
                                        <Wrap gap={2}>
                                            {confirmedParticipants.map((p) => (
                                                <Badge
                                                    key={p.id}
                                                    size="md"
                                                    variant="subtle"
                                                    colorPalette="gray"
                                                    px={3}
                                                    py={1}
                                                >
                                                    {formatParticipantLabel(p)}
                                                </Badge>
                                            ))}
                                        </Wrap>
                                    </Box>
                                )}

                                {waitlistParticipants.length > 0 && (
                                    <Box
                                        borderTopWidth={
                                            confirmedParticipants.length > 0 ? '1px' : undefined
                                        }
                                        borderColor="gray.200"
                                        pt={confirmedParticipants.length > 0 ? 6 : 0}
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color="gray.500"
                                            textTransform="uppercase"
                                            letterSpacing="0.05em"
                                            mb={2}
                                        >
                                            Venteliste
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" mb={3}>
                                            Meldt på når arrangementet var fullt.
                                        </Text>
                                        <Wrap gap={2}>
                                            {waitlistParticipants.map((p) => (
                                                <Badge
                                                    key={p.id}
                                                    size="md"
                                                    variant="subtle"
                                                    colorPalette="orange"
                                                    px={3}
                                                    py={1}
                                                >
                                                    {formatParticipantLabel(p)}
                                                </Badge>
                                            ))}
                                        </Wrap>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={onClose}>
                            Lukk
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
