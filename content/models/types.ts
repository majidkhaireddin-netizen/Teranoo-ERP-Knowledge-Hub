import type { AppLocale } from '@/i18n/config';

export type ContentClassificationType =
  | 'official'
  | 'research'
  | 'independent'
  | 'future';

export type PlanningPhaseStatus = 'completed' | 'in_progress';

export type CapabilityStatus = 'approved' | 'pending';

export type Phase5ItemKind = 'runtime_capability' | 'planning_gate';

export type DocumentApprovalStatus =
  | 'approved'
  | 'reference_snapshot'
  | 'planned';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface SnapshotProvenance {
  sourceRepository: string;
  officialSources: readonly string[];
  reviewedTreeSha: string;
  referenceReviewDate: string;
  isLiveSynced: false;
  snapshotNatureNote: LocalizedText;
  reviewDateNote: LocalizedText;
  metricsOriginNote: LocalizedText;
}

export interface ProjectIdentity {
  productName: string;
  productType: LocalizedText;
  targetCustomers: LocalizedText;
  productStrategy: LocalizedText;
  deploymentStrategy: LocalizedText;
  futureDeploymentProfile: LocalizedText;
  databaseEngine: string;
}

export interface CoreBusinessModule {
  id: string;
  order: number;
  name: LocalizedText;
  classification: ContentClassificationType;
}

export interface PlanningPhase {
  phaseNumber: number;
  code: string;
  name: LocalizedText;
  status: PlanningPhaseStatus;
}

export interface PlatformCapability {
  itemNumber: number;
  id: string;
  name: LocalizedText;
  status: CapabilityStatus;
  kind: Phase5ItemKind;
  decisionId: string | null;
}

export interface SnapshotReferenceCounts {
  approvedArchitecturalDecisions: number;
  futureArchitectureConsiderations: number;
  architecturalResearchPackages: number;
  independentReviewNotes: number;
}

export interface ProjectReferenceSnapshot {
  provenance: SnapshotProvenance;
  snapshotScopeNote: LocalizedText;
  identity: ProjectIdentity;
  coreBusinessModules: readonly CoreBusinessModule[];
  planningPhases: readonly PlanningPhase[];
  phase5Capabilities: readonly PlatformCapability[];
  referenceCounts: SnapshotReferenceCounts;
}

export interface DerivedPhase5Progress {
  completedCount: number;
  pendingCount: number;
  totalCount: number;
  completionPercentage: number;
}

export interface DerivedRuntimeCapabilitiesSummary {
  approvedCount: number;
  pendingCount: number;
  totalCount: number;
}

export interface DerivedPlanningSummary {
  completedPhasesCount: number;
  totalPhasesCount: number;
  activePhase: PlanningPhase | null;
}

export interface DerivedDashboardMetrics {
  approvedDecisionsCount: number;
  completedPhasesCount: number;
  totalPhasesCount: number;
  coreModulesCount: number;
  phase5: DerivedPhase5Progress;
}

export interface TocHeading {
  id: string;
  title: LocalizedText;
  level: 2 | 3;
}

export interface RelatedLinkItem {
  href: string;
  title: LocalizedText;
  description: LocalizedText;
  classification: ContentClassificationType;
}

export interface DocumentMetadata {
  documentId: string;
  classification: ContentClassificationType;
  approvalStatus: DocumentApprovalStatus;
  sourceReference: LocalizedText;
  scopeNote: LocalizedText;
}

export interface SearchableItem {
  id: string;
  href: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: 'navigation' | 'module' | 'capability' | 'decision';
  classification: ContentClassificationType;
  code?: string;
}

export function resolveLocalizedText(
  text: LocalizedText,
  locale: AppLocale
): string {
  return text[locale];
}
