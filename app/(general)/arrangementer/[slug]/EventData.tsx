'use client'

import { useState, useEffect } from 'react'
import {
    Box,
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
import { LinkifiedText } from '@/components/LinkifiedText'
import { PageContainer } from '@/components/PageContainer'
import { ContentCard, cardStyles } from '@/components/ContentCard'
import { PrimaryLinkButton } from '@/components/PrimaryLinkButton'
import { SectionHeading, SubsectionHeading, BodyText } from '@/components/Typography'
import HeroImage from '@/components/HeroImage'
import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/supabase'
import { useParams } from 'next/navigation'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'
import { formatEventDate, isDateUnspecifiedEvent } from '@/lib/eventDate'
import { kullToKlasse } from '@/utils/functions/activeYears'
import { formatPoolKlasser, parseKullPools, summarizeCapacity } from '@/lib/kullPools'

type EventWithAuthorProfile = Tables<'Events'> & {
    profiles: { full_name: string | null; email: string | null } | null
}

/** Max names shown before "Se mer" for påmeldte / venteliste. */
const PARTICIPANT_NAMES_PREVIEW = 4

type EventArrangementDetailClientProps = {
    membershipSignupHref: string
}

export default function EventArrangementDetailClient({
    membershipSignupHref,
}: EventArrangementDetailClientProps) {
    const params = useParams()
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

    /** Bumped to refetch, e.g. after a new signup. */
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
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
        void fetchEventData()
    }, [slug, reloadKey])

    // Close the participant list when navigating to another event
    const [prevSlug, setPrevSlug] = useState(slug)
    if (slug !== prevSlug) {
        setPrevSlug(slug)
        setParticipantListOpen(false)
    }

    const handleSignupSuccess = () => {
        setReloadKey((k) => k + 1) // Refresh participant count
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
            <PageContainer>
                <ContentCard textAlign="center">
                    <SectionHeading as="h1" mt={0}>Arrangement ikke funnet</SectionHeading>
                    <PrimaryLinkButton href="/arrangementer">Tilbake til arrangementer</PrimaryLinkButton>
                </ContentCard>
            </PageContainer>
        )
    }

    const hasFood: boolean = event.has_food

    const isDateUnspecified = isDateUnspecifiedEvent(event)
    const isSignupUndecided = event.signup_undecided
    const startDate = event.start_datetime ? new Date(event.start_datetime) : null
    const endDate = event.end_datetime ? new Date(event.end_datetime) : null
    const regOpens = event.reg_opens ? new Date(event.reg_opens) : null
    const regDeadline = event.reg_deadline ? new Date(event.reg_deadline) : null
    const now = new Date()

    const isRegistrationNotYetOpen = regOpens ? now < regOpens : false
    const isRegistrationClosed = regDeadline ? now > regDeadline : false
    const isFull = event.max_attendees ? participantCount >= event.max_attendees : false
    const kullPools = parseKullPools(event.kull_pools)
    const capacity =
        event.max_attendees && kullPools.length > 0
            ? summarizeCapacity(
                  event.max_attendees,
                  kullPools,
                  publicParticipants.map((p) => p.kull)
              )
            : null
    const canSignup = !isDateUnspecified && !isRegistrationNotYetOpen && !isRegistrationClosed

    const confirmedNamesToShow = publicParticipants.slice(0, PARTICIPANT_NAMES_PREVIEW)
    const waitlistNamesToShow = publicWaitlist.slice(0, PARTICIPANT_NAMES_PREVIEW)
    const hasMoreConfirmedNames = publicParticipants.length > PARTICIPANT_NAMES_PREVIEW
    const hasMoreWaitlistNames = publicWaitlist.length > PARTICIPANT_NAMES_PREVIEW
    const remainingConfirmed = publicParticipants.length - PARTICIPANT_NAMES_PREVIEW
    const remainingWaitlist = publicWaitlist.length - PARTICIPANT_NAMES_PREVIEW

    return (
        <>
            {/* Hero Section */}
            <HeroImage
                imageUrl={event.image || 'https://i.imgur.com/oc9gbos.png'}
                heading={event.title}
                text={authorDisplayName ? `Arrangør: ${authorDisplayName}` : undefined}
                unoptimized
            />

            {/* Content Section */}
            <PageContainer>
                <Stack gap={6}>
                    {/* Event Info Cards */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={4}
                        wrap="wrap"
                    >
                        {isDateUnspecified ? (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                {...cardStyles}
                            >
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                                    DATO
                                </Text>
                                <Text fontSize="lg">
                                    {formatEventDate(event, { style: 'long' })}
                                </Text>
                                <Text color="gray.600" fontSize="sm" mt={1}>
                                    Nøyaktig dato er ikke fastsatt ennå
                                </Text>
                            </Box>
                        ) : (
                            <>
                                {startDate && (
                                    <Box
                                        flex="1"
                                        minW="250px"
                                        p={4}
                                        {...cardStyles}
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
                                        {...cardStyles}
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
                            </>
                        )}

                        {event.location && (
                            <Box
                                flex="1"
                                minW="250px"
                                p={4}
                                {...cardStyles}
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
                                {...cardStyles}
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
                            p={{ base: 6, md: 8 }}
                            {...cardStyles}
                        >
                            <Stack gap={6}>
                                {event.description && (
                                    <Box>
                                        <SubsectionHeading as="h2" fontSize="1.4rem" mb={4}>
                                            Om arrangementet
                                        </SubsectionHeading>
                                        <BodyText whiteSpace="pre-wrap" mb={0}>
                                            <LinkifiedText text={event.description} />
                                        </BodyText>
                                    </Box>
                                )}
                                {!isSignupUndecided && (
                                    <Box
                                        borderTopWidth={event.description ? '1px' : undefined}
                                        borderColor="gray.100"
                                        pt={event.description ? 6 : 0}
                                    >
                                        <SubsectionHeading as="h2" fontSize="1.4rem" mb={4}>
                                            Hvis du ikke møter
                                        </SubsectionHeading>
                                        <BodyText mb={0}>
                                            Dersom du ikke har mulighet til å møte opp på arrangementet, ta kontakt
                                            med arrangøren. Dette må gjøres innen 24 timer før arrangementet starter.
                                            Dersom du ikke gjør dette, vil du bli nedprioritert på senere
                                            TrAMS-arrangementer.
                                        </BodyText>
                                    </Box>
                                )}
                            </Stack>
                        </Box>

                        {!isSignupUndecided && (
                            <Box
                                flexShrink={0}
                                w={{ base: 'full', lg: 'min(100%, 17rem)' }}
                                maxW={{ lg: '17rem' }}
                                p={6}
                                {...cardStyles}
                            >
                                <Stack gap={4}>
                                    <SubsectionHeading as="h2" fontSize="1.4rem" mb={0}>
                                        Påmelding
                                    </SubsectionHeading>
                                    <Stack gap={2} fontSize="sm" color="gray.700">
                                        {event.allowed_kull && event.allowed_kull.length > 0 && (
                                            <Text>
                                                <strong>Åpen for:</strong>{' '}
                                                {[...event.allowed_kull]
                                                    .sort((a, b) => b - a)
                                                    .map((k) => `${kullToKlasse(k)}.`)
                                                    .join(', ')}{' '}
                                                klasse
                                            </Text>
                                        )}
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
                                        {capacity && (
                                            <Stack gap={0.5} pl={3} fontSize="xs" color="gray.600">
                                                {capacity.pools.map((pool) => (
                                                    <Text key={pool.kull.join(',')}>
                                                        Reservert {formatPoolKlasser(pool.kull)}:{' '}
                                                        {pool.taken} / {pool.spots}
                                                    </Text>
                                                ))}
                                                <Text>
                                                    Åpne for alle: {capacity.open.taken} /{' '}
                                                    {capacity.open.spots}
                                                </Text>
                                            </Stack>
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
                                        {isDateUnspecified
                                            ? 'Påmelding ikke tilgjengelig ennå'
                                            : isRegistrationNotYetOpen
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
                        )}
                    </Flex>
                </Stack>
            </PageContainer>

            {/* Signup Dialog */}
            <EventSignupDialog
                open={signupOpen}
                onClose={() => setSignupOpen(false)}
                eventId={event.id}
                eventTitle={event.title || 'dette arrangementet'}
                onSuccess={handleSignupSuccess}
                membershipSignupHref={membershipSignupHref}
                eventHasFood={hasFood}
                eventCustomQuestion={event.custom_question}
                eventRequiresPhone={event.require_phone}
                eventAllowedKull={event.allowed_kull}
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
