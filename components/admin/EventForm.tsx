'use client'

import { useState } from 'react'
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    Button,
    Field,
    Checkbox,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PlannedMonthSelector } from '@/components/admin/PlannedMonthSelector'
import { toaster } from '@/components/ui/toaster'
import { datetimeLocalToUtcIso } from '@/lib/datetimeLocal'

export interface EventFormValues {
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
    planned_month: string
    has_food: boolean
    custom_question: string
}

export interface EventFormPayload {
    title: string
    description: string
    start_datetime: string | null
    end_datetime: string | null
    location: string | null
    contact_email: string | null
    image: string | null
    max_attendees: number | null
    reg_opens: string | null
    reg_deadline: string | null
    author: string | null
    planned_month: string | null
    date_unspecified: boolean
    has_food: boolean
    custom_question: string | null
}

export const emptyEventFormValues: EventFormValues = {
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
    planned_month: '',
    has_food: false,
    custom_question: '',
}

interface EventFormProps {
    heading: string
    submitLabel: string
    initialValues?: EventFormValues
    initialDateUnspecified?: boolean
    onSubmit: (payload: EventFormPayload) => Promise<void>
}

export function EventForm({
    heading,
    submitLabel,
    initialValues = emptyEventFormValues,
    initialDateUnspecified = false,
    onSubmit,
}: EventFormProps) {
    const router = useRouter()
    const [dateUnspecified, setDateUnspecified] = useState(initialDateUnspecified)
    const [hasFood, setHasFood] = useState(initialValues.has_food)
    const [formData, setFormData] = useState<EventFormValues>(initialValues)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (dateUnspecified && !formData.planned_month.trim()) {
            toaster.create({
                title: 'Velg planlagt måned',
                description:
                    'Når dato ikke er spesifisert, må du oppgi hvilken måned arrangementet planlegges i.',
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

        let startUtc: string | null = null
        let endUtc: string | null = null
        if (!dateUnspecified) {
            startUtc = datetimeLocalToUtcIso(formData.start_datetime)
            endUtc = datetimeLocalToUtcIso(formData.end_datetime)
            if (!startUtc || !endUtc) {
                toaster.create({
                    title: 'Ugyldig start- eller sluttidspunkt',
                    type: 'error',
                    duration: 5000,
                })
                setIsSubmitting(false)
                return
            }
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

        const payload: EventFormPayload = {
            title: formData.title,
            description: formData.description,
            start_datetime: startUtc,
            end_datetime: endUtc,
            location: dateUnspecified ? null : formData.location.trim() || null,
            contact_email: formData.contact_email.trim() || null,
            image: formData.image || null,
            max_attendees: dateUnspecified ? null : max_attendees,
            reg_opens: dateUnspecified ? null : regOpensUtc,
            reg_deadline: dateUnspecified ? null : regDeadlineUtc,
            author: formData.author || null,
            planned_month: dateUnspecified ? formData.planned_month.trim() : null,
            date_unspecified: dateUnspecified,
            has_food: hasFood,
            custom_question: formData.custom_question.trim() || null,
        }

        try {
            await onSubmit(payload)
        } catch {
            setIsSubmitting(false)
        }
    }

    return (
        <Box maxW="800px" mx="auto" bg="white" p={8} rounded="lg" shadow="sm">
            <Heading size="lg" mb={6}>
                {heading}
            </Heading>

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

                    <Field.Root>
                        <Checkbox.Root
                            checked={hasFood}
                            onCheckedChange={(details) => setHasFood(!!details.checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Blir det servering av mat drikke?</Checkbox.Label>
                        </Checkbox.Root>
                        <Field.HelperText>
                            Dersom du huker av denne vil deltagere bli spurt om eventuelle allergier
                        </Field.HelperText>
                    </Field.Root>

                    <Checkbox.Root
                        checked={dateUnspecified}
                        onCheckedChange={(details) => setDateUnspecified(!!details.checked)}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Arrangementsdato ikke spesifisert enda</Checkbox.Label>
                    </Checkbox.Root>

                    {dateUnspecified ? (
                        <PlannedMonthSelector
                            value={formData.planned_month}
                            onChange={(planned_month) =>
                                setFormData((prev) => ({ ...prev, planned_month }))
                            }
                        />
                    ) : (
                        <>
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
                        </>
                    )}

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
                            Vises på arrangementssiden. Brukes også som svar-adresse på
                            påmeldingsbekreftelser.
                        </Field.HelperText>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>
                            Spørsmål til påmelding (ja/nei-spørsmål, valgfritt)
                        </Field.Label>
                        <Input
                            name="custom_question"
                            value={formData.custom_question}
                            onChange={handleChange}
                            placeholder="F.eks. Har du deltatt på kurset tidligere?"
                        />
                        <Field.HelperText>
                            Dersom du fyller ut dette, vil deltakerne få et avhukingsspørsmål under
                            påmelding.
                        </Field.HelperText>
                    </Field.Root>

                    <Field.Root w="full">
                        <Field.Label>Bilde</Field.Label>
                        <Field.HelperText>
                            Last opp et bilde som representerer arrangementet. Du kan zoome og
                            flytte for å tilpasse headerbildet.
                        </Field.HelperText>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        />
                    </Field.Root>

                    {!dateUnspecified && (
                        <>
                            <Field.Root>
                                <Field.Label>Påmelding åpner</Field.Label>
                                <Input
                                    name="reg_opens"
                                    type="datetime-local"
                                    value={formData.reg_opens}
                                    onChange={handleChange}
                                />
                                <Field.HelperText>
                                    Valgfritt. Tomt betyr at påmelding er åpen med en gang.
                                </Field.HelperText>
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
                        </>
                    )}

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
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            bg="var(--color-primary)"
                            color="white"
                        >
                            {submitLabel}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}
