'use client'

import { useState, useEffect, useMemo } from 'react'
import { Box, Heading, Table, Button, Spinner, Flex, Badge, NativeSelect, Text } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'
import { toaster } from '@/components/ui/toaster'

function isConfirmedParticipant(p: Tables<'EventParticipants'>) {
    return p.status !== 'waitlist'
}

function attendedSelectValue(attended: boolean | null) {
    if (attended === null) return ''
    return attended ? 'true' : 'false'
}

function parseAttended(value: string): boolean | null {
    if (value === '') return null
    return value === 'true'
}

export default function AdminParticipantsPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const [participants, setParticipants] = useState<Tables<'EventParticipants'>[]>([])
    const [eventTitle, setEventTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const attendanceSummary = useMemo(() => {
        const confirmed = participants.filter(isConfirmedParticipant)
        const attended = confirmed.filter((p) => p.attended === true).length
        return { confirmedCount: confirmed.length, attendedCount: attended }
    }, [participants])

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()

            // Get event id first
            const { data: event, error: eventError } = await supabase
                .from('Events')
                .select('id, title')
                .eq('slug', slug)
                .single()

            if (eventError || !event) {
                console.error('Error fetching event:', eventError)
                return
            }

            setEventTitle(event.title || 'Arrangement')

            // Get participants
            const { data, error } = await supabase
                .from('EventParticipants')
                .select('*')
                .eq('eventId', event.id)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching participants:', error)
            } else {
                setParticipants(data || [])
            }
            setLoading(false)
        }

        fetchData()
    }, [slug])

    const handleAttendanceChange = async (
        participantId: number,
        value: string
    ) => {
        const attended = parseAttended(value)
        const previous = participants.find((p) => p.id === participantId)?.attended ?? null

        setParticipants((prev) =>
            prev.map((p) => (p.id === participantId ? { ...p, attended } : p))
        )
        setSavingId(participantId)

        try {
            const res = await fetch('/api/admin/event-participants/attendance', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId, attended }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
                participant?: { id: number; attended: boolean | null }
            }

            if (!res.ok) {
                throw new Error(payload.error || 'Kunne ikke lagre oppmøte')
            }

            if (payload.participant) {
                setParticipants((prev) =>
                    prev.map((p) =>
                        p.id === participantId
                            ? { ...p, attended: payload.participant!.attended }
                            : p
                    )
                )
            }
        } catch (e) {
            console.error('Error updating attendance:', e)
            setParticipants((prev) =>
                prev.map((p) =>
                    p.id === participantId ? { ...p, attended: previous } : p
                )
            )
            toaster.create({
                title: 'Kunne ikke lagre oppmøte',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 7000,
            })
        } finally {
            setSavingId(null)
        }
    }

    const handleRemoveParticipant = async (participantId: number, displayName: string) => {
        const ok = window.confirm(
            `Fjerne «${displayName}» fra arrangementet? Dette kan ikke angres.`
        )
        if (!ok) return

        setDeletingId(participantId)
        const supabase = createClient()
        const { error } = await supabase
            .from('EventParticipants')
            .delete()
            .eq('id', participantId)

        if (error) {
            console.error('Error removing participant:', error)
            const description =
                typeof error.message === 'string' ? error.message : undefined
            toaster.create({
                title: 'Kunne ikke fjerne deltaker',
                description,
                type: 'error',
                duration: 5000,
            })
        } else {
            setParticipants((prev) => prev.filter((p) => p.id !== participantId))
            toaster.create({
                title: 'Deltaker fjernet',
                type: 'success',
                duration: 4000,
            })
        }
        setDeletingId(null)
    }

    const handleExport = () => {
        // Simple CSV export
        const headers = [
            'Navn',
            'E-post',
            'Kull',
            'Allergier',
            'Status',
            'Oppmøte',
            'Påmeldt',
        ]
        const oppmoteLabel = (p: Tables<'EventParticipants'>) => {
            if (p.attended === true) return 'Møtt'
            if (p.attended === false) return 'Ikke møtt'
            return 'Ikke registrert'
        }
        const csvContent = [
            headers.join(','),
            ...participants.map(p => [
                `"${p.name}"`,
                `"${p.email}"`,
                `"${p.kull}"`,
                `"${p.allergies || ''}"`,
                `"${p.status === 'waitlist' ? 'Venteliste' : 'Påmeldt'}"`,
                `"${oppmoteLabel(p)}"`,
                `"${new Date(p.created_at).toLocaleString()}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${slug}-deltakere.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Button size="sm" variant="ghost" mb={2} onClick={() => router.push('/admin')}>
                        &larr; Tilbake til oversikt
                    </Button>
                    <Heading size="lg">Deltakere: {eventTitle}</Heading>
                </Box>
                <Button onClick={handleExport} variant="outline" disabled={participants.length === 0}>
                    Eksporter CSV
                </Button>
            </Flex>

            {participants.length > 0 && (
                <Text color="gray.600" mb={4}>
                    Oppmøte (bekreftede): {attendanceSummary.attendedCount} av{' '}
                    {attendanceSummary.confirmedCount} registrert som møtt
                </Text>
            )}

            <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                <Table.Root striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Navn</Table.ColumnHeader>
                            <Table.ColumnHeader>E-post</Table.ColumnHeader>
                            <Table.ColumnHeader>Kull</Table.ColumnHeader>
                            <Table.ColumnHeader>Allergier</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Oppmøte</Table.ColumnHeader>
                            <Table.ColumnHeader>Påmeldt</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="right">Handling</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {participants.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={8} textAlign="center" py={8} color="gray.500">
                                    Ingen påmeldte enda.
                                </Table.Cell>
                            </Table.Row>
                        )}
                        {participants.map((p) => (
                            <Table.Row key={p.id}>
                                <Table.Cell fontWeight="medium">{p.name}</Table.Cell>
                                <Table.Cell>{p.email}</Table.Cell>
                                <Table.Cell>{p.kull}</Table.Cell>
                                <Table.Cell>{p.allergies || '-'}</Table.Cell>
                                <Table.Cell>
                                    {p.status === 'waitlist' ? (
                                        <Badge colorPalette="orange">Venteliste</Badge>
                                    ) : (
                                        <Badge colorPalette="green">Påmeldt</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell maxW="200px">
                                    <NativeSelect.Root
                                        size="sm"
                                        w="full"
                                        opacity={savingId === p.id ? 0.6 : 1}
                                        pointerEvents={savingId === p.id ? 'none' : 'auto'}
                                    >
                                        <NativeSelect.Field
                                            value={attendedSelectValue(p.attended ?? null)}
                                            onChange={(e) =>
                                                handleAttendanceChange(p.id, e.target.value)
                                            }
                                        >
                                            <option value="">Ikke registrert</option>
                                            <option value="true">Møtt</option>
                                            <option value="false">Ikke møtt</option>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Table.Cell>
                                <Table.Cell color="gray.500" fontSize="sm">
                                    {new Date(p.created_at).toLocaleString('nb-NO')}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorPalette="red"
                                        loading={deletingId === p.id}
                                        disabled={deletingId !== null}
                                        onClick={() =>
                                            handleRemoveParticipant(
                                                p.id,
                                                p.name?.trim() || p.email || 'Deltaker'
                                            )
                                        }
                                    >
                                        Fjern
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    )
}
