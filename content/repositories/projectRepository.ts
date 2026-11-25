import { ALL_NAV_ITEMS } from '@/config/navigation';
import type {
  CapabilityStatus,
  CoreBusinessModule,
  DerivedDashboardMetrics,
  DerivedPhase5Progress,
  DerivedPlanningSummary,
  PlanningPhase,
  PlatformCapability,
  ProjectIdentity,
  ProjectReferenceSnapshot,
  SearchableItem,
  SnapshotReferenceCounts,
} from '@/content/models/types';
import { PROJECT_REFERENCE_SNAPSHOT } from '@/content/seed/projectSnapshot';

export function getProjectSnapshot(): ProjectReferenceSnapshot {
  return PROJECT_REFERENCE_SNAPSHOT;
}

export function getProjectIdentity(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): ProjectIdentity {
  return snapshot.identity;
}

export function getCoreBusinessModules(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): readonly CoreBusinessModule[] {
  return snapshot.coreBusinessModules;
}

export function getPlanningPhases(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): readonly PlanningPhase[] {
  return snapshot.planningPhases;
}

export function getPhase5Capabilities(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): readonly PlatformCapability[] {
  return snapshot.phase5Capabilities;
}

export function getReferenceCounts(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): SnapshotReferenceCounts {
  return snapshot.referenceCounts;
}

export function derivePhase5Progress(
  capabilities: readonly PlatformCapability[] = PROJECT_REFERENCE_SNAPSHOT.phase5Capabilities
): DerivedPhase5Progress {
  const totalCount = capabilities.length;
  const completedCount = capabilities.filter((c) => c.status === 'approved').length;
  const pendingCount = capabilities.filter((c) => c.status === 'pending').length;
  const completionPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    pendingCount,
    totalCount,
    completionPercentage,
  };
}

export function derivePlanningSummary(
  phases: readonly PlanningPhase[] = PROJECT_REFERENCE_SNAPSHOT.planningPhases
): DerivedPlanningSummary {
  const completedPhasesCount = phases.filter((p) => p.status === 'completed').length;
  const activePhase = phases.find((p) => p.status === 'in_progress') ?? null;

  return {
    completedPhasesCount,
    totalPhasesCount: phases.length,
    activePhase,
  };
}

export function deriveDashboardMetrics(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): DerivedDashboardMetrics {
  const planning = derivePlanningSummary(snapshot.planningPhases);
  const phase5 = derivePhase5Progress(snapshot.phase5Capabilities);

  return {
    approvedDecisionsCount: snapshot.referenceCounts.approvedArchitecturalDecisions,
    completedPhasesCount: planning.completedPhasesCount,
    totalPhasesCount: planning.totalPhasesCount,
    coreModulesCount: snapshot.coreBusinessModules.length,
    phase5,
  };
}

export function filterPhase5Capabilities(
  filter: 'all' | CapabilityStatus,
  capabilities: readonly PlatformCapability[] = PROJECT_REFERENCE_SNAPSHOT.phase5Capabilities
): readonly PlatformCapability[] {
  if (filter === 'all') {
    return capabilities;
  }
  return capabilities.filter((capability) => capability.status === filter);
}

export function buildSearchIndex(
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): readonly SearchableItem[] {
  const navEntries: SearchableItem[] = ALL_NAV_ITEMS.map((item) => ({
    id: `nav-${item.id}`,
    href: item.href,
    title: item.label,
    subtitle: item.description,
    category: 'navigation',
    classification: item.classification,
  }));

  const moduleEntries: SearchableItem[] = snapshot.coreBusinessModules.map((mod) => ({
    id: `mod-${mod.id}`,
    href: '/modules',
    title: mod.name,
    subtitle: {
      ar: 'نظام تجاري أساسي ضمن Teranoo ERP',
      en: 'Core Business Module in Teranoo ERP',
    },
    category: 'module',
    classification: mod.classification,
    code: mod.code,
  }));

  const capabilityEntries: SearchableItem[] = snapshot.phase5Capabilities.map((cap) => ({
    id: `cap-${cap.id}`,
    href: '/platform',
    title: cap.name,
    subtitle: cap.decisionId
      ? {
          ar: `المرحلة 5 — قدرة منصة معتمدة (${cap.decisionId})`,
          en: `Phase 5 — Approved platform capability (${cap.decisionId})`,
        }
      : {
          ar: 'المرحلة 5 — قدرة منصة قيد الاستكمال',
          en: 'Phase 5 — Pending platform capability',
        },
    category: cap.decisionId ? 'decision' : 'capability',
    classification: 'official',
    code: cap.decisionId ?? `P5-${String(cap.itemNumber).padStart(2, '0')}`,
  }));

  return [...navEntries, ...moduleEntries, ...capabilityEntries];
}

export function searchKnowledgeHub(
  query: string,
  index: readonly SearchableItem[] = buildSearchIndex()
): readonly SearchableItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return index.slice(0, 10);
  }

  return index.filter((item) => {
    const haystack = [
      item.title.ar,
      item.title.en,
      item.subtitle.ar,
      item.subtitle.en,
      item.code ?? '',
      item.href,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
