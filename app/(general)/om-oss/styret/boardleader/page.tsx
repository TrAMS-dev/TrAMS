import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Leder',
    description: 'Lederen av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function BoardLeaderPage() {
    const boardLeader = await getBoardMemberByRole('boardLeader')

    if (!boardLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Leder" member={boardLeader}>
            <BodyText>
                Som leder må man ta ansvar for alt, selvom man ikke har anledning til å involvere seg i like mye samtidig.
                Derfor må man få en god nok oversikt over foreningen til at man kan veilede og være tilgjengelig når det blir behov.
                Ledelse av frivillige i en fagspesifikk interesseforening kan være utfordrende, men veldig lærerikt.
            </BodyText>
            <BodyText mb={0}>
                Det er viktig å se etter muligheter for å holde motivasjonen oppe, og fasilitere gode gruppeprosesser som bidrar til felles tilhørighet, trygghet og retning.
            </BodyText>
        </BoardRoleView>
    )
}
