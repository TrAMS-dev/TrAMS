'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Box, Flex, Button, HStack, IconButton } from '@chakra-ui/react';
import { User } from 'lucide-react';

export default function Navbar() {
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
    { href: '/', label: 'Hjem' },
    { href: '/arrangementer', label: 'Arrangementer' },
    { href: '/forstehjelpskurs', label: 'Førstehjelpskurs' },
    { href: '/for-medisinstudenter', label: 'For medisinstudenter' },
    { href: '/instruktorer', label: 'For instruktører' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <Box
      as="nav"
      bg="white"
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      position="sticky"
      top={0}
      zIndex={1000}
      px={4}
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
            src="/assets/Logo.png"
            alt="TrAMS logo"
            width={50}
            height={50}
            className="h-[50px] w-auto"
          />
          <Box as="span" fontWeight={700} fontSize="1.1rem" color="var(--color-text)">
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
              className={`no-underline transition-colors duration-300 relative pb-2 ${isActive(link.href)
                ? 'text-(--color-primary) font-bold'
                : 'text-(--color-text) font-normal hover:text-(--color-primary)'
                }`}
            >
              {link.label}
              {isActive(link.href) && (
                <Box
                  position="absolute"
                  bottom={-1}
                  left={0}
                  right={0}
                  h="3px"
                  bg="var(--color-primary)"
                  borderRadius="2px"
                />
              )}
            </Link>
          ))}
          <Link href="/users">
            <IconButton
              aria-label="Brukere"
              variant="ghost"
              color="var(--color-text)"
              _hover={{ bg: 'var(--color-altBg)', color: 'var(--color-primary)' }}
              rounded="full"
            >
              <User size={20} />
            </IconButton>
          </Link>
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
        >
          <Box
            w="25px"
            h="3px"
            bg="var(--color-text)"
            transition="all 0.3s ease"
            transform={isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}
          />
          <Box
            w="25px"
            h="3px"
            bg="var(--color-text)"
            transition="all 0.3s ease"
            opacity={isMobileMenuOpen ? 0 : 1}
          />
          <Box
            w="25px"
            h="3px"
            bg="var(--color-text)"
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
          py={4}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block no-underline px-4 py-4 transition-colors duration-300 ${isActive(link.href)
                ? 'text-(--color-primary) font-bold bg-(--color-altBg)'
                : 'text-(--color-text) font-normal hover:bg-(--color-altBg)'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Box px={4} pb={4}>
            <Link href="/users" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                w="full"
                variant="ghost"
                justifyContent="flex-start"
                color="var(--color-text)"
                _hover={{ bg: 'var(--color-altBg)', color: 'var(--color-primary)' }}
              >
                <User size={20} style={{ marginRight: '8px' }} />
                Brukere
              </Button>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
}
