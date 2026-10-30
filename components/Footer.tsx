import Image from 'next/image';
import { Box, Flex, Grid, VStack, Link, Text } from '@chakra-ui/react';
import { Facebook, Instagram, Github } from 'lucide-react';
import { ReactNode } from 'react';
import FeedbackDialog from '@/components/FeedbackDialog';

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/trondheimams/', label: 'Instagram', icon: Instagram },
  { href: 'https://www.facebook.com/trondheimams/', label: 'Facebook', icon: Facebook },
  { href: 'https://github.com/trondheimams', label: 'GitHub', icon: Github },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Text as="h3" fontWeight={700} fontSize="1rem" mb={3}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="var(--color-secondary)"
      color="black"
      px={{ base: 4, md: 8 }}
      pt={{ base: 10, md: 12 }}
      pb={6}
      fontSize="0.9rem"
    >
      <Box maxW="1200px" mx="auto">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: '1.2fr 1.5fr 1fr 1fr' }}
          gap={{ base: 8, lg: 12 }}
        >
          {/* Brand */}
          <Flex align="center" gap={4} alignSelf="start">
            <Image
              src="/assets/Logo.png"
              alt="TrAMS logo"
              width={60}
              height={60}
              className="w-[60px]"
            />
            <Text fontWeight="bold" lineHeight="1.3">
              Trondheim
              <br />
              Akuttmedisinske
              <br />
              Studentforening
            </Text>
          </Flex>

          <FooterColumn title="Kontakt">
            <VStack align="start" gap={2}>
              <Text>
                Fred Kavli-bygget, 1. et ved varemottak
                <br />
                St. Olavs Hospital, 7491 Trondheim
              </Text>
              <Text>
                <strong>Org.nr:</strong> 994089358
              </Text>
              <Link href="mailto:ekstern@trams.no" color="black" _hover={{ color: 'var(--color-primary)' }}>
                ekstern@trams.no
              </Link>
            </VStack>
          </FooterColumn>

          <FooterColumn title="Sosiale medier">
            <Flex gap={4}>
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="black"
                  _hover={{ color: 'var(--color-primary)' }}
                  aria-label={label}
                >
                  <Icon size={24} />
                </Link>
              ))}
            </Flex>
          </FooterColumn>

          <FooterColumn title="Tilbakemelding">
            <FeedbackDialog />
          </FooterColumn>
        </Grid>

        {/* Bottom bar */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={2}
          mt={{ base: 8, md: 10 }}
          pt={6}
          borderTop="1px solid"
          borderColor="blackAlpha.200"
          fontSize="0.8rem"
        >
          <Text>&copy; 2026 Trondheim Akuttmedisinske Studentforening</Text>
          <Link
            href="/admin"
            color="black"
            opacity={0.5}
            _hover={{ color: 'var(--color-primary)', opacity: 1 }}
          >
            Adminside
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}
