/**
 * Server component that injects a preload link for hero images.
 * This script runs immediately when the page loads, before React hydrates,
 * ensuring the image starts loading as early as possible.
 */
export default function PreloadHeroImage({ imageUrl }: { imageUrl: string }) {
  // Determine image type from extension
  const getImageType = (url: string): string => {
    if (url.match(/\.(jpg|jpeg)$/i)) return 'image/jpeg';
    if (url.match(/\.png$/i)) return 'image/png';
    if (url.match(/\.webp$/i)) return 'image/webp';
    if (url.match(/\.svg$/i)) return 'image/svg+xml';
    return 'image';
  };

  const imageType = getImageType(imageUrl);
  const escapedUrl = imageUrl.replace(/'/g, "\\'");

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (document.querySelector('link[rel="preload"][href="${escapedUrl}"]')) return;
            var link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = '${escapedUrl}';
            link.fetchPriority = 'high';
            ${imageType !== 'image' ? `link.type = '${imageType}';` : ''}
            document.head.appendChild(link);
          })();
        `,
      }}
    />
  );
}
