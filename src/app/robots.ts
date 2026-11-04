import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onfresh.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/products/*', '/categories/*', '/login', '/register'],
        disallow: [
          '/admin/',
          '/admin/*',
          '/account/',
          '/account/*',
          '/checkout',
          '/order-success',
          '/api/',
          '/*?*wholesale_pricing=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

