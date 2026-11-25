import type { Metadata } from 'next';
import { ArchitectureOverviewView } from '@/features/architecture/ArchitectureOverviewView';

export const metadata: Metadata = {
  title: 'Architecture Overview',
};

export default function ArchitecturePage() {
  return <ArchitectureOverviewView />;
}
