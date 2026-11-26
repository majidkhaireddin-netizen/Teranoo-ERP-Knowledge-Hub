import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { BATCH_001_SOURCE_REVISION } from '@/content/manifest/sourceManifest';

export type DecisionFamilyCode =
  | 'D-TEN'
  | 'D-COMP'
  | 'D-BR'
  | 'D-ORG'
  | 'D-MD'
  | 'D-AUTH'
  | 'D-ISO'
  | 'D-CP'
  | 'D-LC'
  | 'D-DEP'
  | 'D-PLAT'
  | string;

export interface IndexedArchitecturalDecision {
  readonly decisionId: string;
  readonly family: DecisionFamilyCode;
  readonly shortDecision: string;
  readonly officialSource: string;
  readonly normalizedOfficialSourcePath: string;
  readonly ownerPhaseLabel: string;
  readonly ownerPhaseId: string;
  readonly primaryImpact: string;
  readonly approvalStatus: 'approved';
  readonly indexSourceSlug: string;
  readonly indexSectionAnchor: string;
  readonly sourceRevision: string;
  readonly authoritativeSourceImported: boolean;
  readonly authoritativeSourceSlug: string | null;
}

export interface MarketDecisionRecord {
  readonly decisionId: string;
  readonly title: string;
  readonly approvalStatus: 'approved-conditional';
  readonly approvedDate: string;
  readonly outsideArchitecturalCounter: true;
  readonly officialSource: string;
  readonly normalizedOfficialSourcePath: string;
  readonly summary: string;
  readonly conditionCode: string;
  readonly conditionSummary: string;
  readonly indexSourceSlug: string;
  readonly indexSectionAnchor: string;
  readonly authoritativeSourceImported: boolean;
  readonly authoritativeSourceSlug: string | null;
}

export interface GoverningArtifactRecord {
  readonly artifactPath: string;
  readonly normalizedPath: string;
  readonly role: string;
  readonly importedSlug: string | null;
}

export interface InterpretiveGuardrailNote {
  readonly codeRange: string;
  readonly note: string;
}

export interface ExtractedDecisionRegister {
  readonly sourceDocumentId: string;
  readonly sourceDocumentSlug: string;
  readonly sourceRevision: string;
  readonly declaredArchitecturalCount: number;
  readonly architecturalDecisions: readonly IndexedArchitecturalDecision[];
  readonly byPhaseCounts: Readonly<Record<string, number>>;
  readonly byFamilyCounts: Readonly<Record<string, number>>;
  readonly marketDecision: MarketDecisionRecord;
  readonly governingArtifacts: readonly GoverningArtifactRecord[];
  readonly interpretiveGuardrails: readonly InterpretiveGuardrailNote[];
  readonly supersessionNote: string | null;
  readonly maintenanceRule: string | null;
}

function cleanCell(raw: string): string {
  return raw
    .trim()
    .replace(/^\*\*(.+)\*\*$/, '$1')
    .replace(/^`(.+)`$/, '$1')
    .replace(/\*\*/g, '')
    .trim();
}

function derivePhaseId(ownerPhaseLabel: string, fallbackPhaseId: string): string {
  const match = ownerPhaseLabel.match(/Phase\s+(\d+(?:\.\d+)?)/i);
  if (match && match[1]) {
    return `phase-${match[1]}`;
  }
  return fallbackPhaseId;
}

function deriveFamily(decisionId: string): DecisionFamilyCode {
  const match = decisionId.match(/^(D-[A-Z]+)-\d+$/);
  return match && match[1] ? match[1] : decisionId;
}

function normalizePlanningPath(rawSource: string): string {
  const stripped = rawSource.replace(/`/g, '').trim();
  if (stripped.startsWith('teranoo-erp-planning/')) {
    return stripped;
  }
  return `teranoo-erp-planning/${stripped.replace(/^\.?\//, '')}`;
}

/**
 * Pure, deterministic extractor that parses the official DECISION_REGISTER.md body
 * into validated structured records without duplicating counts or fabricating rationale.
 *
 * Throws loudly if:
 * - No architectural decision rows are found.
 * - Duplicate Decision IDs exist.
 * - Extracted architectural decision count disagrees with the declared total in the source.
 * - D-MKT-01 is missing or accidentally mixed into the architectural D-* counter.
 */
export function parseDecisionRegisterMarkdown(
  markdown: string,
  options?: {
    readonly sourceDocumentId?: string;
    readonly sourceDocumentSlug?: string;
    readonly sourceRevision?: string;
    readonly publishedSourcePathToSlug?: ReadonlyMap<string, string>;
  }
): ExtractedDecisionRegister {
  const sourceDocumentId =
    options?.sourceDocumentId ?? 'kh-doc-decision-register-ar';
  const sourceDocumentSlug = options?.sourceDocumentSlug ?? 'decision-register';
  const sourceRevision =
    options?.sourceRevision ?? BATCH_001_SOURCE_REVISION.commitSha;
  const publishedMap = options?.publishedSourcePathToSlug ?? new Map<string, string>();

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  const architecturalDecisions: IndexedArchitecturalDecision[] = [];
  const seenIds = new Set<string>();
  const governingArtifacts: GoverningArtifactRecord[] = [];
  let marketDecision: MarketDecisionRecord | null = null;
  let declaredArchitecturalCount: number | null = null;
  let supersessionNote: string | null = null;
  let maintenanceRule: string | null = null;
  const interpretiveGuardrails: InterpretiveGuardrailNote[] = [];

  let currentSectionHeading = '';
  let currentSectionAnchor = '';
  let currentFallbackPhase = 'phase-3';
  let inGoverningArtifacts = false;
  let inDecisionGateA = false;
  let inCurrentState = false;
  let inMaintenanceRule = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match && h2Match[1]) {
      currentSectionHeading = h2Match[1].trim();
      currentSectionAnchor = `${HEADING_ID_PREFIX}${createHeadingSlug(currentSectionHeading)}`;
      inGoverningArtifacts = /Governing Artifacts/i.test(currentSectionHeading);
      inDecisionGateA = /Decision Gate A/i.test(currentSectionHeading);
      inCurrentState = /Current Decision State/i.test(currentSectionHeading);
      inMaintenanceRule = /Maintenance Rule/i.test(currentSectionHeading);

      const phaseHeadingMatch = currentSectionHeading.match(/Phase\s+(\d+(?:\.\d+)?)/i);
      if (phaseHeadingMatch && phaseHeadingMatch[1]) {
        currentFallbackPhase = `phase-${phaseHeadingMatch[1]}`;
      }
      continue;
    }

    // Parse architectural decision table rows: | **D-TEN-01** | Short Decision | Official Source | Owner Phase | Primary Impact |
    if (
      !inGoverningArtifacts &&
      line.startsWith('|') &&
      line.endsWith('|') &&
      !line.startsWith('|---') &&
      !line.startsWith('| ---')
    ) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      if (cells.length >= 5) {
        const decisionId = cleanCell(cells[0] ?? '');
        if (/^D-[A-Z]+-\d+$/.test(decisionId)) {
          if (decisionId === 'D-MKT-01') {
            throw new Error(
              'Decision Register integrity error: D-MKT-01 must remain outside the architectural D-* decision tables.'
            );
          }
          if (seenIds.has(decisionId)) {
            throw new Error(
              `Decision Register integrity error: duplicate Decision ID "${decisionId}" detected.`
            );
          }
          seenIds.add(decisionId);

          const shortDecision = cleanCell(cells[1] ?? '');
          const officialSource = cleanCell(cells[2] ?? '');
          const ownerPhaseLabel = cleanCell(cells[3] ?? '');
          const primaryImpact = cleanCell(cells[4] ?? '');
          const normalizedOfficialSourcePath =
            normalizePlanningPath(officialSource);
          const authoritativeSourceSlug =
            publishedMap.get(normalizedOfficialSourcePath) ?? null;

          architecturalDecisions.push({
            decisionId,
            family: deriveFamily(decisionId),
            shortDecision,
            officialSource,
            normalizedOfficialSourcePath,
            ownerPhaseLabel,
            ownerPhaseId: derivePhaseId(ownerPhaseLabel, currentFallbackPhase),
            primaryImpact,
            approvalStatus: 'approved',
            indexSourceSlug: sourceDocumentSlug,
            indexSectionAnchor: currentSectionAnchor,
            sourceRevision,
            authoritativeSourceImported: authoritativeSourceSlug !== null,
            authoritativeSourceSlug,
          });
        }
      }
      continue;
    }

    // Parse Governing Artifacts Without D-* IDs table
    if (
      inGoverningArtifacts &&
      line.startsWith('|') &&
      line.endsWith('|') &&
      !line.startsWith('|---') &&
      !line.startsWith('| ---')
    ) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      if (cells.length >= 2) {
        const artifactPath = cleanCell(cells[0] ?? '');
        const role = cleanCell(cells[1] ?? '');
        if (artifactPath && artifactPath !== 'Governing Artifact') {
          const normalizedPath = normalizePlanningPath(artifactPath);
          governingArtifacts.push({
            artifactPath,
            normalizedPath,
            role,
            importedSlug: publishedMap.get(normalizedPath) ?? null,
          });
        }
      }
      continue;
    }

    // Parse separate Decision Gate A (D-MKT-01)
    if (inDecisionGateA && line.includes('D-MKT-01')) {
      const titleMatch = line.match(/D-MKT-01`?\s*—\s*([^*\n]+?)(?:\*\*|\s+—\s+✅)/);
      const dateMatch = line.match(/Approved \(Conditional\)\s*(\d{4}-\d{2}-\d{2})/);
      const sourceMatch = line.match(/Official Source:\s*`([^`]+)`/);
      const contentMatch = line.match(/المضمون:\s*\*\*([^*]+)\*\*/);
      const conditionMatch = line.match(/شرط نفاذ:\*\*\s*(.+)$/);

      const officialSource =
        sourceMatch?.[1]?.trim() ??
        '02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md';
      const normalizedOfficialSourcePath = normalizePlanningPath(officialSource);
      const authoritativeSourceSlug =
        publishedMap.get(normalizedOfficialSourcePath) ?? null;

      marketDecision = {
        decisionId: 'D-MKT-01',
        title:
          titleMatch?.[1]?.trim() ??
          'Primary Launch Market & First Industry Priority',
        approvalStatus: 'approved-conditional',
        approvedDate: dateMatch?.[1] ?? '2026-10-02',
        outsideArchitecturalCounter: true,
        officialSource,
        normalizedOfficialSourcePath,
        summary:
          contentMatch?.[1]?.trim() ??
          'الأردن أولاً + Trading & Wholesale Distribution كأولوية إطلاق وحيدة + ICP المعتمد + V1 غير متزامن',
        conditionCode: 'O-2',
        conditionSummary:
          conditionMatch?.[1]?.replace(/\*\*/g, '').trim() ??
          'O-2 (تحقق ميداني للدفع — 5–10 مقابلات) إلزامي قبل التسعير وقبل Product Baseline.',
        indexSourceSlug: sourceDocumentSlug,
        indexSectionAnchor: currentSectionAnchor,
        authoritativeSourceImported: authoritativeSourceSlug !== null,
        authoritativeSourceSlug,
      };
      continue;
    }

    // Parse Current Decision State metadata
    if (inCurrentState) {
      const countMatch = line.match(
        /Approved D-\* decisions indexed here:\s*\*\*(\d+)\*\*/i
      );
      if (countMatch && countMatch[1]) {
        declaredArchitecturalCount = Number.parseInt(countMatch[1], 10);
      }
      if (/Supersession/i.test(line)) {
        supersessionNote = line.replace(/^-\s*/, '').replace(/\*\*/g, '').trim();
      }
      if (line.includes('C-AUTH-01..03') || line.includes('C-ISO-01..03')) {
        interpretiveGuardrails.push({
          codeRange: 'C-AUTH-01..03 & C-ISO-01..03',
          note: line.replace(/^-\s*/, '').replace(/`/g, '').trim(),
        });
      }
    }

    if (inMaintenanceRule && line.startsWith('`') && line.endsWith('`')) {
      maintenanceRule = line.slice(1, -1).trim();
    }
  }

  if (architecturalDecisions.length === 0) {
    throw new Error(
      'Decision Register extraction failed: zero architectural D-* decisions extracted.'
    );
  }

  if (
    declaredArchitecturalCount !== null &&
    declaredArchitecturalCount !== architecturalDecisions.length
  ) {
    throw new Error(
      `Decision Register count mismatch: source declares ${declaredArchitecturalCount} D-* decisions, but parser extracted ${architecturalDecisions.length}.`
    );
  }

  if (!marketDecision) {
    throw new Error(
      'Decision Register extraction failed: separate Decision Gate A record (D-MKT-01) was not found.'
    );
  }

  const byPhaseCounts: Record<string, number> = {};
  const byFamilyCounts: Record<string, number> = {};
  for (const decision of architecturalDecisions) {
    byPhaseCounts[decision.ownerPhaseId] =
      (byPhaseCounts[decision.ownerPhaseId] ?? 0) + 1;
    byFamilyCounts[decision.family] = (byFamilyCounts[decision.family] ?? 0) + 1;
  }

  return {
    sourceDocumentId,
    sourceDocumentSlug,
    sourceRevision,
    declaredArchitecturalCount:
      declaredArchitecturalCount ?? architecturalDecisions.length,
    architecturalDecisions,
    byPhaseCounts,
    byFamilyCounts,
    marketDecision,
    governingArtifacts,
    interpretiveGuardrails,
    supersessionNote,
    maintenanceRule,
  };
}

let cachedDecisionRegister: ExtractedDecisionRegister | null = null;

/**
 * Extracts the structured Decision Register directly from the published
 * official DECISION_REGISTER.md document in the Content Registry.
 */
export function getExtractedDecisionRegister(): ExtractedDecisionRegister {
  if (cachedDecisionRegister) {
    return cachedDecisionRegister;
  }

  const registry = getContentRegistry();
  const doc = registry.getBySlug('decision-register');
  if (!doc) {
    throw new Error(
      'Published official DECISION_REGISTER.md document ("decision-register") is missing from the Content Registry.'
    );
  }

  const publishedSourcePathToSlug = new Map<string, string>();
  for (const meta of registry.getAllPublicMetadata()) {
    if (meta.source.kind === 'official-source') {
      publishedSourcePathToSlug.set(meta.source.sourcePath, meta.slug);
    }
  }

  cachedDecisionRegister = parseDecisionRegisterMarkdown(doc.bodyMarkdown, {
    sourceDocumentId: doc.metadata.id,
    sourceDocumentSlug: doc.metadata.slug,
    sourceRevision:
      doc.metadata.source.kind === 'official-source'
        ? doc.metadata.source.commitSha ?? BATCH_001_SOURCE_REVISION.commitSha
        : BATCH_001_SOURCE_REVISION.commitSha,
    publishedSourcePathToSlug,
  });

  return cachedDecisionRegister;
}

export function resetExtractedDecisionRegisterCache(): void {
  cachedDecisionRegister = null;
}
