import { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onfresh.in';
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic category routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categoriesRes = await getCategories();
    if (categoriesRes.data) {
      categoryRoutes = categoriesRes.data.map((cat) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: cat.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch {
    // Graceful fallback for offline build
  }

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getProducts();
    if (productsRes.data?.results) {
      productRoutes = productsRes.data.results.map((prod) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: prod.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }
  } catch {
    // Graceful fallback
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

