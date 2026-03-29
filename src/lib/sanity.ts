import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1q5hqwyv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function getAnnouncements() {
  try {
    const announcements = await sanityClient.fetch(
      `*[_type == "announcement"] | order(publishedAt desc)[0...10] {
        _id, title, body, publishedAt
      }`
    );
    return announcements || [];
  } catch {
    return [];
  }
}

export async function getBlogPosts() {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc)[0...20] {
        _id, title, slug, body, publishedAt
      }`
    );
    return posts || [];
  } catch {
    return [];
  }
}
