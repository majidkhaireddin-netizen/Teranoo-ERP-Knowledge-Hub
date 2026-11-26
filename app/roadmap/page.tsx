import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { getExtractedRoadmap } from '@/content/extractors/roadmapExtractor';
import { RoadmapView } from '@/features/roadmap/RoadmapView';

export const metadata: Metadata = {
  title: 'Roadmap & Planning Methodology',
};

export default function RoadmapPage() {
  const workPlanSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-02-project-work-plan'
  );
  const workingRulesSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-03-working-rules'
  );
  const extractedRoadmap = getExtractedRoadmap();

  return (
    <RoadmapView
      workPlanSourceEntry={workPlanSourceEntry}
      workingRulesSourceEntry={workingRulesSourceEntry}
      extractedRoadmap={extractedRoadmap}
    />
  );
}
