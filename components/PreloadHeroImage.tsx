import { preload } from 'react-dom';

/**
 * Preloads a hero image with high priority.
 * React hoists the resulting <link rel="preload"> into <head> during server
 * rendering (and dedupes it), so the image starts loading before hydration.
 */
export default function PreloadHeroImage({ imageUrl }: { imageUrl: string }) {
  // Determine image type from extension
  const getImageType = (url: string): string | undefined => {
    if (url.match(/\.(jpg|jpeg)$/i)) return 'image/jpeg';
    if (url.match(/\.png$/i)) return 'image/png';
    if (url.match(/\.webp$/i)) return 'image/webp';
    if (url.match(/\.svg$/i)) return 'image/svg+xml';
    return undefined;
  };

  preload(imageUrl, {
    as: 'image',
    fetchPriority: 'high',
    type: getImageType(imageUrl),
  });

  return null;
}
