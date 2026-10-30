import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Internkoordinator',
    description: 'Internkoordinator i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function InternalCoordinatorPage() {
    const internalCoordinator = await getBoardMemberByRole('internalCoordinator')

    if (!internalCoordinator) {
        notFound()
    }

    return (
        <BoardRoleView heading="Internkoordinator" member={internalCoordinator}>
            <BodyText mb={0}>
                Internkoordinator har som oppgave, i tett samarbeid med internsjef, å drifte interne oppgaver i foreningen. Dette innebærer planlegging og gjennomføring av kurs og ferdighetstrening for medisinstudenter.
            </BodyText>
        </BoardRoleView>
    )
}
