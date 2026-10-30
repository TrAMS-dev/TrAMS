import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Sekretær',
    description: 'Sekretæren av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function SecretaryPage() {
    const secretary = await getBoardMemberByRole('secretary')

    if (!secretary) {
        notFound()
    }

    return (
        <BoardRoleView heading="Sekretær" member={secretary}>
            <BodyText mb={0}>
                Sekretær har det overordnede ansvaret for foreningens digitale ressurser. Dette innebærer organisering av dokumenter, samt utforming av nye maler, kursbevis og attester. I tillegg kommuniserer sekretær med eksterne og interne aktører som henvender seg til foreningen. Sekretæren fører referat fra styremøter og administrerer denne nettsiden. Assisterer også resten av styret når det er behov for det.
            </BodyText>
        </BoardRoleView>
    )
}
