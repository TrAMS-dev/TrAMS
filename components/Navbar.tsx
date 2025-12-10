'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Box, Flex, Button, HStack } from '@chakra-ui/react';

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
      setIsMobile(window.innerWidth <= 768);
    };
    // Use requestAnimationFrame to avoid synchronous setState
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

  const textColor = transparent && !isMobileMenuOpen ? 'white' : 'var(--color-text)';
  const hoverColor = transparent && !isMobileMenuOpen ? 'gray.200' : 'var(--color-primary)';
  const activeColor = transparent && !isMobileMenuOpen ? 'white' : 'var(--color-primary)';
  const logoSrc = transparent && !isMobileMenuOpen ? '/assets/Logo_white.png' : '/assets/Logo.png'; // Assuming same logo works or handled via CSS filter if needed, but white text next to it changes.

  return (
    <Box
      as="nav"
      bg={transparent && !isMobileMenuOpen ? 'transparent' : 'white'}
      boxShadow={transparent && !isMobileMenuOpen ? 'none' : '0 2px 10px rgba(0,0,0,0.1)'}
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
        <HStack
          gap={8}
          display={{ base: 'none', md: 'flex' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`no-underline transition-colors duration-300 relative pb-2`}
              style={{
                color: isActive(link.href) ? 'var(--active-color)' : 'var(--text-color)',
                fontWeight: isActive(link.href) ? 'bold' : 'normal'
              }}
            >
              <Box as="span" color={isActive(link.href) ? activeColor : textColor} _hover={{ color: hoverColor }}>
                {link.label}
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

        {/* Mobile Menu Button */}
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          display={{ base: 'flex', md: 'none' }}
          variant="ghost"
          p={2}
          flexDirection="column"
          gap={1}
          aria-label="Toggle menu"
          _hover={{ bg: transparent ? 'whiteAlpha.200' : 'gray.100' }}
        >
          <Box
            w="25px"
            h="3px"
            bg={textColor}
            transition="all 0.3s ease"
            transform={isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}
          />
          <Box
            w="25px"
            h="3px"
            bg={textColor}
            transition="all 0.3s ease"
            opacity={isMobileMenuOpen ? 0 : 1}
          />
          <Box
            w="25px"
            h="3px"
            bg={textColor}
            transition="all 0.3s ease"
            transform={isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'}
          />
        </Button>
      </Flex>

      {/* Mobile Navigation */}
      {mounted && isMobileMenuOpen && isMobile && (
        <Box
          display="flex"
          flexDirection="column"
          borderTop="1px solid var(--color-altBg)"
          bg="white"
          py={6}
          position="absolute" // Ensure it doesn't push content down if nav is transparent absolute
          left={0}
          right={0}
          boxShadow="0 4px 6px rgba(0,0,0,0.1)"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block no-underline px-6 py-6 transition-colors duration-300 ${isActive(link.href)
                ? 'text-(--color-primary) font-bold bg-(--color-altBg)'
                : 'text-(--color-text) font-normal hover:bg-(--color-altBg)'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      )}
    </Box >
  );
}

