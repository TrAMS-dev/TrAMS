'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Input, Button, Stack, Center, Field, Text, Link, Spinner } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const { isAuthenticated, isApproved, isLoading: isAuthLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // If user is already authenticated and approved, redirect to admin
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated && isApproved) {
            router.push('/admin')
        }
    }, [isAuthenticated, isApproved, isAuthLoading, router])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (authError) throw authError

            if (authData.user) {
                // Profile creation is handled by Database Trigger

                setMessage({
                    type: 'success',
                    text: 'Registrering vellykket! Kontoen venter på godkjenning fra administrator.',
                })

                // Clear form
                setEmail('')
                setPassword('')
                setFullName('')
            }
        } catch (error) {
            console.error('Registration error:', error)
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Registrering feilet',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Show spinner while checking auth state
    if (isAuthLoading) {
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
                    Registrer ny bruker
                </Heading>

                {message && (
                    <Box
                        p={4}
                        mb={4}
                        bg={message.type === 'success' ? 'green.100' : 'red.100'}
                        color={message.type === 'success' ? 'green.800' : 'red.800'}
                        rounded="md"
                    >
                        {message.text}
                    </Box>
                )}

                <form onSubmit={handleRegister}>
                    <Stack gap={4}>
                        <Field.Root>
                            <Field.Label>E-post</Field.Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="din@epost.no"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Fullt navn</Field.Label>
                            <Input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Ola Nordmann"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Passord</Field.Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Min. 6 tegn"
                                minLength={6}
                            />
                        </Field.Root>

                        <Button
                            type="submit"
                            loading={isLoading}
                            bg="var(--color-primary)"
                            color="white"
                            width="full"
                            mt={4}
                        >
                            Registrer deg
                        </Button>

                        <Text textAlign="center" fontSize="sm">
                            Har du allerede konto? <Link href="/admin/login" color="var(--color-primary)">Logg inn</Link>
                        </Text>
                    </Stack>
                </form>
            </Box>
        </Center>
    )
}
