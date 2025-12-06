import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react'
import { urlFor } from '@/sanity/lib/image'
import { portableTextComponents } from '@/components/Typography'
import { getBoardMemberByRole } from '@/utils/sanity/boardMembers'

export const metadata = {
    title: 'Fagansvarlig | TrAMS',
    description: 'Fagansvarlig av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function StyrelederPage() {
    const subjectLeader = await getBoardMemberByRole('subjectLeader')

    if (!subjectLeader) {
        notFound()
    }

    const profileImageUrl = subjectLeader.profileImage
        ? urlFor(subjectLeader.profileImage).url()
        : null

    const personalImageUrl = subjectLeader.PersonalImage
        ? urlFor(subjectLeader.PersonalImage).url()
        : null

    return (
        <>
            <Box w='100%' display="flex" alignItems="center" justifyContent="center">
                <Heading as="h1" fontSize={{ base: '2.5rem', md: '5rem' }} fontWeight={800} pt={20} pb={4}>
                    FAGANSVARLIG
                </Heading>
            </Box>
            <Box h="10px" bg="var(--color-primary)" mx="auto" mt={4} w='80%' />

            <Container maxW="container.lg" py={12}>
                {/* Top Section: Role Description */}
                <Box mb={12}>
                    <Text fontSize="1.1rem" lineHeight="1.8" mb={6} color="#4A5568">
                        Fagansvarlig i TrAMS er foreningens fungerende nestleder og skal fungere som et bindeledd mot fagmiljøer og samarbeidspartnere. Dette inkluderer mentorgruppen til TrAMS som er en samling avdankede styremedlemmer. Fagansvarlig har også en sentral rolle i kvalitetssikring av foreningens aktiviteter og kontaktperson for spørsmål vedrørende HMS.
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
                                    alt={`${subjectLeader.name} personal`}
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
                                        alt={subjectLeader.name}
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
                            {subjectLeader.name.toUpperCase()}
                        </Heading>

                        <Box className="portable-text" mb={8}>
                            <PortableText value={subjectLeader.bio} components={portableTextComponents} />
                        </Box>

                        <Box>
                            <Text fontWeight="bold" mb={2} fontSize="1.1rem">Kontakt:</Text>
                            <Text fontSize="1.1rem">
                                E-post kan sendes til{' '}
                                <a
                                    href={`mailto:${subjectLeader.email}`}
                                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}
                                >
                                    {subjectLeader.email}
                                </a>
                            </Text>
                        </Box>
                    </Box>

                </Flex>
            </Container>
        </>
    )
}