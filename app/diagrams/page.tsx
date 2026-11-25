import type { Metadata } from 'next';
import { InteractiveDiagramsView } from '@/features/architecture/InteractiveDiagramsView';

export const metadata: Metadata = {
  title: 'Interactive Diagrams',
};

export default function DiagramsPage() {
  return <InteractiveDiagramsView />;
}
