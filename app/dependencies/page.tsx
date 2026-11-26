import type { Metadata } from 'next';
import { getExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { DependenciesArchitectureView } from '@/features/dependencies/DependenciesArchitectureView';

export const metadata: Metadata = {
  title: 'Dependencies & Integration Architecture',
};

export default function DependenciesPage() {
  const architecture = getExtractedDependencyArchitecture();
  return <DependenciesArchitectureView architecture={architecture} />;
}
