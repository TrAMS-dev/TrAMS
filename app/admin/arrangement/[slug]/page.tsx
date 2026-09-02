'use client'

import { useState, useEffect } from 'react'
import { Spinner, Flex } from '@chakra-ui/react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    EventForm,
    emptyEventFormValues,
    type EventFormPayload,
    type EventFormValues,
} from '@/components/admin/EventForm'
import { toaster } from '@/components/ui/toaster'
import { utcIsoToDatetimeLocalValue } from '@/lib/datetimeLocal'

export default function AdminEditEventPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [initialValues, setInitialValues] = useState<EventFormValues | null>(null)
    const [dateUnspecified, setDateUnspecified] = useState(false)
    const [eventId, setEventId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('Events')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error || !data) {
                toaster.create({
                    title: 'Fant ikke arrangementet',
                    type: 'error',
                    duration: 5000,
                })
                router.push('/admin')
                return
            }

            setEventId(data.id)
            setDateUnspecified(Boolean(data.date_unspecified))
            setInitialValues({
                ...emptyEventFormValues,
                title: data.title || '',
                description: data.description || '',
                start_datetime: utcIsoToDatetimeLocalValue(data.start_datetime),
                end_datetime: utcIsoToDatetimeLocalValue(data.end_datetime),
                location: data.location || '',
                contact_email: data.contact_email || '',
                image: data.image || '',
                max_attendees: data.max_attendees?.toString() || '',
                reg_opens: utcIsoToDatetimeLocalValue(data.reg_opens),
                reg_deadline: utcIsoToDatetimeLocalValue(data.reg_deadline),
                author: data.author || '',
                planned_month: data.planned_month || '',
                has_food: Boolean(data.has_food),
                custom_question: data.custom_question || '',
            })
            setLoading(false)
        }

        fetchEvent()
    }, [slug, router])

    const handleSubmit = async (payload: EventFormPayload) => {
        if (!eventId) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('Events')
                .update({
                    title: payload.title,
                    description: payload.description || null,
                    start_datetime: payload.start_datetime,
                    end_datetime: payload.end_datetime,
                    location: payload.location,
                    contact_email: payload.contact_email,
                    image: payload.image,
                    max_attendees: payload.max_attendees,
                    reg_opens: payload.reg_opens,
                    reg_deadline: payload.reg_deadline,
                    author: payload.author,
                    date_unspecified: payload.date_unspecified,
                    planned_month: payload.planned_month,
                    has_food: payload.has_food,
                    custom_question: payload.custom_question,
                })
                .eq('id', eventId)

            if (error) throw error

            toaster.create({
                title: 'Arrangement oppdatert!',
                type: 'success',
                duration: 5000,
            })

            router.push('/admin')
            router.refresh()
        } catch (error) {
            const description =
                error &&
                typeof error === 'object' &&
                'message' in error &&
                typeof (error as { message: unknown }).message === 'string'
                    ? (error as { message: string }).message
                    : undefined
            toaster.create({
                title: 'Kunne ikke oppdatere arrangement',
                description,
                type: 'error',
                duration: 5000,
            })
            throw error
        }
    }

    if (loading || !initialValues) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" />
            </Flex>
        )
    }

    return (
        <EventForm
            heading="Rediger arrangement"
            submitLabel="Lagre endringer"
            initialValues={initialValues}
            initialDateUnspecified={dateUnspecified}
            onSubmit={handleSubmit}
        />
    )
}
