'use client'

import { useState } from 'react'
import { Box, Heading, Stack, Input, Textarea, Button, Field } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAuth } from '@/hooks/useAuth'
import { toaster } from '@/components/ui/toaster'
import { datetimeLocalToUtcIso } from '@/lib/datetimeLocal'

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

export default function AdminCreateEventPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        location: '',
        contact_email: '',
        image: '',
        max_attendees: '',
        reg_opens: '',
        reg_deadline: '',
        author: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toaster.create({
                title: 'Du må være logget inn for å opprette et arrangement',
                type: 'error',
                duration: 5000,
            })
            return
        }

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
            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    start_datetime: startUtc,
                    end_datetime: endUtc,
                    reg_opens: regOpensUtc,
                    reg_deadline: regDeadlineUtc,
                    max_attendees,
                    author: user.id
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create event')
            }

            toaster.create({
                title: 'Arrangement opprettet!',
                type: 'success',
                duration: 5000,
            })

            // Navigate to the dashboard
            router.push('/admin')
            router.refresh()
        } catch (error) {
            toaster.create({
                title: 'Kunne ikke opprette arrangement',
                type: 'error',
                duration: 5000,
            })
            setIsSubmitting(false)
        }
    }

    return (
        <Box maxW="800px" mx="auto" bg="white" p={8} rounded="lg" shadow="sm">
            <Heading size="lg" mb={6}>Oprett nytt arrangement</Heading>

            <form onSubmit={handleSubmit}>
                <Stack gap={6}>
                    <Field.Root>
                        <Field.Label>Tittel *</Field.Label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="F.eks. Førstehjelpskurs for medisinstudenter"
                            required
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Beskrivelse</Field.Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Beskriv arrangementet..."
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
                            placeholder="F.eks. Auditorium 1, Medisinsk Teknisk Forskningssenter"
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
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
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
                                placeholder="F.eks. 50"
                            />
                            <Field.HelperText>La stå tomt for ubegrenset</Field.HelperText>

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
                            onClick={() => [router.push('/admin'),]}
                            disabled={isSubmitting}
                        >
                            Avbryt
                        </Button>
                        <Button type="submit" loading={isSubmitting} bg="var(--color-primary)" color="white">
                            Opprett arrangement
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}
