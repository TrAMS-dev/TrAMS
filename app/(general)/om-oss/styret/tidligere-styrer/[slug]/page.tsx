import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'
import BoardMemberProfile from '@/components/BoardMemberProfile'
import HeroImage from '@/components/HeroImage'
import PreloadHeroImage from '@/components/PreloadHeroImage'
import { getBoardMemberBySlug, getAllBoardMembers } from '@/utils/sanity/boardMembers'
import { translateRole } from '@/utils/sanity/translateRole'

export async function generateStaticParams() {
    const boardMembers = await getAllBoardMembers()

    return boardMembers.map((member) => ({
        slug: member.slug.current,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const boardMember = await getBoardMemberBySlug(slug)

    if (!boardMember) {
        return {
            title: 'Board Member Not Found',
        }
    }

    return {
        title: `${boardMember.name} - ${translateRole(boardMember.role)}`,
        description: `${translateRole(boardMember.role)} i TrAMS - Trondheim Akuttmedisinske Studentforening`,
    }
}

export default async function BoardMemberPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const boardMember = await getBoardMemberBySlug(slug)

    if (!boardMember) {
        notFound()
    }

    const period = `${boardMember.activeFrom?.split('-')[0].slice(2)}/${boardMember.activeTo?.split('-')[0].slice(2)}`

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading="Tidligere styrer"
                text={`Styret ${period}`}
            />
            <PageContainer>
                <BoardMemberProfile
                    member={boardMember}
                    subtitle={`${translateRole(boardMember.role)} ${period}`}
                />
            </PageContainer>
        </>
    )
}
