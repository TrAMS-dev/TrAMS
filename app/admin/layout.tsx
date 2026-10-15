'use client'

import { Box, Flex, Heading, Link, Container, Spinner } from '@chakra-ui/react'
import { Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAdmin, userName, isAuthenticated, isLoading } = useAuth()
    const pathname = usePathname()
    const isAuthPage = pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin/register')

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
                                                    href="/admin/oppmote"
                                                    fontWeight="medium"
                                                    _hover={{ color: 'var(--color-primary)' }}
                                                >
                                                    Oppmøte
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <Link
                                                            href="/admin/studio"
                                                            fontWeight="medium"
                                                            _hover={{ color: 'var(--color-primary)' }}
                                                        >
                                                            Rediger nettsideinnhold
                                                        </Link>
                                                        <Link
                                                            href="/admin/users"
                                                            fontWeight="medium"
                                                            _hover={{ color: 'var(--color-primary)' }}
                                                        >
                                                            Brukere
                                                        </Link>
                                                    </>
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
                                        <Flex align="center" gap={2}>
                                            <Box fontWeight="medium" fontSize="sm" color="gray.900">
                                                {userName}
                                            </Box>
                                            <Link
                                                href="/admin/innstillinger"
                                                aria-label="Innstillinger"
                                                title="Innstillinger"
                                                p={2}
                                                rounded="md"
                                                color={pathname?.startsWith('/admin/innstillinger') ? 'var(--color-primary)' : 'gray.600'}
                                                _hover={{ color: 'var(--color-primary)', bg: 'gray.100' }}
                                            >
                                                <Settings size={20} />
                                            </Link>
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

