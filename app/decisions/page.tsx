import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { getExtractedDecisionRegister } from '@/content/extractors/decisionRegisterExtractor';
import { DecisionRegisterView } from '@/features/decisions/DecisionRegisterView';

export const metadata: Metadata = {
  title: 'Decision Register',
};

export default function DecisionsPage() {
  const decisionRegisterSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-05-decision-register'
  );
  const extractedRegister = getExtractedDecisionRegister();

  return (
    <DecisionRegisterView
      decisionRegisterSourceEntry={decisionRegisterSourceEntry}
      extractedRegister={extractedRegister}
    />
  );
}
