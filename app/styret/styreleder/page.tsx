import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react'
import { client } from '@/sanity/lib/client'
import { BOARD_LEADER_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { BoardMember } from '@/types/sanity.types'

export const metadata = {
    title: 'Leder | TrAMS',
    description: 'Møt lederen av TrAMS - Trondheim Akuttmedisinske Studentforening',
}

export default async function StyrelederPage() {
    const boardLeader = await client.fetch<BoardMember>(BOARD_LEADER_QUERY)

    if (!boardLeader) {
        notFound()
    }

    const profileImageUrl = boardLeader.profileImage
        ? urlFor(boardLeader.profileImage).width(400).height(400).url()
        : null

    const personalImageUrl = boardLeader.PersonalImage
        ? urlFor(boardLeader.PersonalImage).width(800).height(600).url()
        : null

    return (
        <>
            {/* Hero Section */}
            <Box
                position="relative"
                h="30vh"
                bgImage="url('https://i.imgur.com/rKhkGGT.jpg')"
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="var(--color-light)"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p="3rem 1rem"
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px">
                    <Heading as="h1" fontSize={{ base: '2rem', md: '2.5rem' }} mb={4} fontWeight={700}>
                        Leder
                    </Heading>
                    <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                        Som leder må man ta ansvar for alt, selvom man ikke har anledning til å involvere seg i like mye samtidig.
                        Derfor må man få en god nok oversikt over foreningen til at man kan veilede og være tilgjengelig når det blir behov.
                        Ledelse av frivillige i en fagspesifikk interesseforening kan være utfordrende, men veldig lærerikt.
                        Det er viktig å se etter muligheter for å holde motivasjonen oppe, og fasilitere gode gruppeprosesser som bidrar til felles tilhørighet, trygghet og retning.
                    </Text>
                </Box>
            </Box>

            {/* Content Section */}
            <Container maxW={{ base: '95%', md: '70%' }} py={{ base: 8, md: 12 }}>
                <Box bg="white" borderRadius="12px" p={{ base: 6, md: 8 }} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
                    {/* Email Contact */}
                    <Text mb={8} fontSize="1.1rem" color="#666" textAlign="center">
                        E-post kan sendes til{' '}
                        <a
                            href={`mailto:${boardLeader.email || 'leder@trams.no'}`}
                            style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}
                        >
                            {boardLeader.email || 'leder@trams.no'}
                        </a>
                    </Text>

                    {/* Leader Profile Section */}
                    <Box mb={8}>
                        <Heading
                            as="h2"
                            fontSize={{ base: '1.8rem', md: '2rem' }}
                            mb={6}
                            color="black"
                            fontWeight={700}
                        >
                            {boardLeader.name}
                        </Heading>

                        <Flex
                            flexDirection={{ base: 'column', md: 'row' }}
                            gap={{ base: 6, md: 8 }}
                            align={{ base: 'center', md: 'flex-start' }}
                        >
                            {/* Profile Image */}
                            {profileImageUrl && (
                                <Box flexShrink={0}>
                                    <Image
                                        src={profileImageUrl}
                                        alt={boardLeader.name}
                                        width={250}
                                        height={250}
                                        className="rounded-lg object-cover"
                                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                    />
                                </Box>
                            )}

                            {/* Biography and Info */}
                            <Box flex={1}>
                                {/* Optional Info */}
                                {(boardLeader.age || boardLeader.hometown) && (
                                    <Text mb={4} color="#666" fontSize="1.05rem">
                                        {boardLeader.age && `Mitt navn er ${boardLeader.name.split(' ')[0]}, jeg er ${boardLeader.age} år`}
                                        {boardLeader.age && boardLeader.hometown && ' og '}
                                        {boardLeader.hometown && `fra ${boardLeader.hometown}`}.
                                    </Text>
                                )}

                                {/* Biography */}
                                <Box className="portable-text">
                                    <PortableText value={boardLeader.bio} />
                                </Box>
                            </Box>
                        </Flex>
                    </Box>

                    {/* Personal Image Section */}
                    {personalImageUrl && (
                        <Box mt={8}>
                            <Box position="relative" width="100%" height={{ base: '300px', md: '400px' }} borderRadius="12px" overflow="hidden">
                                <Image
                                    src={personalImageUrl}
                                    alt={`${boardLeader.name} - personal photo`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    )
}