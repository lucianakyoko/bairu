import { siteConfig } from './seo';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo-mark.svg`,
  description: siteConfig.description,
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: 'pt-BR',
  publisher: {
    '@id': `${siteConfig.url}#organization`,
  },
};
