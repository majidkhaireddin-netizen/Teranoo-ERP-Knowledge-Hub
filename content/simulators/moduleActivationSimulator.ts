import type { LocalizedText } from '@/content/models/types';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';

export interface PlatformPrerequisiteState {
  readonly mandatoryPlatformCore: boolean; // Tenant, Company, Users/Roles, Audit, Reporting, Config, Integration, Localization
  readonly sharedPartyIdentity: boolean; // Required for Procurement (Supplier) and Sales (Customer); conditional for Finance/Inventory
  readonly sharedProductAndUom: boolean; // Required for Inventory and Sales; conditional for Procurement
  readonly inventoryStorageContext: boolean; // Required for Inventory; conditional for Procurement & Sales
  readonly fiscalCalendar: boolean; // Required for Finance
  readonly currencyFoundation: boolean; // Required for Finance, Procurement, Sales; conditional for Inventory
}

export interface ModuleActivationSimulatorInput {
  readonly selectedModules: Readonly<Record<CoreModuleId, boolean>>;
  readonly platform: PlatformPrerequisiteState;
}

export interface SimulatedModuleOutcome {
  readonly moduleId: CoreModuleId;
  readonly selected: boolean;
  readonly canActivateBase: boolean;
  readonly status: 'not-selected' | 'activatable' | 'blocked-by-pcd';
  readonly missingRequiredPcds: readonly string[];
  readonly hbmdBlockers: readonly string[]; // Always [] in Phase 2 Core baseline
  readonly explanation: LocalizedText;
}

export interface SimulatedCicOutcome {
  readonly contractId: string;
  readonly sourceModuleId: CoreModuleId;
  readonly targetModuleId: CoreModuleId;
  readonly scenario: LocalizedText;
  readonly ready: boolean;
  readonly reason: LocalizedText;
  readonly deferredBoundaryNote?: LocalizedText;
}

export interface SimulatedFldOutcome {
  readonly id: string;
  readonly sourceModuleId: CoreModuleId;
  readonly featureLabel: LocalizedText;
  readonly requiredModules: readonly CoreModuleId[];
  readonly available: boolean;
  readonly missingModules: readonly CoreModuleId[];
  readonly reason: LocalizedText;
  readonly isOwnerDeferred: boolean;
}

export interface ModuleActivationSimulationResult {
  readonly disclaimer: LocalizedText;
  readonly selectedCount: number;
  readonly activatableModulesCount: number;
  readonly hbmdEdgeCount: 0;
  readonly moduleOutcomes: readonly SimulatedModuleOutcome[];
  readonly readyCics: readonly SimulatedCicOutcome[];
  readonly inactiveCics: readonly SimulatedCicOutcome[];
  readonly availableFlds: readonly SimulatedFldOutcome[];
  readonly unavailableFlds: readonly SimulatedFldOutcome[];
  readonly architecturalTakeaways: readonly LocalizedText[];
}

export const MODULE_ACTIVATION_SIMULATOR_DISCLAIMER: LocalizedText = {
  ar: 'محاكاة تعليمية للحدود المعمارية المعتمدة في المرحلة 2 فقط — ليست نظام ERP تشغيليًا ولا سير عمل وظيفيًا مُحقّقًا.',
  en: 'Educational simulation of approved architectural boundaries. Not a running ERP implementation or a validated functional workflow.',
};

export const DEFAULT_PLATFORM_PREREQUISITES: PlatformPrerequisiteState = {
  mandatoryPlatformCore: true,
  sharedPartyIdentity: true,
  sharedProductAndUom: true,
  inventoryStorageContext: true,
  fiscalCalendar: true,
  currencyFoundation: true,
};

const CORE_MODULE_IDS: readonly CoreModuleId[] = [
  'finance',
  'inventory-warehouse',
  'procurement',
  'sales-order-management',
];

const SIMULATOR_CICS: readonly {
  readonly contractId: string;
  readonly sourceModuleId: CoreModuleId;
  readonly targetModuleId: CoreModuleId;
  readonly scenario: LocalizedText;
  readonly deferredBoundaryNote?: LocalizedText;
}[] = [
  {
    contractId: 'CIC-CORE-INV-FIN-001',
    sourceModuleId: 'inventory-warehouse',
    targetModuleId: 'finance',
    scenario: {
      ar: 'الأثر المالي لحركات المخزون (Inventory → Finance)',
      en: 'Financial effect of inventory movement (Inventory → Finance)',
    },
    deferredBoundaryNote: {
      ar: 'طرق التقييم والتكلفة (Costing/Valuation) مؤجلة للمرحلة 5/6.',
      en: 'Costing/Valuation mechanics deferred to Phase 5/6.',
    },
  },
  {
    contractId: 'CIC-CORE-PROC-INV-001',
    sourceModuleId: 'procurement',
    targetModuleId: 'inventory-warehouse',
    scenario: {
      ar: 'الاستلام المخزني مقابل أمر الشراء (Procurement → Inventory)',
      en: 'Receipt against PO / Stock Purchase receipt (Procurement → Inventory)',
    },
    deferredBoundaryNote: {
      ar: 'تفاصيل تنسيق الاستلام (Receiving Orchestration) مؤجلة للمرحلة 6.',
      en: 'Receiving orchestration details deferred to Phase 6.',
    },
  },
  {
    contractId: 'CIC-CORE-PROC-FIN-001',
    sourceModuleId: 'procurement',
    targetModuleId: 'finance',
    scenario: {
      ar: 'فاتورة المورد والذمم الدائنة والأثر المالي (Procurement → Finance)',
      en: 'Supplier Invoice / AP / financial effect (Procurement → Finance)',
    },
    deferredBoundaryNote: {
      ar: 'ملكية وتنسيق Invoice Matching مؤجلان للمرحلة 5/6.',
      en: 'Invoice Matching ownership/orchestration deferred to Phase 5/6.',
    },
  },
  {
    contractId: 'CIC-CORE-SALES-INV-001',
    sourceModuleId: 'sales-order-management',
    targetModuleId: 'inventory-warehouse',
    scenario: {
      ar: 'تنفيذ المخزون والتوفر والحجز والصرف (Sales → Inventory)',
      en: 'Stock Fulfillment / Availability / Reservation / Goods Issue (Sales → Inventory)',
    },
    deferredBoundaryNote: {
      ar: 'خوارزميات الحجز Soft/Hard وتنسيق الشحن مؤجلة للمرحلة 6.',
      en: 'Reservation algorithms and shipment orchestration deferred to Phase 6.',
    },
  },
  {
    contractId: 'CIC-CORE-SALES-FIN-001',
    sourceModuleId: 'sales-order-management',
    targetModuleId: 'finance',
    scenario: {
      ar: 'فوترة العميل والذمم المدينة والإيراد والتحصيل (Sales → Finance)',
      en: 'Customer Billing / AR / Revenue / Payment flow (Sales → Finance)',
    },
    deferredBoundaryNote: {
      ar: 'حدود توليد فاتورة العميل (Customer Invoice Generation) مؤجلة للمرحلة 5/6.',
      en: 'Customer Invoice Generation boundary deferred to Phase 5/6.',
    },
  },
  {
    contractId: 'CIC-CORE-SALES-PROC-001',
    sourceModuleId: 'sales-order-management',
    targetModuleId: 'procurement',
    scenario: {
      ar: 'الشحن المباشر / التوريد الخلفي (Drop Ship / Back-to-Back · Sales → Procurement)',
      en: 'Drop Ship / Direct Delivery / Back-to-Back (Sales → Procurement)',
    },
  },
];

const SIMULATOR_FLDS: readonly {
  readonly id: string;
  readonly sourceModuleId: CoreModuleId;
  readonly featureLabel: LocalizedText;
  readonly requiredModules: readonly CoreModuleId[];
  readonly isOwnerDeferred: boolean;
}[] = [
  {
    id: 'FLD-CORE-01',
    sourceModuleId: 'sales-order-management',
    featureLabel: {
      ar: 'Sales · بيع المخزون وتنفيذه (Stock Sale / Stock Fulfillment)',
      en: 'Sales · Stock Sale / Stock Fulfillment',
    },
    requiredModules: ['inventory-warehouse'],
    isOwnerDeferred: false,
  },
  {
    id: 'FLD-CORE-02',
    sourceModuleId: 'sales-order-management',
    featureLabel: {
      ar: 'Sales · فوترة العميل (Customer Billing)',
      en: 'Sales · Customer Billing',
    },
    requiredModules: ['finance'],
    isOwnerDeferred: false,
  },
  {
    id: 'FLD-CORE-03',
    sourceModuleId: 'sales-order-management',
    featureLabel: {
      ar: 'Sales · الشحن المباشر / التوريد الخلفي (Drop Ship / Back-to-Back)',
      en: 'Sales · Drop Ship / Direct Delivery / Back-to-Back',
    },
    requiredModules: ['procurement'],
    isOwnerDeferred: false,
  },
  {
    id: 'FLD-CORE-04',
    sourceModuleId: 'procurement',
    featureLabel: {
      ar: 'Procurement · شراء الأصناف المخزنية (Stock Purchase)',
      en: 'Procurement · Stock Purchase',
    },
    requiredModules: ['inventory-warehouse'],
    isOwnerDeferred: false,
  },
  {
    id: 'FLD-CORE-05',
    sourceModuleId: 'procurement',
    featureLabel: {
      ar: 'Procurement · المطابقة الثلاثية (Three-Way Match · المالك مؤجل)',
      en: 'Procurement · Three-Way Match (Feature Owner: Deferred)',
    },
    requiredModules: ['inventory-warehouse', 'finance'],
    isOwnerDeferred: true,
  },
];

function getMissingRequiredPcds(
  moduleId: CoreModuleId,
  platform: PlatformPrerequisiteState
): readonly string[] {
  const missing: string[] = [];
  if (!platform.mandatoryPlatformCore) {
    missing.push('Mandatory Platform Core (Tenant / Company / Auth / Audit / Config / Integration / Localization)');
  }
  if (moduleId === 'finance') {
    if (!platform.fiscalCalendar) missing.push('Fiscal Calendar / Accounting Period');
    if (!platform.currencyFoundation) missing.push('Currency Foundation');
  } else if (moduleId === 'inventory-warehouse') {
    if (!platform.sharedProductAndUom) missing.push('Shared Product / Item Identity + UOM Foundation');
    if (!platform.inventoryStorageContext) missing.push('Inventory Storage / Fulfillment Context');
  } else if (moduleId === 'procurement') {
    if (!platform.sharedPartyIdentity) missing.push('Shared Supplier / Party Identity');
    if (!platform.currencyFoundation) missing.push('Currency Foundation');
  } else if (moduleId === 'sales-order-management') {
    if (!platform.sharedPartyIdentity) missing.push('Shared Customer / Party Identity');
    if (!platform.sharedProductAndUom) missing.push('Shared Product / Service Identity + UOM Foundation');
    if (!platform.currencyFoundation) missing.push('Currency Foundation');
  }
  return missing;
}

/**
 * Pure, deterministic educational simulator for all 16 combinations of the 4 Core
 * Business Modules + required Platform Capability Dependencies (PCD).
 *
 * Strictly reflects Phase 2 approved rules:
 * - Zero HBMD edges between the 4 Core Modules (every single module can activate alone).
 * - Required PCDs gate base module activation.
 * - FLDs gate specific features only, never base module activation.
 * - CICs become ready only when both participating modules are active and Mandatory Platform Core (Integration Framework) is ready.
 */
export function simulateModuleActivation(
  input: ModuleActivationSimulatorInput
): ModuleActivationSimulationResult {
  const moduleOutcomes: SimulatedModuleOutcome[] = CORE_MODULE_IDS.map((moduleId) => {
    const selected = Boolean(input.selectedModules[moduleId]);
    if (!selected) {
      return {
        moduleId,
        selected: false,
        canActivateBase: false,
        status: 'not-selected',
        missingRequiredPcds: [],
        hbmdBlockers: [],
        explanation: {
          ar: 'النظام غير محدد للتفعيل في هذا السيناريو.',
          en: 'Module is not selected for activation in this scenario.',
        },
      };
    }

    const missingRequiredPcds = getMissingRequiredPcds(moduleId, input.platform);
    const canActivateBase = missingRequiredPcds.length === 0;

    return {
      moduleId,
      selected: true,
      canActivateBase,
      status: canActivateBase ? 'activatable' : 'blocked-by-pcd',
      missingRequiredPcds,
      hbmdBlockers: [],
      explanation: canActivateBase
        ? {
            ar: 'قابل للتفعيل المستقل (Active) — جميع PCD المطلوبة متوفرة ولا يوجد أي HBMD معتمد يمنعه.',
            en: 'Independently activatable (Active) — all required PCDs are ready and 0 approved HBMDs block activation.',
          }
        : {
            ar: `التفعيل الأساسي محجوب بسبب نقص قدرات المنصة المطلوبة (PCD Required): ${missingRequiredPcds.join('، ')} — وليس بسبب أي Business Module آخر.`,
            en: `Base activation blocked by missing Required PCD(s): ${missingRequiredPcds.join(', ')} — NOT by another Business Module.`,
          },
    };
  });

  const activeSet = new Set<CoreModuleId>(
    moduleOutcomes.filter((m) => m.canActivateBase).map((m) => m.moduleId)
  );

  const cicOutcomes: SimulatedCicOutcome[] = SIMULATOR_CICS.map((cic) => {
    const srcActive = activeSet.has(cic.sourceModuleId);
    const tgtActive = activeSet.has(cic.targetModuleId);
    const ready = srcActive && tgtActive && input.platform.mandatoryPlatformCore;

    let reason: LocalizedText;
    if (ready) {
      reason = {
        ar: 'جاهز مفاهيميًا للتكامل المشترك (الطرفان Active وإطار التكامل متاح).',
        en: 'Conceptually ready for cross-module scenario (both modules Active and Platform Integration Framework available).',
      };
    } else if (!srcActive && !tgtActive) {
      reason = {
        ar: 'غير نشط — كلا الطرفين غير مفعّل حاليًا.',
        en: 'Inactive — neither participating module is currently active.',
      };
    } else {
      reason = {
        ar: 'غير جاهز — أحد طرفي العقد غير مفعّل؛ السيناريو المشترك فقط يتوقف ولا يمنع تفعيل الطرف الآخر.',
        en: 'Not ready — one participating module is inactive; only the shared scenario is unavailable, never base activation.',
      };
    }

    return {
      contractId: cic.contractId,
      sourceModuleId: cic.sourceModuleId,
      targetModuleId: cic.targetModuleId,
      scenario: cic.scenario,
      ready,
      reason,
      deferredBoundaryNote: cic.deferredBoundaryNote,
    };
  });

  const fldOutcomes: SimulatedFldOutcome[] = SIMULATOR_FLDS.map((fld) => {
    const sourceActive = activeSet.has(fld.sourceModuleId);
    const missingModules = fld.requiredModules.filter((req) => !activeSet.has(req));
    const available = sourceActive && missingModules.length === 0;

    let reason: LocalizedText;
    if (!sourceActive) {
      reason = {
        ar: 'النظام المصدر للميزة غير مفعّل في هذا السيناريو.',
        en: 'Source module owning this feature is not active in this scenario.',
      };
    } else if (available) {
      reason = {
        ar: 'الميزة متاحة معماريًا (جميع الأنظمة المطلوبة للـ FLD مفعّلة).',
        en: 'Feature architecturally available (all required FLD target modules are active).',
      };
    } else {
      reason = {
        ar: `الميزة غير متاحة (FLD Blocked) لغياب: ${missingModules.join(', ')} — لكن النظام المصدر يبقى Active بالكامل.`,
        en: `Feature unavailable (FLD blocked) because ${missingModules.join(', ')} is inactive — source module remains fully Active.`,
      };
    }

    return {
      id: fld.id,
      sourceModuleId: fld.sourceModuleId,
      featureLabel: fld.featureLabel,
      requiredModules: fld.requiredModules,
      available,
      missingModules,
      reason,
      isOwnerDeferred: fld.isOwnerDeferred,
    };
  });

  const selectedCount = moduleOutcomes.filter((m) => m.selected).length;
  const activatableModulesCount = activeSet.size;
  const readyCics = cicOutcomes.filter((c) => c.ready);
  const inactiveCics = cicOutcomes.filter((c) => !c.ready);
  const availableFlds = fldOutcomes.filter((f) => f.available);
  const unavailableFlds = fldOutcomes.filter((f) => !f.available);

  const architecturalTakeaways: LocalizedText[] = [];
  if (selectedCount === 0) {
    architecturalTakeaways.push({
      ar: 'اختر نظامًا واحدًا أو أكثر لمحاكاة التفعيل المستقل وعقود التكامل المشروط (CIC) واعتماديات مستوى الميزة (FLD).',
      en: 'Select one or more Core Modules to simulate standalone activation, Conditional Integration Contracts (CICs), and Feature-Level Dependencies (FLDs).',
    });
  } else {
    architecturalTakeaways.push({
      ar: `عدد الاعتماديات الصلبة (HBMD) = 0: كل نظام محدد يستطيع العمل بصورة مستقلة تمامًا فور توفر PCD المطلوبة له.`,
      en: 'Approved HBMD count = 0: every selected Core Module can activate independently once its Required PCDs are ready.',
    });
    if (
      activeSet.has('sales-order-management') &&
      !activeSet.has('inventory-warehouse')
    ) {
      architecturalTakeaways.push({
        ar: 'المبيعات تعمل منفردة لبيع الخدمات والبنود غير المخزنية (D-SALES-10)، بينما تتعطل ميزة Stock Sale فقط (FLD) دون تعطيل النظام.',
        en: 'Sales runs standalone for Service/Non-stock sales (D-SALES-10); only the Stock Sale feature is disabled (FLD), never the base module.',
      });
    }
    if (
      activeSet.has('procurement') &&
      !activeSet.has('finance')
    ) {
      architecturalTakeaways.push({
        ar: 'المشتريات تدير أوامر الشراء والخدمات منفردة، لكن فواتير الموردين وAP والسداد خارج نطاقها المستقل وتتطلب Finance (D-PROC-05).',
        en: 'Procurement handles POs and services standalone, while Supplier Invoices, AP, and Payments require Finance (D-PROC-05).',
      });
    }
    if (
      activeSet.has('inventory-warehouse') &&
      !activeSet.has('finance')
    ) {
      architecturalTakeaways.push({
        ar: 'المخزون يدير الأرصدة والحركات كميًا فقط بدون GL؛ وتُؤجل آلية Opening Valuation عند تفعيل المالية لاحقًا إلى المرحلة 6.',
        en: 'Inventory manages quantities and movements without GL; Opening Valuation upon later Finance activation is deferred to Phase 6.',
      });
    }
  }

  return {
    disclaimer: MODULE_ACTIVATION_SIMULATOR_DISCLAIMER,
    selectedCount,
    activatableModulesCount,
    hbmdEdgeCount: 0,
    moduleOutcomes,
    readyCics,
    inactiveCics,
    availableFlds,
    unavailableFlds,
    architecturalTakeaways,
  };
}
