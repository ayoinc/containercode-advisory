import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata for the site
export const metadata: Metadata = {
  title: {
    default: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    template: '%s | ContainerCode Advisory',
  },
  description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
  keywords: ['cloud consulting', 'multi-cloud', 'cybersecurity', 'devops', 'digital transformation', 'software engineering'],
  authors: [{ name: 'ContainerCode Advisory' }],
  creator: 'ContainerCode Advisory',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
    siteName: 'ContainerCode Advisory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContainerCode Advisory | Multi-Cloud Consulting Experts',
    description: 'Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
