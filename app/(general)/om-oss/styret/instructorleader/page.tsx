import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Instruktøransvarlig',
    description: 'Instruktøransvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function InstructorLeaderPage() {
    const instructorLeader = await getBoardMemberByRole('instructorLeader')

    if (!instructorLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Instruktøransvarlig" member={instructorLeader}>
            <BodyText mb={0}>
                Som instruktøransvarlig har man ansvaret for at instruktørene får den oppfølgingen, erfaringen, læringen og samholdet som trengs for å kunne gi best mulig kursing og best mulig instruktørmiljø. I en organisasjon som TrAMS er det viktig med faglig påfyll, samt godt samhold, derfor er jeg også med på å planlegge arrangement som for eksempel hytteturer og instruktørkvelder.
            </BodyText>
        </BoardRoleView>
    )
}
