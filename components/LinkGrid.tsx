'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { InstruktorLink } from '@/types/sanity.types';
import { INSTRUKT_LINKS_QUERY } from '@/sanity/lib/queries';
import { SubsectionHeading } from '@/components/Typography';
import { Box, Flex, Text, Link } from '@chakra-ui/react';

export default function LinkGrid() {
    const [links, setLinks] = useState<InstruktorLink[]>([]);

    useEffect(() => {
        client.fetch<InstruktorLink[]>(INSTRUKT_LINKS_QUERY)
            .then((data) => setLinks(data))
            .catch((err) => console.error('Failed to fetch instruktorer links:', err));
    }, []);
    return (
        <Flex flexWrap="wrap" gap={8} mt={8} justifyContent="center">
            {links.map((box) => (
                <Box
                    key={box._id}
                    flex="1 1 300px"
                    bg="var(--color-light)"
                    boxShadow="0 2px 5px rgba(0,0,0,0.1)"
                    borderRadius="8px"
                    p={6}
                    textAlign="center"
                    maxW="350px"
                >
                    <SubsectionHeading mt={0} mb={2} fontSize="1.1rem">
                        {box.title}
                    </SubsectionHeading>
                    <Text mb={4} fontSize="0.9rem" lineHeight="1.4">
                        {box.description}
                    </Text>
                    <Link
                        href={box.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="inline-block"
                        bg="var(--color-primary)"
                        color="var(--color-light)"
                        p="0.6rem 1.2rem"
                        textDecoration="none"
                        borderRadius="4px"
                        transition="background 0.3s ease"
                        fontWeight={600}
                        fontSize="0.9rem"
                        _hover={{
                            bg: 'var(--color-secondary)',
                            color: 'black',
                        }}
                    >
                        {box.linkText}
                    </Link>
                </Box>
            ))}
        </Flex>
    );
}