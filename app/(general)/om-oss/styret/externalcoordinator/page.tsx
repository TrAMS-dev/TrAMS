import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Eksternkoordinator',
    description: 'Eksternkoordinator i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function ExternalCoordinatorPage() {
    const externalCoordinator = await getBoardMemberByRole('externalCoordinator')

    if (!externalCoordinator) {
        notFound()
    }

    return (
        <BoardRoleView heading="Eksternkoordinator" member={externalCoordinator}>
            <BodyText mb={0}>
                Eksternkoordinator bistår eksternsjef og instruktøransvarlig med å organisere og informere om kurs eksternt. Har også ansvar for å arrangere eksterne HLR-dager med hjerte-lunge-redning til lekfolk.
            </BodyText>
        </BoardRoleView>
    )
}
