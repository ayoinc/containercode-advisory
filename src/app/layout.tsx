import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PerformanceProvider } from './providers/performance-provider';

// Configure Inter font with optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

// Configure JetBrains Mono font for code and monospace text
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com'),
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 custom-scrollbar">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        
        <PerformanceProvider>
          <Header />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
        </PerformanceProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}