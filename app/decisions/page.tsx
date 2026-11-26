import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { DecisionRegisterView } from '@/features/decisions/DecisionRegisterView';

export const metadata: Metadata = {
  title: 'Decision Register',
};

export default function DecisionsPage() {
  const decisionRegisterSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-05-decision-register'
  );

  return (
    <DecisionRegisterView
      decisionRegisterSourceEntry={decisionRegisterSourceEntry}
    />
  );
}
