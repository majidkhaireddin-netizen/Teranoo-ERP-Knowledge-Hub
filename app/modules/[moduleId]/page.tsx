import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCoreModuleProfileById,
  getExtractedCoreModulesCatalog,
} from '@/content/extractors/moduleModelsExtractor';
import { getExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { CoreModuleDetailView } from '@/features/modules/CoreModuleDetailView';

interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>;
}

export async function generateStaticParams() {
  const catalog = getExtractedCoreModulesCatalog();
  return catalog.modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({
  params,
}: ModuleDetailPageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const profile = getCoreModuleProfileById(moduleId);
  if (!profile) {
    return { title: 'Module Not Found' };
  }
  return {
    title: `${profile.name.en} — Core Module Architecture`,
    description: profile.identitySummary.en,
  };
}

export default async function CoreModuleDetailPage({
  params,
}: ModuleDetailPageProps) {
  const { moduleId } = await params;
  const profile = getCoreModuleProfileById(moduleId);
  if (!profile) {
    notFound();
  }

  const catalog = getExtractedCoreModulesCatalog();
  const depArch = getExtractedDependencyArchitecture();
  const linkedCics = depArch.matrix.coreCics.filter((cic) =>
    profile.relatedCicIds.includes(cic.contractId)
  );
  const siblingModules = catalog.modules.map((m) => ({
    id: m.id,
    code: m.code,
    shortName: m.shortName,
  }));

  return (
    <CoreModuleDetailView
      moduleProfile={profile}
      linkedCics={linkedCics}
      siblingModules={siblingModules}
    />
  );
}
