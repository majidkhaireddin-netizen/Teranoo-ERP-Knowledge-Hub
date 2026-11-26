import type { Metadata } from 'next';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { KnowledgeLibraryView } from '@/features/knowledge/KnowledgeLibraryView';

export const metadata: Metadata = {
  title: 'Knowledge Library',
};

export default function KnowledgeLibraryPage() {
  const registry = getContentRegistry();
  const records = registry.getAllPublicMetadata();

  return <KnowledgeLibraryView records={records} />;
}
