import { Heading, Text, Box, HeadingProps, TextProps } from '@chakra-ui/react';

interface HeroHeadingProps extends HeadingProps {
  children: React.ReactNode;
}

/**
 * Large heading for hero sections (typically 2.5rem, white text on dark overlay)
 */
export function HeroHeading({ children, ...props }: HeroHeadingProps) {
  return (
    <Heading
      as="h1"
      fontSize="2.5rem"
      fontWeight={700}
      mb={4}
      {...props}
    >
      {children}
    </Heading>
  );
}

interface HeroTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * Text for hero sections (typically 1.2rem, white text)
 */
export function HeroText({ children, ...props }: HeroTextProps) {
  return (
    <Text
      fontSize="1.2rem"
      lineHeight="1.6"
      mb={4}
      {...props}
    >
      {children}
    </Text>
  );
}

interface PageHeadingProps extends HeadingProps {
  children: React.ReactNode;
}

/**
 * Large heading for main page sections (typically 2rem)
 */
export function PageHeading({ children, ...props }: PageHeadingProps) {
  return (
    <Heading
      as="h1"
      fontSize="2rem"
      fontWeight={700}
      mb={4}
      {...props}
    >
      {children}
    </Heading>
  );
}

interface SectionHeadingProps extends HeadingProps {
  children: React.ReactNode;
  underlineWidth?: string;
  underlineColor?: string;
}

/**
 * Section heading with decorative underline (typically h2, 2rem, with underline bar)
 */
export function SectionHeading({
  children,
  underlineWidth = '80px',
  underlineColor = 'var(--color-primary)',
  ...props
}: SectionHeadingProps) {
  return (
    <Heading
      as="h2"
      textAlign="center"
      fontSize="2rem"
      fontWeight={700}
      position="relative"
      my={8}
      pb={2}
      {...props}
    >
      {children}
      <Box
        display="block"
        w={underlineWidth}
        h="4px"
        bg={underlineColor}
        mx="auto"
        mt={2}
        borderRadius="2px"
      />
    </Heading>
  );
}

interface SubsectionHeadingProps extends HeadingProps {
  children: React.ReactNode;
}

/**
 * Subsection heading (typically h3, 1.2rem-1.4rem)
 */
export function SubsectionHeading({ children, ...props }: SubsectionHeadingProps) {
  return (
    <Heading
      as="h3"
      fontSize="1.2rem"
      fontWeight={700}
      mb={2}
      {...props}
    >
      {children}
    </Heading>
  );
}

interface BodyTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * Standard body text with consistent line height
 */
export function BodyText({ children, ...props }: BodyTextProps) {
  return (
    <Text
      lineHeight="1.5"
      mb={4}
      {...props}
    >
      {children}
    </Text>
  );
}

interface CenteredTextProps extends TextProps {
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Centered body text, typically used for introductory paragraphs
 */
export function CenteredText({
  children,
  maxWidth = '800px',
  ...props
}: CenteredTextProps) {
  return (
    <Text
      textAlign="center"
      maxW={maxWidth}
      mx="auto"
      mb={8}
      lineHeight="1.5"
      {...props}
    >
      {children}
    </Text>
  );
}

