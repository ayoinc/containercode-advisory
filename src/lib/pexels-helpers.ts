import { IMAGE_CATEGORIES } from './pexels';

export { IMAGE_CATEGORIES as PEXELS_IMAGE_CATEGORIES };

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string; // Changed from number to string to match Pexels API
  avg_color: string | null; // Allow null to match Pexels API
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string | null; // Allow null to match Pexels API
}

/**
 * Get a photo for a specific category without throwing errors during validation
 */
export async function getPexelsPhoto(category: keyof typeof IMAGE_CATEGORIES): Promise<Photo | null> {
  try {
    // Only import and use Pexels when actually needed
    const { getRandomPhoto } = await import('./pexels');
    return await getRandomPhoto(category);
  } catch (error) {
    console.warn('Pexels API not available:', error);
    return null;
  }
}

/**
 * Search for photos by query without throwing errors during validation
 */
export async function searchPexelsPhotos(query: string, orientation: 'landscape' | 'portrait' | 'square' = 'landscape'): Promise<Photo[]> {
  try {
    const { searchPhotos } = await import('./pexels');
    const response = await searchPhotos(query, { perPage: 5, orientation });
    return response.photos;
  } catch (error) {
    console.warn('Pexels API not available:', error);
    return [];
  }
}