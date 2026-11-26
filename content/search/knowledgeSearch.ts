import type {
  ContentClassificationType,
  LocalizedText,
  ProjectReferenceSnapshot,
  SearchableItem,
} from '@/content/models/types';
import type { KnowledgeRecordMetadata } from '@/content/models/knowledge';
import type { ExtractedDecisionRegister } from '@/content/extractors/decisionRegisterExtractor';
import type { ExtractedFacRegister } from '@/content/extractors/facRegisterExtractor';
import type { ExtractedGuardrailsDocument } from '@/content/extractors/guardrailsExtractor';
import type { ExtractedRoadmap } from '@/content/extractors/roadmapExtractor';
import type { ExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import type { ExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { PROJECT_REFERENCE_SNAPSHOT } from '@/content/seed/projectSnapshot';
import { buildSearchIndex } from '@/content/repositories/projectRepository';
import {
  BUSINESS_MODULES_TAXONOMY,
  CONTROLLED_TOPICS,
  getContentTypeDefinition,
  getTaxonomyLabel,
} from '@/content/taxonomy/registry';

export type KnowledgeSearchCategory =
  | 'navigation'
  | 'module'
  | 'capability'
  | 'decision'
  | 'document'
  | 'fac'
  | 'phase'
  | 'guardrail'
  | 'contract'
  | 'dependency'
  | 'lifecycle'
  | 'ownership';

export interface KnowledgeSearchEntry {
  readonly id: string;
  readonly href: string;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly category: KnowledgeSearchCategory;
  readonly classification: ContentClassificationType;
  readonly code?: string;
  readonly isSuperseded?: boolean;
  readonly searchTokens: readonly string[];
}

export interface UnifiedSearchStructuredSources {
  readonly decisionRegister?: ExtractedDecisionRegister;
  readonly facRegister?: ExtractedFacRegister;
  readonly guardrails?: ExtractedGuardrailsDocument;
  readonly roadmap?: ExtractedRoadmap;
  readonly coreModulesCatalog?: ExtractedCoreModulesCatalog;
  readonly dependencyArchitecture?: ExtractedDependencyArchitecture;
}

export function knowledgeRecordToSearchEntry(
  record: KnowledgeRecordMetadata
): KnowledgeSearchEntry {
  const typeDef = getContentTypeDefinition(record.type);
  const topicLabels = record.topics.flatMap((topic) => {
    const label = getTaxonomyLabel(CONTROLLED_TOPICS, topic);
    return label ? [topic, label.ar, label.en] : [topic];
  });
  const moduleLabels = record.moduleRefs.flatMap((mod) => {
    const label = getTaxonomyLabel(BUSINESS_MODULES_TAXONOMY, mod);
    return label ? [mod, label.ar, label.en] : [mod];
  });

  const primaryOfficialCode =
    record.traceability.decisionIds[0] ??
    record.traceability.requirementIds[0] ??
    record.traceability.officialDocumentId ??
    undefined;

  const isSuperseded = record.editorialStatus === 'superseded';

  return {
    id: `doc-${record.id}`,
    href: `/knowledge/${record.slug}`,
    title: record.title,
    subtitle: record.description,
    category: 'document',
    classification: record.classification,
    code: primaryOfficialCode,
    isSuperseded,
    searchTokens: [
      record.id,
      record.slug,
      record.type,
      typeDef?.label.ar ?? '',
      typeDef?.label.en ?? '',
      record.classification,
      record.language,
      record.editorialStatus,
      record.source.kind === 'official-source' ? record.source.sourcePath : '',
      ...topicLabels,
      ...record.tags,
      ...moduleLabels,
      ...record.domainRefs,
      ...record.phaseRefs,
      record.traceability.officialDocumentId ?? '',
      ...record.traceability.decisionIds,
      ...record.traceability.requirementIds,
      ...record.traceability.researchIds,
      ...record.traceability.futureConsiderationIds,
      ...record.traceability.independentReviewIds,
    ].filter(Boolean),
  };
}

function baseItemToSearchEntry(item: SearchableItem): KnowledgeSearchEntry {
  return {
    ...item,
    searchTokens: [item.code ?? '', item.href].filter(Boolean),
  };
}

function buildDecisionEntries(
  register: ExtractedDecisionRegister
): readonly KnowledgeSearchEntry[] {
  const archEntries: KnowledgeSearchEntry[] = register.architecturalDecisions.map(
    (decision) => ({
      id: `dec-${decision.decisionId}`,
      href: `/decisions?decision=${encodeURIComponent(decision.decisionId)}`,
      title: {
        ar: decision.shortDecision,
        en: decision.shortDecision,
      },
      subtitle: {
        ar: `${decision.ownerPhaseLabel} · ${decision.primaryImpact}`,
        en: `${decision.ownerPhaseLabel} · ${decision.primaryImpact}`,
      },
      category: 'decision',
      classification: 'approved-decision',
      code: decision.decisionId,
      searchTokens: [
        decision.decisionId,
        decision.family,
        decision.ownerPhaseId,
        decision.ownerPhaseLabel,
        decision.officialSource,
        decision.primaryImpact,
      ],
    })
  );

  const mkt = register.marketDecision;
  const marketEntry: KnowledgeSearchEntry = {
    id: `dec-${mkt.decisionId}`,
    href: `/decisions?decision=${encodeURIComponent(mkt.decisionId)}`,
    title: {
      ar: `${mkt.title} (بوابة القرار A — معتمد مشروطًا)`,
      en: `${mkt.title} (Decision Gate A — Approved Conditional)`,
    },
    subtitle: {
      ar: `${mkt.summary} · شرط نفاذ: ${mkt.conditionCode}`,
      en: `${mkt.summary} · Condition: ${mkt.conditionCode}`,
    },
    category: 'decision',
    classification: 'approved-decision',
    code: mkt.decisionId,
    searchTokens: [
      mkt.decisionId,
      'Decision Gate A',
      'بوابة القرار A',
      'Jordan',
      'الأردن',
      'Trading',
      'Wholesale',
      mkt.conditionCode,
      mkt.officialSource,
    ],
  };

  return [marketEntry, ...archEntries];
}

function buildPhase2ModuleEntries(
  catalog: ExtractedCoreModulesCatalog
): readonly KnowledgeSearchEntry[] {
  const moduleEntries: KnowledgeSearchEntry[] = catalog.modules.map((mod) => ({
    id: `core-mod-${mod.id}`,
    href: `/modules/${mod.id}`,
    title: mod.name,
    subtitle: {
      ar: `${mod.code} · ${mod.decisions.length} قرار مرحلة 2 · 0 HBMD · ${mod.relatedCicIds.length} عقود CIC`,
      en: `${mod.code} · ${mod.decisions.length} Phase 2 decisions · 0 HBMD · ${mod.relatedCicIds.length} Core CICs`,
    },
    category: 'module',
    classification: 'official',
    code: mod.code,
    searchTokens: [
      mod.id,
      mod.code,
      mod.shortName.ar,
      mod.shortName.en,
      mod.officialSourcePath,
      mod.identitySummary.ar,
      mod.identitySummary.en,
      ...mod.relatedCicIds,
      ...mod.relatedFldLabels,
      ...mod.decisions.map((d) => d.decisionId),
    ],
  }));

  const phase2DecisionEntries: KnowledgeSearchEntry[] =
    catalog.allPhase2Decisions.map((dec) => ({
      id: `p2-dec-${dec.decisionId}`,
      href: `/decisions?decision=${encodeURIComponent(dec.decisionId)}`,
      title: {
        ar: dec.title,
        en: dec.title,
      },
      subtitle: {
        ar: `المرحلة 2 (محلي في ${dec.owningModuleLabel.ar}) · خارج عدّاد 126`,
        en: `Phase 2 (Source-local in ${dec.owningModuleLabel.en}) · Outside 126 counter`,
      },
      category: 'decision',
      classification: 'approved-decision',
      code: dec.decisionId,
      searchTokens: [
        dec.decisionId,
        dec.family,
        'phase-2',
        'source-local',
        dec.owningModuleId,
        dec.owningModuleLabel.ar,
        dec.owningModuleLabel.en,
        dec.owningDocumentPath,
        dec.verbatimBody,
      ],
    }));

  return [...phase2DecisionEntries, ...moduleEntries];
}

function buildDependencyArchitectureEntries(
  arch: ExtractedDependencyArchitecture
): readonly KnowledgeSearchEntry[] {
  const typeEntries: KnowledgeSearchEntry[] =
    arch.dependencyModel.officialTypes.map((dt) => ({
      id: `dep-type-${dt.code}`,
      href: `/dependencies?tab=model&type=${encodeURIComponent(dt.code)}`,
      title: {
        ar: `${dt.code} — ${dt.name}`,
        en: `${dt.code} — ${dt.name}`,
      },
      subtitle: {
        ar: dt.purpose,
        en: dt.purpose,
      },
      category: 'dependency',
      classification: 'official',
      code: dt.code,
      searchTokens: [
        dt.code,
        dt.name,
        dt.purpose,
        dt.blocksModuleActivation,
        'dependency model',
        'نموذج الاعتماديات',
      ],
    }));

  const cicEntries: KnowledgeSearchEntry[] = arch.matrix.coreCics.map((cic) => ({
    id: `cic-${cic.contractId}`,
    href: `/dependencies?tab=matrix&cic=${encodeURIComponent(cic.contractId)}`,
    title: {
      ar: `${cic.sourceInitiator} → ${cic.target}: ${cic.businessScenario}`,
      en: `${cic.sourceInitiator} → ${cic.target}: ${cic.businessScenario}`,
    },
    subtitle: {
      ar: `عقد تكامل مشروط (v0.1-conceptual) · ${cic.evidence}`,
      en: `Core CIC Contract (v0.1-conceptual) · ${cic.evidence}`,
    },
    category: 'contract',
    classification: 'official',
    code: cic.contractId,
    searchTokens: [
      cic.contractId,
      'CIC',
      cic.sourceInitiator,
      cic.target,
      cic.businessScenario,
      cic.evidence,
      cic.metadata.participatingModules,
      cic.metadata.businessObjectRefs,
      cic.metadata.expectedOutcome,
    ],
  }));

  const fldEntries: KnowledgeSearchEntry[] = arch.matrix.coreFlds.map((fld) => ({
    id: `fld-${fld.id}`,
    href: '/dependencies?tab=matrix#fld-register',
    title: {
      ar: `${fld.sourceModuleFeature} → ${fld.targetModuleCapability}`,
      en: `${fld.sourceModuleFeature} → ${fld.targetModuleCapability}`,
    },
    subtitle: {
      ar: `اعتمادية مستوى الميزة (FLD) · ${fld.featureScenario}`,
      en: `Feature-Level Dependency (FLD) · ${fld.featureScenario}`,
    },
    category: 'dependency',
    classification: 'official',
    code: 'FLD',
    searchTokens: [
      'FLD',
      fld.sourceModuleFeature,
      fld.targetModuleCapability,
      fld.featureScenario,
      fld.featureOwner,
      fld.evidence,
    ],
  }));

  const lifecycleEntries: KnowledgeSearchEntry[] = [
    {
      id: 'lifecycle-freeze-not-delete',
      href: '/dependencies?tab=lifecycle',
      title: {
        ar: 'Freeze, not Delete — التجميد لا الحذف ودورة حياة الأنظمة',
        en: 'Freeze, not Delete — Module Lifecycle States (Inactive / Active / Frozen)',
      },
      subtitle: {
        ar: 'حفظ التاريخ والأرصدة والبيانات المشتركة عند إيقاف أي نظام فرعي دون حذف البيانات',
        en: 'Preserves operational history, balances, and shared master data when deactivating a module',
      },
      category: 'lifecycle',
      classification: 'official',
      code: 'LIFECYCLE',
      searchTokens: [
        'Freeze, not Delete',
        'Freeze not Delete',
        'التجميد لا الحذف',
        'Inactive',
        'Active',
        'Frozen',
        'Entitlement',
        'MODULE_LIFECYCLE_RULES',
        'دورة حياة الأنظمة',
      ],
    },
  ];

  const ownershipEntries: KnowledgeSearchEntry[] =
    arch.matrix.dataOwnershipRecords.map((rec) => ({
      id: `own-${rec.id}`,
      href: '/dependencies?tab=ownership',
      title: {
        ar: `${rec.businessObject} — المالك: ${rec.ownerAtPhase2}`,
        en: `${rec.businessObject} — Owner: ${rec.ownerAtPhase2}`,
      },
      subtitle: {
        ar: `المستهلكون: ${rec.consumers}`,
        en: `Consumers: ${rec.consumers}`,
      },
      category: 'ownership',
      classification: 'official',
      code: rec.isDeferredBoundary ? 'DEFERRED-OWNER' : 'DATA-OWNER',
      searchTokens: [
        rec.businessObject,
        rec.ownerAtPhase2,
        rec.consumers,
        rec.dependencyNote,
        'Data Ownership',
        'ملكية البيانات',
      ],
    }));

  const phase2GuardrailEntries: KnowledgeSearchEntry[] =
    arch.phase2Reviews.assumptionSafety.guardrails.map((gr) => ({
      id: `p2-gr-${gr.code}`,
      href: '/dependencies?tab=reviews',
      title: {
        ar: `${gr.code} — ${gr.title}`,
        en: `${gr.code} — ${gr.title}`,
      },
      subtitle: {
        ar: 'ضابط سلامة افتراضات ملزم للمرحلة 3 وما بعدها (PHASE_2_ASSUMPTION_SAFETY_REVIEW.md)',
        en: 'Binding Phase 2 Assumption Safety Guardrail for Phase 3+ (PHASE_2_ASSUMPTION_SAFETY_REVIEW.md)',
      },
      category: 'guardrail',
      classification: 'official',
      code: gr.code,
      searchTokens: [
        gr.code,
        gr.title,
        'G-ASSUMP',
        'Assumption Safety Review',
        'Phase 2 Closure',
      ],
    }));

  return [
    ...typeEntries,
    ...cicEntries,
    ...fldEntries,
    ...lifecycleEntries,
    ...phase2GuardrailEntries,
    ...ownershipEntries,
  ];
}

function buildFacEntries(
  facRegister: ExtractedFacRegister
): readonly KnowledgeSearchEntry[] {
  return facRegister.records.map((rec) => ({
    id: `fac-${rec.facId}`,
    href: `/future-considerations?fac=${encodeURIComponent(rec.facId)}`,
    title: {
      ar: rec.title,
      en: rec.title,
    },
    subtitle: {
      ar: `${rec.status} · المالك: ${rec.owner} · ليس قرارًا معتمدًا`,
      en: `${rec.status} · Owner: ${rec.owner} · Not an approved decision`,
    },
    category: 'fac',
    classification: 'future',
    code: rec.facId,
    searchTokens: [
      rec.facId,
      rec.status,
      rec.owner,
      ...rec.ownerPhaseIds,
      rec.summary,
      rec.referencedDetailedDoc ?? '',
    ].filter(Boolean),
  }));
}

function buildRoadmapEntries(
  roadmap: ExtractedRoadmap
): readonly KnowledgeSearchEntry[] {
  return roadmap.phases.map((phase) => ({
    id: `roadmap-${phase.id}`,
    href: `/roadmap?phase=${encodeURIComponent(phase.id)}`,
    title: phase.title,
    subtitle: phase.purpose,
    category: 'phase',
    classification: 'official',
    code: phase.code,
    searchTokens: [
      phase.id,
      phase.code,
      phase.originalTitle,
      phase.status,
      phase.decisionRange ?? '',
      ...phase.workItems,
    ].filter(Boolean),
  }));
}

function buildGuardrailEntries(
  guardrailsDoc: ExtractedGuardrailsDocument
): readonly KnowledgeSearchEntry[] {
  return guardrailsDoc.guardrails.map((gr) => ({
    id: `guardrail-${gr.sequenceNumber}`,
    href: `/architecture?guardrail=${gr.sequenceNumber}#guardrail-${gr.sequenceNumber}`,
    title: {
      ar: `${gr.sequenceNumber}. ${gr.arabicTitle}`,
      en: `${gr.sequenceNumber}. ${gr.originalTitle}`,
    },
    subtitle: {
      ar: gr.governingPrinciple,
      en: gr.whyItMatters.en,
    },
    category: 'guardrail',
    classification: 'official',
    code: `Guardrail #${gr.sequenceNumber}`,
    searchTokens: [
      `guardrail ${gr.sequenceNumber}`,
      gr.originalTitle,
      gr.arabicTitle,
      gr.governingPrinciple,
      ...gr.ownerPhases,
    ],
  }));
}

/**
 * Combines published Content Registry metadata, TASK-004 extracted official
 * structured records (126 decisions + D-MKT-01, 24 FACs, 14 roadmap stages,
 * 8 Cross-Phase Product Guardrails), TASK-005 BATCH-002 Core Modules &
 * Dependency Architecture records (4 modules, 34 Phase 2 decisions, 6 CICs,
 * 5 FLDs, 4 Dependency Types, Lifecycle governance, 15 Ownership records,
 * 7 G-ASSUMP guardrails), and base navigation/snapshot items.
 *
 * Only explicitly published, non-fixture records should ever be passed into
 * publishedRecords. Active full official documents rank ahead of superseded
 * historical reference summaries.
 */
export function buildUnifiedSearchIndex(
  publishedRecords: readonly KnowledgeRecordMetadata[],
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT,
  structured?: UnifiedSearchStructuredSources
): readonly KnowledgeSearchEntry[] {
  const safePublished = publishedRecords.filter(
    (rec) =>
      !rec.isFixture &&
      rec.publicationStatus === 'public' &&
      rec.editorialStatus !== 'draft' &&
      rec.publicationAuthorization.authorized === true
  );

  const activeDocuments = safePublished
    .filter((rec) => rec.editorialStatus !== 'superseded')
    .map(knowledgeRecordToSearchEntry);
  const supersededDocuments = safePublished
    .filter((rec) => rec.editorialStatus === 'superseded')
    .map(knowledgeRecordToSearchEntry);

  const decisionEntries = structured?.decisionRegister
    ? buildDecisionEntries(structured.decisionRegister)
    : [];
  const phase2ModuleEntries = structured?.coreModulesCatalog
    ? buildPhase2ModuleEntries(structured.coreModulesCatalog)
    : [];
  const dependencyEntries = structured?.dependencyArchitecture
    ? buildDependencyArchitectureEntries(structured.dependencyArchitecture)
    : [];
  const facEntries = structured?.facRegister
    ? buildFacEntries(structured.facRegister)
    : [];
  const roadmapEntries = structured?.roadmap
    ? buildRoadmapEntries(structured.roadmap)
    : [];
  const guardrailEntries = structured?.guardrails
    ? buildGuardrailEntries(structured.guardrails)
    : [];

  // When extracted decisions or core modules are indexed, avoid duplicate coarse
  // snapshot module rows overriding deep-linked /modules/[id] entries.
  const baseEntries = buildSearchIndex(snapshot)
    .filter((item) =>
      structured?.coreModulesCatalog ? !item.id.startsWith('mod-') : true
    )
    .map((item) => {
      const entry = baseItemToSearchEntry(item);
      if (structured?.decisionRegister && item.id.startsWith('cap-')) {
        return { ...entry, category: 'capability' as const };
      }
      return entry;
    });

  return [
    ...activeDocuments,
    ...decisionEntries,
    ...phase2ModuleEntries,
    ...dependencyEntries,
    ...facEntries,
    ...roadmapEntries,
    ...guardrailEntries,
    ...baseEntries,
    ...supersededDocuments,
  ];
}

export function searchUnifiedKnowledge(
  query: string,
  index: readonly KnowledgeSearchEntry[]
): readonly KnowledgeSearchEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    // Show non-superseded active canonical docs & core navigation first
    return index.filter((item) => !item.isSuperseded).slice(0, 12);
  }

  const scored: { item: KnowledgeSearchEntry; score: number }[] = [];

  for (const item of index) {
    const codeLower = (item.code ?? '').toLowerCase();
    const titleAr = item.title.ar.toLowerCase();
    const titleEn = item.title.en.toLowerCase();
    const haystack = [
      titleAr,
      titleEn,
      item.subtitle.ar.toLowerCase(),
      item.subtitle.en.toLowerCase(),
      codeLower,
      item.href.toLowerCase(),
      ...item.searchTokens.map((tok) => tok.toLowerCase()),
    ].join(' ');

    if (!haystack.includes(normalized)) {
      continue;
    }

    let score = 10;
    if (codeLower === normalized) {
      score = item.category === 'document' ? 100 : 110;
    } else if (codeLower && codeLower.startsWith(normalized)) {
      score = item.category === 'document' ? 80 : 85;
    } else if (titleAr.includes(normalized) || titleEn.includes(normalized)) {
      score = 60;
    } else if (item.category === 'document') {
      score = 40;
    }

    // Demote superseded historical summaries below current official content
    if (item.isSuperseded) {
      score -= 35;
    }

    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.item);
}
