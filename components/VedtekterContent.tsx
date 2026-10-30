'use client'

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { VEDTEKTER_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { portableTextComponents, BodyText } from '@/components/Typography';
import { ContentCard } from '@/components/ContentCard';
import { Vedtekter } from '@/types/sanity.types';
import { formatNorwegianDate } from '@/sanity/lib/date';

export default function VedtekterContent() {

    const [vedtekter, setVedtekter] = useState<Vedtekter>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .fetch<Vedtekter>(VEDTEKTER_QUERY)
            .then((data) => {
                setVedtekter(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching vedtekter:', error);
                setLoading(false);
            });
    }, []);

    const lastUpdated = loading 
        ? "Laster inn..."
        : !vedtekter 
            ? "Ingen vedtekter funnet"
            : `Sist oppdatert ${formatNorwegianDate(vedtekter.lastUpdated)}`;

    return (
        <>


            {/* Content Section */}
            <PageContainer narrow>
                <ContentCard>
                    {loading ? (
                        <BodyText mb={0} textAlign="center" color="gray.600">Laster inn...</BodyText>
                    ) : !vedtekter ? (
                        <>
                            <BodyText textAlign="center">Ingen vedtekter funnet</BodyText>
                            <BodyText mb={0} textAlign="center" color="gray.500">
                                Vedtekter vil vises her når de er lagt til
                            </BodyText>
                        </>
                    ) : (

                        <>
                            <BodyText color="gray.500">
                                Sist oppdatert {formatNorwegianDate(vedtekter.lastUpdated)}
                            </BodyText>
                            <PortableText value={vedtekter.content} components={portableTextComponents} />
                        </>
                    )}
                </ContentCard>
            </PageContainer>
        </>
    );
}