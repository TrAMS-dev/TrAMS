import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Komiteansvarlig',
    description: 'Komiteansvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function CommitteeLeaderPage() {
    const committeeLeader = await getBoardMemberByRole('committeeLeader')

    if (!committeeLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Komiteansvarlig" member={committeeLeader}>
            <BodyText mb={0}>
                Foreningens komitéansvarlig har et koordinerende ansvar for foreningens komiteer og er komiteenes kontaktperson i styret. Komitéansvarlig skal sikre kvalitet og kontinuitet i oppstart og drift av komitéer i TrAMS. Komitéansvarlig har også ansvaret for å holde møter med komiteene hvert semester.
            </BodyText>
        </BoardRoleView>
    )
}
