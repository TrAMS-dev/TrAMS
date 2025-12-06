import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react'
import { getBoardMemberBySlug, getAllBoardMembers } from '@/utils/sanity/boardMembers'
import { urlFor } from '@/sanity/lib/image'
import { translateRole } from '@/utils/sanity/translateRole'

export async function generateStaticParams() {
    const boardMembers = await getAllBoardMembers()

    return boardMembers.map((member) => ({
        slug: member.slug.current,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const boardMember = await getBoardMemberBySlug(slug)

    if (!boardMember) {
        return {
            title: 'Board Member Not Found',
        }
    }

    return {
        title: `${boardMember.name} - ${translateRole(boardMember.role)} | TrAMS`,
        description: `${translateRole(boardMember.role)} i TrAMS - Trondheim Akuttmedisinske Studentforening`,
    }
}

export default async function BoardMemberPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const boardMember = await getBoardMemberBySlug(slug)

    if (!boardMember) {
        notFound()
    }

    const profileImageUrl = boardMember.profileImage
        ? urlFor(boardMember.profileImage).url()
        : null

    const personalImageUrl = boardMember.PersonalImage
        ? urlFor(boardMember.PersonalImage).url()
        : null
    return (
        <Container maxW={{ base: '95%', md: '80%' }} py={{ base: 8, md: 12 }}>
            <Flex
                flexDirection={{ base: 'column', md: 'row' }}
                gap={{ base: 6, md: 8 }}
                align={{ base: 'center', md: 'flex-start' }}
            >
                <Box>
                    {/* Profile Image */}
                    {personalImageUrl ? (
                        <Box width="100%" borderRadius="lg" overflow="hidden" >
                            <Image
                                src={personalImageUrl}
                                alt={boardMember.name}
                                width={300}
                                height={300}
                                className='w-full h-auto'
                            />
                        </Box>
                    ) :
                        profileImageUrl && (
                            <Box width="100%" borderRadius="lg" overflow="hidden" >
                                <Image
                                    src={profileImageUrl}
                                    alt={boardMember.name}
                                    width={300}
                                    height={300}
                                    className='w-full h-auto'
                                />
                            </Box>
                        )}
                </Box>

                {/* Content */}
                <Box flex={1}>
                    <Heading
                        as="h1"
                        fontSize={{ base: '2rem', md: '2.5rem' }}
                        mb={2}
                        color="black"
                    >
                        {boardMember.name.toUpperCase()}

                    </Heading>

                    <Box
                        display="block"
                        w="80px"
                        h="4px"
                        bg="var(--color-primary)"
                        mb={6}
                        borderRadius="2px"
                    />

                    <Heading
                        as="h2"
                        fontSize={{ base: '1.5rem', md: '1.8rem' }}
                        mb={4}
                        color="black"
                        fontWeight={600}
                    >
                        {translateRole(boardMember.role)} {boardMember.activeFrom?.split('-')[0].slice(2)}/{boardMember.activeTo?.split('-')[0].slice(2)}
                    </Heading>

                    {/* Biography */}
                    <Box mb={4} className="portable-text">
                        <PortableText value={boardMember.bio} />
                    </Box>

                    {/* Email */}
                    {boardMember.email && (
                        <Text mt={6} color="black">
                            E-post:{' '}
                            <a
                                href={`mailto:${boardMember.email}`}
                                style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                            >
                                {boardMember.email}
                            </a>
                        </Text>
                    )}
                </Box>
            </Flex>
        </Container >
    )
}
