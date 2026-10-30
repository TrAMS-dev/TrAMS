import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Utstyrsansvarlig',
    description: 'Utstyrsansvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function EquipmentLeaderPage() {
    const equipmentLeader = await getBoardMemberByRole('equipmentLeader')

    if (!equipmentLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Utstyrsansvarlig" member={equipmentLeader}>
            <BodyText mb={0}>
                Jobben som utstyrsansvarlig er å holde styr på alt utstyret TrAMS disponerer og sørge for at det i orden til vi holder kurs. I tillegg så bidrar man der det ellers er behov. Gjennom vervet får man et innblikk i mye kule gadgets innenfor akuttmedisinen og en praktisk håndtering av disse.
            </BodyText>
        </BoardRoleView>
    )
}
