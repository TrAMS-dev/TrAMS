import { notFound } from 'next/navigation'
import BoardRoleView from '@/components/BoardRoleView'
import { BodyText } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Sponsoransvarlig',
    description: 'Sponsoransvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function StyrelederPage() {
    const sponsorLeader = await getBoardMemberByRole('sponsorLeader')

    if (!sponsorLeader) {
        notFound()
    }

    return (
        <BoardRoleView heading="Sponsoransvarlig" member={sponsorLeader}>
            <BodyText mb={0}>
                Foreningens sponsoransvarlig har ansvarsområde å arbeide med å tilegne foreningen økonomiske goder gjennom å søke stipend, fond og legat, eller gjennom samarbeid med andre aktører som er interessert i å hjelpe foreningen.
            </BodyText>
        </BoardRoleView>
    )
}
