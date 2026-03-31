import { createClient } from '@/utils/supabase/server'
import { Box, Heading, Table, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'

type EventRow = {
    id: number
    title: string | null
    start_datetime: string | null
}

function formatEventDate(startDatetime: string | null) {
    if (!startDatetime) return '—'
    const d = new Date(startDatetime)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('nb-NO', {
        timeZone: APP_TIME_ZONE,
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default async function AdminAttendancePage() {
    const supabase = await createClient()

    const { data: participants, error: participantsError } = await supabase
        .from('EventParticipants')
        .select('id, name, eventId')
        .eq('attended', true)
        .neq('status', 'waitlist')
        .order('name', { ascending: true })

    if (participantsError) {
        console.error('Error fetching attendance:', participantsError)
        return <Box>Feil ved henting av oppmøte</Box>
    }

    const list = participants ?? []
    const eventIds = [
        ...new Set(
            list
                .map((p) => p.eventId)
                .filter((id): id is number => typeof id === 'number')
        ),
    ]

    let eventMap = new Map<number, EventRow>()
    if (eventIds.length > 0) {
        const { data: events, error: eventsError } = await supabase
            .from('Events')
            .select('id, title, start_datetime')
            .in('id', eventIds)

        if (eventsError) {
            console.error('Error fetching events for attendance:', eventsError)
            return <Box>Feil ved henting av arrangementer</Box>
        }
        eventMap = new Map((events ?? []).map((e) => [e.id, e]))
    }

    const rows = list
        .map((p) => {
            const ev = p.eventId != null ? eventMap.get(p.eventId) : undefined
            return {
                id: p.id,
                personName: (p.name && p.name.trim()) || '—',
                eventTitle: ev?.title?.trim() || 'Ukjent arrangement',
                startDatetime: ev?.start_datetime ?? null,
            }
        })
        .sort((a, b) => {
            const ta = a.startDatetime ? new Date(a.startDatetime).getTime() : 0
            const tb = b.startDatetime ? new Date(b.startDatetime).getTime() : 0
            if (tb !== ta) return tb - ta
            return a.personName.localeCompare(b.personName, 'nb')
        })

    return (
        <Box>
            <Heading size="xl" mb={2}>
                Registrert oppmøte
            </Heading>
            <Text color="gray.600" mb={6}>
                Personer markert som møtt (bekreftede deltakere), med arrangement og
                tidspunkt for arrangementet.{' '}
                <Link href="/admin" style={{ textDecoration: 'underline' }}>
                    Tilbake til oversikt
                </Link>
            </Text>

            {rows.length === 0 ? (
                <Text color="gray.600">Ingen registrert oppmøte ennå.</Text>
            ) : (
                <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                    <Table.Root striped interactive>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Navn</Table.ColumnHeader>
                                <Table.ColumnHeader>Arrangement</Table.ColumnHeader>
                                <Table.ColumnHeader>Dato (arrangement)</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.id}>
                                    <Table.Cell fontWeight="medium">{row.personName}</Table.Cell>
                                    <Table.Cell>{row.eventTitle}</Table.Cell>
                                    <Table.Cell>{formatEventDate(row.startDatetime)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    )
}
