import Image from 'next/image';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { CooperationPartners } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { SectionHeading } from '@/components/Typography';


interface PartnersSectionProps {
    data: CooperationPartners | null;
}

export const PartnersSection = ({ data }: PartnersSectionProps) => {
    if (!data) return null;

    const { partners, sisterOrganizations } = data;

    return (
        <Box textAlign="center">
            {partners && partners.length > 0 && (
                <>
                    <SectionHeading mt={0}>Samarbeidspartnere</SectionHeading>

                    <Flex flexWrap="wrap" gap={8} justify="center" align="center">
                        {partners.map((partner, index) => {
                            if (!partner.logo) return null;
                            const imageUrl = urlFor(partner.logo).url();
                            let width = 120;
                            let height = 40;
                            if (partner.size === 'small') { width = 80; height = 50; }
                            if (partner.size === 'large') { width = 200; height = 150; }

                            return (
                                <Link
                                    href={partner.url}
                                    key={partner._key || index}
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.3s ease-in-out',
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={partner.name || 'Partner logo'}
                                        width={width}
                                        height={height}
                                    />
                                </Link>
                            );
                        })}
                    </Flex>
                </>
            )}

            {sisterOrganizations && sisterOrganizations.length > 0 && (
                <Box id="sosterforeninger" mt={16}>
                    <SectionHeading as="h3" mt={0}>Søsterforeninger</SectionHeading>
                    <Flex flexWrap="wrap" gap={8} justify="center" align="center">
                        {sisterOrganizations.map((org, index) => {
                            if (!org.logo) return null;
                            const imageUrl = urlFor(org.logo).url();
                            return (
                                <Link
                                    href={org.url}
                                    key={org._key || index}
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.3s ease-in-out',
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={org.name || 'Sister org logo'}
                                        width={200}
                                        height={150}

                                    />
                                </Link>
                            );
                        })}
                    </Flex>
                </Box>
            )}
        </Box>
    );
}