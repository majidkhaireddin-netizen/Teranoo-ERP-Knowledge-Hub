import type { Metadata } from 'next';
import { ResearchCenterView } from '@/features/research/ResearchCenterView';

export const metadata: Metadata = {
  title: 'Research Center',
};

export default function ResearchPage() {
  return <ResearchCenterView />;
}
