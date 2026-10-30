import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Økonomiansvarlig',
    description: 'Økonomiansvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function FinancialLeaderPage() {
    const financialLeader = await getBoardMemberByRole('financialLeader')

    if (!financialLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Økonomiansvarlig" member={financialLeader}>
            <BodyText mb={0}>
                Som økonomisjef sørger man for at instruktørene våre får lønn, og for at TrAMS tjener nok til å drive foreningen videre.
            </BodyText>
        </BoardRoleView>
    )
}
