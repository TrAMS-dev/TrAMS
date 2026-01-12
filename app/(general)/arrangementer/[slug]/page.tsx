'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Text, Stack, Badge, Flex, Spinner, Button } from '@chakra-ui/react'
import EventSignupDialog from '@/components/EventSignupDialog'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [event, setEvent] = useState<Tables<'Events'> | null>(null)
    const [participantCount, setParticipantCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [signupOpen, setSignupOpen] = useState(false)

    const fetchEventData = async () => {
        const supabase = createClient()

        // Fetch event
        const { data: eventData, error: eventError } = await supabase
            .from('Events')
            .select('*')
            .eq('slug', slug)
            .single()

        if (eventError || !eventData) {
            console.error('Error fetching event:', eventError)
            setLoading(false)
            return
        }

        setEvent(eventData)

        // Fetch participant count
        const { count, error: countError } = await supabase
            .from('EventParticipants')
            .select('*', { count: 'exact', head: true })
            .eq('eventId', eventData.id)

        if (!countError && count !== null) {
            setParticipantCount(count)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchEventData()
    }, [slug])

    const handleSignupSuccess = () => {
        fetchEventData() // Refresh participant count
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
                <Spinner size="xl" />
            </Box>
        )
    }

    if (!event) {
        return (
            <Box textAlign="center" py={10}>
                <Heading size="lg" mb={4}>
                    Arrangement ikke funnet
                </Heading>
                <Button onClick={() => router.push('/arrangementer')}>
                    Tilbake til arrangementer
                </Button>
            </Box>
        )
    }

    const startDate = event.start_datetime ? new Date(event.start_datetime) : null
    const endDate = event.end_datetime ? new Date(event.end_datetime) : null
    const regDeadline = event.reg_deadline ? new Date(event.reg_deadline) : null
    const now = new Date()

    const isRegistrationClosed = regDeadline ? now > regDeadline : false
    const isFull = event.max_attendees ? participantCount >= event.max_attendees : false
    const canSignup = !isRegistrationClosed && !isFull

    return (
        <>
            {/* Hero Section */}
            <Box
                position="relative"
                h={{ base: '30vh', md: '40vh' }}
                bgImage={event.image ? `url('${event.image}')` : "url('https://i.imgur.com/oc9gbos.png')"}
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="white"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                p={{ base: 4, md: 8 }}
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="1200px" mx="auto" w="full">
                    <Heading size={{ base: 'xl', md: '2xl' }} mb={2}>
                        {event.title}
                    </Heading>
                    {event.author && (
                        <Text fontSize={{ base: 'sm', md: 'md' }} opacity={0.9}>
                            Arrangør: {event.author}
                        </Text>
                    )}
                </Box>
            </Box>

            {/* Content Section */}
            <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
                <Stack gap={6}>
                    {/* Event Info Cards */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={4}
                        wrap="wrap"
                    >
                        {startDate && (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                bg="white"
                                borderRadius="md"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="blue.500"
                            >
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                                    START
                                </Text>
                                <Text fontSize="lg">
                                    {startDate.toLocaleDateString('nb-NO', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text color="gray.600">
                                    Kl. {startDate.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </Box>
                        )}

                        {endDate && (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                bg="white"
                                borderRadius="md"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="green.500"
                            >
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                                    SLUTT
                                </Text>
                                <Text fontSize="lg">
                                    {endDate.toLocaleDateString('nb-NO', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text color="gray.600">
                                    Kl. {endDate.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </Box>
                        )}

                        {event.location && (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                bg="white"
                                borderRadius="md"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="purple.500"
                            >
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                                    LOKASJON
                                </Text>
                                <Text fontSize="lg">{event.location}</Text>
                            </Box>
                        )}
                    </Flex>

                    {/* Registration Info */}
                    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                            <Box>
                                <Heading size="md" mb={2}>
                                    Påmelding
                                </Heading>
                                <Stack gap={2}>
                                    {event.max_attendees && (
                                        <Text>
                                            <strong>Plasser:</strong> {participantCount} / {event.max_attendees}
                                            {isFull && (
                                                <Badge ml={2} colorPalette="red">
                                                    Fullt
                                                </Badge>
                                            )}
                                        </Text>
                                    )}
                                    {regDeadline && (
                                        <Text>
                                            <strong>Påmeldingsfrist:</strong>{' '}
                                            {regDeadline.toLocaleDateString('nb-NO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            {isRegistrationClosed && (
                                                <Badge ml={2} colorPalette="red">
                                                    Utløpt
                                                </Badge>
                                            )}
                                        </Text>
                                    )}
                                </Stack>
                            </Box>
                            <Button
                                size="lg"
                                bg="var(--color-primary)"
                                color="white"
                                onClick={() => setSignupOpen(true)}
                                disabled={!canSignup}
                            >
                                {isFull ? 'Fullt' : isRegistrationClosed ? 'Påmelding stengt' : 'Meld deg på'}
                            </Button>
                        </Flex>
                    </Box>

                    {/* Description */}
                    {event.description && (
                        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                            <Heading size="md" mb={4}>
                                Om arrangementet
                            </Heading>
                            <Text whiteSpace="pre-wrap" lineHeight="1.8">
                                {event.description}
                            </Text>
                        </Box>
                    )}
                </Stack>
            </Box>

            {/* Signup Dialog */}
            <EventSignupDialog
                open={signupOpen}
                onClose={() => setSignupOpen(false)}
                eventId={event.id}
                eventTitle={event.title || 'dette arrangementet'}
                onSuccess={handleSignupSuccess}
            />
        </>
    )
}
