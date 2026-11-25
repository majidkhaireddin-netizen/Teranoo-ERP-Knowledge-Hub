import type { Metadata } from 'next';
import { RoadmapView } from '@/features/roadmap/RoadmapView';

export const metadata: Metadata = {
  title: 'Roadmap',
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
