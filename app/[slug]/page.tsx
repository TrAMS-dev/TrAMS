import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react'
import { getBoardMemberBySlug, getAllBoardMembers } from '@/utils/sanity/boardMembers'
import { urlFor } from '@/sanity/lib/image'

export async function generateStaticParams() {
    const boardMembers = await getAllBoardMembers()

    return boardMembers.map((member) => ({
        slug: member.slug.current,
    }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const boardMember = await getBoardMemberBySlug(params.slug)

    if (!boardMember) {
        return {
            title: 'Board Member Not Found',
        }
    }

    return {
        title: `${boardMember.name} - ${boardMember.role} | TrAMS`,
        description: `${boardMember.role} i TrAMS - Trondheim Akuttmedisinske Studentforening`,
    }
}

export default async function BoardMemberPage({ params }: { params: { slug: string } }) {
    const boardMember = await getBoardMemberBySlug(params.slug)

    if (!boardMember) {
        notFound()
    }

    const imageUrl = boardMember.profileImage
        ? urlFor(boardMember.profileImage).width(400).height(400).url()
        : null

    return (
        <Container maxW={{ base: '95%', md: '60%' }} py={{ base: 8, md: 12 }}>
            <Box bg="white" borderRadius="8px" p={{ base: 6, md: 8 }} boxShadow="0 0 10px rgba(0,0,0,0.1)">
                <Flex
                    flexDirection={{ base: 'column', md: 'row' }}
                    gap={{ base: 6, md: 8 }}
                    align={{ base: 'center', md: 'flex-start' }}
                >
                    {/* Profile Image */}
                    {imageUrl && (
                        <Box flexShrink={0}>
                            <Image
                                src={imageUrl}
                                alt={boardMember.name}
                                width={200}
                                height={200}
                                className="rounded-full object-cover"
                            />
                        </Box>
                    )}

                    {/* Content */}
                    <Box flex={1}>
                        <Heading
                            as="h1"
                            fontSize={{ base: '2rem', md: '2.5rem' }}
                            mb={2}
                            color="black"
                        >
                            {boardMember.role}
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
                            {boardMember.name}
                        </Heading>

                        {/* Optional Info */}
                        {(boardMember.age || boardMember.hometown) && (
                            <Text mb={4} color="#666">
                                {boardMember.age && `${boardMember.age} år`}
                                {boardMember.age && boardMember.hometown && ' | '}
                                {boardMember.hometown && `Fra ${boardMember.hometown}`}
                            </Text>
                        )}

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
            </Box>
        </Container>
    )
}
