/**
 * Utility functions for working with Supabase Storage
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

/**
 * Get the public URL for an image stored in Supabase Storage
 * 
 * @param path - Path to the image in the storage bucket (e.g., "rKhkGGT.jpg")
 * @returns Full public URL to the image
 * 
 * @example
 * const imageUrl = getSupabaseImageUrl('rKhkGGT.jpg');
 * // Returns: https://your-project.supabase.co/storage/v1/object/public/hero-images/rKhkGGT.jpg
 */
export function getSupabaseImageUrl(path: string): string {
  if (!SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  console.log(`${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanPath}`);

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanPath}`;
}

/**
 * Get the public URL for a hero image
 * This is a convenience wrapper around getSupabaseImageUrl
 * 
 * @param filename - Name of the hero image file (e.g., "rKhkGGT.jpg")
 * @returns Full public URL to the hero image
 */
export function getHeroImageUrl(filename: string): string {
  return getSupabaseImageUrl(filename);
}

