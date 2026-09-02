'use client'

import { useRouter } from 'next/navigation'
import { EventForm, type EventFormPayload } from '@/components/admin/EventForm'
import { useAuth } from '@/hooks/useAuth'
import { toaster } from '@/components/ui/toaster'

export default function AdminCreateEventPage() {
    const router = useRouter()
    const { user } = useAuth()

    const handleSubmit = async (payload: EventFormPayload) => {
        if (!user) {
            toaster.create({
                title: 'Du må være logget inn for å opprette et arrangement',
                type: 'error',
                duration: 5000,
            })
            throw new Error('Not authenticated')
        }

        const response = await fetch('/api/events/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                author: user.id,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            toaster.create({
                title: 'Kunne ikke opprette arrangement',
                type: 'error',
                duration: 5000,
            })
            throw new Error(data.error || 'Failed to create event')
        }

        toaster.create({
            title: 'Arrangement opprettet!',
            type: 'success',
            duration: 5000,
        })

        router.push('/admin')
        router.refresh()
    }

    return (
        <EventForm
            heading="Opprett nytt arrangement"
            submitLabel="Opprett arrangement"
            onSubmit={handleSubmit}
        />
    )
}
