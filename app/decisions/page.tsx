import type { Metadata } from 'next';
import {
  OFFICIAL_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
  getSourceManifestEntryByRefId,
} from '@/content/manifest/sourceManifest';
import { getExtractedDecisionRegister } from '@/content/extractors/decisionRegisterExtractor';
import { getExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import { DecisionRegisterView } from '@/features/decisions/DecisionRegisterView';

export const metadata: Metadata = {
  title: 'Decision Register',
};

export default function DecisionsPage() {
  const decisionRegisterSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-05-decision-register'
  );
  const extractedRegister = getExtractedDecisionRegister();
  const coreModulesCatalog = getExtractedCoreModulesCatalog();
  const officialManifestSummary = deriveSourceManifestSummary(
    OFFICIAL_SOURCE_MANIFEST
  );

  return (
    <DecisionRegisterView
      decisionRegisterSourceEntry={decisionRegisterSourceEntry}
      extractedRegister={extractedRegister}
      phase2Decisions={coreModulesCatalog.allPhase2Decisions}
      phase2CountsByModule={coreModulesCatalog.phase2DecisionCountByModule}
      officialSourcesPublishedCount={officialManifestSummary.publishedCount}
      officialSourcesTotalCount={officialManifestSummary.totalSources}
    />
  );
}
