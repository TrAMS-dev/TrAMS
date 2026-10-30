import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Markøransvarlig',
    description: 'Markøransvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function ExtraLeaderPage() {
    const extraLeader = await getBoardMemberByRole('extraLeader')

    if (!extraLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Markøransvarlig" member={extraLeader}>
            <BodyText mb={0}>
                Som markøransvarlig har man ansvar for markørene i TrAMS. Det innebærer å rekruttere og ivareta markører på både interne og eksterne arrangementer og kurs.
            </BodyText>
        </BoardRoleView>
    )
}
