'use client'

import { useEffect, useState } from 'react'
import { Box, Heading, Input, Button, Stack, Field, Text, Spinner, Center } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toaster } from '@/components/ui/toaster'

const MIN_PASSWORD_LENGTH = 6

export default function SettingsPage() {
    const { user, isLoading: isAuthLoading } = useAuth()
    const supabase = createClient()

    const [fullName, setFullName] = useState('')
    const [savedName, setSavedName] = useState('')
    const [isSavingName, setIsSavingName] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSavingPassword, setIsSavingPassword] = useState(false)

    const userId = user?.id

    useEffect(() => {
        if (!userId) return
        const loadProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', userId)
                .single()
            if (error) {
                console.error('Error fetching profile:', error)
                return
            }
            setFullName(data.full_name ?? '')
            setSavedName(data.full_name ?? '')
        }
        void loadProfile()
    }, [userId, supabase])

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingName(true)
        try {
            const res = await fetch('/api/account/name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName }),
            })
            const json = (await res.json().catch(() => ({}))) as { error?: string; fullName?: string }
            if (!res.ok) throw new Error(json.error || 'Kunne ikke oppdatere navnet')

            const newName = json.fullName ?? fullName.trim()
            setFullName(newName)
            setSavedName(newName)
            // Fires TOKEN_REFRESHED so every useAuth instance (e.g. the navbar) reloads the profile
            await supabase.auth.refreshSession()
            toaster.create({ title: 'Navnet er oppdatert', type: 'success' })
        } catch (error) {
            toaster.create({
                title: 'Kunne ikke oppdatere navnet',
                description: error instanceof Error ? error.message : undefined,
                type: 'error',
            })
        } finally {
            setIsSavingName(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.email) return

        if (newPassword !== confirmPassword) {
            toaster.create({ title: 'De nye passordene er ikke like', type: 'error' })
            return
        }
        if (newPassword === currentPassword) {
            toaster.create({ title: 'Det nye passordet må være forskjellig fra det nåværende', type: 'error' })
            return
        }

        setIsSavingPassword(true)
        try {
            // Supabase doesn't check the old password on update, so verify it by signing in again
            const { error: verifyError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })
            if (verifyError) throw new Error('Nåværende passord er feil')

            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            toaster.create({ title: 'Passordet er endret', type: 'success' })
        } catch (error) {
            toaster.create({
                title: 'Kunne ikke endre passordet',
                description: error instanceof Error ? error.message : undefined,
                type: 'error',
            })
        } finally {
            setIsSavingPassword(false)
        }
    }

    if (isAuthLoading) {
        return (
            <Center minH="40vh">
                <Spinner size="xl" />
            </Center>
        )
    }

    const trimmedName = fullName.trim()

    return (
        <Box maxW="lg">
            <Heading size="xl" mb={6}>Innstillinger</Heading>

            <Stack gap={6}>
                <Box p={6} bg="white" rounded="lg" shadow="sm" borderWidth="1px" borderColor="gray.200">
                    <Heading size="md" mb={1}>Navn</Heading>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                        Navnet som vises når du er logget inn.
                    </Text>
                    <form onSubmit={handleNameSubmit}>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Fullt navn</Field.Label>
                                <Input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    maxLength={100}
                                    placeholder="Ola Nordmann"
                                />
                            </Field.Root>
                            <Button
                                type="submit"
                                loading={isSavingName}
                                disabled={!trimmedName || trimmedName === savedName}
                                bg="var(--color-primary)"
                                color="white"
                                alignSelf="flex-start"
                            >
                                Lagre navn
                            </Button>
                        </Stack>
                    </form>
                </Box>

                <Box p={6} bg="white" rounded="lg" shadow="sm" borderWidth="1px" borderColor="gray.200">
                    <Heading size="md" mb={1}>Passord</Heading>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                        Innlogget som {user?.email}
                    </Text>
                    <form onSubmit={handlePasswordSubmit}>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Nåværende passord</Field.Label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Nytt passord</Field.Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={MIN_PASSWORD_LENGTH}
                                    placeholder={`Min. ${MIN_PASSWORD_LENGTH} tegn`}
                                    autoComplete="new-password"
                                />
                            </Field.Root>
                            <Field.Root invalid={confirmPassword.length > 0 && confirmPassword !== newPassword}>
                                <Field.Label>Bekreft nytt passord</Field.Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={MIN_PASSWORD_LENGTH}
                                    autoComplete="new-password"
                                />
                                <Field.ErrorText>Passordene er ikke like</Field.ErrorText>
                            </Field.Root>
                            <Button
                                type="submit"
                                loading={isSavingPassword}
                                bg="var(--color-primary)"
                                color="white"
                                alignSelf="flex-start"
                            >
                                Endre passord
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Box>
    )
}
