import { client } from '@/sanity/lib/client';
import { COMMITTEE_QUERY } from '@/sanity/lib/queries';
import { Committee } from '@/types/sanity.types';
import { Metadata } from 'next';
import CommitteeView from '../../../../components/CommitteeView';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const committee = await client.fetch<Committee>(COMMITTEE_QUERY, { slug });

    if (!committee) {
        return {
            title: 'Komité ikke funnet | TrAMS',
        };
    }

    return {
        title: `${committee.name} | TrAMS`,
        description: `Les om ${committee.name} i TrAMS - Trondheim Akuttmedisinske Studentforening.`,
    };
}

export default async function CommitteePage({ params }: Props) {
    const { slug } = await params;
    const committee = await client.fetch<Committee>(COMMITTEE_QUERY, { slug });

    return <CommitteeView committee={committee} />;
}
