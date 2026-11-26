import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { BATCH_001_SOURCE_REVISION } from '@/content/manifest/sourceManifest';

export type FacSourceStatus = 'RESEARCH REQUIRED' | 'REVIEW LATER' | 'WATCH';

export interface FacDetailSection {
  readonly heading: string;
  readonly body: string;
  readonly bullets: readonly string[];
}

export interface ExtractedFacRecord {
  readonly facId: string;
  readonly title: string;
  readonly status: FacSourceStatus;
  readonly owner: string;
  readonly ownerPhaseIds: readonly string[];
  readonly researchRequired: boolean;
  readonly summary: string;
  readonly detailSections: readonly FacDetailSection[];
  readonly referencedDetailedDoc: string | null;
  readonly detailedDocImported: boolean;
  readonly isApprovedDecision: false;
  readonly sourceDocumentSlug: string;
  readonly sourceSectionAnchor: string;
  readonly sourceRevision: string;
}

export interface PromotedGuardrailIdea {
  readonly title: string;
  readonly promotedToSourcePath: string;
  readonly targetSlug: string;
}

export interface ExtractedFacRegister {
  readonly sourceDocumentId: string;
  readonly sourceDocumentSlug: string;
  readonly sourceRevision: string;
  readonly records: readonly ExtractedFacRecord[];
  readonly byStatusCounts: Readonly<Record<FacSourceStatus, number>>;
  readonly promotedIdeas: readonly PromotedGuardrailIdea[];
  readonly reviewRulePoints: readonly string[];
}

const ALLOWED_FAC_STATUSES = new Set<FacSourceStatus>([
  'RESEARCH REQUIRED',
  'REVIEW LATER',
  'WATCH',
]);

function extractOwnerPhases(ownerText: string): readonly string[] {
  const matches = ownerText.matchAll(/Phase\s+(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?/gi);
  const phases = new Set<string>();
  for (const m of matches) {
    if (m[1]) phases.add(`phase-${m[1]}`);
    if (m[2]) phases.add(`phase-${m[2]}`);
  }
  return Array.from(phases).sort();
}

function splitBulletsAndProse(lines: readonly string[]): {
  body: string;
  bullets: string[];
} {
  const prose: string[] = [];
  const bullets: string[] = [];

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bullets.push(trimmed.slice(2).trim());
    } else if (/^\d+\.\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^\d+\.\s+/, '').trim());
    } else {
      prose.push(trimmed);
    }
  }

  return { body: prose.join(' '), bullets };
}

/**
 * Pure, deterministic extractor for FUTURE_ARCHITECTURE_CONSIDERATIONS.md.
 * Preserves exact FAC identifiers, source-defined statuses (RESEARCH REQUIRED,
 * REVIEW LATER, WATCH), non-approved semantics, referenced detailed FAC files
 * awaiting future ingestion, and promoted guardrails.
 */
export function parseFacRegisterMarkdown(
  markdown: string,
  options?: {
    readonly sourceDocumentId?: string;
    readonly sourceDocumentSlug?: string;
    readonly sourceRevision?: string;
  }
): ExtractedFacRegister {
  const sourceDocumentId =
    options?.sourceDocumentId ?? 'kh-doc-future-architecture-considerations-ar';
  const sourceDocumentSlug =
    options?.sourceDocumentSlug ?? 'future-architecture-considerations';
  const sourceRevision =
    options?.sourceRevision ?? BATCH_001_SOURCE_REVISION.commitSha;

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const records: ExtractedFacRecord[] = [];
  const seenFacIds = new Set<string>();
  const promotedIdeas: PromotedGuardrailIdea[] = [];
  const reviewRulePoints: string[] = [];

  let i = 0;
  let inPromotedSection = false;
  let inReviewRuleSection = false;

  while (i < lines.length) {
    const line = (lines[i] ?? '').trim();

    if (/^#\s+Ideas Already Promoted/i.test(line)) {
      inPromotedSection = true;
      inReviewRuleSection = false;
      i += 1;
      continue;
    }

    if (/^#\s+Review Rule/i.test(line)) {
      inPromotedSection = false;
      inReviewRuleSection = true;
      i += 1;
      continue;
    }

    if (inPromotedSection) {
      const promoMatch = line.match(/^-\s+`PROMOTED`\s+—\s+(.+?)\.?$/);
      if (promoMatch && promoMatch[1]) {
        promotedIdeas.push({
          title: promoMatch[1].trim(),
          promotedToSourcePath:
            'teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md',
          targetSlug: 'cross-phase-product-guardrails',
        });
      }
      i += 1;
      continue;
    }

    if (inReviewRuleSection) {
      const ruleMatch = line.match(/^\d+\.\s+(.+)$/);
      if (ruleMatch && ruleMatch[1]) {
        reviewRulePoints.push(ruleMatch[1].trim());
      }
      i += 1;
      continue;
    }

    const facHeadingMatch = line.match(/^##\s+(FAC-\d{3})\s+—\s+(.+)$/);
    if (facHeadingMatch && facHeadingMatch[1] && facHeadingMatch[2]) {
      const facId = facHeadingMatch[1].trim();
      const title = facHeadingMatch[2].trim();
      const fullHeading = `${facId} — ${title}`;
      const sourceSectionAnchor = `${HEADING_ID_PREFIX}${createHeadingSlug(fullHeading)}`;

      if (seenFacIds.has(facId)) {
        throw new Error(
          `FAC Register integrity error: duplicate identifier "${facId}".`
        );
      }
      seenFacIds.add(facId);

      // Collect lines until next ## or # heading or --- separator before next section
      const sectionLines: string[] = [];
      i += 1;
      while (i < lines.length) {
        const peek = (lines[i] ?? '').trim();
        if (/^#{1,2}\s+/.test(peek)) {
          break;
        }
        sectionLines.push(lines[i] ?? '');
        i += 1;
      }

      let rawStatus = '';
      let owner = '';
      let referencedDetailedDoc: string | null = null;
      const introLines: string[] = [];
      const detailSections: FacDetailSection[] = [];
      let currentSubHeading: string | null = null;
      let currentSubLines: string[] = [];

      const flushSub = () => {
        if (currentSubHeading) {
          const { body, bullets } = splitBulletsAndProse(currentSubLines);
          if (body || bullets.length > 0) {
            detailSections.push({
              heading: currentSubHeading,
              body,
              bullets,
            });
          }
        }
        currentSubHeading = null;
        currentSubLines = [];
      };

      for (const sRaw of sectionLines) {
        const sLine = sRaw.trim();
        if (!sLine || sLine === '---') continue;

        const statusMatch = sLine.match(/^\*\*Status:\*\*\s*(.+)$/);
        if (statusMatch && statusMatch[1]) {
          rawStatus = statusMatch[1].trim();
          continue;
        }

        const ownerMatch = sLine.match(/^\*\*Owner:\*\*\s*(.+)$/);
        if (ownerMatch && ownerMatch[1]) {
          owner = ownerMatch[1].trim();
          continue;
        }

        const detailedDocMatch = sLine.match(/`(FAC-\d{3}_[A-Z0-9_]+\.md)`/);
        if (detailedDocMatch && detailedDocMatch[1]) {
          referencedDetailedDoc = detailedDocMatch[1];
          continue;
        }

        const subMatch = sLine.match(/^###\s+(.+)$/);
        if (subMatch && subMatch[1]) {
          flushSub();
          currentSubHeading = subMatch[1].trim();
          continue;
        }

        if (currentSubHeading) {
          currentSubLines.push(sRaw);
        } else if (!/^التفاصيل محفوظة في:?$/.test(sLine)) {
          introLines.push(sLine);
        }
      }
      flushSub();

      if (!ALLOWED_FAC_STATUSES.has(rawStatus as FacSourceStatus)) {
        throw new Error(
          `FAC Register integrity error for "${facId}": unrecognized source status "${rawStatus}".`
        );
      }

      const status = rawStatus as FacSourceStatus;
      const ideaSection = detailSections.find((s) => s.heading === 'الفكرة');
      const summary =
        ideaSection?.body ||
        introLines.join(' ') ||
        detailSections[0]?.body ||
        detailSections[0]?.bullets[0] ||
        title;

      // If intro prose existed (e.g. FAC-019..FAC-024 summary paragraphs), include it in detailSections if empty
      const finalDetailSections: FacDetailSection[] =
        detailSections.length > 0
          ? detailSections
          : introLines.length > 0
            ? [{ heading: 'ملخص البحث المؤجل', body: introLines.join(' '), bullets: [] }]
            : [];

      records.push({
        facId,
        title,
        status,
        owner,
        ownerPhaseIds: extractOwnerPhases(owner),
        researchRequired: status === 'RESEARCH REQUIRED',
        summary: summary.replace(/\*\*/g, '').trim(),
        detailSections: finalDetailSections,
        referencedDetailedDoc,
        detailedDocImported: false,
        isApprovedDecision: false,
        sourceDocumentSlug,
        sourceSectionAnchor,
        sourceRevision,
      });

      continue;
    }

    i += 1;
  }

  if (records.length === 0) {
    throw new Error(
      'FAC Register extraction failed: zero FAC records extracted.'
    );
  }

  const byStatusCounts: Record<FacSourceStatus, number> = {
    'RESEARCH REQUIRED': 0,
    'REVIEW LATER': 0,
    WATCH: 0,
  };
  for (const rec of records) {
    byStatusCounts[rec.status] += 1;
  }

  return {
    sourceDocumentId,
    sourceDocumentSlug,
    sourceRevision,
    records,
    byStatusCounts,
    promotedIdeas,
    reviewRulePoints,
  };
}

let cachedFacRegister: ExtractedFacRegister | null = null;

export function getExtractedFacRegister(): ExtractedFacRegister {
  if (cachedFacRegister) {
    return cachedFacRegister;
  }

  const registry = getContentRegistry();
  const doc = registry.getBySlug('future-architecture-considerations');
  if (!doc) {
    throw new Error(
      'Published official FUTURE_ARCHITECTURE_CONSIDERATIONS.md document ("future-architecture-considerations") is missing from the Content Registry.'
    );
  }

  cachedFacRegister = parseFacRegisterMarkdown(doc.bodyMarkdown, {
    sourceDocumentId: doc.metadata.id,
    sourceDocumentSlug: doc.metadata.slug,
    sourceRevision:
      doc.metadata.source.kind === 'official-source'
        ? doc.metadata.source.commitSha ?? BATCH_001_SOURCE_REVISION.commitSha
        : BATCH_001_SOURCE_REVISION.commitSha,
  });

  return cachedFacRegister;
}

export function resetExtractedFacRegisterCache(): void {
  cachedFacRegister = null;
}
