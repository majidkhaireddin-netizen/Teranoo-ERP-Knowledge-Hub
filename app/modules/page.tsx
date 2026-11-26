import type { Metadata } from 'next';
import { getExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import { getExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { BusinessModulesView } from '@/features/modules/BusinessModulesView';

export const metadata: Metadata = {
  title: 'Core Business Modules',
};

export default function ModulesPage() {
  const catalog = getExtractedCoreModulesCatalog();
  const depArch = getExtractedDependencyArchitecture();

  return (
    <BusinessModulesView
      catalog={catalog}
      hbmdEdgeCount={depArch.matrix.hbmdEdgeCount}
      coreCicCount={depArch.matrix.coreCics.length}
      coreFldCount={depArch.matrix.coreFlds.length}
    />
  );
}
