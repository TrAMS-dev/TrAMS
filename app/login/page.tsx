'use client'

import { useState } from 'react'
import { Box, Heading, Input, Button, Stack, Center, Field } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            router.push('/admin')
            router.refresh()
        } catch (error) {
            console.error('Login error:', error)
            alert(error instanceof Error ? error.message : 'Login failed')
        } finally {
            setIsLoading(false)
        }
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
                            loading={isLoading}
                            bg="var(--color-primary)"
                            color="white"
                            width="full"
                            mt={4}
                        >
                            Logg inn
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Center>
    )
}
