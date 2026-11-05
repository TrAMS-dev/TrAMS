'use client'

import { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Stack,
    Input,
    Textarea,
    Text,
    Button,
    Field,
    Checkbox,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PlannedMonthSelector } from '@/components/admin/PlannedMonthSelector'
import { toaster } from '@/components/ui/toaster'
import { datetimeLocalToUtcIso } from '@/lib/datetimeLocal'
import { activeYears, kullToKlasse } from '@/utils/functions/activeYears'
import { type KullPool, formatPoolKlasser, validateKullPools } from '@/lib/kullPools'
import { type SignupQuestion, validateSignupQuestions } from '@/lib/signupQuestions'
import {
    type SignupQuestionDraft,
    SignupQuestionsEditor,
    newSignupQuestionDraft,
    draftToQuestion,
} from '@/components/admin/SignupQuestionsEditor'
import type { FeedbackQuestion } from '@/lib/eventFeedback'
import {
    FeedbackQuestionsEditor,
    newFeedbackQuestion,
} from '@/components/admin/FeedbackQuestionsEditor'

/** One titled part of the form, separated from the previous one by a line. */
function FormSection({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <Box as="section" borderTopWidth="1px" borderColor="gray.200" pt={6}>
            <Heading size="md" mb={description ? 1 : 4}>
                {title}
            </Heading>
            {description && (
                <Text fontSize="sm" color="fg.muted" mb={4}>
                    {description}
                </Text>
            )}
            <Stack gap={5}>{children}</Stack>
        </Box>
    )
}

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
    signup_questions: SignupQuestionDraft[]
    require_phone: boolean
    /** Empty means every kull may sign up (all boxes checked). */
    allowed_kull: number[]
    /** Reserved spots per kull; spots is the raw input value. */
    kull_pools: { kull: number[]; spots: string }[]
    feedback_questions: FeedbackQuestion[]
    certificate_description: string
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
    signup_undecided: boolean
    has_food: boolean
    signup_questions: SignupQuestion[]
    require_phone: boolean
    allowed_kull: number[] | null
    kull_pools: KullPool[]
    feedback_questions: FeedbackQuestion[]
    certificate_description: string | null
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
    signup_questions: [],
    require_phone: false,
    allowed_kull: [],
    kull_pools: [],
    feedback_questions: [],
    certificate_description: '',
}

interface EventFormProps {
    heading: string
    /** Optional element shown next to the heading, e.g. extra actions */
    headerAction?: React.ReactNode
    submitLabel: string
    initialValues?: EventFormValues
    initialDateUnspecified?: boolean
    initialSignupUndecided?: boolean
    onSubmit: (payload: EventFormPayload) => Promise<void>
}

export function EventForm({
    heading,
    headerAction,
    submitLabel,
    initialValues = emptyEventFormValues,
    initialDateUnspecified = false,
    initialSignupUndecided = false,
    onSubmit,
}: EventFormProps) {
    const router = useRouter()
    const [dateUnspecified, setDateUnspecified] = useState(initialDateUnspecified)
    // Signup can't happen without a date, so an unspecified date implies undecided signup
    const [signupUndecided, setSignupUndecided] = useState(
        initialSignupUndecided || initialDateUnspecified
    )
    const [hasFood, setHasFood] = useState(initialValues.has_food)
    const [hasExtraQuestions, setHasExtraQuestions] = useState(
        initialValues.signup_questions.length > 0
    )
    const [formData, setFormData] = useState<EventFormValues>(() => ({
        ...initialValues,
        allowed_kull:
            initialValues.allowed_kull.length > 0 ? initialValues.allowed_kull : activeYears(),
    }))
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Keep previously saved kull visible even after they drop out of activeYears()
    const kullOptions = Array.from(
        new Set([...activeYears(), ...initialValues.allowed_kull])
    ).sort((a, b) => b - a)

    const toggleAllowedKull = (kull: number, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            allowed_kull: checked
                ? [...prev.allowed_kull, kull]
                : prev.allowed_kull.filter((k) => k !== kull),
            // A kull that can't sign up can't have reserved spots
            kull_pools: checked
                ? prev.kull_pools
                : prev.kull_pools.map((p) => ({ ...p, kull: p.kull.filter((k) => k !== kull) })),
        }))
    }

    const poolKullOptions = kullOptions.filter((k) => formData.allowed_kull.includes(k))

    const addKullPool = () => {
        setFormData((prev) => ({
            ...prev,
            kull_pools: [...prev.kull_pools, { kull: [], spots: '' }],
        }))
    }

    const updateKullPool = (index: number, change: Partial<{ kull: number[]; spots: string }>) => {
        setFormData((prev) => ({
            ...prev,
            kull_pools: prev.kull_pools.map((p, i) => (i === index ? { ...p, ...change } : p)),
        }))
    }

    const togglePoolKull = (index: number, kull: number, checked: boolean) => {
        const pool = formData.kull_pools[index]
        updateKullPool(index, {
            kull: checked ? [...pool.kull, kull] : pool.kull.filter((k) => k !== kull),
        })
    }

    const removeKullPool = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            kull_pools: prev.kull_pools.filter((_, i) => i !== index),
        }))
    }

    const reservedSpots = formData.kull_pools.reduce(
        (sum, p) => sum + (Number.parseInt(p.spots, 10) || 0),
        0
    )
    const maxAttendeesInput = Number.parseInt(formData.max_attendees, 10)

    // datetime-local values share one format, so string comparison orders them correctly
    const endBeforeStart =
        !dateUnspecified &&
        formData.start_datetime !== '' &&
        formData.end_datetime !== '' &&
        formData.end_datetime < formData.start_datetime

    const [hasFeedbackForm, setHasFeedbackForm] = useState(
        initialValues.feedback_questions.length > 0
    )
    const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>(
        initialValues.feedback_questions
    )

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

        if (!signupUndecided && formData.allowed_kull.length === 0) {
            toaster.create({
                title: 'Velg minst ett kull',
                description: 'Minst ett kull må kunne melde seg på arrangementet.',
                type: 'error',
                duration: 5000,
            })
            return
        }

        const cleanedFeedbackQuestions: FeedbackQuestion[] = hasFeedbackForm
            ? feedbackQuestions
                  .map((q) => ({ ...q, label: q.label.trim() }))
                  .filter((q) => q.label !== '')
            : []

        if (hasFeedbackForm && cleanedFeedbackQuestions.length === 0) {
            toaster.create({
                title: 'Legg til minst ett tilbakemeldingsspørsmål',
                description:
                    'Skriv inn minst ett spørsmål, eller fjern avhukingen for tilbakemeldingsskjema.',
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
            if (new Date(endUtc) < new Date(startUtc)) {
                toaster.create({
                    title: 'Sluttidspunkt kan ikke være før starttidspunkt',
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

        const hideSignup = signupUndecided

        const allowedKull =
            signupUndecided || activeYears().every((k) => formData.allowed_kull.includes(k))
                ? null
                : [...formData.allowed_kull].sort((a, b) => a - b)

        const kullPools: KullPool[] = hideSignup
            ? []
            : formData.kull_pools.map((p) => ({
                  kull: [...p.kull].sort((a, b) => a - b),
                  spots: Number(p.spots.trim() === '' ? Number.NaN : p.spots),
              }))
        const poolError = validateKullPools(kullPools, max_attendees, allowedKull)
        if (poolError) {
            toaster.create({
                title: 'Ugyldige reserverte plasser',
                description: poolError,
                type: 'error',
                duration: 5000,
            })
            setIsSubmitting(false)
            return
        }

        const signupQuestions =
            hideSignup || !hasExtraQuestions
                ? []
                : formData.signup_questions.map(draftToQuestion)
        const questionError = validateSignupQuestions(signupQuestions)
        if (questionError) {
            toaster.create({
                title: 'Ugyldige spørsmål ved påmelding',
                description: questionError,
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
            max_attendees: hideSignup ? null : max_attendees,
            reg_opens: hideSignup ? null : regOpensUtc,
            reg_deadline: hideSignup ? null : regDeadlineUtc,
            author: formData.author || null,
            planned_month: dateUnspecified ? formData.planned_month.trim() : null,
            date_unspecified: dateUnspecified,
            signup_undecided: signupUndecided,
            has_food: hasFood,
            signup_questions: signupQuestions,
            require_phone: !signupUndecided && formData.require_phone,
            // All active kull checked means no restriction
            allowed_kull: allowedKull,
            kull_pools: kullPools,
            feedback_questions: cleanedFeedbackQuestions,
            certificate_description: formData.certificate_description.trim() || null,
        }

        try {
            await onSubmit(payload)
        } catch {
            setIsSubmitting(false)
        }
    }


    return (
        <Box maxW="800px" mx="auto" bg="white" p={8} rounded="lg" shadow="sm">
            <Flex justify="space-between" align="center" gap={4} mb={6} wrap="wrap">
                <Heading size="lg">{heading}</Heading>
                {headerAction}
            </Flex>

            <form onSubmit={handleSubmit}>
                <Stack gap={8}>
                    <FormSection title="Om arrangementet">
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
                    </FormSection>

                    <FormSection title="Tid og sted">
                        <Checkbox.Root
                            checked={dateUnspecified}
                            onCheckedChange={(details) => {
                                const checked = !!details.checked
                                setDateUnspecified(checked)
                                if (checked) setSignupUndecided(true)
                            }}
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

                                    <Field.Root invalid={endBeforeStart}>
                                        <Field.Label>Sluttidspunkt *</Field.Label>
                                        <Input
                                            name="end_datetime"
                                            type="datetime-local"
                                            value={formData.end_datetime}
                                            onChange={handleChange}
                                            min={formData.start_datetime || undefined}
                                            required
                                        />
                                        <Field.ErrorText>
                                            Sluttidspunkt kan ikke være før starttidspunkt
                                        </Field.ErrorText>
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
                    </FormSection>

                    <FormSection title="Påmelding">
                        <Field.Root>
                            <Checkbox.Root
                                checked={signupUndecided}
                                disabled={dateUnspecified}
                                onCheckedChange={(details) => setSignupUndecided(!!details.checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Påmelding ikke synlig for deltakere</Checkbox.Label>
                            </Checkbox.Root>
                            <Field.HelperText>
                                {dateUnspecified
                                    ? 'Settes automatisk når arrangementsdato ikke er spesifisert'
                                    : 'Skjuler all informasjon om påmelding på arrangementssiden'}
                            </Field.HelperText>
                        </Field.Root>

                        {!signupUndecided && (
                            <>
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                                    gap={4}
                                >
                                    <Field.Root>
                                        <Field.Label>Påmelding åpner</Field.Label>
                                        <Input
                                            name="reg_opens"
                                            type="datetime-local"
                                            value={formData.reg_opens}
                                            onChange={handleChange}
                                        />
                                        <Field.HelperText>Tomt betyr åpen med en gang</Field.HelperText>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Påmeldingsfrist</Field.Label>
                                        <Input
                                            name="reg_deadline"
                                            type="datetime-local"
                                            value={formData.reg_deadline}
                                            onChange={handleChange}
                                        />
                                        <Field.HelperText>Tomt betyr ingen frist</Field.HelperText>
                                    </Field.Root>
                                </Box>

                                <Field.Root maxW={{ md: 'calc(50% - 0.5rem)' }}>
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

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                                        Hvilke kull kan melde seg på?
                                    </Text>
                                    <Box display="flex" flexWrap="wrap" gap={4}>
                                        {kullOptions.map((kull) => (
                                            <Checkbox.Root
                                                key={kull}
                                                checked={formData.allowed_kull.includes(kull)}
                                                onCheckedChange={(details) =>
                                                    toggleAllowedKull(kull, !!details.checked)
                                                }
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label>
                                                    {kullToKlasse(kull)}. klasse
                                                </Checkbox.Label>
                                            </Checkbox.Root>
                                        ))}
                                    </Box>
                                    <Text fontSize="xs" color="fg.muted" mt={2}>
                                        Fjern avhukingen for kull som ikke skal kunne melde seg på.
                                    </Text>
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                                        Reserverte plasser
                                    </Text>
                                    <Text fontSize="xs" color="fg.muted" mb={3}>
                                        Reserver et antall av plassene for én eller flere klasser.
                                        Resten av plassene er åpne for alle. Deltakere havner i den
                                        mest spesifikke puljen de passer i, deretter i bredere
                                        puljer, og til slutt på de åpne plassene. Puljer kan ligge
                                        inni hverandre (f.eks. 3.–6. og 6. klasse), men ikke delvis
                                        overlappe.
                                    </Text>
                                    <Stack gap={2}>
                                        {formData.kull_pools.map((pool, index) => (
                                            <Box
                                                key={index}
                                                p={3}
                                                borderWidth="1px"
                                                borderColor="gray.200"
                                                rounded="md"
                                            >
                                                <Box
                                                    display="flex"
                                                    flexWrap="wrap"
                                                    gap={3}
                                                    mb={3}
                                                    role="group"
                                                    aria-label={`Klasser i pulje ${index + 1}`}
                                                >
                                                    {poolKullOptions.map((kull) => (
                                                        <Checkbox.Root
                                                            key={kull}
                                                            size="sm"
                                                            checked={pool.kull.includes(kull)}
                                                            onCheckedChange={(details) =>
                                                                togglePoolKull(
                                                                    index,
                                                                    kull,
                                                                    !!details.checked
                                                                )
                                                            }
                                                        >
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                            <Checkbox.Label>
                                                                {kullToKlasse(kull)}. klasse
                                                            </Checkbox.Label>
                                                        </Checkbox.Root>
                                                    ))}
                                                </Box>
                                                <Box display="flex" gap={2} alignItems="center">
                                                    <Input
                                                        aria-label="Antall plasser"
                                                        type="number"
                                                        min="1"
                                                        w="8rem"
                                                        value={pool.spots}
                                                        onChange={(e) =>
                                                            updateKullPool(index, {
                                                                spots: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Plasser"
                                                    />
                                                    <Text fontSize="sm" color="fg.muted" flex="1">
                                                        {pool.kull.length > 0
                                                            ? `plasser for ${formatPoolKlasser(pool.kull)}`
                                                            : 'Velg klasser'}
                                                    </Text>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeKullPool(index)}
                                                    >
                                                        Fjern
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        mt={formData.kull_pools.length > 0 ? 3 : 0}
                                        onClick={addKullPool}
                                    >
                                        Legg til reserverte plasser
                                    </Button>
                                    {formData.kull_pools.length > 0 && (
                                        <Text fontSize="xs" color="fg.muted" mt={2}>
                                            {Number.isFinite(maxAttendeesInput)
                                                ? `${reservedSpots} reservert, ${Math.max(0, maxAttendeesInput - reservedSpots)} åpne for alle.`
                                                : 'Sett maks antall deltakere for å bruke reserverte plasser.'}
                                        </Text>
                                    )}
                                </Box>
                            </>
                        )}
                    </FormSection>

                    {!signupUndecided && (
                        <FormSection
                            title="Påmeldingsskjema"
                            description="Hva deltakerne fyller ut når de melder seg på."
                        >
                            <Field.Root>
                                <Checkbox.Root
                                    checked={hasFood}
                                    onCheckedChange={(details) => setHasFood(!!details.checked)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Servering av mat eller drikke</Checkbox.Label>
                                </Checkbox.Root>
                                <Field.HelperText>
                                    Deltakerne blir spurt om allergier og matpreferanser.
                                </Field.HelperText>
                            </Field.Root>

                            <Field.Root>
                                <Checkbox.Root
                                    checked={formData.require_phone}
                                    onCheckedChange={(details) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            require_phone: !!details.checked,
                                        }))
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Krev telefonnummer</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>

                            <Field.Root>
                                <Checkbox.Root
                                    checked={hasExtraQuestions}
                                    onCheckedChange={(details) => {
                                        const checked = !!details.checked
                                        setHasExtraQuestions(checked)
                                        // Start with one empty question so there is something to fill in
                                        if (checked && formData.signup_questions.length === 0) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                signup_questions: [newSignupQuestionDraft()],
                                            }))
                                        }
                                    }}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Ekstra spørsmål til deltakerne?</Checkbox.Label>
                                </Checkbox.Root>
                                <Field.HelperText>
                                    Navn, e-post, kull og TrAMS-medlemskap spørres det allerede om.
                                </Field.HelperText>
                            </Field.Root>
                            {hasExtraQuestions && (
                                <SignupQuestionsEditor
                                    value={formData.signup_questions}
                                    onChange={(signup_questions) =>
                                        setFormData((prev) => ({ ...prev, signup_questions }))
                                    }
                                />
                            )}
                        </FormSection>
                    )}

                    <FormSection title="Etter arrangementet">
                        <Field.Root>
                            <Checkbox.Root
                                checked={hasFeedbackForm}
                                onCheckedChange={(details) => {
                                    const checked = !!details.checked
                                    setHasFeedbackForm(checked)
                                    if (checked && feedbackQuestions.length === 0) {
                                        setFeedbackQuestions([newFeedbackQuestion()])
                                    }
                                }}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Bruk tilbakemeldingsskjema</Checkbox.Label>
                            </Checkbox.Root>
                            <Field.HelperText>
                                Anonyme spørsmål som sendes på e-post til de som møtte, fra
                                deltakerlisten etter arrangementet. Svarene vises under
                                «Tilbakemeldinger» i admin.
                            </Field.HelperText>
                        </Field.Root>

                        {hasFeedbackForm && (
                            <FeedbackQuestionsEditor
                                value={feedbackQuestions}
                                onChange={setFeedbackQuestions}
                            />
                        )}

                        <Field.Root>
                            <Field.Label>Beskrivelse på kursbevis</Field.Label>
                            <Textarea
                                name="certificate_description"
                                value={formData.certificate_description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="F.eks. Kurset omfatter en gjennomgang av prosedyren for perifer venekanylering, samt praktisk trening i mindre grupper med instruktører."
                            />
                            <Field.HelperText>
                                Valgfritt. Vises på kursbeviset de som møtte får på e-post.
                            </Field.HelperText>
                        </Field.Root>
                    </FormSection>

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
                            disabled={endBeforeStart}
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
