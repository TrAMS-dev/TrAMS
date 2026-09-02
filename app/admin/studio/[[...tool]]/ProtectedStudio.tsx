'use client'

import { useEffect } from 'react'
import { Container, Spinner } from '@chakra-ui/react'
import { NextStudio } from 'next-sanity/studio'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import config from '@/sanity.config'

export default function ProtectedStudio() {
    const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/admin')
            router.refresh()
        }
    }, [authLoading, isAuthenticated, isAdmin, router])

    if (authLoading) {
        return (
            <Container centerContent py={10}>
                <Spinner size="xl" />
            </Container>
        )
    }

    if (!isAuthenticated || !isAdmin) {
        return null
    }

    return <NextStudio config={config} />
}
