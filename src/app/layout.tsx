import type { Metadata } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

const fontBricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

const fontJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onfresh.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OnFresh — Wholesale Bakery & Traditional Kerala Snacks | Vandiperiyar, Idukki',
    template: '%s | OnFresh Kerala Snacks',
  },
  description:
    'Manufacturer and wholesale distributor of authentic Kerala snacks and bakery products in Vandiperiyar, Idukki, Kerala. Direct farm Nendran banana chips, tapioca chips, murukku, mixture, and rusks in retail and bulk wholesale packaging.',
  keywords: [
    'OnFresh',
    'Kerala banana chips wholesale',
    'Kerala snacks manufacturer',
    'Vandiperiyar bakery',
    'Idukki snacks supplier',
    'murukku wholesale',
    'Kerala mixture bulk',
    'tapioca chips',
    'pure coconut oil banana chips',
    'wholesale bakery products Kerala',
    'B2B snacks supplier Kerala',
  ],
  authors: [{ name: 'OnFresh Foods Vandiperiyar', url: siteUrl }],
  creator: 'OnFresh Foods',
  publisher: 'OnFresh Foods',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'OnFresh Foods Vandiperiyar',
    title: 'OnFresh — Wholesale Bakery & Traditional Kerala Snacks',
    description:
      'Traditional Kerala snack manufacturing facility in Vandiperiyar, Idukki. Authentic Nendran banana chips, tapioca crisps, and artisan bakery items.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OnFresh Kerala Snacks - Fresh from Vandiperiyar, Idukki',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnFresh — Wholesale Bakery & Kerala Snacks',
    description:
      'Authentic Kerala banana chips and traditional bakery snacks made fresh in Vandiperiyar, Idukki District.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['FoodEstablishment', 'Organization'],
  name: 'OnFresh — Wholesale Bakery & Traditional Kerala Snacks',
  legalName: 'OnFresh Foods Private Limited',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Manufacturer of authentic Kerala snacks and wholesale bakery items based in Vandiperiyar, Idukki District, Kerala, India.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main Road, Vandiperiyar',
    addressLocality: 'Vandiperiyar, Idukki District',
    addressRegion: 'Kerala',
    postalCode: '685533',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 9.5833,
    longitude: 77.0833,
  },
  telephone: '+91-9447000000',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontBricolage.variable} ${fontJakarta.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
