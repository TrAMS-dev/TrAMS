'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Box, Flex, Button, HStack, Drawer, VStack } from '@chakra-ui/react';
import { MenuIcon, XIcon } from 'lucide-react';
import { NavbarHeading, DrawerHeading } from '@/components/Typography';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    requestAnimationFrame(() => {
      checkMobile();
      setMounted(true);
    });
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navLinks = [
    { href: '/om-oss', label: 'Om oss' },
    { href: '/forstehjelpskurs', label: 'Våre tilbud' },
    { href: '/book-kurs', label: 'Book kurs' },
    { href: '/for-medisinstudenter', label: 'For medisinstudenter' },
    { href: '/instruktorer', label: 'For instruktører' },
    { href: '/arrangementer', label: 'Arrangementer' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const textColor = transparent ? 'white' : 'var(--color-text)';
  const hoverColor = transparent ? 'gray.200' : 'var(--color-primary)';
  const activeColor = transparent ? 'white' : 'var(--color-primary)';
  const logoSrc = transparent ? '/assets/Logo_white.png' : '/assets/Logo.png';

  return (
    <Box
      as="nav"
      bg={transparent ? 'transparent' : 'white'}
      boxShadow={transparent ? 'none' : '0 2px 10px rgba(0,0,0,0.1)'}
      position={transparent ? 'absolute' : 'sticky'}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      px={4}
      transition="background-color 0.3s ease, box-shadow 0.3s ease"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        justify="space-between"
        align="center"
        py={4}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 no-underline text-inherit">
          <Image
            src={logoSrc}
            alt="TrAMS logo"
            width={50}
            height={50}
            className="h-[50px] w-auto"
          />
          <Box as="span" fontWeight={700} fontSize="1.1rem" color={textColor}>
            TrAMS
          </Box>
        </Link>

        {/* Desktop Navigation */}
        <HStack gap={8} display={{ base: 'none', lg: 'flex' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline relative pb-2"
              style={{
                color: isActive(link.href) ? 'var(--active-color)' : 'var(--text-color)',
                transition: 'color 0.2s ease',
              }}
            >
              <Box
                as="span"
                color={isActive(link.href) ? activeColor : textColor}
                _hover={{ color: hoverColor }}
              >
                <NavbarHeading fontWeight={isActive(link.href) ? 'bold' : 'normal'}>{link.label}</NavbarHeading>
              </Box>
              {isActive(link.href) && (
                <Box
                  position="absolute"
                  bottom={-1}
                  left={0}
                  right={0}
                  h="3px"
                  bg={activeColor}
                  borderRadius="2px"
                />
              )}
            </Link>
          ))}
        </HStack>

        <Drawer.Root
          open={isMobileMenuOpen}
          onOpenChange={({ open }) => setIsMobileMenuOpen(open)}
        >
          <Drawer.Backdrop />

          <Drawer.Trigger asChild>
            <Button
              display={{ base: 'flex', lg: 'none' }}
              variant="ghost"
              p={2}
              borderRadius="full"
              aria-label="Åpne meny"

              _hover={{ bg: transparent ? 'whiteAlpha.200' : 'gray.100' }}
            >
              <MenuIcon color={transparent ? 'white' : 'black'} />
            </Button >
          </Drawer.Trigger>

          <Drawer.Positioner>
            <Drawer.Content
              bg="white"
              maxW="320px"
              ml="auto"
              boxShadow="lg"
              p={0}
            >
              <Drawer.Body p={6}>
                {/* 3) Use CloseTrigger so Drawer will also update its own state */}
                <Flex justify="flex-end" mb={4}>
                  <Drawer.CloseTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      borderRadius="full"
                      aria-label="Lukk meny"
                      _hover={{ bg: 'gray.100' }}
                    >
                      <XIcon />
                    </Button>
                  </Drawer.CloseTrigger>
                </Flex>

                {mounted && isMobile && (
                  <VStack align="stretch" gap={2}>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="no-underline relative pb-2"
                        style={{
                          color: isActive(link.href) ? 'var(--active-color)' : 'var(--text-color)',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        <Box
                          as="span"
                          color={isActive(link.href) ? activeColor : textColor}
                          _hover={{ color: hoverColor }}
                        >
                          <NavbarHeading fontWeight={isActive(link.href) ? 'bold' : 'normal'}>{link.label}</NavbarHeading>
                        </Box>
                      </Link>
                    ))}
                  </VStack>
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      </Flex>
    </Box>
  );
}