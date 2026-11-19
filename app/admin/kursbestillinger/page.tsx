'use client'

import { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Table,
    Badge,
    Text,
    Container,
    Spinner,
    Stack,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { Tables } from '@/types/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminKursbestillingerPage() {
    const { canViewBookings, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [submissions, setSubmissions] = useState<Tables<'CourseSubmissions'>[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !canViewBookings)) {
            router.push('/admin')
            router.refresh()
        }
    }, [authLoading, isAuthenticated, canViewBookings, router])

    useEffect(() => {
        if (!canViewBookings) return

        const fetchSubmissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('CourseSubmissions')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setSubmissions(data || [])
            } catch (error) {
                console.error('Error fetching course submissions:', error)
                setLoadError('Kunne ikke laste kursbestillinger')
            } finally {
                setIsLoading(false)
            }
        }
        void fetchSubmissions()
    }, [canViewBookings, supabase])

    if (isLoading || authLoading) {
        return (
            <Container centerContent py={10}>
                <Spinner size="xl" />
            </Container>
        )
    }

    if (!isAuthenticated || !canViewBookings) {
        return null
    }

    return (
        <Container maxW="container.xl" py={10}>
            <Heading mb={6}>Kursbestillinger</Heading>

            {loadError && (
                <Text color="red.500" mb={4}>
                    {loadError}
                </Text>
            )}

            <Box overflowX="auto" bg="white" shadow="sm" rounded="lg">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Mottatt</Table.ColumnHeader>
                            <Table.ColumnHeader>Kontaktperson</Table.ColumnHeader>
                            <Table.ColumnHeader>Kurs</Table.ColumnHeader>
                            <Table.ColumnHeader>Antall</Table.ColumnHeader>
                            <Table.ColumnHeader>Tidspunkt</Table.ColumnHeader>
                            <Table.ColumnHeader>Sted</Table.ColumnHeader>
                            <Table.ColumnHeader>Tillegg</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {submissions.map((submission) => (
                            <Table.Row key={submission.id}>
                                <Table.Cell whiteSpace="nowrap">
                                    {submission.created_at
                                        ? new Date(submission.created_at).toLocaleDateString('no-NO')
                                        : '—'}
                                </Table.Cell>
                                <Table.Cell>
                                    <Stack gap={0}>
                                        <Text fontWeight="medium">
                                            {submission.kontaktperson_navn || 'Ukjent'}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {submission.kontaktperson_epost}
                                        </Text>
                                        {submission.kontaktperson_telefon && (
                                            <Text fontSize="sm" color="gray.600">
                                                {submission.kontaktperson_telefon}
                                            </Text>
                                        )}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{submission.kurs_type || '—'}</Text>
                                    {submission.kurs_type_annet && (
                                        <Text fontSize="sm" color="gray.600">
                                            {submission.kurs_type_annet}
                                        </Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell>{submission.antall_deltakere ?? '—'}</Table.Cell>
                                <Table.Cell>{submission.datoer || '—'}</Table.Cell>
                                <Table.Cell>
                                    <Text>
                                        {submission.sted === 'helsehus' ? 'Øya Helsehus' : 'Eget lokale'}
                                    </Text>
                                    {submission.adresse && (
                                        <Text fontSize="sm" color="gray.600">
                                            {submission.adresse}
                                        </Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Stack direction="row" gap={1} flexWrap="wrap">
                                        {submission.kursbevis && (
                                            <Badge colorPalette="blue" variant="subtle">
                                                Kursbevis
                                            </Badge>
                                        )}
                                        {submission.engelsk_kurs && (
                                            <Badge colorPalette="purple" variant="subtle">
                                                Engelsk
                                            </Badge>
                                        )}
                                    </Stack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
                {submissions.length === 0 && (
                    <Box p={4} textAlign="center">
                        <Text color="gray.500">Ingen kursbestillinger funnet.</Text>
                    </Box>
                )}
            </Box>
        </Container>
    )
}
