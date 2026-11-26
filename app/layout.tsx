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
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { getExtractedDecisionRegister } from '@/content/extractors/decisionRegisterExtractor';
import { getExtractedFacRegister } from '@/content/extractors/facRegisterExtractor';
import { getExtractedGuardrails } from '@/content/extractors/guardrailsExtractor';
import { getExtractedRoadmap } from '@/content/extractors/roadmapExtractor';
import { getExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import { getExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { buildUnifiedSearchIndex } from '@/content/search/knowledgeSearch';

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
    'The Complete Journey of Building an Enterprise ERP System — ERP encyclopedia, engineering guide, living architecture documentation, research library, and build-in-public journal for Teranoo ERP.',
  openGraph: {
    title: 'Teranoo ERP Knowledge Hub',
    description:
      'The Complete Journey of Building an Enterprise ERP System — ERP encyclopedia, engineering guide, living architecture documentation, research library, and build-in-public journal for Teranoo ERP.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teranoo ERP Knowledge Hub',
    description:
      'The Complete Journey of Building an Enterprise ERP System — ERP encyclopedia, engineering guide, living architecture documentation, research library, and build-in-public journal for Teranoo ERP.',
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
  const registry = getContentRegistry();
  const searchEntries = buildUnifiedSearchIndex(
    registry.getAllPublicMetadata(),
    undefined,
    {
      decisionRegister: getExtractedDecisionRegister(),
      facRegister: getExtractedFacRegister(),
      guardrails: getExtractedGuardrails(),
      roadmap: getExtractedRoadmap(),
      coreModulesCatalog: getExtractedCoreModulesCatalog(),
      dependencyArchitecture: getExtractedDependencyArchitecture(),
    }
  );

  return (
    <html
      lang={initialLocale}
      dir={dir}
      suppressHydrationWarning
      className={`${ibmPlexSansArabic.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body suppressHydrationWarning>
        <AppProviders initialLocale={initialLocale}>
          <AppShell searchEntries={searchEntries}>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
