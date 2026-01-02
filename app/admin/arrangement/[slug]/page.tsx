'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Stack, Input, Textarea, Button, Field, Spinner, Flex } from '@chakra-ui/react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ImageUploader } from '@/components/admin/ImageUploader'

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
                alert('Fant ikke arrangementet')
                router.push('/admin')
                return
            }

            setEventId(data.id)
            setFormData({
                title: data.title || '',
                description: data.description || '',
                start_datetime: data.start_datetime ? data.start_datetime.slice(0, 16) : '',
                end_datetime: data.end_datetime ? data.end_datetime.slice(0, 16) : '',
                location: data.location || '',
                image: data.image || '',
                max_attendees: data.max_attendees?.toString() || '',
                reg_deadline: data.reg_deadline ? data.reg_deadline.slice(0, 16) : '',
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

        try {
            const supabase = createClient()

            const { error } = await supabase
                .from('Events')
                .update({
                    title: formData.title,
                    description: formData.description || null,
                    start_datetime: formData.start_datetime,
                    end_datetime: formData.end_datetime,
                    location: formData.location,
                    image: formData.image || null,
                    max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                    reg_deadline: formData.reg_deadline || null,
                    author: formData.author || null,
                })
                .eq('id', eventId)

            if (error) throw error

            alert('Arrangement oppdatert!')

            router.push('/admin')
            router.refresh()
        } catch (error) {
            alert('Kunne ikke oppdatere arrangement: ' + (error instanceof Error ? error.message : 'Noe gikk galt'))
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
                        <Field.Label>Bilde</Field.Label>
                        <Field.HelperText>Last opp et bilde som representerer arrangementet</Field.HelperText>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => (prev ? { ...prev, image: url } : null))}
                        />
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
