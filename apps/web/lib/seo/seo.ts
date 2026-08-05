import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Bairu',
  description:
    'Descubra negócios, produtos e serviços locais ou crie gratuitamente um perfil profissional para que seu negócio seja encontrado com mais facilidade em São Miguel Arcanjo/SP.',
  url: 'https://bairu.com.br',
  creator: 'Luciana Kyoko',
  author: {
    name: 'Luciana Kyoko',
    url: 'https://lucianakyoko.vercel.app',
  },
  publisher: 'Bairu',
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    siteName: siteConfig.name,

    title: siteConfig.name,
    description: siteConfig.description,

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
  keywords: [
    'Bairu',
    'negócios locais',
    'São Miguel Arcanjo',
    'comércio local',
    'prestadores de serviço',
    'empresa local',
  ],
  authors: [siteConfig.author],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  category: 'Business',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
