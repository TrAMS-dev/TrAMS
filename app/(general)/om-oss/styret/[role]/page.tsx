import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { RichText } from '@/components/Typography'
import { client } from '@/sanity/lib/client'
import { BOARD_ROLE_PAGE_QUERY } from '@/sanity/lib/queries'

type Props = {
    params: Promise<{ role: string }>
}

async function getBoardRole(slug: string) {
    return client.fetch(BOARD_ROLE_PAGE_QUERY, { slug: slug.toLowerCase() })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { role } = await params
    const boardRole = await getBoardRole(role)

    if (!boardRole?.title) {
        return { title: 'Fant ikke vervet' }
    }

    return {
        title: boardRole.title,
        description: `${boardRole.title} i TrAMS - Trondheim Akuttmedisinske Studentforening`,
    }
}

export default async function BoardRolePage({ params }: Props) {
    const { role } = await params
    const boardRole = await getBoardRole(role)

    if (!boardRole?.member) {
        notFound()
    }

    return (
        <BoardRoleView heading={boardRole.title} member={boardRole.member}>
            <RichText value={boardRole.description} />
        </BoardRoleView>
    )
}
