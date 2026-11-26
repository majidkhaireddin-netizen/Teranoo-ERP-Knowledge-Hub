import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { RoadmapView } from '@/features/roadmap/RoadmapView';

export const metadata: Metadata = {
  title: 'Roadmap',
};

export default function RoadmapPage() {
  const workPlanSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-02-project-work-plan'
  );

  return <RoadmapView workPlanSourceEntry={workPlanSourceEntry} />;
}
