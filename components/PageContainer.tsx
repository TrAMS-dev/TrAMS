import { Container, ContainerProps } from '@chakra-ui/react';

interface PageContainerProps extends ContainerProps {
  /** Use a narrower width for text-heavy pages */
  narrow?: boolean;
}

/**
 * Standard content wrapper for pages, giving every page the same width and spacing
 */
export function PageContainer({ narrow = false, children, ...props }: PageContainerProps) {
  return (
    <Container
      maxW={narrow ? '900px' : '1200px'}
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
      {...props}
    >
      {children}
    </Container>
  );
}
