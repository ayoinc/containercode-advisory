import { createClient } from 'pexels';
import { cache } from 'react';
import { Images } from 'pexels/dist/types';

const pexelsApiKey = process.env.PEXELS_API_KEY;

if (!pexelsApiKey) {
  throw new Error('Missing PEXELS_API_KEY environment variable');
}

export const pexelsClient = createClient(pexelsApiKey);

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
): Promise<Images> => {
  const { perPage = 10, page = 1, orientation } = options;
  
  try {
    const response = await pexelsClient.photos.search({
      query,
      per_page: perPage,
      page,
      orientation,
    });
    
    return response;
  } catch (error) {
    console.error('Pexels API error:', error);
    throw new Error('Failed to fetch images');
  }
});

// Get a single photo by ID
export const getPhoto = cache(async (id: number) => {
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
  const categories = IMAGE_CATEGORIES[category];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const response = await searchPhotos(randomCategory, {
    perPage: 10,
    orientation,
  });
  
  if (response.photos.length === 0) {
    throw new Error('No images found');
  }
  
  return response.photos[Math.floor(Math.random() * response.photos.length)];
});

// Get multiple random photos from a category
export const getRandomPhotos = cache(async (
  category: keyof typeof IMAGE_CATEGORIES,
  count: number = 4,
  orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
) => {
  const categories = IMAGE_CATEGORIES[category];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const response = await searchPhotos(randomCategory, {
    perPage: Math.max(count * 2, 10), // Fetch more to have options
    orientation,
  });
  
  if (response.photos.length === 0) {
    throw new Error('No images found');
  }
  
  // Shuffle photos and return the requested count
  const shuffled = [...response.photos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
});
