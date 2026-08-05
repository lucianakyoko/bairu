import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/dashboard', '/admin', '/api'],
      },
    ],

    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
