import type { Metadata } from 'next';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import {
  OFFICIAL_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
} from '@/content/manifest/sourceManifest';
import { getExtractedDecisionRegister } from '@/content/extractors/decisionRegisterExtractor';
import { getExtractedFacRegister } from '@/content/extractors/facRegisterExtractor';
import { getExtractedRoadmap } from '@/content/extractors/roadmapExtractor';
import { getExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import { getExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { DashboardView } from '@/features/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const registryStats = getContentRegistry().getStats();
  const manifestSummary = deriveSourceManifestSummary(OFFICIAL_SOURCE_MANIFEST);
  const decisionRegister = getExtractedDecisionRegister();
  const facRegister = getExtractedFacRegister();
  const roadmap = getExtractedRoadmap();
  const coreModules = getExtractedCoreModulesCatalog();
  const dependencyArch = getExtractedDependencyArchitecture();

  const importedOwningDecisionDocsCount =
    decisionRegister.architecturalDecisions.filter(
      (d) => d.authoritativeSourceImported
    ).length;

  return (
    <DashboardView
      registryStats={registryStats}
      manifestSummary={manifestSummary}
      extractedSummary={{
        indexedArchitecturalDecisionsCount:
          decisionRegister.architecturalDecisions.length,
        importedOwningDecisionDocsCount,
        phase2SourceLocalDecisionsCount: coreModules.totalPhase2DecisionsCount,
        coreCicsCount: dependencyArch.matrix.coreCics.length,
        facRecordsCount: facRegister.records.length,
        completedOfficialPhasesCount: roadmap.completedPhasesCount,
        totalOfficialPhasesCount: roadmap.totalOfficialPhasesCount,
      }}
    />
  );
}
