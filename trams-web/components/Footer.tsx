import Image from 'next/image';
import { Box, Flex, VStack, Link, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="var(--color-secondary)"
      color="black"
      p={8}
      fontSize="0.9rem"
    >
      <Flex
        justify="space-between"
        flexWrap="wrap"
        gap={8}
        maxW="1200px"
        mx="auto"
      >
        <Box flex="1 1 200px">
          <Flex align="center" gap={4} mb={4}>
            <Image
              src="https://i.imgur.com/jZBTHbd.png"
              alt="TrAMS logo"
              width={60}
              height={60}
              className="w-[60px]"
            />
            <VStack align="start" gap={0} lineHeight="1.2">
              <Text as="span" display="block" fontWeight="bold" color="black">
                Trondheim
              </Text>
              <Text as="span" display="block" fontWeight="bold" color="black">
                Akuttmedisinske
              </Text>
              <Text as="span" display="block" fontWeight="bold" color="black">
                Studentforening
              </Text>
            </VStack>
          </Flex>
          <VStack align="start" gap={1}>
            <Text m={0} color="black">
              <strong>Adresse:</strong> Fred Kavli-bygget, 1. et ved varemottak St. Olavs Hospital 7491 Trondheim
            </Text>
            <Text m={0} color="black">
              <strong>Org.nr:</strong> 994089358
            </Text>
            <Text m={0} color="black">
              <strong>E-post:</strong>{' '}
              <Link href="mailto:web@trams.no" color="black" textDecoration="none" _hover={{ color: 'var(--color-primary)' }}>
                web@trams.no
              </Link>
            </Text>
          </VStack>
        </Box>
        <Box flex="1 1 200px">
          <Text as="h3" mt={0} fontWeight={700} mb={2}>
            Sosiale medier
          </Text>
          <VStack as="ul" align="start" gap={1} listStyleType="none" p={0} m={0}>
            <Box as="li">
              <Link
                href="https://www.instagram.com/trondheimams/"
                target="_blank"
                rel="noopener noreferrer"
                textDecoration="none"
                color="black"
                _hover={{ color: 'var(--color-primary)' }}
              >
                Instagram
              </Link>
            </Box>
            <Box as="li">
              <Link
                href="https://www.facebook.com/trondheimams/"
                target="_blank"
                rel="noopener noreferrer"
                textDecoration="none"
                color="black"
                _hover={{ color: 'var(--color-primary)' }}
              >
                Facebook
              </Link>
            </Box>
          </VStack>
        </Box>
      </Flex>
      <Box textAlign="center" mt={4} fontSize="0.8rem" color="black">
        <Text m={0}>&copy; 2024 Trondheim Akuttmedisinske Studentforening</Text>
      </Box>
    </Box>
  );
}
