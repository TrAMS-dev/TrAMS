'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Heading,
    Table,
    Button,
    Spinner,
    Flex,
    Badge,
    NativeSelect,
    Text,
    Input,
    Field,
    HStack,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'
import { toaster } from '@/components/ui/toaster'
import { useAuth } from '@/hooks/useAuth'
import ExportParticipantsDialog from '@/components/admin/ExportParticipantsDialog'

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
    const { isAuthenticated, isApproved, isLoading: authLoading } = useAuth()
    const [participants, setParticipants] = useState<Tables<'EventParticipants'>[]>([])
    const [eventId, setEventId] = useState<number | null>(null)
    const [eventTitle, setEventTitle] = useState('')
    const [eventMaxAttendees, setEventMaxAttendees] = useState<number | null>(null)
    const [eventCustomQuestion, setEventCustomQuestion] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [promoteCountInput, setPromoteCountInput] = useState('1')
    const [promoting, setPromoting] = useState(false)
    const [promotingId, setPromotingId] = useState<number | null>(null)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)

    const attendanceSummary = useMemo(() => {
        const confirmed = participants.filter(isConfirmedParticipant)
        const attended = confirmed.filter((p) => p.attended === true).length
        return { confirmedCount: confirmed.length, attendedCount: attended }
    }, [participants])

    const waitlistCount = useMemo(
        () => participants.filter((p) => p.status === 'waitlist').length,
        [participants]
    )

    const memberStatusSummary = useMemo(() => {
        let asMember = 0
        let notAsMember = 0
        let unknown = 0
        for (const p of participants) {
            if (p.confirmed_trams_member === true) asMember++
            else if (p.confirmed_trams_member === false) notAsMember++
            else unknown++
        }
        return { asMember, notAsMember, unknown }
    }, [participants])

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isApproved)) {
            router.push('/admin/login')
        }
    }, [authLoading, isAuthenticated, isApproved, router])

    useEffect(() => {
        if (authLoading || !isAuthenticated || !isApproved) return

        const fetchData = async () => {
            const supabase = createClient()

            // Get event id first
            const { data: event, error: eventError } = await supabase
                .from('Events')
                .select('id, title, max_attendees, custom_question')
                .eq('slug', slug)
                .single()

            if (eventError || !event) {
                console.error('Error fetching event:', eventError)
                return
            }

            setEventId(event.id)
            setEventTitle(event.title || 'Arrangement')
            setEventMaxAttendees(event.max_attendees ?? null)
            setEventCustomQuestion(event.custom_question ?? null)

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
    }, [slug, authLoading, isAuthenticated, isApproved])

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
        try {
            const res = await fetch('/api/admin/event-participants/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
            }

            if (!res.ok) {
                throw new Error(payload.error || 'Kunne ikke fjerne deltaker')
            }

            setParticipants((prev) => prev.filter((p) => p.id !== participantId))
            toaster.create({
                title: 'Deltaker fjernet',
                type: 'success',
                duration: 4000,
            })
        } catch (e) {
            console.error('Error removing participant:', e)
            toaster.create({
                title: 'Kunne ikke fjerne deltaker',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 5000,
            })
        } finally {
            setDeletingId(null)
        }
    }

    const handlePromoteWaitlist = async () => {
        if (eventId == null || waitlistCount === 0) return

        const parsed = Number.parseInt(promoteCountInput.trim(), 10)
        if (!Number.isFinite(parsed) || parsed < 1) {
            toaster.create({
                title: 'Ugyldig antall',
                description: 'Oppgi hvor mange som skal flyttes opp fra ventelisten (heltall minst 1).',
                type: 'error',
                duration: 5000,
            })
            return
        }

        const firstN = Math.min(parsed, waitlistCount)
        const ok = window.confirm(
            `Flytt de første ${firstN} på ventelisten til bekreftet plass? De vil motta e-post om at de har fått plass.`
        )
        if (!ok) return

        setPromoting(true)
        try {
            const res = await fetch('/api/admin/event-participants/promote-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, count: parsed }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
                promoted?: number
                participantIds?: number[]
            }

            if (!res.ok) {
                throw new Error(payload.error || 'Kunne ikke flytte opp fra venteliste')
            }

            const n = typeof payload.promoted === 'number' ? payload.promoted : 0
            const promotedIds = new Set(payload.participantIds ?? [])
            if (n > 0) {
                setParticipants((prev) =>
                    prev.map((p) =>
                        promotedIds.has(p.id) ? { ...p, status: 'confirmed' } : p
                    )
                )
            }
            toaster.create({
                title: n > 0 ? 'Flyttet opp fra venteliste' : 'Ingen ble flyttet opp',
                description:
                    n > 0
                        ? `${n} deltaker(e) har fått bekreftet plass og har mottatt e-post.`
                        : eventMaxAttendees == null
                          ? 'Ingen på ventelisten med gyldig e-post, eller noe gikk galt.'
                          : 'Ingen ledige plasser, eller ingen på ventelisten med gyldig e-post.',
                type: n > 0 ? 'success' : 'warning',
                duration: 7000,
            })
        } catch (e) {
            console.error('Promote waitlist error:', e)
            toaster.create({
                title: 'Kunne ikke flytte opp fra venteliste',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 6000,
            })
        } finally {
            setPromoting(false)
        }
    }

    const handlePromoteParticipant = async (participantId: number, displayName: string) => {
        const ok = window.confirm(
            `Flytt «${displayName}» fra venteliste til bekreftet plass? Dette kan gjøres selv om arrangementet er fullt eller påmeldingen er stengt, og vedkommende vil motta e-post om at de har fått plass.`
        )
        if (!ok) return

        setPromotingId(participantId)
        try {
            const res = await fetch('/api/admin/event-participants/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
                promoted?: number
            }

            if (!res.ok) {
                throw new Error(payload.error || 'Kunne ikke flytte opp deltakeren')
            }

            const n = typeof payload.promoted === 'number' ? payload.promoted : 0
            if (n > 0) {
                setParticipants((prev) =>
                    prev.map((p) => (p.id === participantId ? { ...p, status: 'confirmed' } : p))
                )
                toaster.create({
                    title: 'Flyttet opp fra venteliste',
                    description: `${displayName} har fått bekreftet plass og har mottatt e-post.`,
                    type: 'success',
                    duration: 5000,
                })
            } else {
                toaster.create({
                    title: 'Ingen endring',
                    description: 'Deltakeren sto ikke lenger på venteliste.',
                    type: 'warning',
                    duration: 5000,
                })
            }
        } catch (e) {
            console.error('Promote participant error:', e)
            toaster.create({
                title: 'Kunne ikke flytte opp deltakeren',
                description:
                    e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 6000,
            })
        } finally {
            setPromotingId(null)
        }
    }

    if (authLoading || loading) return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>

    if (!isAuthenticated || !isApproved) return null

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Button size="sm" variant="ghost" mb={2} onClick={() => router.push('/admin')}>
                        &larr; Tilbake til oversikt
                    </Button>
                    <Heading size="lg">Deltakere: {eventTitle}</Heading>
                </Box>
                <Button
                    onClick={() => setExportDialogOpen(true)}
                    variant="outline"
                    disabled={participants.length === 0}
                >
                    Eksporter CSV
                </Button>
            </Flex>

            {participants.length > 0 && (
                <Box mb={4}>
                    <Text color="gray.600" mb={1}>
                        <Text as="span" fontWeight="semibold" color="green.700">
                            TrAMS-medlem: {memberStatusSummary.asMember}
                        </Text>
                        {' · '}
                        <Text as="span" fontWeight="semibold" color="orange.800">
                            Ikke medlem: {memberStatusSummary.notAsMember}
                        </Text>
                        {memberStatusSummary.unknown > 0 && (
                            <>
                                {' · '}
                                <Text as="span" fontWeight="medium" color="gray.600">
                                    Ukjent : {memberStatusSummary.unknown}
                                </Text>
                            </>
                        )}
                    </Text>
                    <Text color="gray.600">
                        Oppmøte (bekreftede): {attendanceSummary.attendedCount} av{' '}
                        {attendanceSummary.confirmedCount} registrert som møtt
                    </Text>
                </Box>
            )}

            {waitlistCount > 0 && eventId != null && (
                <Box
                    mb={4}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="orange.200"
                    bg="orange.50"
                >
                    <Text fontWeight="semibold" mb={1}>
                        Venteliste ({waitlistCount})
                    </Text>
                    <Text fontSize="sm" color="gray.700" mb={3}>
                        Flytt de første på ventelisten (i påmeldingsrekkefølge) direkte til
                        bekreftet plass, f.eks. etter avmelding eller økt kapasitet. Du kan
                        oppgi flere enn det er ledige plasser for å bevisst overfylle
                        arrangementet, og dette fungerer uavhengig av om påmeldingen er åpen.
                        De som flyttes opp får automatisk e-post om at de har fått plass. Du kan
                        også flytte opp enkeltpersoner direkte fra tabellen under.
                    </Text>
                    <HStack flexWrap="wrap" gap={3} align="flex-end">
                        <Field.Root maxW="200px">
                            <Field.Label fontSize="sm">Antall som skal flyttes opp</Field.Label>
                            <Input
                                type="number"
                                min={1}
                                value={promoteCountInput}
                                onChange={(e) => setPromoteCountInput(e.target.value)}
                            />
                        </Field.Root>
                        <Button
                            loading={promoting}
                            disabled={promoting || deletingId !== null || promotingId !== null}
                            colorPalette="orange"
                            onClick={handlePromoteWaitlist}
                        >
                            Flytt opp fra venteliste
                        </Button>
                    </HStack>
                </Box>
            )}

            <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                <Table.Root striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Navn</Table.ColumnHeader>
                            <Table.ColumnHeader>E-post</Table.ColumnHeader>
                            <Table.ColumnHeader>Kull</Table.ColumnHeader>
                            <Table.ColumnHeader>Allergier</Table.ColumnHeader>
                            <Table.ColumnHeader maxW="200px">
                                Medlemskap (selvrapportert)
                            </Table.ColumnHeader>
                            {eventCustomQuestion && (
                                <Table.ColumnHeader maxW="200px">
                                    {eventCustomQuestion}
                                </Table.ColumnHeader>
                            )}
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Oppmøte</Table.ColumnHeader>
                            <Table.ColumnHeader>Påmeldt</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="right">Handling</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {participants.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={eventCustomQuestion ? 10 : 9} textAlign="center" py={8} color="gray.500">
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
                                    {p.confirmed_trams_member === true ? (
                                        <Badge colorPalette="green" size="lg">
                                            TrAMS-medlem
                                        </Badge>
                                    ) : p.confirmed_trams_member === false ? (
                                        <Badge colorPalette="orange" size="lg" variant="solid">
                                            Ikke medlem
                                        </Badge>
                                    ) : (
                                        <Badge colorPalette="gray" variant="outline">
                                            Ukjent
                                        </Badge>
                                    )}
                                </Table.Cell>
                                {eventCustomQuestion && (
                                    <Table.Cell>
                                        {p.custom_question_response ? (
                                            <Badge colorPalette="green" size="lg">
                                                Ja
                                            </Badge>
                                        ) : (
                                            <Badge colorPalette="gray" variant="outline" size="lg">
                                                Nei
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                )}
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
                                    {p.status === 'waitlist' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorPalette="orange"
                                            mr={2}
                                            loading={promotingId === p.id}
                                            disabled={
                                                promotingId !== null ||
                                                deletingId !== null ||
                                                promoting
                                            }
                                            onClick={() =>
                                                handlePromoteParticipant(
                                                    p.id,
                                                    p.name?.trim() || p.email || 'Deltaker'
                                                )
                                            }
                                        >
                                            Flytt opp
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorPalette="red"
                                        loading={deletingId === p.id}
                                        disabled={deletingId !== null || promotingId !== null}
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

            <ExportParticipantsDialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                participants={participants}
                eventCustomQuestion={eventCustomQuestion}
                slug={slug}
            />
        </Box>
    )
}
