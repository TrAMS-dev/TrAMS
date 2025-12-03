import NextLink from 'next/link';
import { Box, HStack, Button, Link as ChakraLink } from '@chakra-ui/react';
import { PageHeading, CenteredText } from '../components/Typography';

export default function NotFound() {
  return (
    <>

      <Box as="main" className="container" py={40}>
        <Box maxW="680px" mx="auto" textAlign="center">

          <PageHeading>Fant ikke siden</PageHeading>

          <CenteredText>
            Beklager — siden du leter etter finnes ikke. Den kan ha blitt slettet, eller lenken kan være feil.
          </CenteredText>

          <HStack justify="center" flexWrap="wrap">
            <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
              <Button bg="var(--color-primary)" color="white" _hover={{ opacity: 0.95 }}>
                Gå til startsiden
              </Button>
            </ChakraLink>

            <ChakraLink as={NextLink} href="/arrangementer" _hover={{ textDecoration: 'none' }}>
              <Button variant="outline" borderColor="var(--color-primary)" color="var(--color-text)">
                Se arrangementer
              </Button>
            </ChakraLink>

            <ChakraLink href="mailto:web@trams.no"  _hover={{ textDecoration: 'none' }}>
              <Button variant="ghost" color="var(--color-text)">Kontakt oss</Button>
            </ChakraLink>
          </HStack>

          <Box mt={4} color="gray.600" fontSize="sm">
            Eller bruk navigasjonen øverst for å finne det du trenger.
          </Box>
        </Box>
      </Box>

    </>
  );
}
