import type { Metadata } from 'next';
import { getSourceManifestEntryByRefId } from '@/content/manifest/sourceManifest';
import { getExtractedGuardrails } from '@/content/extractors/guardrailsExtractor';
import { ArchitectureOverviewView } from '@/features/architecture/ArchitectureOverviewView';

export const metadata: Metadata = {
  title: 'Architecture & Cross-Phase Guardrails',
};

export default function ArchitecturePage() {
  const guardrailsSourceEntry = getSourceManifestEntryByRefId(
    'src-pf-04-cross-phase-guardrails'
  );
  const extractedGuardrails = getExtractedGuardrails();

  return (
    <ArchitectureOverviewView
      guardrailsSourceEntry={guardrailsSourceEntry}
      extractedGuardrails={extractedGuardrails}
    />
  );
}
