import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
  Inter,
} from 'next/font/google';
import './globals.css';
import {
  DEFAULT_LOCALE,
  getDirection,
  isValidLocale,
  LOCALE_COOKIE_NAME,
} from '@/i18n/config';
import { AppProviders } from '@/providers/AppProviders';
import { AppShell } from '@/components/layout/AppShell';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Teranoo ERP Knowledge Hub',
    template: '%s · Teranoo ERP Knowledge Hub',
  },
  description:
    'Product Documentation & Architecture Center for Teranoo ERP — an enterprise-grade modular ERP knowledge, architecture, decisions, and research platform.',
  openGraph: {
    title: 'Teranoo ERP Knowledge Hub',
    description:
      'Product Documentation & Architecture Center for Teranoo ERP — an enterprise-grade modular ERP knowledge, architecture, decisions, and research platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teranoo ERP Knowledge Hub',
    description:
      'Product Documentation & Architecture Center for Teranoo ERP — an enterprise-grade modular ERP knowledge, architecture, decisions, and research platform.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale = isValidLocale(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE;
  const dir = getDirection(initialLocale);

  return (
    <html
      lang={initialLocale}
      dir={dir}
      suppressHydrationWarning
      className={`${ibmPlexSansArabic.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body suppressHydrationWarning>
        <AppProviders initialLocale={initialLocale}>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
