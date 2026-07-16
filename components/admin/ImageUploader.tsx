'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Button, Image, Text, Stack, HStack } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'

/** Fallback aspect when the preview frame has not been measured yet. */
const FALLBACK_ASPECT = 2.5
const OUTPUT_WIDTH = 1600
const MIN_SCALE = 1
const MAX_SCALE = 3

/** Same height as the public event hero in EventData. */
const PREVIEW_FRAME_PROPS = {
    w: 'full' as const,
    h: { base: '30vh', md: '40vh' } as const,
    minH: '240px',
}

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    bucketName?: string
    folder?: string
}

interface CropState {
    objectUrl: string
    naturalWidth: number
    naturalHeight: number
    scale: number
    /** Top-left of the scaled image relative to the frame */
    offsetX: number
    offsetY: number
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function getScaledSize(
    naturalWidth: number,
    naturalHeight: number,
    frameWidth: number,
    frameHeight: number,
    scale: number
) {
    const coverScale = Math.max(frameWidth / naturalWidth, frameHeight / naturalHeight)
    return {
        width: naturalWidth * coverScale * scale,
        height: naturalHeight * coverScale * scale,
    }
}

function clampOffsets(
    offsetX: number,
    offsetY: number,
    scaledWidth: number,
    scaledHeight: number,
    frameWidth: number,
    frameHeight: number
) {
    return {
        offsetX: clamp(offsetX, Math.min(0, frameWidth - scaledWidth), 0),
        offsetY: clamp(offsetY, Math.min(0, frameHeight - scaledHeight), 0),
    }
}

function centeredOffsets(
    naturalWidth: number,
    naturalHeight: number,
    frameWidth: number,
    frameHeight: number,
    scale: number
) {
    const { width, height } = getScaledSize(
        naturalWidth,
        naturalHeight,
        frameWidth,
        frameHeight,
        scale
    )
    return clampOffsets(
        (frameWidth - width) / 2,
        (frameHeight - height) / 2,
        width,
        height,
        frameWidth,
        frameHeight
    )
}

export function ImageUploader({
    value,
    onChange,
    bucketName = 'event-images',
    folder = 'arrangements',
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [crop, setCrop] = useState<CropState | null>(null)
    const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [needsCenter, setNeedsCenter] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(
        null
    )
    const supabase = createClient()

    const frameWidth = frameSize.width
    const frameHeight = frameSize.height

    useEffect(() => {
        const frame = frameRef.current
        if (!frame) return

        const updateSize = () => {
            setFrameSize({
                width: frame.clientWidth,
                height: frame.clientHeight,
            })
        }
        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(frame)
        return () => observer.disconnect()
    }, [crop, value])

    useEffect(() => {
        return () => {
            if (crop?.objectUrl) URL.revokeObjectURL(crop.objectUrl)
        }
    }, [crop?.objectUrl])

    useEffect(() => {
        if (!crop || !needsCenter || frameWidth === 0) return
        const offsets = centeredOffsets(
            crop.naturalWidth,
            crop.naturalHeight,
            frameWidth,
            frameHeight,
            crop.scale
        )
        setCrop((prev) => (prev ? { ...prev, ...offsets } : prev))
        setNeedsCenter(false)
    }, [crop, needsCenter, frameWidth, frameHeight])

    const resetCrop = useCallback(() => {
        setCrop((prev) => {
            if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl)
            return null
        })
        setNeedsCenter(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Vennligst velg en gyldig bildefil')
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Bildet må være mindre enn 10MB')
            return
        }

        setError(null)
        const objectUrl = URL.createObjectURL(file)
        const img = new window.Image()
        img.onload = () => {
            setCrop({
                objectUrl,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
            })
            setNeedsCenter(true)
        }
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            setError('Kunne ikke laste bildet')
        }
        img.src = objectUrl
    }

    const handleScaleChange = (nextScale: number) => {
        if (!crop || frameWidth === 0) return

        const centerX = -crop.offsetX + frameWidth / 2
        const centerY = -crop.offsetY + frameHeight / 2
        const ratio = nextScale / crop.scale

        const next = getScaledSize(
            crop.naturalWidth,
            crop.naturalHeight,
            frameWidth,
            frameHeight,
            nextScale
        )
        const offsets = clampOffsets(
            frameWidth / 2 - centerX * ratio,
            frameHeight / 2 - centerY * ratio,
            next.width,
            next.height,
            frameWidth,
            frameHeight
        )

        setCrop({ ...crop, scale: nextScale, ...offsets })
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!crop) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setIsDragging(true)
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            offsetX: crop.offsetX,
            offsetY: crop.offsetY,
        }
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!crop || !dragStartRef.current || frameWidth === 0) return
        const { width, height } = getScaledSize(
            crop.naturalWidth,
            crop.naturalHeight,
            frameWidth,
            frameHeight,
            crop.scale
        )
        const offsets = clampOffsets(
            dragStartRef.current.offsetX + (e.clientX - dragStartRef.current.x),
            dragStartRef.current.offsetY + (e.clientY - dragStartRef.current.y),
            width,
            height,
            frameWidth,
            frameHeight
        )
        setCrop({ ...crop, ...offsets })
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId)
        }
        setIsDragging(false)
        dragStartRef.current = null
    }

    const cropToBlob = async (state: CropState): Promise<Blob> => {
        const aspect =
            frameWidth > 0 && frameHeight > 0 ? frameWidth / frameHeight : FALLBACK_ASPECT
        const outputHeight = Math.round(OUTPUT_WIDTH / aspect)

        const canvas = document.createElement('canvas')
        canvas.width = OUTPUT_WIDTH
        canvas.height = outputHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Kunne ikke opprette canvas')

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new window.Image()
            el.onload = () => resolve(el)
            el.onerror = () => reject(new Error('Kunne ikke laste bildet'))
            el.src = state.objectUrl
        })

        const sourceFrameW = frameWidth > 0 ? frameWidth : OUTPUT_WIDTH
        const sourceFrameH = frameHeight > 0 ? frameHeight : Math.round(OUTPUT_WIDTH / aspect)
        const { width, height } = getScaledSize(
            state.naturalWidth,
            state.naturalHeight,
            sourceFrameW,
            sourceFrameH,
            state.scale
        )

        const scaleX = state.naturalWidth / width
        const scaleY = state.naturalHeight / height
        const sx = -state.offsetX * scaleX
        const sy = -state.offsetY * scaleY
        const sWidth = sourceFrameW * scaleX
        const sHeight = sourceFrameH * scaleY

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, OUTPUT_WIDTH, outputHeight)

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Kunne ikke generere bilde'))
                },
                'image/jpeg',
                0.9
            )
        })
    }

    const handleConfirmCrop = async () => {
        if (!crop) return
        setIsUploading(true)
        setError(null)

        try {
            const blob = await cropToBlob(crop)
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`

            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/jpeg',
                })

            if (uploadError) throw uploadError

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucketName).getPublicUrl(data.path)

            onChange(publicUrl)
            resetCrop()
        } catch (err) {
            console.error('Upload error:', err)
            setError(err instanceof Error ? err.message : 'Kunne ikke laste opp bildet')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = async () => {
        if (!value) return

        try {
            const url = new URL(value)
            const path = url.pathname.split(`/storage/v1/object/public/${bucketName}/`)[1]
            if (path) {
                await supabase.storage.from(bucketName).remove([path])
            }
            onChange('')
            setError(null)
        } catch (err) {
            console.error('Remove error:', err)
            onChange('')
        }
    }

    const displaySize =
        crop && frameWidth > 0
            ? getScaledSize(
                  crop.naturalWidth,
                  crop.naturalHeight,
                  frameWidth,
                  frameHeight,
                  crop.scale
              )
            : null

    return (
        <Stack gap={3} w="full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {crop ? (
                <Stack gap={3} w="full">
                    <Box
                        ref={frameRef}
                        position="relative"
                        {...PREVIEW_FRAME_PROPS}
                        overflow="hidden"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="gray.900"
                        cursor={isDragging ? 'grabbing' : 'grab'}
                        touchAction="none"
                        userSelect="none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        {displaySize && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={crop.objectUrl}
                                alt="Beskjær bilde"
                                draggable={false}
                                style={{
                                    position: 'absolute',
                                    width: displaySize.width,
                                    height: displaySize.height,
                                    left: crop.offsetX,
                                    top: crop.offsetY,
                                    maxWidth: 'none',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                        <Box
                            position="absolute"
                            inset={0}
                            bg="rgba(0,0,0,0.35)"
                            pointerEvents="none"
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={4}
                        >
                            <Text color="white" fontWeight="semibold" fontSize="sm" opacity={0.9}>
                                Slik vil bildet se ut i headeren
                            </Text>
                        </Box>
                    </Box>

                    <Box w="full">
                        <Text fontSize="sm" mb={1}>
                            Zoom: {crop.scale.toFixed(1)}×
                        </Text>
                        <input
                            type="range"
                            min={MIN_SCALE}
                            max={MAX_SCALE}
                            step={0.05}
                            value={crop.scale}
                            onChange={(e) => handleScaleChange(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </Box>

                    <HStack>
                        <Button
                            size="sm"
                            onClick={handleConfirmCrop}
                            loading={isUploading}
                            bg="var(--color-primary)"
                            color="white"
                        >
                            Bruk bilde
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={resetCrop}
                            disabled={isUploading}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </Stack>
            ) : value ? (
                <Box w="full">
                    <Box
                        ref={frameRef}
                        position="relative"
                        {...PREVIEW_FRAME_PROPS}
                        overflow="hidden"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="gray.100"
                    >
                        <Image
                            src={value}
                            alt="Arrangementsbilde"
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            objectPosition="center"
                        />
                        <Box
                            position="absolute"
                            inset={0}
                            bg="rgba(0,0,0,0.35)"
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={4}
                            pointerEvents="none"
                        >
                            <Text color="white" fontWeight="semibold" fontSize="sm" opacity={0.9}>
                                Header-forhåndsvisning
                            </Text>
                        </Box>
                    </Box>
                    <HStack mt={2}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            Bytt bilde
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            colorPalette="red"
                            onClick={handleRemove}
                            disabled={isUploading}
                        >
                            Fjern bilde
                        </Button>
                    </HStack>
                </Box>
            ) : (
                <Box w="full">
                    <Box
                        ref={frameRef}
                        {...PREVIEW_FRAME_PROPS}
                        borderRadius="md"
                        border="1px dashed"
                        borderColor="gray.300"
                        bg="gray.50"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        onClick={() => fileInputRef.current?.click()}
                        _hover={{ borderColor: 'gray.400', bg: 'gray.100' }}
                    >
                        <Stack align="center" gap={2} p={4}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    fileInputRef.current?.click()
                                }}
                                loading={isUploading}
                                variant="outline"
                            >
                                Velg bilde
                            </Button>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                Forhåndsvisningen fyller samme høyde som headerbildet. Du kan zoome
                                og flytte før opplasting.
                            </Text>
                        </Stack>
                    </Box>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                        Maks 10MB. Støttede formater: JPG, PNG, GIF, WebP
                    </Text>
                </Box>
            )}

            {error && (
                <Text fontSize="sm" color="red.600">
                    {error}
                </Text>
            )}
        </Stack>
    )
}
