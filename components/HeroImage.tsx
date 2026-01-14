import { Box, BoxProps } from '@chakra-ui/react';
import { HeroHeading, HeroText } from './Typography';
import { ReactNode } from 'react';
import Image from 'next/image';

interface HeroImageProps extends Omit<BoxProps, 'bgImage'> {
  /**
   * URL of the hero image (can be from Supabase storage, imgur, or any URL)
   */
  imageUrl: string;
  /**
   * Main heading text
   */
  heading: ReactNode;
  /**
   * Optional subheading/description text
   */
  text?: ReactNode;
  /**
   * Optional decorative bar below the heading (some pages use this)
   */
  showDecorativeBar?: boolean;
  /**
   * Height of the hero section. Defaults to "25vh"
   */
  height?: string | { base?: string; md?: string; lg?: string };
  /**
   * Priority loading for the image. Defaults to true for hero images.
   * When true, Next.js will preload the image and add a <link rel="preload"> tag.
   */
  priority?: boolean;
  /**
   * Whether to use unoptimized images. Set to true for local images to skip optimization.
   */
  unoptimized?: boolean;
}

/**
 * Reusable HeroImage component for consistent hero section styling across all pages.
 * 
 * Features:
 * - Uses Next.js Image component with priority preloading (standard Next.js approach)
 * - Consistent styling with dark overlay
 * - Responsive design
 * - Optional decorative bar
 * - Supports both Supabase storage URLs and external URLs (imgur, etc.)
 * 
 * @example
 * <HeroImage
 *   imageUrl="https://your-supabase-url.com/storage/v1/object/public/hero-images/image.jpg"
 *   heading="Page Title"
 *   text="Page description"
 * />
 */
export default function HeroImage({
  imageUrl,
  heading,
  text,
  showDecorativeBar = false,
  height = "25vh",
  priority = true,
  unoptimized = false,
  ...boxProps
}: HeroImageProps) {
  // Determine if image is local (starts with /) or external
  const isLocalImage = imageUrl.startsWith('/');
  
  return (
    <Box
      position="relative"
      h={height}
      color="var(--color-light)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      p={{ base: "1.5rem 1rem", md: "3rem 1rem" }}
      boxShadow="0 10px 20px rgba(0,0,0,0.3)"
      overflow="hidden"
      {...boxProps}
    >
      {/* Background Image */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          priority={priority}
          unoptimized={unoptimized || isLocalImage}
          quality={90}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          sizes="100vw"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </Box>

      {/* Dark overlay */}
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
      
      {/* Content */}
      <Box position="relative" zIndex={2} maxW="800px" color="var(--color-light)">
        {typeof heading === 'string' ? (
          <HeroHeading>{heading}</HeroHeading>
        ) : (
          <Box>{heading}</Box>
        )}
        {text && (
          typeof text === 'string' ? (
            <HeroText>{text}</HeroText>
          ) : (
            <Box>{text}</Box>
          )
        )}
        {showDecorativeBar && (
          <Box h="10px" bg="var(--color-primary)" mx="auto" mt={4} w="70%" zIndex={2} />
        )}
      </Box>
    </Box>
  );
}
