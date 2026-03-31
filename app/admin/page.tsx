import { createClient } from '@/utils/supabase/server'
import { Box, Heading, Table, Button, Flex, Badge, Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: events, error } = await supabase
        .from('Events')
        .select('*')
        .order('start_datetime', { ascending: false })

    if (error) {
        console.error('Error fetching events:', error)
        return <Box>Feil ved henting av arrangementer</Box>
    }

    const eventList = events ?? []
    const eventIds = eventList.map((e) => e.id)

    /** Confirmed signups only (excludes waitlist) — same filter as arrangementer/[slug]. */
    const confirmedCountByEventId = new Map<number, number>()
    if (eventIds.length > 0) {
        const { data: participantRows, error: participantsError } = await supabase
            .from('EventParticipants')
            .select('eventId')
            .in('eventId', eventIds)
            .or('status.eq.confirmed,status.is.null')

        if (participantsError) {
            console.error('Error fetching participant counts:', participantsError)
        } else {
            for (const row of participantRows ?? []) {
                const eid = row.eventId
                if (eid == null) continue
                confirmedCountByEventId.set(eid, (confirmedCountByEventId.get(eid) ?? 0) + 1)
            }
        }
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading size="xl">Arrangementer</Heading>
                <Link href="/admin/arrangement/ny">
                    <Button bg="var(--color-primary)" color="white">
                        + Nytt Arrangement
                    </Button>
                </Link>
            </Flex>

            <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                <Table.Root striped interactive>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Tittel</Table.ColumnHeader>
                            <Table.ColumnHeader>Dato</Table.ColumnHeader>
                            <Table.ColumnHeader>Påmeldte</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="right">Handlinger</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {eventList.map((event) => {
                            const startDate = new Date(event.start_datetime || '')
                            const isPast = startDate < new Date()
                            const confirmed = confirmedCountByEventId.get(event.id) ?? 0
                            const attendeesLabel =
                                event.max_attendees != null
                                    ? `${confirmed} / ${event.max_attendees}`
                                    : String(confirmed)

                            return (
                                <Table.Row key={event.id}>
                                    <Table.Cell fontWeight="medium">{event.title}</Table.Cell>
                                    <Table.Cell>
                                        {startDate.toLocaleDateString('nb-NO', {
                                            timeZone: APP_TIME_ZONE,
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Table.Cell>
                                    <Table.Cell>{attendeesLabel}</Table.Cell>
                                    <Table.Cell>
                                        <Badge colorPalette={isPast ? 'gray' : 'green'}>
                                            {isPast ? 'Fullført' : 'Kommende'}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex justify="flex-end" gap={3}>
                                            <Link href={`/admin/arrangement/${event.slug}/participants`}>
                                                <Button size="xs" variant="outline">Deltakere</Button>
                                            </Link>
                                            <Link href={`/admin/arrangement/${event.slug}`}>
                                                <Button size="xs" variant="subtle">Rediger</Button>
                                            </Link>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    )
}
