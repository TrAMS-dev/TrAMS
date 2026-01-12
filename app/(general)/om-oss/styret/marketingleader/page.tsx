import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react'
import { urlFor } from '@/sanity/lib/image'
import { portableTextComponents } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Markedsføringsansvarlig | TrAMS',
    description: 'Markedsføringsansvarlig i TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function MarketingLeaderPage() {
    const marketingLeader = await getBoardMemberByRole('marketingLeader')

    if (!marketingLeader) {
        notFound()
    }

    const profileImageUrl = marketingLeader.profileImage
        ? urlFor(marketingLeader.profileImage).url()
        : null

    const personalImageUrl = marketingLeader.PersonalImage
        ? urlFor(marketingLeader.PersonalImage).url()
        : null

    return (
        <>
            <Box w='100%' display="flex" alignItems="center" justifyContent="center">
                <Heading as="h1" fontSize={{ base: '2.5rem', md: '5rem' }} fontWeight={800} pt={20} pb={4}>
                    MARKEDSFØRINGSANSVARLIG
                </Heading>
            </Box>
            <Box h="10px" bg="var(--color-primary)" mx="auto" mt={4} w='80%' />

            <Container maxW="container.lg" py={12}>
                {/* Top Section: Role Description */}
                <Box mb={12}>
                    <Text fontSize="1.1rem" lineHeight="1.8" mb={6} color="#4A5568">
                        Markedsføringsansvarlig har som oppgave å fremme interesse og profilere foreningens aktiviteter både eksternt og internt. I tillegg vil markedsføringsansvarlig ha en sentral rolle i å nå ut og reklamere for aktuelle kurs vi tilbyr.
                    </Text>
                </Box>

                {/* Two Columns: Image and Bio/Contact */}
                <Flex direction={{ base: 'column', md: 'row' }} gap={12} alignItems="flex-start">

                    {/* Left Column: Image */}
                    <Box flex={1} display="flex" justifyContent="center">
                        {personalImageUrl ? (
                            <Box width="90%" borderRadius="lg" overflow="hidden" >
                                <Image
                                    src={personalImageUrl}
                                    alt={`${marketingLeader.name} personal`}
                                    width={300}
                                    height={300}
                                    className='w-full h-auto'
                                />
                            </Box>
                        ) : (
                            profileImageUrl && (
                                <Box width="90%" borderRadius="lg" overflow="hidden" >
                                    <Image
                                        src={profileImageUrl}
                                        alt={marketingLeader.name}
                                        width={300}
                                        height={300}
                                        className='w-full h-auto'
                                    />
                                </Box>
                            )
                        )}
                    </Box>

                    {/* Right Column: Bio & Contact */}
                    <Box flex={1}>
                        <Heading as="h3" fontSize="2.5rem" mb={6}>
                            {marketingLeader.name.toUpperCase()}
                        </Heading>

                        <Box className="portable-text" mb={8}>
                            <PortableText value={marketingLeader.bio} components={portableTextComponents} />
                        </Box>

                        <Box>
                            <Text fontWeight="bold" mb={2} fontSize="1.1rem">Kontakt:</Text>
                            <Text fontSize="1.1rem">
                                E-post kan sendes til{' '}
                                <a
                                    href={`mailto:${marketingLeader.email}`}
                                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}
                                >
                                    {marketingLeader.email}
                                </a>
                            </Text>
                        </Box>
                    </Box>

                </Flex>
            </Container>
        </>
    )
}