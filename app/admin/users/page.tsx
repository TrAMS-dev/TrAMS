'use client'

import { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Table,
    Button,
    Badge,
    Text,
    Container,
    Spinner,
    Stack,
    HStack
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { Tables } from '@/types/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
    const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState<Tables<'profiles'>[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/admin')
            router.refresh()
        }
    }, [authLoading, isAuthenticated, isAdmin, router])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            alert('Kunne ikke laste brukere')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleApproval = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ approved: !currentStatus })
                .eq('id', userId)

            if (error) throw error

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, approved: !currentStatus } : user
            ))
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Kunne ikke oppdatere status')
        }
    }

    if (isLoading || authLoading) {
        return (
            <Container centerContent py={10}>
                <Spinner size="xl" />
            </Container>
        )
    }

    if (!isAuthenticated || !isAdmin) {
        return null
    }

    return (
        <Container maxW="container.xl" py={10}>
            <Heading mb={6}>Brukeradministrasjon</Heading>

            <Box overflowX="auto" bg="white" shadow="sm" rounded="lg">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Navn</Table.ColumnHeader>
                            <Table.ColumnHeader>E-post</Table.ColumnHeader>
                            <Table.ColumnHeader>Registrert</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Handling</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map((user) => (
                            <Table.Row key={user.id}>
                                <Table.Cell>{user.full_name || 'Ukjent'}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>
                                    {new Date(user.created_at).toLocaleDateString('no-NO')}
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        colorPalette={user.approved ? 'green' : 'yellow'}
                                        variant="solid"
                                    >
                                        {user.approved ? 'Godkjent' : 'Venter'}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        size="sm"
                                        colorPalette={user.approved ? 'red' : 'green'}
                                        onClick={() => toggleApproval(user.id, user.approved ?? false)}
                                    >
                                        {user.approved ? 'Fjern tilgang' : 'Godkjenn'}
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
                {users.length === 0 && (
                    <Box p={4} textAlign="center">
                        <Text color="gray.500">Ingen brukere funnet.</Text>
                    </Box>
                )}
            </Box>
        </Container>
    )
}
