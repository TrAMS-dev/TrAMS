'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Input, Button, Stack, Center, Field, Link, Alert, Spinner } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isAuthenticated, isApproved, isLoading, refresh } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // Handle redirect after authentication state changes
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (isApproved) {
                router.push('/admin')
            } else {
                // Show error but don't redirect - user is logged in but not approved
                setError('Kontoen din er ikke godkjent av administrator ennå.')
            }
        }
    }, [isAuthenticated, isApproved, isLoading, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            // Wait for useAuth to update with the new session
            // The useEffect above will handle the redirect
            await refresh()
        } catch (error) {
            console.error('Login error:', error)
            setError(error instanceof Error ? error.message : 'Innlogging feilet')
            setIsSubmitting(false)
        }
    }

    // Show spinner while checking auth or while successfully logging in
    if (isLoading || (isSubmitting && !error)) {
        return (
            <Center minH="80vh" bg="gray.50">
                <Spinner size="xl" />
            </Center>
        )
    }

    // If already authenticated and approved, show spinner while redirecting
    if (isAuthenticated && isApproved) {
        return (
            <Center minH="80vh" bg="gray.50">
                <Spinner size="xl" />
            </Center>
        )
    }

    return (
        <Center minH="80vh" bg="gray.50">
            <Box
                p={8}
                bg="white"
                rounded="lg"
                shadow="lg"
                maxW="md"
                w="full"
            >
                <Heading size="xl" mb={6} textAlign="center" color="var(--color-primary)">
                    Admin Innlogging
                </Heading>

                <form onSubmit={handleLogin}>
                    <Stack gap={4}>
                        {error && (
                            <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Title>{error}</Alert.Title>
                            </Alert.Root>
                        )}
                        <Field.Root>
                            <Field.Label>E-post</Field.Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@trams.no"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Passord</Field.Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </Field.Root>

                        <Button
                            type="submit"
                            loading={isSubmitting}
                            bg="var(--color-primary)"
                            color="white"
                            width="full"
                            mt={4}
                        >
                            Logg inn
                        </Button>

                        <Center>
                            <Link href="/admin/register" color="var(--color-primary)" fontSize="sm">
                                Registrer ny bruker
                            </Link>
                        </Center>
                    </Stack>
                </form>
            </Box>
        </Center>
    )
}

