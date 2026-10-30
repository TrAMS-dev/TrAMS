'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Box, Button, Dialog, Field, Input, Link, Text, Textarea } from '@chakra-ui/react'
import { MessageSquare } from 'lucide-react'
import { toaster } from '@/components/ui/toaster'

const MAX_MESSAGE_LENGTH = 5000

/**
 * Footer link that opens a form for sending feedback about the website to the web team
 */
export default function FeedbackDialog() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/send/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, email, page: pathname, website }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    typeof data.error === 'string' && data.error
                        ? data.error
                        : 'Kunne ikke sende tilbakemeldingen'
                )
            }

            toaster.create({
                title: 'Takk for tilbakemeldingen!',
                type: 'success',
                description: email
                    ? 'Vi har mottatt den og svarer deg på e-post hvis det trengs.'
                    : 'Vi har mottatt den.',
                duration: 5000,
            })

            setMessage('')
            setEmail('')
            setOpen(false)
        } catch (error) {
            toaster.create({
                title: 'Kunne ikke sende tilbakemeldingen',
                type: 'error',
                description: error instanceof Error ? error.message : 'Noe gikk galt',
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
            <Dialog.Trigger asChild>
                <Link
                    as="button"
                    color="black"
                    textDecoration="none"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    _hover={{ color: 'var(--color-primary)' }}
                >
                    <MessageSquare size={20} />
                    Gi tilbakemelding på nettsiden
                </Link>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Tilbakemelding på nettsiden</Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <form onSubmit={handleSubmit}>
                        <Dialog.Body display="flex" flexDirection="column" gap={4}>
                            <Text color="gray.600">
                                Har du funnet en feil, noe som er utdatert, eller et forslag til forbedring? Gi oss
                                beskjed!
                            </Text>

                            <Field.Root required>
                                <Field.Label>Tilbakemelding *</Field.Label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    rows={5}
                                    placeholder="Hva kan vi gjøre bedre?"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>E-post</Field.Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="navn@eksempel.no"
                                />
                                <Field.HelperText>Valgfritt – fyll inn hvis du vil ha svar.</Field.HelperText>
                            </Field.Root>

                            {/* Honeypot: hidden from people, filled in by bots */}
                            <Box position="absolute" left="-9999px" aria-hidden="true">
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </Box>
                        </Dialog.Body>

                        <Dialog.Footer gap={3}>
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                                Avbryt
                            </Button>
                            <Button type="submit" loading={isSubmitting} bg="var(--color-primary)" color="white">
                                Send
                            </Button>
                        </Dialog.Footer>
                    </form>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
