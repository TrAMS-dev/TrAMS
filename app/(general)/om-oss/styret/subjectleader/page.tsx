import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Fagansvarlig',
    description: 'Fagansvarlig av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function StyrelederPage() {
    const subjectLeader = await getBoardMemberByRole('subjectLeader')

    if (!subjectLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Fagansvarlig" member={subjectLeader}>
            <BodyText mb={0}>
                Fagansvarlig i TrAMS er foreningens fungerende nestleder og skal fungere som et bindeledd mot fagmiljøer og samarbeidspartnere. Dette inkluderer mentorgruppen til TrAMS som er en samling avdankede styremedlemmer. Fagansvarlig har også en sentral rolle i kvalitetssikring av foreningens aktiviteter og kontaktperson for spørsmål vedrørende HMS.
            </BodyText>
        </BoardRoleView>
    )
}
