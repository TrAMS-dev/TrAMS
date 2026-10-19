import { Box, Heading, Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import type { Tables } from '@/types/supabase'
import { isEventPast } from '@/lib/eventDate'
import { requireApprovedUser } from '@/utils/supabase/requireApprovedUser'
import { AdminEventList, type AdminEventRow, type RegistrationStatus } from '@/components/admin/AdminEventList'

function getRegistrationStatus(event: Tables<'Events'>, now: Date): RegistrationStatus {
    if (event.signup_undecided) return 'undecided'
    if (event.reg_opens && now < new Date(event.reg_opens)) return 'not-open'
    if (event.reg_deadline && now > new Date(event.reg_deadline)) return 'closed'
    return 'open'
}

export default async function AdminDashboard() {
    const { supabase } = await requireApprovedUser()

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

    const now = new Date()
    const rows: AdminEventRow[] = eventList.map((event) => ({
        event,
        confirmed: confirmedCountByEventId.get(event.id) ?? 0,
        isPast: isEventPast(event, now),
        registrationStatus: getRegistrationStatus(event, now),
    }))

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="xl">Arrangementer</Heading>
                <Link href="/admin/arrangement/ny">
                    <Button bg="var(--color-primary)" color="white">
                        + Nytt Arrangement
                    </Button>
                </Link>
            </Flex>

            <AdminEventList rows={rows} />
        </Box>
    )
}
