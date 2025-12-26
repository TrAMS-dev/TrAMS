'use client'

import { useState } from 'react'
import { Box, Heading, Stack, Input, Textarea, Button, Field } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

interface EventFormData {
    title: string
    description: string
    start_datetime: string
    end_datetime: string
    location: string
    image: string
    max_attendees: string
    reg_deadline: string
    author: string
}

export default function AdminCreateEventPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        location: '',
        image: '',
        max_attendees: '',
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
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create event')
            }

            alert('Arrangement opprettet!')

            // Navigate to the dashboard
            router.push('/admin')
            router.refresh()
        } catch (error) {
            alert('Kunne ikke opprette arrangement: ' + (error instanceof Error ? error.message : 'Noe gikk galt'))
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
                        <Field.Label>Bilde-URL</Field.Label>
                        <Field.HelperText>Lenke til et bilde som representerer arrangementet</Field.HelperText>
                        <Input
                            name="image"
                            type="url"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </Field.Root>

                    <Box
                        display="grid"
                        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                        gap={4}
                    >
                        <Field.Root>
                            <Field.Label>Maks antall deltakere</Field.Label>
                            <Field.HelperText>La stå tomt for ubegrenset</Field.HelperText>
                            <Input
                                name="max_attendees"
                                type="number"
                                min="1"
                                value={formData.max_attendees}
                                onChange={handleChange}
                                placeholder="F.eks. 50"
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

                    <Field.Root>
                        <Field.Label>Arrangør</Field.Label>
                        <Field.HelperText>Hvem arrangerer dette?</Field.HelperText>
                        <Input
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="F.eks. TrAMS Styret"
                        />
                    </Field.Root>

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
                            Opprett arrangement
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}
