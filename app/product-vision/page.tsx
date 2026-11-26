import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { ProductVisionView } from '@/features/product-vision/ProductVisionView';

export const metadata: Metadata = {
  title: 'Product Vision',
};

export default function ProductVisionPage() {
  const visionSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-01-project-vision'
  );

  return <ProductVisionView visionSourceEntry={visionSourceEntry} />;
}
