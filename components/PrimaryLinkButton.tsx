import { Button, Link, LinkProps } from '@chakra-ui/react';

interface PrimaryLinkButtonProps extends LinkProps {
  href: string;
  /** Open in a new tab */
  external?: boolean;
}

/**
 * Full-width primary button used as the main call to action in content cards
 */
export function PrimaryLinkButton({ href, external = false, children, ...props }: PrimaryLinkButtonProps) {
  return (
    <Link
      href={href}
      display="block"
      w="100%"
      mt={4}
      _hover={{ textDecoration: 'none' }}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
    >
      <Button
        bg="var(--color-primary)"
        color="white"
        _hover={{ bg: 'var(--color-secondary)', color: 'black' }}
        w="100%"
        whiteSpace="normal"
      >
        {children}
      </Button>
    </Link>
  );
}
