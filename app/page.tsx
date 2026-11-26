import type { Metadata } from 'next';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import {
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
} from '@/content/manifest/sourceManifest';
import { DashboardView } from '@/features/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const registryStats = getContentRegistry().getStats();
  const manifestSummary = deriveSourceManifestSummary(
    PROJECT_FOUNDATIONS_SOURCE_MANIFEST
  );

  return (
    <DashboardView
      registryStats={registryStats}
      manifestSummary={manifestSummary}
    />
  );
}
