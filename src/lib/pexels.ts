import { createClient } from 'pexels';
import type { PhotosWithTotalResults } from 'pexels';

// Simple cache implementation for Node.js environments
const simpleCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cached = simpleCache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return Promise.resolve(cached.data);
    }
    
    const result = fn(...args);
    result.then((data: any) => {
      simpleCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
    });
    
    return result;
  }) as T;
}

const pexelsApiKey = process.env.PEXELS_API_KEY;

// Validate API key only when actually using the client
const validateApiKey = () => {
  if (!pexelsApiKey) {
    console.warn('PEXELS_API_KEY not configured - Pexels images will not be available');
    return false;
  }
  return true;
};

export const pexelsClient = pexelsApiKey ? createClient(pexelsApiKey) : null;

// Strategic image categories for ContainerCode Advisory
export const IMAGE_CATEGORIES = {
  cloudComputing: [
    'cloud computing',
    'data center',
    'server room',
    'digital transformation',
  ],
  cybersecurity: [
    'cybersecurity',
    'data protection',
    'network security',
    'digital security',
  ],
  devops: [
    'software development',
    'coding',
    'automation',
    'developer',
  ],
  teamwork: [
    'business team',
    'collaboration',
    'meeting',
    'consulting',
  ],
  innovation: [
    'innovation',
    'digital innovation',
    'future technology',
    'artificial intelligence',
  ],
};

// Cache Pexels API responses
export const searchPhotos = cache(async (
  query: string,
  options: {
    perPage?: number;
    page?: number;
    orientation?: 'landscape' | 'portrait' | 'square';
  } = {}
): Promise<PhotosWithTotalResults> => {
  if (!validateApiKey() || !pexelsClient) {
    // Return empty results instead of throwing
    return { photos: [], total_results: 0, page: 1, per_page: 0, next_page: 2 };
  }
  
  const { perPage = 10, page = 1, orientation } = options;
  
  try {
    const response = await pexelsClient.photos.search({
      query,
      per_page: perPage,
      page,
      orientation,
    });
    
    // Type guard to ensure we have PhotosWithTotalResults
    if ('photos' in response) {
      return response as PhotosWithTotalResults;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Pexels API error:', error);
    throw new Error('Failed to fetch images');
  }
});

// Get a single photo by ID
export const getPhoto = cache(async (id: number) => {
  if (!validateApiKey() || !pexelsClient) {
    return null;
  }
  
  try {
    return await pexelsClient.photos.show({ id });
  } catch (error) {
    console.error('Pexels API error:', error);
    throw new Error('Failed to fetch image');
  }
});

// Get random photo from category
export const getRandomPhoto = cache(async (
  category: keyof typeof IMAGE_CATEGORIES,
  orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
) => {
  try {
    const categories = IMAGE_CATEGORIES[category];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const response = await searchPhotos(randomCategory, {
      perPage: 10,
      orientation,
    });
    
    if (response.photos.length === 0) {
      console.warn(`No images found for category: ${category}`);
      return null;
    }
    
    return response.photos[Math.floor(Math.random() * response.photos.length)];
  } catch (error) {
    console.warn(`Failed to get random photo for ${category}:`, error);
    return null;
  }
});

// Get multiple random photos from a category
export const getRandomPhotos = cache(async (
  category: keyof typeof IMAGE_CATEGORIES,
  count: number = 4,
  orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
) => {
  try {
    const categories = IMAGE_CATEGORIES[category];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const response = await searchPhotos(randomCategory, {
      perPage: Math.max(count * 2, 10), // Fetch more to have options
      orientation,
    });
    
    if (response.photos.length === 0) {
      console.warn(`No images found for category: ${category}`);
      return [];
    }
    
    // Shuffle photos and return the requested count
    const shuffled = [...response.photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.warn(`Failed to get random photos for ${category}:`, error);
    return [];
  }
});
