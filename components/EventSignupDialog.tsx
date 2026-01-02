'use client'

import { useState } from 'react'
import {
    Dialog,
    Input,
    Textarea,
    Button,
    NativeSelect,
    Field,
} from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { activeYears } from '@/utils/functions/activeYears'

interface EventSignupDialogProps {
    open: boolean
    onClose: () => void
    eventId: number
    eventTitle: string
    onSuccess?: () => void
}

interface SignupFormData {
    name: string
    email: string
    kull: string
    allergies: string
}

export default function EventSignupDialog({
    open,
    onClose,
    eventId,
    eventTitle,
    onSuccess,
}: EventSignupDialogProps) {
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        kull: '',
        allergies: '',
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
            const response = await fetch('/api/events/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    eventId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign up')
            }

            toaster.create({
                title: 'Påmelding vellykket!',
                type: 'success',
                description: 'Du er nå påmeldt ' + eventTitle,
                duration: 5000,
            })

            // Reset form
            setFormData({
                name: '',
                email: '',
                kull: '',
                allergies: '',
            })

            onSuccess?.()
            onClose()
        } catch (error) {
            toaster.create({
                title: 'Påmelding feilet!',
                type: 'error',
                description: 'Noe gikk galt',
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
                                        {activeYears().map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>

                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>

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
