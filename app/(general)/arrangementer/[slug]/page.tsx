'use client'

import { useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Text,
    Stack,
    Badge,
    Flex,
    Spinner,
    Button,
    Link,
    Wrap,
} from '@chakra-ui/react'
import EventSignupDialog from '@/components/EventSignupDialog'
import EventParticipantListDialog from '@/components/EventParticipantListDialog'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'
import { useParams, useRouter } from 'next/navigation'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'


type EventWithAuthorProfile = Tables<'Events'> & {
    profiles: { full_name: string | null; email: string | null } | null
}

/** Max names shown before "Se mer" for påmeldte / venteliste. */
const PARTICIPANT_NAMES_PREVIEW = 4

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [event, setEvent] = useState<Tables<'Events'> | null>(null)
    /** Resolved from profiles (never the raw author UUID). */
    const [authorDisplayName, setAuthorDisplayName] = useState<string | null>(null)
    const [participantCount, setParticipantCount] = useState<number>(0)
    /** Confirmed signups; name + kull for public display (no email). */
    const [publicParticipants, setPublicParticipants] = useState<
        Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'kull'>[]
    >([])
    const [publicWaitlist, setPublicWaitlist] = useState<
        Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'kull'>[]
    >([])
    const [loading, setLoading] = useState(true)
    const [signupOpen, setSignupOpen] = useState(false)
    const [participantListOpen, setParticipantListOpen] = useState(false)

    const fetchEventData = async () => {
        const supabase = createClient()

        // Fetch event
        const { data: eventData, error: eventError } = await supabase
            .from('Events')
            .select(
                `
                *,
                profiles!author (
                    full_name,
                    email
                )
            `
            )
            .eq('slug', slug)
            .single()

        if (eventError || !eventData) {
            console.error('Error fetching event:', eventError)
            setLoading(false)
            return
        }

        const row = eventData as EventWithAuthorProfile
        const { profiles, ...eventRow } = row
        setEvent(eventRow)
        setAuthorDisplayName(
            profiles?.full_name?.trim() || profiles?.email?.trim() || null
        )

        const { data: participantRows, error: participantsError } = await supabase
            .from('EventParticipants')
            .select('id, name, kull, status, created_at')
            .eq('eventId', eventData.id)

        if (!participantsError && participantRows) {
            const sortByName = (
                a: Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'kull'>,
                b: Pick<Tables<'EventParticipants'>, 'id' | 'name' | 'kull'>
            ) => {
                const an = (a.name ?? '').trim()
                const bn = (b.name ?? '').trim()
                return an.localeCompare(bn, 'nb-NO', { sensitivity: 'base' })
            }

            const confirmed = participantRows
                .filter((p) => p.status !== 'waitlist')
                .map(({ id, name, kull }) => ({ id, name, kull }))
                .sort(sortByName)

            const waitlist = participantRows
                .filter((p) => p.status === 'waitlist')
                .sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
                .map(({ id, name, kull }) => ({ id, name, kull }))

            setPublicParticipants(confirmed)
            setPublicWaitlist(waitlist)
            setParticipantCount(confirmed.length)
        } else {
            setPublicParticipants([])
            setPublicWaitlist([])
            setParticipantCount(0)
            if (participantsError) {
                console.error('Error fetching public participant list:', participantsError)
            }
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchEventData()
    }, [slug])

    useEffect(() => {
        setParticipantListOpen(false)
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
    const regOpens = event.reg_opens ? new Date(event.reg_opens) : null
    const regDeadline = event.reg_deadline ? new Date(event.reg_deadline) : null
    const now = new Date()

    const isRegistrationNotYetOpen = regOpens ? now < regOpens : false
    const isRegistrationClosed = regDeadline ? now > regDeadline : false
    const isFull = event.max_attendees ? participantCount >= event.max_attendees : false
    const canSignup = !isRegistrationNotYetOpen && !isRegistrationClosed

    const confirmedNamesToShow = publicParticipants.slice(0, PARTICIPANT_NAMES_PREVIEW)
    const waitlistNamesToShow = publicWaitlist.slice(0, PARTICIPANT_NAMES_PREVIEW)
    const hasMoreConfirmedNames = publicParticipants.length > PARTICIPANT_NAMES_PREVIEW
    const hasMoreWaitlistNames = publicWaitlist.length > PARTICIPANT_NAMES_PREVIEW
    const remainingConfirmed = publicParticipants.length - PARTICIPANT_NAMES_PREVIEW
    const remainingWaitlist = publicWaitlist.length - PARTICIPANT_NAMES_PREVIEW

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
                    {authorDisplayName && (
                        <Text fontSize={{ base: 'sm', md: 'md' }} opacity={0.9}>
                            Arrangør: {authorDisplayName}
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
                                        timeZone: APP_TIME_ZONE,
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text color="gray.600">
                                    Kl.{' '}
                                    {startDate.toLocaleTimeString('nb-NO', {
                                        timeZone: APP_TIME_ZONE,
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
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
                                        timeZone: APP_TIME_ZONE,
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text color="gray.600">
                                    Kl.{' '}
                                    {endDate.toLocaleTimeString('nb-NO', {
                                        timeZone: APP_TIME_ZONE,
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
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

                        {event.contact_email && (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                bg="white"
                                borderRadius="md"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="teal.500"
                            >
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                                    KONTAKT
                                </Text>
                                <Text fontSize="lg">
                                    <Link
                                        href={`mailto:${encodeURIComponent(event.contact_email)}`}
                                        color="blue.600"
                                        textDecoration="underline"
                                    >
                                        {event.contact_email}
                                    </Link>
                                </Text>
                            </Box>
                        )}
                    </Flex>

                    {/* Description (main) + påmelding (narrow sidebar on large screens) */}
                    <Flex
                        direction={{ base: 'column', lg: 'row' }}
                        gap={{ base: 6, lg: 8 }}
                        align={{ lg: 'flex-start' }}
                    >
                        <Box
                            flex="1"
                            minW={0}
                            p={{ base: 5, md: 7 }}
                            bg="white"
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <Stack gap={6}>
                                {event.description && (
                                    <Box>
                                        <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
                                            Om arrangementet
                                        </Heading>
                                        <Text whiteSpace="pre-wrap" lineHeight="1.8">
                                            {event.description}
                                        </Text>
                                    </Box>
                                )}
                                <Box
                                    borderTopWidth={event.description ? '1px' : undefined}
                                    borderColor="gray.100"
                                    pt={event.description ? 6 : 0}
                                >
                                    <Heading size={{ base: 'md', md: 'lg' }} mb={3}>
                                        Hvis du ikke møter
                                    </Heading>
                                    <Text color="gray.700" lineHeight="1.8">
                                        Dersom du ikke har mulighet til å møte opp på arrangementet, ta kontakt
                                        med arrangøren. Dette må gjøres innen 24 timer før arrangementet starter.
                                        Dersom du ikke gjør dette, vil du bli nedprioritert på senere
                                        TrAMS-arrangementer.
                                    </Text>
                                </Box>
                            </Stack>
                        </Box>

                        <Box
                            flexShrink={0}
                            w={{ base: 'full', lg: 'min(100%, 17rem)' }}
                            maxW={{ lg: '17rem' }}
                            p={4}
                            bg="gray.50"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="gray.200"
                        >
                            <Stack gap={4}>
                                <Heading size="sm" color="gray.600" fontWeight="semibold">
                                    Påmelding
                                </Heading>
                                <Stack gap={2} fontSize="sm" color="gray.700">
                                    {event.max_attendees && (
                                        <Text>
                                            <strong>Plasser:</strong> {participantCount} /{' '}
                                            {event.max_attendees}
                                            {isFull && (
                                                <Badge ml={2} size="sm" colorPalette="red">
                                                    Fullt – venteliste
                                                </Badge>
                                            )}
                                        </Text>
                                    )}
                                    {regOpens && (
                                        <Text>
                                            <strong>Påmelding åpner:</strong>{' '}
                                            {regOpens.toLocaleDateString('nb-NO', {
                                                timeZone: APP_TIME_ZONE,
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            {isRegistrationNotYetOpen && (
                                                <Badge ml={2} size="sm" colorPalette="orange">
                                                    Ikke åpnet
                                                </Badge>
                                            )}
                                        </Text>
                                    )}
                                    {regDeadline && (
                                        <Text>
                                            <strong>Påmeldingsfrist:</strong>{' '}
                                            {regDeadline.toLocaleDateString('nb-NO', {
                                                timeZone: APP_TIME_ZONE,
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            {isRegistrationClosed && (
                                                <Badge ml={2} size="sm" colorPalette="red">
                                                    Utløpt
                                                </Badge>
                                            )}
                                        </Text>
                                    )}
                                </Stack>
                                <Button
                                    size="md"
                                    w="full"
                                    bg="var(--color-primary)"
                                    color="white"
                                    onClick={() => setSignupOpen(true)}
                                    disabled={!canSignup}
                                >
                                    {isRegistrationNotYetOpen
                                        ? 'Påmelding ikke åpnet'
                                        : isRegistrationClosed
                                          ? 'Påmelding stengt'
                                          : isFull
                                            ? 'Meld deg på venteliste'
                                            : 'Meld deg på'}
                                </Button>
                            </Stack>

                            {(publicParticipants.length > 0 || publicWaitlist.length > 0) && (
                                <Box mt={5} pt={5} borderTopWidth="1px" borderColor="gray.200">
                                    {publicParticipants.length > 0 && (
                                        <Box
                                            mb={publicWaitlist.length > 0 ? 5 : 0}
                                            pb={publicWaitlist.length > 0 ? 5 : 0}
                                            borderBottomWidth={
                                                publicWaitlist.length > 0 ? '1px' : undefined
                                            }
                                            borderColor="gray.200"
                                        >
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
                                            <Text fontSize="xs" color="gray.500" mb={2}>
                                                Bekreftede plasser.
                                            </Text>
                                            <Wrap gap={1.5}>
                                                {confirmedNamesToShow.map((p) => (
                                                    <Badge
                                                        key={p.id}
                                                        size="sm"
                                                        variant="subtle"
                                                        colorPalette="gray"
                                                        px={2}
                                                        py={0.5}
                                                    >
                                                        {(p.name ?? 'Uten navn').trim() || 'Uten navn'}
                                                        {p.kull != null ? ` - kull ${p.kull}` : ''}
                                                    </Badge>
                                                ))}
                                            </Wrap>
                                            {hasMoreConfirmedNames && (
                                                <Button
                                                    mt={2}
                                                    size="xs"
                                                    variant="ghost"
                                                    colorPalette="gray"
                                                    onClick={() => setParticipantListOpen(true)}
                                                >
                                                    Se mer ({remainingConfirmed} til)
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                    {publicWaitlist.length > 0 && (
                                        <Box>
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
                                            <Text fontSize="xs" color="gray.500" mb={2}>
                                                Meldt på når arrangementet var fullt.
                                            </Text>
                                            <Wrap gap={1.5}>
                                                {waitlistNamesToShow.map((p) => (
                                                    <Badge
                                                        key={p.id}
                                                        size="sm"
                                                        variant="subtle"
                                                        colorPalette="orange"
                                                        px={2}
                                                        py={0.5}
                                                    >
                                                        {(p.name ?? 'Uten navn').trim() || 'Uten navn'}
                                                        {p.kull != null ? ` - kull ${p.kull}` : ''}
                                                    </Badge>
                                                ))}
                                            </Wrap>
                                            {hasMoreWaitlistNames && (
                                                <Button
                                                    mt={2}
                                                    size="xs"
                                                    variant="ghost"
                                                    colorPalette="gray"
                                                    onClick={() => setParticipantListOpen(true)}
                                                >
                                                    Se mer ({remainingWaitlist} til)
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Flex>
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

            <EventParticipantListDialog
                open={participantListOpen}
                onClose={() => setParticipantListOpen(false)}
                confirmedParticipants={publicParticipants}
                waitlistParticipants={publicWaitlist}
            />
        </>
    )
}
