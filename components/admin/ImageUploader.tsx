'use client'

import { useState, useRef } from 'react'
import { Box, Button, Image, Text, Stack, HStack } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    bucketName?: string
    folder?: string
}

export function ImageUploader({
    value,
    onChange,
    bucketName = 'event-images',
    folder = 'arrangements',
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vennligst velg en gyldig bildefil')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Bildet må være mindre enn 5MB')
            return
        }

        setError(null)
        setIsUploading(true)

        try {
            // Create a unique filename with timestamp
            const fileExt = file.name.split('.').pop()
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(data.path)

            onChange(publicUrl)
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
            // Extract the path from the URL
            const url = new URL(value)
            const path = url.pathname.split(`/storage/v1/object/public/${bucketName}/`)[1]

            if (path) {
                await supabase.storage.from(bucketName).remove([path])
            }

            onChange('')
            setError(null)
        } catch (err) {
            console.error('Remove error:', err)
            // Still clear the value even if deletion fails
            onChange('')
        }
    }

    return (
        <Stack gap={3}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {value ? (
                <Box>
                    <Box
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.200"
                        maxW="400px"
                    >
                        <Image
                            src={value}
                            alt="Uploaded image"
                            w="100%"
                            h="auto"
                            objectFit="cover"
                        />
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
                <Box>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        loading={isUploading}
                        variant="outline"
                        w="full"
                    >
                        {isUploading ? 'Laster opp...' : 'Velg bilde'}
                    </Button>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                        Maks 5MB. Støttede formater: JPG, PNG, GIF, WebP
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
