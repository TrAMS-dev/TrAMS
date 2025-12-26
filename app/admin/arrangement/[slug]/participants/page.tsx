'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Table, Button, Spinner, Flex } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'

export default function AdminParticipantsPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const [participants, setParticipants] = useState<Tables<'EventParticipants'>[]>([])
    const [eventTitle, setEventTitle] = useState('')
    const [loading, setLoading] = useState(true)

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

    const handleExport = () => {
        // Simple CSV export
        const headers = ['Navn', 'E-post', 'Kull', 'Allergier', 'Påmeldt']
        const csvContent = [
            headers.join(','),
            ...participants.map(p => [
                `"${p.name}"`,
                `"${p.email}"`,
                `"${p.kull}"`,
                `"${p.allergies || ''}"`,
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

            <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                <Table.Root striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Navn</Table.ColumnHeader>
                            <Table.ColumnHeader>E-post</Table.ColumnHeader>
                            <Table.ColumnHeader>Kull</Table.ColumnHeader>
                            <Table.ColumnHeader>Allergier</Table.ColumnHeader>
                            <Table.ColumnHeader>Påmeldt</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {participants.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={5} textAlign="center" py={8} color="gray.500">
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
                                <Table.Cell color="gray.500" fontSize="sm">
                                    {new Date(p.created_at).toLocaleString('nb-NO')}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    )
}
