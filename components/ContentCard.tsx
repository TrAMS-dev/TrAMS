import { Box, BoxProps } from '@chakra-ui/react';

/**
 * Shared card surface so every card on the site looks the same.
 * Spread onto any Chakra element (e.g. a Link) that should look like a card.
 */
export const cardStyles = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  borderRadius: 'lg',
} as const;

/** Hover effect for cards that are clickable */
export const cardHoverStyles = {
  boxShadow: 'md',
  transform: 'translateY(-2px)',
} as const;

/**
 * Standard white card for page content
 */
export function ContentCard({ children, ...props }: BoxProps) {
  return (
    <Box {...cardStyles} p={{ base: 6, md: 8 }} {...props}>
      {children}
    </Box>
  );
}
