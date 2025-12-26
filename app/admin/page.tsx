import { createClient } from '@/utils/supabase/server'
import { Box, Heading, Table, Button, Flex, Badge, Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'

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
                        {events?.map((event) => {
                            const startDate = new Date(event.start_datetime || '')
                            const isPast = startDate < new Date()

                            return (
                                <Table.Row key={event.id}>
                                    <Table.Cell fontWeight="medium">{event.title}</Table.Cell>
                                    <Table.Cell>
                                        {startDate.toLocaleDateString('nb-NO', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {/* Placeholder for count - would need a join or separate query in real app for efficiency if list is long */}
                                        {event.max_attendees ? `? / ${event.max_attendees}` : '?'}
                                    </Table.Cell>
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
