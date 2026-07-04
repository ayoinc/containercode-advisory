import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PerformanceProvider } from './providers/performance-provider';

// Geist — display / headline typeface (sharp, geometric, "engineered").
// Self-hosted via the `geist` package; exposes --font-geist-sans.

// Inter — body copy
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

// JetBrains Mono — data labels, status chips, technical accents
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: true,
  adjustFontFallback: true,
});

// Enhanced metadata for the site
export const metadata: Metadata = {
  title: {
    default: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    template: '%s | ContainerCode Advisory',
  },
  description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
  keywords: ['cloud consulting', 'multi-cloud', 'cybersecurity', 'devops', 'digital transformation', 'software engineering'],
  authors: [{ name: 'ContainerCode Advisory' }],
  creator: 'ContainerCode Advisory',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.club'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
    siteName: 'ContainerCode Advisory',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ContainerCode Advisory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/images/containercode-icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/containercode-icon.svg',
  },
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-navy-900 text-navy-100 custom-scrollbar">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-link">Skip to content</a>

        <PerformanceProvider>
          <Header />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
        </PerformanceProvider>
      </body>
    </html>
  );
}