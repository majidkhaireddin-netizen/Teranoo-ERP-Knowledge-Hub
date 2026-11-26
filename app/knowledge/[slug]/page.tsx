import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { resolveRendererForContentType } from '@/content/renderers/rendererRegistry';
import { DocumentReaderView } from '@/features/knowledge/DocumentReaderView';

interface KnowledgeDocumentPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const registry = getContentRegistry();
  return registry.getAllPublicMetadata().map((meta) => ({
    slug: meta.slug,
  }));
}

export async function generateMetadata({
  params,
}: KnowledgeDocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const registry = getContentRegistry();
  const doc = registry.getBySlug(slug);

  if (!doc) {
    return {
      title: 'Document Unavailable',
    };
  }

  return {
    title: doc.metadata.title.en,
    description: doc.metadata.description.en,
  };
}

export default async function KnowledgeDocumentPage({
  params,
}: KnowledgeDocumentPageProps) {
  const { slug } = await params;
  const registry = getContentRegistry();
  const document = registry.getBySlug(slug);

  if (!document) {
    notFound();
  }

  const { outgoing, incoming } = registry.getRelationships(document.metadata.id);
  const translations = registry.getTranslations(document.metadata.id);
  const revisions = registry.getRevisions(document.metadata.id);
  const neighbors = registry.getCollectionNeighbors(document.metadata.id);
  const rendererDescriptor = resolveRendererForContentType(
    document.metadata.type
  );

  return (
    <DocumentReaderView
      document={document}
      outgoingRelationships={outgoing}
      incomingRelationships={incoming}
      translations={translations}
      revisions={revisions}
      neighbors={neighbors}
      rendererDescriptor={rendererDescriptor}
    />
  );
}
