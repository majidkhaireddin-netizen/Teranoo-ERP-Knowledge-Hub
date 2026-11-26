import type { Metadata } from 'next';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import {
  OFFICIAL_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
} from '@/content/manifest/sourceManifest';
import { KnowledgeLibraryView } from '@/features/knowledge/KnowledgeLibraryView';

export const metadata: Metadata = {
  title: 'Knowledge Library',
};

export default function KnowledgeLibraryPage() {
  const registry = getContentRegistry();
  const records = registry.getAllPublicMetadata();
  const manifestSummary = deriveSourceManifestSummary(OFFICIAL_SOURCE_MANIFEST);

  return (
    <KnowledgeLibraryView
      records={records}
      sourceManifest={OFFICIAL_SOURCE_MANIFEST}
      sourceManifestSummary={manifestSummary}
    />
  );
}
