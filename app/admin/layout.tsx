'use client'

import { Box, Flex, Heading, Link, Button, Container } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
            alert('Feil ved utlogging')
        }
    }

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Admin Navbar */}
            <Box bg="white" shadow="sm" borderBottom="1px solid" borderColor="gray.200">
                <Container maxW="container.xl">
                    <Flex h={16} align="center" justify="space-between">
                        <Flex align="center" gap={8}>
                            <Link href="/admin">
                                <Heading size="md" color="var(--color-primary)">
                                    TrAMS Admin
                                </Heading>
                            </Link>
                            <Flex gap={6}>
                                <Link
                                    href="/admin/"
                                    fontWeight="medium"
                                    _hover={{ color: 'var(--color-primary)' }}
                                >
                                    Oversikt
                                </Link>
                                <Link
                                    href="/admin/studio"
                                    fontWeight="medium"
                                    _hover={{ color: 'var(--color-primary)' }}
                                >
                                    Rediger nettsideinnhold
                                </Link>
                                <Link
                                    href="/"
                                    fontWeight="medium"
                                    _hover={{ color: 'var(--color-primary)' }}
                                >
                                    Tilbake til hovedsiden
                                </Link>
                            </Flex>
                        </Flex>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLogout}
                            colorPalette="gray"
                        >
                            Logg ut
                        </Button>
                    </Flex>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={8}>
                {children}
            </Container>
        </Box>
    )
}
