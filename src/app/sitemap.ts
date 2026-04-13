import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';

const SITE = 'https://www.abearicaonline.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ];

  try {
    const posts: { slug?: { current?: string }; publishedAt?: string }[] =
      await sanityClient.fetch(
        `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
          slug, publishedAt
        }`
      );
    for (const p of posts || []) {
      const slug = p.slug?.current;
      if (!slug) continue;
      entries.push({
        url: `${SITE}/blog/${slug}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // If Sanity is unreachable at build, still emit the homepage.
  }

  return entries;
}
