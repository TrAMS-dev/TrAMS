import { Link as ChakraLink, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { translateRole } from '@/utils/sanity/translateRole';
import { BoardMember } from '@/types/sanity.types';

interface BoardMemberCardProps {
    member: BoardMember;
    href: string;
}

export default function BoardMemberCard({ member, href }: BoardMemberCardProps) {
    const imageUrl = member.profileImage
        ? urlFor(member.profileImage).width(300).height(400).url()
        : null;

    return (
        <ChakraLink
            href={href}
            bg="white"
            borderRadius="8px"
            p={4}
            w="240px"
            textAlign="center"
            transition="all 0.3s ease"
            flex="0 0 auto"
            style={{ scrollSnapAlign: 'start' }}
            textDecoration="none"
            color="inherit"
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
            _hover={{ transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={member.name || ''}
                    width={100}
                    height={133}
                    className="w-[100px] h-[133px] object-cover rounded-xl mb-2"
                />
            )}
            <Heading as="h3" m={0} fontSize="1rem" fontWeight={600} wordBreak="break-word" hyphens="auto">
                {member.name}
            </Heading>
            <Text m={0} fontSize="0.9rem" color="#666" wordBreak="break-word">
                {translateRole(member.role)}
            </Text>
        </ChakraLink>
    );
}
