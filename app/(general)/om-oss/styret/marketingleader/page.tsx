import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Markedsføringsansvarlig',
    description: 'Markedsføringsansvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function MarketingLeaderPage() {
    const marketingLeader = await getBoardMemberByRole('marketingLeader')

    if (!marketingLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Markedsføringsansvarlig" member={marketingLeader}>
            <BodyText mb={0}>
                Markedsføringsansvarlig har som oppgave å fremme interesse og profilere foreningens aktiviteter både eksternt og internt. I tillegg vil markedsføringsansvarlig ha en sentral rolle i å nå ut og reklamere for aktuelle kurs vi tilbyr.
            </BodyText>
        </BoardRoleView>
    )
}
