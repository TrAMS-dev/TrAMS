import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Internsjef',
    description: 'Internsjefen av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function InternalLeaderPage() {
    const internalLeader = await getBoardMemberByRole('internalLeader')

    if (!internalLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Internsjef" member={internalLeader}>
            <BodyText mb={0}>
                Internsjef har det overordnede ansvaret for det interne arbeidet TrAMS driver med. Dette betyr å drifte kursene vi arrangerer for medisinstudenter, samt å utvikle nye kurs.
            </BodyText>
        </BoardRoleView>
    )
}
