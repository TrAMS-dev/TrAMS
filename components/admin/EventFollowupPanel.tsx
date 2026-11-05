'use client'

import { useState } from 'react'
import { Box, Button, Checkbox, HStack, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { toaster } from '@/components/ui/toaster'

interface EventFollowupPanelProps {
    eventId: number
    eventSlug: string
    eventIsPast: boolean
    /** Arrangementet har tilbakemeldingsskjema med minst ett spørsmål. */
    feedbackFormReady: boolean
    attendedCount: number
    /** Antall som har møtt og ikke har fått e-posten ennå. */
    notSentCount: number
    onSent: (participantIds: number[], sentAt: string) => void
}

/** Sender lenke til tilbakemeldingsskjema og kursbevis til deltakere registrert som «Møtt». */
export default function EventFollowupPanel({
    eventId,
    eventSlug,
    eventIsPast,
    feedbackFormReady,
    attendedCount,
    notSentCount,
    onSent,
}: EventFollowupPanelProps) {
    const [sendFeedback, setSendFeedback] = useState(feedbackFormReady)
    const [sendCertificate, setSendCertificate] = useState(true)
    const [sending, setSending] = useState(false)

    const includeFeedback = sendFeedback && feedbackFormReady
    const nothingSelected = !includeFeedback && !sendCertificate
    const whatText = [
        includeFeedback ? 'tilbakemeldingsskjema' : null,
        sendCertificate ? 'kursbevis' : null,
    ]
        .filter(Boolean)
        .join(' og ')

    const send = async (resendAll: boolean) => {
        const count = resendAll ? attendedCount : notSentCount
        const ok = window.confirm(
            resendAll
                ? `Sende e-post med ${whatText} på nytt til alle ${count} som har møtt? De som har fått den før, får den en gang til.`
                : `Sende e-post med ${whatText} til ${count} som har møtt?`
        )
        if (!ok) return

        setSending(true)
        try {
            const res = await fetch('/api/admin/event-participants/followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    sendFeedback: includeFeedback,
                    sendCertificate,
                    resendAll,
                }),
            })
            const payload = (await res.json().catch(() => ({}))) as {
                error?: string
                sent?: number
                participantIds?: number[]
                sentAt?: string | null
            }
            if (!res.ok) throw new Error(payload.error || 'Kunne ikke sende e-post')

            const sent = payload.sent ?? 0
            if (sent > 0 && payload.participantIds && payload.sentAt) {
                onSent(payload.participantIds, payload.sentAt)
            }
            toaster.create({
                title: sent > 0 ? 'E-post sendt' : 'Ingen e-post sendt',
                description:
                    sent > 0
                        ? `${sent} deltaker(e) har fått e-post med ${whatText}.`
                        : 'Fant ingen som har møtt med gyldig e-postadresse.',
                type: sent > 0 ? 'success' : 'warning',
                duration: 6000,
            })
        } catch (e) {
            console.error('Followup error:', e)
            toaster.create({
                title: 'Kunne ikke sende e-post',
                description: e instanceof Error ? e.message : 'Prøv igjen eller kontakt administrator.',
                type: 'error',
                duration: 7000,
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <Box mb={4} p={4} borderWidth="1px" borderRadius="md" borderColor="blue.200" bg="blue.50">
            <Text fontWeight="semibold" mb={1}>
                Etter arrangementet
            </Text>

            {!eventIsPast ? (
                <Text fontSize="sm" color="gray.700">
                    Når arrangementet er ferdig, kan du sende lenke til tilbakemeldingsskjema og
                    personlig kursbevis på e-post til alle som er registrert som «Møtt».
                </Text>
            ) : (
                <Stack gap={3}>
                    <Text fontSize="sm" color="gray.700">
                        Send e-post til deltakerne som er registrert som «Møtt». Kursbeviset er en
                        personlig side med navn, kurs og dato som de kan skrive ut eller lagre som
                        PDF. {attendedCount} har møtt, {attendedCount - notSentCount} har allerede
                        fått e-posten.
                    </Text>

                    <Stack gap={1}>
                        <Checkbox.Root
                            checked={includeFeedback}
                            disabled={!feedbackFormReady}
                            onCheckedChange={(d) => setSendFeedback(!!d.checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Lenke til tilbakemeldingsskjema</Checkbox.Label>
                        </Checkbox.Root>
                        {!feedbackFormReady && (
                            <Text fontSize="xs" color="gray.600" pl={7}>
                                Arrangementet har ikke tilbakemeldingsskjema.{' '}
                                <NextLink
                                    href={`/admin/arrangement/${eventSlug}`}
                                    style={{ textDecoration: 'underline' }}
                                >
                                    Legg det til under «Rediger»
                                </NextLink>
                                .
                            </Text>
                        )}
                        <Checkbox.Root
                            checked={sendCertificate}
                            onCheckedChange={(d) => setSendCertificate(!!d.checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Personlig kursbevis</Checkbox.Label>
                        </Checkbox.Root>
                    </Stack>

                    <HStack flexWrap="wrap" gap={3}>
                        <Button
                            colorPalette="blue"
                            loading={sending}
                            disabled={sending || nothingSelected || notSentCount === 0}
                            onClick={() => send(false)}
                        >
                            {notSentCount > 0
                                ? `Send til ${notSentCount} som ikke har fått e-post`
                                : 'Alle som har møtt har fått e-post'}
                        </Button>
                        {attendedCount > notSentCount && (
                            <Button
                                variant="outline"
                                colorPalette="blue"
                                disabled={sending || nothingSelected}
                                onClick={() => send(true)}
                            >
                                Send på nytt til alle ({attendedCount})
                            </Button>
                        )}
                    </HStack>
                </Stack>
            )}
        </Box>
    )
}
