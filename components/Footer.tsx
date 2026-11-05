import Image from 'next/image';
import { Box, Flex, Grid, VStack, Link, Text } from '@chakra-ui/react';
import { Facebook, Instagram, Github } from 'lucide-react';
import { ReactNode } from 'react';
import FeedbackDialog from '@/components/FeedbackDialog';
import { client } from '@/sanity/lib/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';

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

export default async function Footer() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch((error) => {
    console.error('Error fetching site settings:', error);
    return null;
  });

  const socialLinks = [
    { href: settings?.instagramUrl, label: 'Instagram', icon: Instagram },
    { href: settings?.facebookUrl, label: 'Facebook', icon: Facebook },
    { href: settings?.githubUrl, label: 'GitHub', icon: Github },
  ].filter((link): link is typeof link & { href: string } => !!link.href);

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
              {settings?.address && <Text whiteSpace="pre-line">{settings.address}</Text>}
              {settings?.orgNumber && (
                <Text>
                  <strong>Org.nr:</strong> {settings.orgNumber}
                </Text>
              )}
              {settings?.contactEmail && (
                <Link href={`mailto:${settings.contactEmail}`} color="black" _hover={{ color: 'var(--color-primary)' }}>
                  {settings.contactEmail}
                </Link>
              )}
            </VStack>
          </FooterColumn>

          <FooterColumn title="Sosiale medier">
            <Flex gap={4}>
              {socialLinks.map(({ href, label, icon: Icon }) => (
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
          <Text>&copy; {new Date().getFullYear()} Trondheim Akuttmedisinske Studentforening</Text>
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
