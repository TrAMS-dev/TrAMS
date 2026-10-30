import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Mentorgruppen',
    description: 'Mentorgruppen i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function MentorLeaderPage() {
    const mentorLeader = await getBoardMemberByRole('mentorLeader')

    if (!mentorLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Mentorgruppen" member={mentorLeader}>
            <BodyText mb={0}>
                Mentorgruppen er en ressursgruppe bestående av tidligere styremedlemmer som fortsatt vil bidra til å gjøre TrAMS bedre. De har jevnlige møter og bidrar dessuten som støtte til styret og komitéer både organisatorisk og faglig.
            </BodyText>
        </BoardRoleView>
    )
}
