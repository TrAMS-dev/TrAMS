import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Eksternsjef',
    description: 'Eksternsjefen i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function ExternalLeaderPage() {
    const externalLeader = await getBoardMemberByRole('externalLeader')

    if (!externalLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Eksternsjef" member={externalLeader}>
            <BodyText mb={0}>
                Som eksternsjef har man ansvaret for at foreningens eksternaktiviteter gjennomføres iht. vedtekter og gjeldende avtaler. Med stillingen følger også et mellomleder-ansvar som krever at man tar aktiv del i oppfølgingen av spesielt eksternkoordinator, men også instruktør- markedsførings- og utstyrsansvarlig.
            </BodyText>
        </BoardRoleView>
    )
}
