import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { BoardMember } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { ContentCard } from '@/components/ContentCard';
import { SubsectionHeading, BodyText, portableTextComponents } from '@/components/Typography';

interface BoardMemberProfileProps {
  member: BoardMember;
  /** Optional line shown under the name, e.g. role and period */
  subtitle?: string;
}

/**
 * Card with a board member's photo, name, bio and contact e-mail
 */
export default function BoardMemberProfile({ member, subtitle }: BoardMemberProfileProps) {
  const image = member.PersonalImage ?? member.profileImage;
  const imageUrl = image ? urlFor(image).url() : null;

  return (
    <ContentCard>
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 8 }} align="flex-start">
        {imageUrl && (
          <Box w={{ base: '100%', md: '300px' }} flexShrink={0} borderRadius="lg" overflow="hidden">
            <Image
              src={imageUrl}
              alt={member.name}
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </Box>
        )}

        <Box flex={1}>
          <SubsectionHeading as="h2" fontSize="1.8rem" mb={subtitle ? 1 : 4}>
            {member.name}
          </SubsectionHeading>
          {subtitle && (
            <BodyText color="gray.600" fontWeight={600}>
              {subtitle}
            </BodyText>
          )}

          {member.bio && <PortableText value={member.bio} components={portableTextComponents} />}

          {member.email && (
            <BodyText mb={0}>
              E-post:{' '}
              <Link href={`mailto:${member.email}`} color="var(--color-primary)" textDecoration="underline">
                {member.email}
              </Link>
            </BodyText>
          )}
        </Box>
      </Flex>
    </ContentCard>
  );
}
