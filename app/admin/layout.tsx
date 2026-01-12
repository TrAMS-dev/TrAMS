'use client'

import { Box, Flex, Heading, Link, Button, Container, Spinner } from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAdmin, userName, isAuthenticated, isLoading, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const isAuthPage = pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin/register')

    const handleLogout = async () => {
        await logout()
        router.push('/admin/login')
    }

    return (
        <>
            {
                isLoading ? (
                    <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
                        <Spinner size="xl" />
                    </Box>
                ) : (
                    <Box minH="100vh" bg="gray.50">
                        {/* Admin Navbar - Only show if authenticated AND not on auth pages */}
                        {!isLoading && isAuthenticated && !isAuthPage && (
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
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin/users"
                                                        fontWeight="medium"
                                                        _hover={{ color: 'var(--color-primary)' }}
                                                    >
                                                        Brukere
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/"
                                                    fontWeight="medium"
                                                    _hover={{ color: 'var(--color-primary)' }}
                                                >
                                                    Tilbake til hovedsiden
                                                </Link>
                                            </Flex>
                                        </Flex>
                                        <Flex align="center" gap={4}>
                                            <Box fontWeight="medium" fontSize="sm" color="gray.600">
                                                Logget inn som: <Box as="span" color="gray.900">{userName}</Box>
                                            </Box>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleLogout}
                                                colorPalette="gray"
                                            >
                                                Logg ut
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Container>
                            </Box>
                        )}

                        {/* Main Content */}
                        <Container maxW="container.xl" py={8}>
                            {children}
                        </Container>
                    </Box>
                )
            }
        </>
    )
}

