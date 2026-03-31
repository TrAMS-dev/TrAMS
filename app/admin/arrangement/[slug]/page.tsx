'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Stack, Input, Textarea, Button, Field, Spinner, Flex } from '@chakra-ui/react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toaster } from '@/components/ui/toaster'
import { datetimeLocalToUtcIso, utcIsoToDatetimeLocalValue } from '@/lib/datetimeLocal'

interface EventFormData {
    title: string
    description: string
    start_datetime: string
    end_datetime: string
    location: string
    contact_email: string
    image: string
    max_attendees: string
    reg_opens: string
    reg_deadline: string
    author: string
}

export default function AdminEditEventPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [formData, setFormData] = useState<EventFormData | null>(null)
    const [eventId, setEventId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            setFormData({
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
            })
            setLoading(false)
        }

        fetchEvent()
    }, [slug])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!formData) return
        const { name, value } = e.target
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData || !eventId) return
        setIsSubmitting(true)

        const rawMax = formData.max_attendees.trim()
        let max_attendees: number | null = null
        if (rawMax !== '') {
            const n = Number.parseInt(rawMax, 10)
            if (!Number.isFinite(n) || n < 1) {
                toaster.create({
                    title: 'Ugyldig maks antall deltakere',
                    description: 'Oppgi et heltall større enn 0, eller la feltet stå tomt.',
                    type: 'error',
                    duration: 5000,
                })
                setIsSubmitting(false)
                return
            }
            max_attendees = n
        }

        const startUtc = datetimeLocalToUtcIso(formData.start_datetime)
        const endUtc = datetimeLocalToUtcIso(formData.end_datetime)
        if (!startUtc || !endUtc) {
            toaster.create({
                title: 'Ugyldig start- eller sluttidspunkt',
                type: 'error',
                duration: 5000,
            })
            setIsSubmitting(false)
            return
        }

        const regOpensUtc = formData.reg_opens.trim()
            ? datetimeLocalToUtcIso(formData.reg_opens)
            : null
        const regDeadlineUtc = formData.reg_deadline.trim()
            ? datetimeLocalToUtcIso(formData.reg_deadline)
            : null
        if (formData.reg_opens.trim() && !regOpensUtc) {
            toaster.create({
                title: 'Ugyldig tidspunkt for «Påmelding åpner»',
                type: 'error',
                duration: 5000,
            })
            setIsSubmitting(false)
            return
        }
        if (formData.reg_deadline.trim() && !regDeadlineUtc) {
            toaster.create({
                title: 'Ugyldig påmeldingsfrist',
                type: 'error',
                duration: 5000,
            })
            setIsSubmitting(false)
            return
        }

        try {
            const supabase = createClient()

            const { error } = await supabase
                .from('Events')
                .update({
                    title: formData.title,
                    description: formData.description || null,
                    start_datetime: startUtc,
                    end_datetime: endUtc,
                    location: formData.location,
                    contact_email: formData.contact_email.trim() || null,
                    image: formData.image || null,
                    max_attendees,
                    reg_opens: regOpensUtc,
                    reg_deadline: regDeadlineUtc,
                    author: formData.author || null,
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
            setIsSubmitting(false)
        }
    }

    if (loading || !formData) return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>

    return (
        <Box maxW="800px" mx="auto" bg="white" p={8} rounded="lg" shadow="sm">
            <Heading size="lg" mb={6}>Rediger arrangement</Heading>

            <form onSubmit={handleSubmit}>
                <Stack gap={6}>
                    <Field.Root>
                        <Field.Label>Tittel *</Field.Label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Beskrivelse</Field.Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                        />
                    </Field.Root>

                    <Box
                        display="grid"
                        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                        gap={4}
                    >
                        <Field.Root>
                            <Field.Label>Starttidspunkt *</Field.Label>
                            <Input
                                name="start_datetime"
                                type="datetime-local"
                                value={formData.start_datetime}
                                onChange={handleChange}
                                required
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Sluttidspunkt *</Field.Label>
                            <Input
                                name="end_datetime"
                                type="datetime-local"
                                value={formData.end_datetime}
                                onChange={handleChange}
                                required
                            />
                        </Field.Root>
                    </Box>

                    <Field.Root>
                        <Field.Label>Lokasjon *</Field.Label>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Kontakt e-post</Field.Label>
                        <Input
                            name="contact_email"
                            type="email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            placeholder="f.eks. arrangement@trams.no"
                        />
                        <Field.HelperText>
                            Vises på arrangementssiden. Brukes også som svar-adresse på påmeldingsbekreftelser.
                        </Field.HelperText>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Bilde</Field.Label>
                        <Field.HelperText>Last opp et bilde som representerer arrangementet</Field.HelperText>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => (prev ? { ...prev, image: url } : null))}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Påmelding åpner</Field.Label>
                        <Input
                            name="reg_opens"
                            type="datetime-local"
                            value={formData.reg_opens}
                            onChange={handleChange}
                        />
                        <Field.HelperText>Valgfritt. Tomt betyr at påmelding er åpen med en gang.</Field.HelperText>
                    </Field.Root>

                    <Box
                        display="grid"
                        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                        gap={4}
                    >
                        <Field.Root>
                            <Field.Label>Maks antall deltakere</Field.Label>
                            <Input
                                name="max_attendees"
                                type="number"
                                min="1"
                                value={formData.max_attendees}
                                onChange={handleChange}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Påmeldingsfrist</Field.Label>
                            <Input
                                name="reg_deadline"
                                type="datetime-local"
                                value={formData.reg_deadline}
                                onChange={handleChange}
                            />
                        </Field.Root>
                    </Box>



                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={4}
                        pt={6}
                        borderTop="1px solid"
                        borderColor="gray.200"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin')}
                            disabled={isSubmitting}
                        >
                            Avbryt
                        </Button>
                        <Button type="submit" loading={isSubmitting} bg="var(--color-primary)" color="white">
                            Lagre endringer
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}
