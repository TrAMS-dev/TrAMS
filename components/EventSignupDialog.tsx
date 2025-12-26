'use client'

import { useState } from 'react'
import {
    Dialog,
    Input,
    Textarea,
    Button,
    Field,
} from '@chakra-ui/react'

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

            alert('Påmelding vellykket! Du er nå påmeldt ' + eventTitle)

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
            alert('Påmelding feilet: ' + (error instanceof Error ? error.message : 'Noe gikk galt'))
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
                            <Field.Root>
                                <Field.Label>Navn *</Field.Label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ola Nordmann"
                                    required
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>E-post *</Field.Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ola.nordmann@ntnu.no"
                                    required
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Kull *</Field.Label>
                                <Input
                                    name="kull"
                                    value={formData.kull}
                                    onChange={handleChange}
                                    placeholder="2023"
                                    required
                                />
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
