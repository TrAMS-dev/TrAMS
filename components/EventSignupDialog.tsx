'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Box,
    Dialog,
    Input,
    Textarea,
    Button,
    NativeSelect,
    Field,
    Checkbox,
    Fieldset,
    Stack,
    Text,
} from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { activeYears, isKullAllowed } from '@/utils/functions/activeYears'
import {
    type SignupAnswer,
    type SignupAnswers,
    type SignupQuestion,
    validateSignupAnswers,
} from '@/lib/signupQuestions'

interface EventSignupDialogProps {
    open: boolean
    onClose: () => void
    eventId: number
    eventTitle: string
    onSuccess?: () => void
    eventHasFood: boolean
    /** Medlemskap — fra Sanity (`forMedisinstudenterPage.membershipSignupUrl`) eller fallback. */
    membershipSignupHref?: string
    eventSignupQuestions?: SignupQuestion[]
    eventRequiresPhone?: boolean
    /** Null or empty means every kull may sign up. */
    eventAllowedKull?: number[] | null
}

interface SignupFormData {
    name: string
    email: string
    kull: string
    phone: string
    allergies: string
}

export default function EventSignupDialog({
    open,
    onClose,
    eventId,
    eventTitle,
    eventHasFood,
    onSuccess,
    membershipSignupHref = 'https://forms.gle/GDLsAZTeVvTKmCqw9',
    eventSignupQuestions = [],
    eventRequiresPhone = false,
    eventAllowedKull,
}: EventSignupDialogProps) {
    const membershipLinkIsExternal = /^https?:\/\//i.test(membershipSignupHref)
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        kull: '',
        phone: '',
        allergies: '',
    })
    const [declaresTramsMember, setDeclaresTramsMember] = useState(false)
    const [answers, setAnswers] = useState<SignupAnswers>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const setAnswer = (questionId: string, answer: SignupAnswer) =>
        setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    const toggleChoice = (questionId: string, option: string, checked: boolean) => {
        const current = answers[questionId]
        const chosen = Array.isArray(current) ? current : []
        setAnswer(
            questionId,
            checked ? [...chosen, option] : chosen.filter((o) => o !== option)
        )
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.kull.trim()) {
            toaster.create({
                title: 'Velg kull',
                type: 'error',
                description: 'Du må velge kull for å melde deg på.',
                duration: 5000,
            })
            return
        }
        if (eventRequiresPhone && !formData.phone.trim()) {
            toaster.create({
                title: 'Oppgi telefonnummer',
                type: 'error',
                description: 'Du må oppgi telefonnummer for å melde deg på dette arrangementet.',
                duration: 5000,
            })
            return
        }
        const answerCheck = validateSignupAnswers(eventSignupQuestions, answers)
        if ('error' in answerCheck) {
            toaster.create({
                title: 'Svar på spørsmålene',
                type: 'error',
                description: answerCheck.error,
                duration: 5000,
            })
            return
        }
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/events/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    eventId,
                    confirmedTramsMember: declaresTramsMember,
                    questionAnswers: answerCheck.answers,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    typeof data.error === 'string' && data.error
                        ? data.error
                        : 'Påmelding feilet'
                )
            }

            const onWaitlist = data.registrationStatus === 'waitlist'

            toaster.create({
                title: onWaitlist ? 'Du står på venteliste' : 'Påmelding vellykket!',
                type: 'success',
                description: onWaitlist
                    ? `Det er ingen ledige plasser for kullet ditt. Du er satt på venteliste for ${eventTitle}. Du får en bekreftelse på e-post.`
                    : `Du er påmeldt ${eventTitle}. Du får en bekreftelse på e-post.`,
                duration: 6000,
            })

            // Reset form
            setFormData({
                name: '',
                email: '',
                kull: '',
                phone: '',
                allergies: '',
            })
            setDeclaresTramsMember(false)
            setAnswers({})

            onSuccess?.()
            onClose()
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Noe gikk galt'
            toaster.create({
                title: 'Påmelding feilet!',
                type: 'error',
                description: message,
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Meld deg på {eventTitle}</Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <form onSubmit={handleSubmit}>
                        <Dialog.Body display="flex" flexDirection="column" gap={4}>
                            <Field.Root required>
                                <Field.Label>Navn *</Field.Label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ola Nordmann"
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>E-post *</Field.Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ola.nordmann@ntnu.no"
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Kull *</Field.Label>

                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        name="kull"
                                        value={formData.kull}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, kull: e.target.value }))
                                        }
                                    >
                                        <option value="" disabled>
                                            Velg kull
                                        </option>
                                        {activeYears()
                                            .filter((year) => isKullAllowed(year, eventAllowedKull))
                                            .map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                    </NativeSelect.Field>

                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>

                            {eventRequiresPhone && (
                                <Field.Root required>
                                    <Field.Label>Telefonnummer *</Field.Label>
                                    <Input
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="123 45 678"
                                    />
                                </Field.Root>
                            )}

                            {eventHasFood && (
                                <Field.Root>
                                    <Field.Label>Allergier / Matpreferanser</Field.Label>
                                    <Textarea
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        placeholder="Skriv inn eventuelle allergier eller matpreferanser..."
                                        rows={3}
                                    />
                                </Field.Root>
                            )}

                            {eventSignupQuestions.map((q) => {
                                const answer = answers[q.id]
                                const label = `${q.label}${q.required ? ' *' : ''}`

                                if (q.type === 'checkbox') {
                                    return (
                                        <Checkbox.Root
                                            key={q.id}
                                            checked={answer === true}
                                            onCheckedChange={(details) =>
                                                setAnswer(q.id, !!details.checked)
                                            }
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>{label}</Checkbox.Label>
                                        </Checkbox.Root>
                                    )
                                }

                                if (q.type === 'multi_choice') {
                                    const chosen = Array.isArray(answer) ? answer : []
                                    return (
                                        <Fieldset.Root key={q.id}>
                                            <Fieldset.Legend fontSize="sm" fontWeight="medium">
                                                {label}
                                            </Fieldset.Legend>
                                            <Stack gap={2} mt={2}>
                                                {q.options.map((option) => (
                                                    <Checkbox.Root
                                                        key={option}
                                                        checked={chosen.includes(option)}
                                                        onCheckedChange={(details) =>
                                                            toggleChoice(
                                                                q.id,
                                                                option,
                                                                !!details.checked
                                                            )
                                                        }
                                                    >
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                        <Checkbox.Label>{option}</Checkbox.Label>
                                                    </Checkbox.Root>
                                                ))}
                                            </Stack>
                                        </Fieldset.Root>
                                    )
                                }

                                return (
                                    <Field.Root key={q.id} required={q.required}>
                                        <Field.Label>{label}</Field.Label>
                                        {q.type === 'text' ? (
                                            <Input
                                                value={typeof answer === 'string' ? answer : ''}
                                                onChange={(e) => setAnswer(q.id, e.target.value)}
                                                maxLength={1000}
                                            />
                                        ) : (
                                            <NativeSelect.Root>
                                                <NativeSelect.Field
                                                    value={typeof answer === 'string' ? answer : ''}
                                                    onChange={(e) =>
                                                        setAnswer(q.id, e.target.value)
                                                    }
                                                >
                                                    <option value="" disabled={q.required}>
                                                        Velg
                                                    </option>
                                                    {q.options.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        )}
                                    </Field.Root>
                                )
                            })}

                            <Box>
                                <Checkbox.Root
                                    checked={declaresTramsMember}
                                    onCheckedChange={(details) =>
                                        setDeclaresTramsMember(!!details.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        Jeg er TrAMS-medlem og har betalt medlemsgebyret.
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            </Box>

                            <Box
                                borderWidth="1px"
                                borderRadius="md"
                                px={3}
                                py={2.5}
                                bg="gray.50"
                                _dark={{ bg: 'whiteAlpha.50' }}
                            >
                                <Text fontSize="sm" color="fg.muted">
                                    Ikke medlem ennå? Bli det{' '}
                                    <Link
                                        href={membershipSignupHref}
                                        {...(membershipLinkIsExternal
                                            ? {
                                                target: '_blank',
                                                rel: 'noopener noreferrer',
                                            }
                                            : {})}
                                        style={{
                                            color: 'var(--color-primary)',
                                            textDecoration: 'underline',
                                            fontWeight: 500,
                                        }}
                                    >
                                        her
                                    </Link>
                                </Text>
                            </Box>
                        </Dialog.Body>

                        <Dialog.Footer gap={3}>
                            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Avbryt
                            </Button>
                            <Button type="submit" loading={isSubmitting} bg="var(--color-primary)" color="white">
                                Meld meg på
                            </Button>
                        </Dialog.Footer>
                    </form>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
