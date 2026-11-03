'use client'

import { useEffect, useState } from 'react'
import { Dialog, Button, Stack, Text, Image, Spinner, Flex, HStack } from '@chakra-ui/react'
import { QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { toaster } from '@/components/ui/toaster'

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no').replace(/\/$/, '')

interface EventQrCodeButtonProps {
    slug: string
}

function eventPublicUrl(slug: string) {
    return `${SITE_ORIGIN}/arrangementer/${encodeURIComponent(slug)}`
}

function triggerDownload(href: string, filename: string) {
    const link = document.createElement('a')
    link.href = href
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export default function EventQrCodeButton({ slug }: EventQrCodeButtonProps) {
    const [open, setOpen] = useState(false)
    const [pngDataUrl, setPngDataUrl] = useState<string | null>(null)
    const url = eventPublicUrl(slug)

    useEffect(() => {
        if (!open) return
        let cancelled = false
        // High resolution so the PNG prints sharply on posters
        QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: 'M' })
            .then((dataUrl) => {
                if (!cancelled) setPngDataUrl(dataUrl)
            })
            .catch(() => {
                toaster.create({ title: 'Kunne ikke lage QR-kode', type: 'error', duration: 5000 })
            })
        return () => {
            cancelled = true
        }
    }, [open, url])

    const downloadSvg = async () => {
        const svg = await QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' })
        const blobUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
        triggerDownload(blobUrl, `${slug}-qr.svg`)
        URL.revokeObjectURL(blobUrl)
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            toaster.create({ title: 'Lenke kopiert', type: 'success', duration: 3000 })
        } catch {
            toaster.create({ title: 'Kunne ikke kopiere lenken', type: 'error', duration: 5000 })
        }
    }

    return (
        <>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                <QrCode size={16} />
                QR-kode
            </Button>

            <Dialog.Root open={open} onOpenChange={({ open: isOpen }) => setOpen(isOpen)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="md">
                        <Dialog.Header>
                            <Dialog.Title>QR-kode til arrangementet</Dialog.Title>
                            <Dialog.CloseTrigger />
                        </Dialog.Header>

                        <Dialog.Body>
                            <Stack gap={4} align="center">
                                {pngDataUrl ? (
                                    <Image
                                        src={pngDataUrl}
                                        alt={`QR-kode som lenker til ${url}`}
                                        w="256px"
                                        h="256px"
                                    />
                                ) : (
                                    <Flex w="256px" h="256px" align="center" justify="center">
                                        <Spinner />
                                    </Flex>
                                )}
                                <Text fontSize="sm" color="gray.600" wordBreak="break-all" textAlign="center">
                                    {url}
                                </Text>
                            </Stack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack gap={2} flexWrap="wrap" justify="flex-end">
                                <Button variant="outline" onClick={copyLink}>
                                    Kopier lenke
                                </Button>
                                <Button variant="outline" onClick={downloadSvg}>
                                    Last ned SVG
                                </Button>
                                <Button
                                    disabled={!pngDataUrl}
                                    onClick={() => pngDataUrl && triggerDownload(pngDataUrl, `${slug}-qr.png`)}
                                >
                                    Last ned PNG
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}
