import { Heading, Text, Box, BoxProps, HeadingProps, TextProps } from '@chakra-ui/react';

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
export function NavbarHeading({ children, ...props }: SubsectionHeadingProps) {
  return (
    <Heading
      as="h4"
      fontSize="1rem"
      {...props}
    >
      {children}
    </Heading>
  );
}
export function DrawerHeading({ children, ...props }: SubsectionHeadingProps) {
  return (
    <Heading
      as="h3"
      fontSize="1.2rem"
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

import { PortableText, type PortableTextComponents, type PortableTextProps } from 'next-sanity';

/**
 * Custom components for rendering Sanity PortableText content
 * Uses predefined Typography components for consistency
 * Use this with: <PortableText value={content} components={portableTextComponents} />
 */
export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <PageHeading mb={6}>{children}</PageHeading>,
    h2: ({ children }) => (
      <SubsectionHeading as="h2" fontSize="1.5rem" mt={6} mb={3}>
        {children}
      </SubsectionHeading>
    ),
    h3: ({ children }) => <SubsectionHeading mt={5} mb={2}>{children}</SubsectionHeading>,
    h4: ({ children }) => (
      <SubsectionHeading as="h4" fontSize="1.1rem" mt={4} mb={2}>
        {children}
      </SubsectionHeading>
    ),
    normal: ({ children }) => <BodyText>{children}</BodyText>,
    blockquote: ({ children }) => (
      <Box
        as="blockquote"
        borderLeftWidth="4px"
        borderLeftColor="gray.300"
        pl={4}
        fontStyle="italic"
        my={4}
      >
        {children}
      </Box>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <Box as="ul" listStyleType="disc" listStylePosition="inside" mb={4} css={{ '& > li': { marginTop: '0.5rem' } }}>
        {children}
      </Box>
    ),
    number: ({ children }) => (
      <Box as="ol" listStyleType="decimal" listStylePosition="inside" mb={4} css={{ '& > li': { marginTop: '0.5rem' } }}>
        {children}
      </Box>
    ),
  },
  listItem: {
    bullet: ({ children }) => <Box as="li" ml={4}>{children}</Box>,
    number: ({ children }) => <Box as="li" ml={4}>{children}</Box>,
  },
  marks: {
    strong: ({ children }) => <Text as="strong" fontWeight="bold">{children}</Text>,
    em: ({ children }) => <Text as="em" fontStyle="italic">{children}</Text>,
    code: ({ children }) => (
      <Text
        as="code"
        bg="gray.100"
        borderRadius="md"
        px={1}
        py={0.5}
        fontSize="sm"
        fontFamily="mono"
      >
        {children}
      </Text>
    ),
    link: ({ children, value }) => {
      const href: string | undefined = value?.href;
      const isExternal = !!href && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{
            // Overridable per section with the --rich-text-link-color CSS variable
            color: 'var(--rich-text-link-color, #2563eb)',
            textDecoration: 'underline',
          }}
        >
          {children}
        </a>
      );
    },
  },
};

interface RichTextProps extends Omit<BoxProps, 'children'> {
  value: PortableTextProps['value'] | null | undefined;
  /** Center the text in a narrow column, like CenteredText */
  centered?: boolean;
  /** Link color, defaults to the primary site color */
  linkColor?: string;
}

/**
 * Renders Sanity rich text with the site's typography.
 * The last paragraph's bottom margin is removed so spacing is controlled by the wrapper.
 */
export function RichText({ value, centered = false, linkColor = 'var(--color-primary)', ...props }: RichTextProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <Box
      {...(centered ? { textAlign: 'center', maxW: '800px', mx: 'auto', mb: 8 } : {})}
      css={{ '--rich-text-link-color': linkColor, '& > :last-child': { marginBottom: 0 } }}
      {...props}
    >
      <PortableText value={value} components={portableTextComponents} />
    </Box>
  );
}
