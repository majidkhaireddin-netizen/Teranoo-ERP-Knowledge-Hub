import type { Metadata } from 'next';
import { DependenciesView } from '@/features/architecture/PlannedArchitectureViews';

export const metadata: Metadata = {
  title: 'Dependencies & Integration',
};

export default function DependenciesPage() {
  return <DependenciesView />;
}
