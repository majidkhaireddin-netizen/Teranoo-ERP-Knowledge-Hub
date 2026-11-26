import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { getExtractedFacRegister } from '@/content/extractors/facRegisterExtractor';
import { FutureConsiderationsView } from '@/features/future-considerations/FutureConsiderationsView';

export const metadata: Metadata = {
  title: 'Future Considerations',
};

export default function FutureConsiderationsPage() {
  const facSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-06-future-architecture-considerations'
  );
  const extractedFac = getExtractedFacRegister();

  return (
    <FutureConsiderationsView
      facSourceEntry={facSourceEntry}
      extractedFac={extractedFac}
    />
  );
}
