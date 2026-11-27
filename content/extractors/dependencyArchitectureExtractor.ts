import type { IdentifierScope, LocalizedText } from '@/content/models/types';
import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { computeCanonicalStoredBodySha256 } from '@/content/ingestion/ingestionPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';

export type DependencyTypeCode = 'PCD' | 'HBMD' | 'CIC' | 'FLD';

export interface DependencyTypeDefinition {
  readonly code: DependencyTypeCode;
  readonly name: string;
  readonly purpose: string;
  readonly blocksModuleActivation: string;
  readonly sectionAnchor: string;
}

export interface EnforcementScopeRule {
  readonly kind: string;
  readonly primaryScope: string;
  readonly blockedWhenUnavailable: string;
}

export interface SummaryMatrixRow {
  readonly sourceModuleId: CoreModuleId;
  readonly sourceLabel: string;
  readonly cells: Readonly<Record<CoreModuleId, string>>;
}

export interface HbmdAbsenceRecord {
  readonly source: string;
  readonly target: string;
  readonly type: 'HBMD';
  readonly enforcementScope: string;
  readonly evidence: string;
  readonly status: string;
}

export interface CoreCicContract {
  readonly contractId: string;
  /** Official Phase 2 ERP identifier defined verbatim in MODULE_DEPENDENCY_MATRIX.md (KH-032). */
  readonly identifierScope: Extract<IdentifierScope, 'official-erp'>;
  readonly sourceInitiator: string;
  readonly target: string;
  readonly sourceModuleId: CoreModuleId;
  readonly targetModuleId: CoreModuleId;
  readonly businessScenario: string;
  readonly enforcementScope: string;
  readonly sourceOwnerSummary: string;
  readonly targetOwnerSummary: string;
  readonly evidence: string;
  readonly summaryStatus: string;
  readonly sectionAnchor: string;
  // 16 minimum CIC metadata fields from MODULE_DEPENDENCY_MATRIX.md §5.1–5.6
  readonly metadata: {
    readonly participatingModules: string;
    readonly businessScenario: string;
    readonly triggerInitiator: string;
    readonly sourceOwner: string;
    readonly targetOwner: string;
    readonly businessObjectRefs: string;
    readonly requiredPreconditions: string;
    readonly expectedOutcome: string;
    readonly failureBehavior: string;
    readonly idempotencyPrinciple: string;
    readonly auditRequirement: string;
    readonly activationCondition: string;
    readonly version: string;
    readonly contractOwner: string;
    readonly status: string;
  };
  readonly hasDeferredBoundary: boolean;
}

export interface CoreFldRecord {
  /** Knowledge Hub internal row reference ID (e.g. FLD-CORE-01); NOT an official ERP identifier (KH-032). */
  readonly id: string;
  readonly identifierScope: Extract<IdentifierScope, 'knowledge-hub-internal'>;
  readonly sourceModuleFeature: string;
  readonly sourceModuleId: CoreModuleId;
  readonly targetModuleCapability: string;
  readonly requiredTargetModules: readonly CoreModuleId[];
  readonly featureScenario: string;
  readonly enforcementScope: string;
  readonly featureOwner: string;
  readonly isOwnerDeferred: boolean;
  readonly evidence: string;
  readonly status: string;
}

export type PcdCellValue = 'R' | 'C' | 'C*' | '—' | string;

export interface PcdMatrixRow {
  readonly capability: string;
  readonly finance: PcdCellValue;
  readonly inventory: PcdCellValue;
  readonly procurement: PcdCellValue;
  readonly sales: PcdCellValue;
}

export interface DataOwnershipRecord {
  /** Knowledge Hub internal row reference ID (e.g. OWN-CORE-01); NOT an official ERP identifier (KH-032). */
  readonly id: string;
  readonly identifierScope: Extract<IdentifierScope, 'knowledge-hub-internal'>;
  readonly businessObject: string;
  readonly ownerAtPhase2: string;
  readonly isDeferredBoundary: boolean;
  readonly consumers: string;
  readonly dependencyNote: string;
  readonly mutationAuthority: LocalizedText;
}

export interface ConsistencyCheckRecord {
  readonly check: string;
  readonly result: string;
  readonly notes: string;
}

export interface LifecycleStateDefinition {
  readonly state: 'Inactive' | 'Active' | 'Frozen';
  readonly meaning: string;
}

export interface ModuleLifecycleConsistencyRow {
  readonly module: string;
  readonly standaloneActivation: string;
  readonly freezeNotDelete: string;
  readonly historyPreserved: string;
  readonly cicDoesNotBlockBase: string;
  readonly fldDoesNotBlockBase: string;
  readonly result: string;
}

export interface AssumptionSafetyGuardrail {
  readonly code: string;
  readonly title: string;
  readonly summary: string;
  readonly sectionAnchor: string;
}

export interface AssumptionSafetyModuleVerdict {
  readonly moduleLabel: string;
  readonly verdict: string;
  readonly syncNote: string | null;
}

export interface Phase2ExitCriterion {
  readonly criterion: string;
  readonly result: string;
}

export interface DeferredCommitmentGroup {
  readonly groupTitle: string;
  readonly items: readonly string[];
}

export interface ExtractedDependencyArchitecture {
  readonly dependencyModel: {
    readonly documentSlug: string;
    readonly officialSourcePath: string;
    readonly supremeRuleAr: string;
    readonly supremeRuleEn: string;
    readonly officialTypes: readonly DependencyTypeDefinition[];
    readonly disallowedLabels: readonly string[];
    readonly enforcementScopes: readonly EnforcementScopeRule[];
    readonly governanceRules: readonly string[];
  };
  readonly matrix: {
    readonly documentSlug: string;
    readonly officialSourcePath: string;
    readonly sourceRevision: string | null;
    readonly sourceBodySha256: string;
    readonly summaryRows: readonly SummaryMatrixRow[];
    readonly hbmdAbsenceRegister: readonly HbmdAbsenceRecord[];
    readonly hbmdEdgeCount: 0;
    readonly hbmdCycleCount: 0;
    readonly hbmdCycleStatus: string;
    readonly coreCics: readonly CoreCicContract[];
    readonly coreFlds: readonly CoreFldRecord[];
    readonly pcdMatrix: readonly PcdMatrixRow[];
    readonly pcdNotes: readonly string[];
    readonly dataOwnershipRecords: readonly DataOwnershipRecord[];
    readonly deferredOwnershipCount: number;
    readonly consistencyChecks: readonly ConsistencyCheckRecord[];
    readonly consistencyResult: string;
  };
  readonly lifecycle: {
    readonly documentSlug: string;
    readonly officialSourcePath: string;
    readonly topRules: readonly string[];
    readonly functionalStates: readonly LifecycleStateDefinition[];
    readonly activationPreconditions: readonly string[];
    readonly deactivationPreconditions: readonly string[];
    readonly freezeNotDeletePoints: readonly string[];
    readonly sharedDataSafetyExamples: readonly string[];
    readonly reactivationRules: readonly string[];
    readonly consistencyRows: readonly ModuleLifecycleConsistencyRow[];
    readonly finalRules: readonly string[];
  };
  readonly futureExtensions: {
    readonly documentSlug: string;
    readonly officialSourcePath: string;
    readonly supremeRule: string;
    readonly newModuleRequirements: readonly string[];
    readonly coreOwnershipGuardrails: readonly string[];
    readonly noBackDependencyExamples: readonly string[];
    readonly compatibilityReviewChecklist: readonly string[];
    readonly illustrativeDirectionalExamples: readonly string[];
  };
  readonly phase2Reviews: {
    readonly reviewKind: 'official-project-review-gate';
    readonly assumptionSafety: {
      readonly documentSlug: string;
      readonly officialSourcePath: string;
      readonly reviewDate: string;
      readonly result: string;
      readonly reopensRequired: 0;
      readonly materialConflicts: 0;
      readonly docSyncCount: 1;
      readonly docSyncDetail: string;
      readonly moduleVerdicts: readonly AssumptionSafetyModuleVerdict[];
      readonly guardrails: readonly AssumptionSafetyGuardrail[];
      readonly phase3Handoffs: readonly string[];
    };
    readonly closureReview: {
      readonly documentSlug: string;
      readonly officialSourcePath: string;
      readonly closureDate: string;
      readonly exitGateResult: string;
      readonly exitCriteria: readonly Phase2ExitCriterion[];
      readonly deferredCommitmentGroups: readonly DeferredCommitmentGroup[];
    };
  };
}

function cleanCell(raw: string): string {
  return raw
    .trim()
    .replace(/^\*\*(.+)\*\*$/, '$1')
    .replace(/^`(.+)`$/, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

function parseMarkdownTableUnderHeading(
  markdown: string,
  headingRegex: RegExp
): readonly (readonly string[])[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let active = false;
  let startedTable = false;
  const rows: string[][] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^#{1,3}\s+/.test(line)) {
      if (headingRegex.test(line)) {
        active = true;
        continue;
      }
      if (active) {
        break;
      }
    }
    if (!active) continue;

    if (line.startsWith('|') && line.endsWith('|')) {
      startedTable = true;
      if (/^\|[\s:-]+\|/.test(line)) {
        continue;
      }
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => cleanCell(c));
      rows.push(cells);
    } else if (startedTable && line === '') {
      break;
    }
  }

  return rows;
}

function parseListUnderHeading(
  markdown: string,
  headingRegex: RegExp,
  pattern: 'numbered' | 'bullet' | 'both' = 'both'
): readonly string[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let active = false;
  const items: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^#{1,3}\s+/.test(line)) {
      if (headingRegex.test(line)) {
        active = true;
        continue;
      }
      if (active) {
        break;
      }
    }
    if (!active) continue;

    if (pattern === 'numbered' || pattern === 'both') {
      const m = line.match(/^\d+\.\s+(.+)$/);
      if (m && m[1]) {
        items.push(m[1].replace(/\*\*/g, '').replace(/`/g, '').trim());
        continue;
      }
    }
    if (pattern === 'bullet' || pattern === 'both') {
      const m = line.match(/^[-*]\s+(.+)$/);
      if (m && m[1]) {
        items.push(m[1].replace(/\*\*/g, '').replace(/`/g, '').trim());
      }
    }
  }

  return items;
}

function moduleNameToId(label: string): CoreModuleId {
  const lower = label.toLowerCase();
  if (lower.includes('finance')) return 'finance';
  if (lower.includes('inventory')) return 'inventory-warehouse';
  if (lower.includes('procurement')) return 'procurement';
  return 'sales-order-management';
}

function deriveMutationAuthority(
  ownerAtPhase2: string,
  isDeferredBoundary: boolean
): LocalizedText {
  if (isDeferredBoundary) {
    return {
      ar: 'مؤجل للمرحلة 5/6 — لا يجوز افتراض سلطة التعديل قبل الإغلاق الرسمي',
      en: 'Deferred to Phase 5/6 — mutation authority intentionally not locked at Phase 2',
    };
  }
  if (/Shared Platform/i.test(ownerAtPhase2)) {
    return {
      ar: 'إدارة مركزية عبر قدرات المنصة المشتركة؛ الأنظمة التجارية تستهلك وتضيف سياقها فقط',
      en: 'Governed by Shared Platform capability; business modules consume and maintain domain context only',
    };
  }
  return {
    ar: `حصري لـ ${ownerAtPhase2} فقط (لا كتابة مباشرة من الوحدات الأخرى)`,
    en: `Exclusive to ${ownerAtPhase2} (no direct cross-module mutation permitted)`,
  };
}

function parseCicMetadataMap(
  markdown: string,
  contractId: string
): { readonly fields: ReadonlyMap<string, string>; readonly anchor: string } {
  const escaped = contractId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headingLineMatch = markdown.match(
    new RegExp(`^##\\s+(5\\.\\d+\\s+${escaped}[^\\n]*)$`, 'm')
  );
  const rawHeading = headingLineMatch?.[1]?.trim() ?? contractId;
  const anchor = `${HEADING_ID_PREFIX}${createHeadingSlug(rawHeading)}`;

  const rows = parseMarkdownTableUnderHeading(
    markdown,
    new RegExp(`^##\\s+5\\.\\d+\\s+${escaped}\\b`)
  );
  const fields = new Map<string, string>();
  for (const row of rows.slice(1)) {
    if (row[0] && row[1]) {
      fields.set(row[0].trim(), row[1].trim());
    }
  }
  return { fields, anchor };
}

function parseAssumptionGuardrails(
  markdown: string
): readonly AssumptionSafetyGuardrail[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const guardrails: AssumptionSafetyGuardrail[] = [];
  let current: {
    code: string;
    title: string;
    rawHeading: string;
    bodyLines: string[];
  } | null = null;

  const flush = () => {
    if (!current) return;
    const summary = current.bodyLines
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l !== '---')
      .join(' ')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .trim();
    guardrails.push({
      code: current.code,
      title: current.title,
      summary,
      sectionAnchor: `${HEADING_ID_PREFIX}${createHeadingSlug(current.rawHeading)}`,
    });
    current = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    const m = trimmed.match(/^###\s+(G-ASSUMP-\d+)\s+—\s+(.+)$/);
    if (m && m[1] && m[2]) {
      flush();
      current = {
        code: m[1].trim(),
        title: m[2].trim(),
        rawHeading: trimmed.replace(/^###\s+/, '').trim(),
        bodyLines: [],
      };
      continue;
    }
    if (current) {
      if (/^##\s+/.test(trimmed)) {
        flush();
        continue;
      }
      current.bodyLines.push(rawLine);
    }
  }
  flush();

  if (guardrails.length !== 7) {
    throw new Error(
      `Assumption Safety Review extraction error: expected 7 guardrails (G-ASSUMP-01..07), got ${guardrails.length}.`
    );
  }
  return guardrails;
}

function parseDeferredCommitmentGroups(
  markdown: string
): readonly DeferredCommitmentGroup[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const groups: DeferredCommitmentGroup[] = [];
  let inSection9 = false;
  let currentTitle: string | null = null;
  let currentItems: string[] = [];

  const flush = () => {
    if (currentTitle && currentItems.length > 0) {
      groups.push({ groupTitle: currentTitle, items: [...currentItems] });
    }
    currentTitle = null;
    currentItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^##\s+9\.\s+Deferred Architecture Commitments/i.test(line)) {
      inSection9 = true;
      continue;
    }
    if (inSection9 && /^##\s+10\./.test(line)) {
      flush();
      break;
    }
    if (!inSection9) continue;

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3 && h3[1]) {
      flush();
      currentTitle = h3[1].trim();
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet && bullet[1] && currentTitle) {
      currentItems.push(bullet[1].replace(/\*\*/g, '').replace(/`/g, '').trim());
    }
  }
  flush();
  return groups;
}

let cachedDependencyArchitecture: ExtractedDependencyArchitecture | null = null;

export function getExtractedDependencyArchitecture(): ExtractedDependencyArchitecture {
  if (cachedDependencyArchitecture) {
    return cachedDependencyArchitecture;
  }

  const registry = getContentRegistry();
  const depDoc = registry.getBySlug('dependency-model');
  const matrixDoc = registry.getBySlug('module-dependency-matrix');
  const lifecycleDoc = registry.getBySlug('module-lifecycle-rules');
  const extDoc = registry.getBySlug('future-module-extension-rules');
  const assumpDoc = registry.getBySlug('phase-2-assumption-safety-review');
  const closureDoc = registry.getBySlug('phase-2-closure-review');

  if (!depDoc || !matrixDoc || !lifecycleDoc || !extDoc || !assumpDoc || !closureDoc) {
    throw new Error(
      'One or more required BATCH-002 Phase 2 governance documents are missing from Content Registry.'
    );
  }

  // 1. DEPENDENCY_MODEL.md
  const depTypesRows = parseMarkdownTableUnderHeading(
    depDoc.bodyMarkdown,
    /^##\s+2\.\s+الأنواع الرسمية للاعتماديات/
  );
  const officialTypes: DependencyTypeDefinition[] = depTypesRows.slice(1).map((row) => {
    const code = (row[0] ?? '') as DependencyTypeCode;
    const anchorHeading =
      code === 'PCD'
        ? '3. PCD — Platform Capability Dependency'
        : code === 'HBMD'
          ? '4. HBMD — Hard Business Module Dependency'
          : code === 'CIC'
            ? '5. CIC — Conditional Integration Contract'
            : '6. FLD — Feature-Level Dependency';
    return {
      code,
      name: row[1] ?? '',
      purpose: row[2] ?? '',
      blocksModuleActivation: row[3] ?? '',
      sectionAnchor: `${HEADING_ID_PREFIX}${createHeadingSlug(anchorHeading)}`,
    };
  });

  if (officialTypes.length !== 4) {
    throw new Error(
      `Dependency Model extraction error: expected 4 official dependency types, got ${officialTypes.length}.`
    );
  }

  const enforcementRows = parseMarkdownTableUnderHeading(
    depDoc.bodyMarkdown,
    /^##\s+8\.\s+Enforcement Scope/
  );
  const enforcementScopes: EnforcementScopeRule[] = enforcementRows
    .slice(1)
    .map((row) => ({
      kind: row[0] ?? '',
      primaryScope: row[1] ?? '',
      blockedWhenUnavailable: row[2] ?? '',
    }));

  const governanceRules = parseListUnderHeading(
    depDoc.bodyMarkdown,
    /^##\s+10\.\s+قواعد الحوكمة/,
    'numbered'
  );

  // 2. MODULE_DEPENDENCY_MATRIX.md
  const summaryTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^##\s+3\.\s+Core Module Summary Matrix/
  );
  const summaryRows: SummaryMatrixRow[] = summaryTable.slice(1).map((row) => ({
    sourceModuleId: moduleNameToId(row[0] ?? ''),
    sourceLabel: row[0] ?? '',
    cells: {
      finance: row[1] ?? '—',
      'inventory-warehouse': row[2] ?? '—',
      procurement: row[3] ?? '—',
      'sales-order-management': row[4] ?? '—',
    },
  }));

  const hbmdTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^#\s+4\.\s+HBMD Absence Register/
  );
  const hbmdAbsenceRegister: HbmdAbsenceRecord[] = hbmdTable.slice(1).map((row) => ({
    source: row[0] ?? '',
    target: row[1] ?? '',
    type: 'HBMD',
    enforcementScope: row[3] ?? '',
    evidence: row[4] ?? '',
    status: row[5] ?? '',
  }));

  if (hbmdAbsenceRegister.length !== 12) {
    throw new Error(
      `HBMD Absence Register extraction error: expected 12 ordered module pairs, got ${hbmdAbsenceRegister.length}.`
    );
  }

  const hasAnyActiveHbmd = hbmdAbsenceRegister.some(
    (r) => !/No HBMD/i.test(r.status)
  );
  if (hasAnyActiveHbmd) {
    throw new Error(
      'HBMD integrity violation: non-"No HBMD" entry detected in Phase 2 Core baseline.'
    );
  }

  const cicSummaryTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^#\s+5\.\s+Core Relationship Register — CIC/
  );
  const coreCics: CoreCicContract[] = cicSummaryTable.slice(1).map((row) => {
    const contractId = row[0] ?? '';
    const sourceInitiator = row[1] ?? '';
    const target = row[2] ?? '';
    const { fields, anchor } = parseCicMetadataMap(
      matrixDoc.bodyMarkdown,
      contractId
    );
    const statusText = fields.get('Status') ?? row[9] ?? '';

    return {
      contractId,
      identifierScope: 'official-erp',
      sourceInitiator,
      target,
      sourceModuleId: moduleNameToId(sourceInitiator),
      targetModuleId: moduleNameToId(target),
      businessScenario: row[4] ?? '',
      enforcementScope: row[5] ?? '',
      sourceOwnerSummary: row[6] ?? '',
      targetOwnerSummary: row[7] ?? '',
      evidence: row[8] ?? '',
      summaryStatus: row[9] ?? '',
      sectionAnchor: anchor,
      metadata: {
        participatingModules: fields.get('Participating Modules') ?? '',
        businessScenario: fields.get('Business Scenario') ?? row[4] ?? '',
        triggerInitiator: fields.get('Trigger / Initiator') ?? '',
        sourceOwner: fields.get('Source Owner') ?? row[6] ?? '',
        targetOwner: fields.get('Target Owner') ?? row[7] ?? '',
        businessObjectRefs: fields.get('Business Object / Data References') ?? '',
        requiredPreconditions: fields.get('Required Preconditions') ?? '',
        expectedOutcome: fields.get('Expected Outcome') ?? '',
        failureBehavior: fields.get('Failure / Unavailable Behavior') ?? '',
        idempotencyPrinciple: fields.get('Idempotency Principle') ?? '',
        auditRequirement: fields.get('Audit Requirement') ?? '',
        activationCondition: fields.get('Activation Condition') ?? '',
        version: fields.get('Version') ?? 'v0.1-conceptual',
        contractOwner: fields.get('Contract Owner') ?? '',
        status: statusText,
      },
      hasDeferredBoundary: /deferred/i.test(statusText) || /deferred/i.test(row[9] ?? ''),
    };
  });

  if (coreCics.length !== 6) {
    throw new Error(
      `Core CIC Register extraction error: expected 6 Core CICs, got ${coreCics.length}.`
    );
  }

  const fldTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^#\s+6\.\s+Core Relationship Register — FLD/
  );
  const coreFlds: CoreFldRecord[] = fldTable.slice(1).map((row, idx) => {
    const sourceModuleFeature = row[0] ?? '';
    const targetModuleCapability = row[1] ?? '';
    const targetLower = targetModuleCapability.toLowerCase();
    const requiredTargetModules: CoreModuleId[] = [];
    if (targetLower.includes('inventory')) requiredTargetModules.push('inventory-warehouse');
    if (targetLower.includes('finance')) requiredTargetModules.push('finance');
    if (targetLower.includes('procurement')) requiredTargetModules.push('procurement');
    if (targetLower.includes('sales')) requiredTargetModules.push('sales-order-management');

    const featureOwner = row[5] ?? '';
    return {
      id: `FLD-CORE-0${idx + 1}`,
      identifierScope: 'knowledge-hub-internal',
      sourceModuleFeature,
      sourceModuleId: moduleNameToId(sourceModuleFeature),
      targetModuleCapability,
      requiredTargetModules,
      featureScenario: row[3] ?? '',
      enforcementScope: row[4] ?? '',
      featureOwner,
      isOwnerDeferred: /deferred/i.test(featureOwner),
      evidence: row[6] ?? '',
      status: row[7] ?? '',
    };
  });

  if (coreFlds.length !== 5) {
    throw new Error(
      `Core FLD Register extraction error: expected 5 Core FLDs, got ${coreFlds.length}.`
    );
  }

  const pcdTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^##\s+7\.2\s+PCD Matrix/
  );
  const pcdMatrix: PcdMatrixRow[] = pcdTable.slice(1).map((row) => ({
    capability: row[0] ?? '',
    finance: row[1] ?? '—',
    inventory: row[2] ?? '—',
    procurement: row[3] ?? '—',
    sales: row[4] ?? '—',
  }));

  if (pcdMatrix.length !== 21) {
    throw new Error(
      `PCD Matrix extraction error: expected 21 PCD rows, got ${pcdMatrix.length}.`
    );
  }

  const pcdNotes = parseListUnderHeading(
    matrixDoc.bodyMarkdown,
    /^###\s+PCD Notes/,
    'numbered'
  );

  const ownershipTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^#\s+8\.\s+Data Ownership Cross-Reference/
  );
  const dataOwnershipRecords: DataOwnershipRecord[] = ownershipTable
    .slice(1)
    .map((row, idx) => {
      const ownerAtPhase2 = row[1] ?? '';
      const isDeferredBoundary = /Deferred Boundary/i.test(ownerAtPhase2);
      return {
        id: `OWN-CORE-${String(idx + 1).padStart(2, '0')}`,
        identifierScope: 'knowledge-hub-internal',
        businessObject: row[0] ?? '',
        ownerAtPhase2,
        isDeferredBoundary,
        consumers: row[2] ?? '',
        dependencyNote: row[3] ?? '',
        mutationAuthority: deriveMutationAuthority(
          ownerAtPhase2,
          isDeferredBoundary
        ),
      };
    });

  if (dataOwnershipRecords.length !== 15) {
    throw new Error(
      `Data Ownership extraction error: expected 15 rows, got ${dataOwnershipRecords.length}.`
    );
  }

  const consistencyTable = parseMarkdownTableUnderHeading(
    matrixDoc.bodyMarkdown,
    /^#\s+9\.\s+Consistency \/ Acceptance Checks/
  );
  const consistencyChecks: ConsistencyCheckRecord[] = consistencyTable
    .slice(1)
    .map((row) => ({
      check: row[0] ?? '',
      result: row[1] ?? '',
      notes: row[2] ?? '',
    }));

  // 3. MODULE_LIFECYCLE_RULES.md
  const lifecycleStatesTable = parseMarkdownTableUnderHeading(
    lifecycleDoc.bodyMarkdown,
    /^##\s+3\.\s+Functional Lifecycle States/
  );
  const functionalStates: LifecycleStateDefinition[] = lifecycleStatesTable
    .slice(1)
    .map((row) => ({
      state: (row[0] ?? 'Inactive') as 'Inactive' | 'Active' | 'Frozen',
      meaning: row[1] ?? '',
    }));

  const lifecycleConsistencyTable = parseMarkdownTableUnderHeading(
    lifecycleDoc.bodyMarkdown,
    /^##\s+14\.\s+Core Module Consistency Check/
  );
  const consistencyRows: ModuleLifecycleConsistencyRow[] = lifecycleConsistencyTable
    .slice(1)
    .map((row) => ({
      module: row[0] ?? '',
      standaloneActivation: row[1] ?? '',
      freezeNotDelete: row[2] ?? '',
      historyPreserved: row[3] ?? '',
      cicDoesNotBlockBase: row[4] ?? '',
      fldDoesNotBlockBase: row[5] ?? '',
      result: row[6] ?? '',
    }));

  // 4. FUTURE_MODULE_EXTENSION_RULES.md
  const newModuleRequirements = parseListUnderHeading(
    extDoc.bodyMarkdown,
    /^##\s+2\.\s+متطلبات أي Business Module جديد/,
    'numbered'
  );
  const coreOwnershipGuardrails = parseListUnderHeading(
    extDoc.bodyMarkdown,
    /^##\s+3\.\s+Core Ownership Guardrails/,
    'bullet'
  );
  const noBackDependencyExamples = parseListUnderHeading(
    extDoc.bodyMarkdown,
    /^##\s+4\.\s+No Core Back-Dependency/,
    'bullet'
  );
  const compatibilityReviewChecklist = parseListUnderHeading(
    extDoc.bodyMarkdown,
    /^##\s+12\.\s+Compatibility Review/,
    'numbered'
  );
  const illustrativeDirectionalExamples = parseListUnderHeading(
    extDoc.bodyMarkdown,
    /^##\s+13\.\s+أمثلة اتجاهية للمستقبل/,
    'bullet'
  );

  // 5. PHASE_2_ASSUMPTION_SAFETY_REVIEW.md & PHASE_2_CLOSURE_REVIEW.md
  const guardrails = parseAssumptionGuardrails(assumpDoc.bodyMarkdown);
  const phase3Handoffs = parseListUnderHeading(
    assumpDoc.bodyMarkdown,
    /^##\s+5\.\s+عناصر يجب أن يجيب عنها Phase 3/,
    'numbered'
  );
  const exitCriteriaTable = parseMarkdownTableUnderHeading(
    closureDoc.bodyMarkdown,
    /^##\s+12\.\s+Exit Criteria/
  );
  const exitCriteria: Phase2ExitCriterion[] = exitCriteriaTable
    .slice(1)
    .map((row) => ({
      criterion: row[0] ?? '',
      result: row[1] ?? '',
    }));

  if (exitCriteria.length !== 13) {
    throw new Error(
      `Phase 2 Closure Exit Criteria extraction error: expected 13 rows, got ${exitCriteria.length}.`
    );
  }

  cachedDependencyArchitecture = {
    dependencyModel: {
      documentSlug: depDoc.metadata.slug,
      officialSourcePath: 'teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md',
      supremeRuleAr:
        'الأصل أن كل Business Module مستقل في التفعيل، ولا يصبح Business Module آخر شرطًا عليه إلا بقرار Hard Business Module Dependency صريح ومعتمد. أما التكامل أو البيانات المشتركة أو اعتماد Feature معينة فلا يحول تلقائيًا إلى اعتماد على مستوى الـModule.',
      supremeRuleEn:
        'A Business Module is independently activatable unless an explicitly approved Hard Business Module Dependency says otherwise. Integration requirements, shared data usage, and feature dependencies do not by themselves create module-level activation dependencies.',
      officialTypes,
      disallowedLabels: [
        'Soft Dependency',
        'Optional Dependency',
        'Data Dependency',
        'Process Dependency',
      ],
      enforcementScopes,
      governanceRules,
    },
    matrix: {
      documentSlug: matrixDoc.metadata.slug,
      officialSourcePath:
        'teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md',
      sourceRevision:
        matrixDoc.metadata.source.kind === 'official-source'
          ? (matrixDoc.metadata.source.commitSha ?? null)
          : null,
      sourceBodySha256: computeCanonicalStoredBodySha256(matrixDoc.bodyMarkdown),
      summaryRows,
      hbmdAbsenceRegister,
      hbmdEdgeCount: 0,
      hbmdCycleCount: 0,
      hbmdCycleStatus: 'Acyclic by construction (0 HBMD edges / 0 cycles)',
      coreCics,
      coreFlds,
      pcdMatrix,
      pcdNotes,
      dataOwnershipRecords,
      deferredOwnershipCount: dataOwnershipRecords.filter(
        (r) => r.isDeferredBoundary
      ).length,
      consistencyChecks,
      consistencyResult: 'PASS — Core Dependency Model is internally consistent',
    },
    lifecycle: {
      documentSlug: lifecycleDoc.metadata.slug,
      officialSourcePath:
        'teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md',
      topRules: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+1\.\s+القواعد العليا/,
        'numbered'
      ),
      functionalStates,
      activationPreconditions: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+4\.\s+Module Activation Preconditions/,
        'numbered'
      ),
      deactivationPreconditions: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+7\.\s+Deactivation Preconditions/,
        'numbered'
      ),
      freezeNotDeletePoints: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+8\.\s+Freeze, not Delete/,
        'bullet'
      ),
      sharedDataSafetyExamples: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+12\.\s+Shared Data Safety/,
        'bullet'
      ),
      reactivationRules: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+13\.\s+Reactivation Principle/,
        'numbered'
      ),
      consistencyRows,
      finalRules: parseListUnderHeading(
        lifecycleDoc.bodyMarkdown,
        /^##\s+15\.\s+قواعد الحوكمة النهائية/,
        'numbered'
      ),
    },
    futureExtensions: {
      documentSlug: extDoc.metadata.slug,
      officialSourcePath:
        'teranoo-erp-planning/03-modules/FUTURE_MODULE_EXTENSION_RULES.md',
      supremeRule:
        'إضافة Module جديد توسّع المنتج، لكنها لا تعيد تعريف Business Core أو تجعله معتمدًا على الـModule الجديد ضمنيًا.',
      newModuleRequirements,
      coreOwnershipGuardrails,
      noBackDependencyExamples,
      compatibilityReviewChecklist,
      illustrativeDirectionalExamples,
    },
    phase2Reviews: {
      reviewKind: 'official-project-review-gate',
      assumptionSafety: {
        documentSlug: assumpDoc.metadata.slug,
        officialSourcePath:
          'teranoo-erp-planning/00-project-foundation/PHASE_2_ASSUMPTION_SAFETY_REVIEW.md',
        reviewDate: '2026-09-09',
        result: 'PASS with Guardrails',
        reopensRequired: 0,
        materialConflicts: 0,
        docSyncCount: 1,
        docSyncDetail:
          'Inventory documentation synchronized with D-SALES-06: Reservation Record Ownership = Inventory (algorithms deferred to Phase 6).',
        moduleVerdicts: [
          {
            moduleLabel: 'Finance',
            verdict: 'SAFE',
            syncNote: null,
          },
          {
            moduleLabel: 'Inventory & Warehouse Management',
            verdict: 'SAFE after documentation sync',
            syncNote: 'Synced with D-SALES-06 (Reservation Record Ownership = Inventory)',
          },
          {
            moduleLabel: 'Procurement',
            verdict: 'SAFE',
            syncNote: null,
          },
          {
            moduleLabel: 'Sales & Order Management',
            verdict: 'SAFE',
            syncNote: null,
          },
        ],
        guardrails,
        phase3Handoffs,
      },
      closureReview: {
        documentSlug: closureDoc.metadata.slug,
        officialSourcePath:
          'teranoo-erp-planning/00-project-foundation/PHASE_2_CLOSURE_REVIEW.md',
        closureDate: '2026-09-09',
        exitGateResult: 'PASS — Phase 2 Closed',
        exitCriteria,
        deferredCommitmentGroups: parseDeferredCommitmentGroups(
          closureDoc.bodyMarkdown
        ),
      },
    },
  };

  return cachedDependencyArchitecture;
}

export function resetExtractedDependencyArchitectureCache(): void {
  cachedDependencyArchitecture = null;
}
