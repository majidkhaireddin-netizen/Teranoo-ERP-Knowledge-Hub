import type { LocalizedText } from '@/content/models/types';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';

export interface ModuleSourceAnchorRef {
  readonly sectionLabel: LocalizedText;
  readonly sectionAnchor: string;
}

export interface ModuleBusinessProblemItem {
  readonly title: LocalizedText;
  readonly explanation: LocalizedText;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface ModuleFutureDesignImpactItem {
  readonly area: LocalizedText;
  readonly approvedConstraint: LocalizedText;
  readonly deferredToPhase: LocalizedText;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface ModulePurposeAndImpactProfile {
  readonly whyModuleExists: LocalizedText;
  readonly whyModuleExistsSourceRef: ModuleSourceAnchorRef;
  readonly businessProblemsAddressed: readonly ModuleBusinessProblemItem[];
  readonly futureDesignImplications: readonly ModuleFutureDesignImpactItem[];
}

export interface ModuleDesignReasoningEntry {
  readonly id: string;
  readonly topic: LocalizedText;
  readonly officialReasoning: LocalizedText;
  readonly educationalInterpretation: LocalizedText | null;
  readonly architecturalImplication: LocalizedText;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface ModuleAbsentPeerScenario {
  readonly absentPeerName: LocalizedText;
  readonly absentPeerCode: string;
  readonly standaloneBehavior: LocalizedText;
  readonly unavailableCapabilities: LocalizedText;
  readonly bridgeContractOrFld: string;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface ModuleOwnershipBoundaryRow {
  readonly domainConcept: LocalizedText;
  readonly moduleOwns: LocalizedText;
  readonly consumesOrReferences: LocalizedText;
  readonly otherModulesOwn: LocalizedText;
  readonly unresolvedBoundary: LocalizedText;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface ModuleDeferredBoundaryRationale {
  readonly topic: LocalizedText;
  readonly targetPhase: LocalizedText;
  readonly whyDeferredInSource: LocalizedText;
  readonly approvedPhase2Boundary: LocalizedText;
  readonly sourceRef: ModuleSourceAnchorRef;
}

export interface DecisionEducationalDetail {
  readonly decisionId: string;
  readonly educationalExplanation: LocalizedText;
  readonly architecturalImplication: LocalizedText;
  readonly relevantLimitations: LocalizedText;
  readonly relatedSourceSections: readonly ModuleSourceAnchorRef[];
}

export interface ModuleEducationalDepthBundle {
  readonly moduleId: CoreModuleId;
  readonly purposeAndImpact: ModulePurposeAndImpactProfile;
  readonly designReasoning: readonly ModuleDesignReasoningEntry[];
  readonly absentPeerScenarios: readonly ModuleAbsentPeerScenario[];
  readonly ownershipBoundaryMatrix: readonly ModuleOwnershipBoundaryRow[];
  readonly deferredBoundaryRationales: readonly ModuleDeferredBoundaryRationale[];
  readonly decisionDetails: Readonly<Record<string, DecisionEducationalDetail>>;
}

export const MODULE_EDUCATIONAL_DEPTH_BUNDLES: Readonly<
  Record<CoreModuleId, ModuleEducationalDepthBundle>
> = {
  finance: {
    moduleId: 'finance',
    purposeAndImpact: {
      whyModuleExists: {
        ar: 'يوجد نظام المالية والمحاسبة (Finance) بوصفه وحدة أعمال أساسية مستقلة (First-Class Sellable Module) مسؤولة عن السجل المالي النهائي، الترحيل إلى الأستاذ العام (GL Posting)، والالتزامات والذمم المالية (AP/AR)، بحيث تستطيع المنشأة تشغيل المحاسبة الرسمية داخل بيئة الشركة والكيان القانوني والتقويم المالي دون الاضطرار إلى شراء أو تفعيل المخزون أو المشتريات أو المبيعات.',
        en: 'Finance exists as a First-Class Sellable Core Business Module responsible for final financial records, General Ledger posting, and financial liabilities/receivables (AP/AR). It enables an enterprise to operate formal accounting within a Company/Legal Entity and Fiscal Calendar context without being forced to license or activate Inventory, Procurement, or Sales.',
      },
      whyModuleExistsSourceRef: {
        sectionLabel: { ar: '§1 تعريف Finance داخل المنتج', en: '§1 Module Definition' },
        sectionAnchor: 'kh-h-1-تعريف-finance-داخل-المنتج',
      },
      businessProblemsAddressed: [
        {
          title: {
            ar: 'تشغيل محاسبي مستقل للعملاء غير المخزنيين أو المرحليين',
            en: 'Standalone Accounting for Service-Only or Phased Adopters',
          },
          explanation: {
            ar: 'يمكّن العملاء الذين يحتاجون الأستاذ العام والقيود المباشرة والذمم الأساسية فقط من تفعيل Finance منفردًا فوق قدرات المنصة المشتركة، دون فرض وحدات تشغيلية لا يحتاجونها.',
            en: 'Allows organizations needing core GL, direct journals, and financial tracking to activate Finance independently over Mandatory Platform Foundation without forcing unused operational modules.',
          },
          sourceRef: {
            sectionLabel: { ar: '§3 التشغيل المنفرد للمالية', en: '§3 Standalone Capabilities' },
            sectionAnchor: 'kh-h-3-ما-يستطيع-finance-فعله-عند-تشغيله-منفردا',
          },
        },
        {
          title: {
            ar: 'حماية سلامة الأستاذ العام من الكتابة المباشرة للأنظمة التشغيلية',
            en: 'Protecting General Ledger Integrity from Direct Operational Writes',
          },
          explanation: {
            ar: 'يمنع تسرب الكتابة المباشرة من حركات المخزون أو أوامر الشراء أو أوامر البيع إلى الدفاتر المحاسبية، ويجعل الترحيل المالي محصورًا في المالية عبر عقود تكامل مشروطة.',
            en: 'Prevents Inventory movements, Purchase Orders, or Sales Orders from mutating ledger entries directly, channeling cross-module financial effects exclusively through explicit Conditional Integration Contracts.',
          },
          sourceRef: {
            sectionLabel: { ar: '§6 حدود التكامل مع Business Core Modules', en: '§6 Core Module Boundaries' },
            sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
          },
        },
        {
          title: {
            ar: 'حفظ السجل المالي التاريخي ضد الحذف المدمر',
            en: 'Preserving Historical Financial Auditability Under Freeze, not Delete',
          },
          explanation: {
            ar: 'يمنع تعطيل أو إيقاف الوحدة من حذف القيود والمعاملات المالية بعد نشوء تاريخ مالي، ويفصل بين إيقاف التفاعلات الجديدة وسلامة التاريخ.',
            en: 'Prevents module deactivation from deleting historical transactions once financial postings exist, enforcing Freeze, not Delete and requiring explicit integration handling.',
          },
          sourceRef: {
            sectionLabel: { ar: '§7.2 قواعد الإيقاف Freeze, not Delete', en: '§7.2 Deactivation Rules' },
            sectionAnchor: 'kh-h-72-deactivation',
          },
        },
      ],
      futureDesignImplications: [
        {
          area: {
            ar: 'تعدد الشركات والفروع (Multi-Company & Multi-Branch)',
            en: 'Multi-Company & Multi-Branch Structure',
          },
          approvedConstraint: {
            ar: 'يجب أن تنتمي كل حركة مالية إلى Company / Legal Entity صريح، وألا يُفترض أن Tenant = Company واحدة، وأن يُبنى النظام كـ Branch-capable by design مع معاملة Intercompany وConsolidation كقدرات صريحة لا تلقائية.',
            en: 'Every financial transaction must belong to an explicit Company/Legal Entity; Tenant ≠ single Company; system must be Branch-capable by design; Intercompany and Consolidation must be explicit capabilities.',
          },
          deferredToPhase: {
            ar: 'المرحلة 3 (Platform & Tenancy Model): هل Branch إلزامي على كل قيد؟ وهل له P&L مستقل؟',
            en: 'Phase 3 (Platform & Tenancy Model): whether Branch is mandatory per entry or an accounting P&L unit.',
          },
          sourceRef: {
            sectionLabel: { ar: '§8 أثر Multi-Company وMulti-Branch', en: '§8 Multi-Company & Multi-Branch' },
            sectionAnchor: 'kh-h-8-أثر-multi-company-وmulti-branch-كمتطلبات',
          },
        },
        {
          area: {
            ar: 'إطار العملات والضرائب (Currency & Tax Foundations)',
            en: 'Currency & Tax Foundations',
          },
          approvedConstraint: {
            ar: 'Base/Functional Currency مطلوبة لكل شركة، والمنصة تدعم Multi-Currency دون فرض أسعار الصرف على كل عميل. أما الضرائب فالاتجاه المقترح هو Shared Platform Capability تستهلكها المالية والمبيعات والمشتريات بدل تكرارها داخل المالية.',
            en: 'Base/Functional Currency is required per company; multi-currency is platform-capable without forcing exchange rates on single-currency tenants. Tax is proposed as a Shared Platform Capability consumed by Finance, Sales, and Procurement.',
          },
          deferredToPhase: {
            ar: 'المرحلة 5: تصميم إطار العملات والقرار المعماري النهائي لملكية محرك الضرائب.',
            en: 'Phase 5: Currency Framework design and final architectural placement of the Tax Engine.',
          },
          sourceRef: {
            sectionLabel: { ar: '§9 أثر Currency وTax كاعتماد', en: '§9 Currency & Tax Implications' },
            sectionAnchor: 'kh-h-9-أثر-currency-وtax-كاعتماد',
          },
        },
        {
          area: {
            ar: 'سياسات التفعيل والتجميد والترحيل الوظيفي (Phase 6 Blueprint)',
            en: 'Functional Blueprint & Deactivation Mechanics (Phase 6)',
          },
          approvedConstraint: {
            ar: 'تلتزم جميع المخططات الوظيفية القادمة (GL, AP, AR, Cash, Assets, Close) بألا تفترض وجود المخزون أو المشتريات أو المبيعات لتشغيلها الأساسي، وأن تحترم Freeze, not Delete.',
            en: 'Upcoming Phase 6 Functional Blueprints (GL, AP, AR, Cash, Assets, Close) must remain operable without requiring Inventory, Procurement, or Sales and enforce Freeze, not Delete.',
          },
          deferredToPhase: {
            ar: 'المرحلة 6 (Finance Functional Blueprint) والمرحلة 5 (Integration Execution Model).',
            en: 'Phase 6 (Finance Functional Blueprint) and Phase 5 (Integration Execution Model).',
          },
          sourceRef: {
            sectionLabel: { ar: '§10 الحدود والاستبعادات و§11 المؤجلات', en: '§10 Exclusions & §11 Deferred' },
            sectionAnchor: 'kh-h-10-حدود-الدراسة-والاستبعادات-الصريحة',
          },
        },
      ],
    },
    designReasoning: [
      {
        id: 'fin-reason-gl-authority',
        topic: {
          ar: 'ملكية المالية الحصرية للترحيل المحاسبي النهائي (Financial Ledger Posting)',
          en: 'Finance Exclusive Ownership of Final Financial Ledger Posting',
        },
        officialReasoning: {
          ar: 'تُثبت الوثيقة في §6.1 و§6.2 و§6.3 أن Inventory يملك الكميات والحركات وProcurement يملك أوامر الشراء وSales تملك أوامر البيع، بينما يملك Finance الأثر المالي المعتمد والسلطة النهائية على الكتابة في السجل المالي/الأستاذ العام. ويُقرأ هذا مع §11 (البند 6) الذي يعامل Single Posting Authority كمرشح معماري قوي إلى أن تكتمل دراسة الوحدات الأربع (وقد ترسخ ذلك في مصفوفة المرحلة 2).',
          en: 'Sections §6.1–§6.3 establish that Inventory owns physical quantities, Procurement owns POs, and Sales owns Sales Orders, while Finance owns the approved financial effect and final authority over ledger writing. Section §11 item 6 notes Single Posting Authority as a Strong Architecture Candidate confirmed across the four Core Module studies.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: لو سُمح لكل وحدة تشغيلية بإنشاء قيود GL مباشرة داخل جداول المحاسبة، لحدث تضارب في توازن القيد المزدوج، وانكسرت قابلية التدقيق عند إيقاف أو تعديل وحدة فرعية، ولاستحال تشغيل المالية كنظام مستقل لأن قواعد المحاسبة ستصبح مبعثرة عبر وحدات غير مفعّلة.',
          en: 'Educational Interpretation: Allowing operational modules to write directly to ledger tables would scatter accounting rules across optional modules, threaten double-entry consistency, and break standalone Finance operation whenever peer modules are disabled.',
        },
        architecturalImplication: {
          ar: 'أي حركة مخزنية أو فاتورة مشتريات أو مبيعات تُنتج حدثًا أو مرجعًا عبر CIC، ولا تصبح قيدًا في الأستاذ إلا من خلال بوابة وحدود المالية.',
          en: 'Operational movements, purchases, and sales emit contract-governed events or references via CICs; only Finance materializes Financial Ledger Postings.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.1 المالية ↔ المخزون و§11 (6)', en: '§6.1 Finance ↔ Inventory & §11 (6)' },
          sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
        },
      },
      {
        id: 'fin-reason-standalone-pcd',
        topic: {
          ar: 'قاعدة Module Dependency ≠ Integration Requirement والاعتماد على المنصة',
          en: 'Module Dependency ≠ Integration Requirement & Platform-Based Dependency',
        },
        officialReasoning: {
          ar: 'تنص §2 و§4 صراحةً على أن وجود تدفق بيانات أو Accounting Event بين وحدتين لا يعني أن إحداهما Hard Dependency للأخرى. التفعيل المستقل لـ Finance يعتمد فقط على قدرات المنصة المطلوبة (Tenant، Company، Users/Roles، Audit، Fiscal Calendar، Base Currency، Reporting، Configuration) مع تمييز القدرات المشروطة بسيناريو العميل مثل Tax وExchange Rates وShared Party.',
          en: 'Sections §2 and §4 distinguish platform capability existence from business module dependency: data flow or accounting events never convert peer business modules into Hard Dependencies. Base activation depends only on Required Platform Capabilities while scenario-driven capabilities (Tax, Exchange Rates, Shared Party) remain conditional.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: التمييز بين نوعين من الاعتماد — اعتماد المنصة (PCD) مقابل تكامل الأعمال (CIC) — هو جوهر البنية المعيارية: كل وحدة تحتاج أرضية تشغيلية من المنصة (هوية، شركة، صلاحيات، تدقيق)، لكنها لا تفترض وجود وحدة تجارية موازية ما لم يشغّل العميل سيناريو عابرًا للوحدات.',
          en: 'Educational Interpretation: Separating Platform Capability Dependencies (PCD) from Cross-Module Integration Contracts (CIC) keeps the core modular: every module relies on shared platform infrastructure, never on peer business modules unless a cross-module scenario is enabled.',
        },
        architecturalImplication: {
          ar: 'يتم تفعيل المالية بنجاح مع 0 HBMD، ولا يمنع غياب المخزون أو المشتريات أو المبيعات إنشاء شركة أو تشغيل قيود ودفاتر مالية.',
          en: 'Finance activates cleanly with 0 HBMDs; absence of Inventory, Procurement, or Sales never blocks financial ledger setup.',
        },
        sourceRef: {
          sectionLabel: { ar: '§2 الاستقلالية و§4 اعتماديات المنصة', en: '§2 Independence & §4 Platform Dependencies' },
          sectionAnchor: 'kh-h-قاعدة-معمارية-معتمدة',
        },
      },
      {
        id: 'fin-reason-shared-party',
        topic: {
          ar: 'فصل هوية الطرف المشتركة (Shared Party) عن السياق المالي داخل المالية',
          en: 'Separating Shared Party Identity from Financial Party Context',
        },
        officialReasoning: {
          ar: 'تنص §6.2 و§6.3 وD-FIN-05 على أن المالية لا تملك وحدها هوية العميل أو المورد ولا تنشئ نسخة معزولة مكررة منها، بل تستهلك Shared Party Identity عند استخدام AP/AR وتحتفظ بالسياق المالي المرتبط بالذمم والالتزامات والمدفوعات.',
          en: 'Sections §6.2, §6.3, and D-FIN-05 prohibit Finance from duplicating isolated Customer/Supplier masters; Finance consumes Shared Party Identity when AP/AR is used and owns only the financial liability/receivable/payment context.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: لو خزّنت المالية نسخة مستقلة للعملاء والموردين وخزّنت المبيعات والمشتريات نسخًا أخرى، لتعارضت البيانات عند تفعيل أكثر من وحدة؛ فصل الهوية المشتركة (Shared Master) عن السياقات الوظيفية (Commercial vs Financial) يحل التعارض دون خلق اعتمادية صلبة بين الوحدات.',
          en: 'Educational Interpretation: Duplicating party masters per module creates synchronization drift when modules combine; splitting Shared Party Identity from module-owned commercial/financial contexts prevents duplication without introducing HBMD coupling.',
        },
        architecturalImplication: {
          ar: 'تبقى Party Identity ضمن Shared Platform Master Data (بمشروطية PCD في المالية)، بينما تملك المالية AP/AR/Payment Context فقط.',
          en: 'Party Identity remains a Conditional PCD for Finance, while Finance strictly owns AP, AR, and financial payment contexts.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.2–6.3 وD-FIN-05 حدود المسؤولية', en: '§6.2–6.3 & D-FIN-05 Boundary' },
          sectionAnchor: 'kh-h-62-finance-procurement',
        },
      },
    ],
    absentPeerScenarios: [
      {
        absentPeerName: { ar: 'غياب المخزون (Inventory)', en: 'Without Inventory' },
        absentPeerCode: 'MOD-INV',
        standaloneBehavior: {
          ar: 'تعمل المالية بصورة كاملة للأستاذ العام والقيود اليدوية والتقارير المالية وAP/AR والمدفوعات غير المرتبطة بحركات مخزنية.',
          en: 'Finance operates fully for GL, manual journals, financial statements, and non-stock AP/AR/payments.',
        },
        unavailableCapabilities: {
          ar: 'يتوقف الترحيل المالي الآلي لحركات الاستلام والصرف المخزني وتقييم المخزون الآلي.',
          en: 'Automated financial postings triggered by stock receipts, issues, and inventory movements are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-INV-FIN-001',
        sourceRef: {
          sectionLabel: { ar: '§6.1 المالية ↔ المخزون', en: '§6.1 Finance ↔ Inventory' },
          sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
        },
      },
      {
        absentPeerName: { ar: 'غياب المشتريات (Procurement)', en: 'Without Procurement' },
        absentPeerCode: 'MOD-PROC',
        standaloneBehavior: {
          ar: 'يمكن تسجيل فواتير الموردين المباشرة (عند اعتماد AP في المرحلة 6) وإدارة الذمم الدائنة والمدفوعات داخل المالية مباشرةً.',
          en: 'Direct supplier invoices (once AP is specified in Phase 6), liabilities, and supplier payments can be recorded directly inside Finance.',
        },
        unavailableCapabilities: {
          ar: 'تغيب دورة Requisition / RFQ / Purchase Order ومراجع الـ PO ومطابقة فواتير الشراء مع أوامر الشراء.',
          en: 'Requisition, RFQ, Purchase Order references, and PO-linked invoice matching are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-PROC-FIN-001',
        sourceRef: {
          sectionLabel: { ar: '§6.2 المالية ↔ المشتريات', en: '§6.2 Finance ↔ Procurement' },
          sectionAnchor: 'kh-h-62-finance-procurement',
        },
      },
      {
        absentPeerName: { ar: 'غياب المبيعات (Sales)', en: 'Without Sales' },
        absentPeerCode: 'MOD-SALES',
        standaloneBehavior: {
          ar: 'تعمل الذمم المدينة والتحصيل والقيود المالية المباشرة في المالية دون الحاجة إلى أوامر بيع.',
          en: 'AR tracking, customer collections, and direct revenue/accounting journals operate without Sales Orders.',
        },
        unavailableCapabilities: {
          ar: 'تغيب الفوترة الآتية من عروض الأسعار وأوامر البيع وميزة Customer Billing المربوطة بأوامر البيع.',
          en: 'Sales-order-driven Customer Billing and commercial commitment references from Sales are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-FIN-001 + FLD Customer Billing',
        sourceRef: {
          sectionLabel: { ar: '§6.3 المالية ↔ المبيعات', en: '§6.3 Finance ↔ Sales' },
          sectionAnchor: 'kh-h-63-finance-sales-order-management',
        },
      },
    ],
    ownershipBoundaryMatrix: [
      {
        domainConcept: {
          ar: 'الأستاذ العام والترحيل المحاسبي النهائي (GL & Financial Posting)',
          en: 'General Ledger & Final Financial Posting',
        },
        moduleOwns: {
          ar: 'الترحيل المحاسبي النهائي، السجلات والدفاتر المالية، والتوازن المحاسبي.',
          en: 'Final Financial Ledger Posting, accounting records, and ledger balance integrity.',
        },
        consumesOrReferences: {
          ar: 'التقويم المالي، العملة الأساسية، سياق الشركة، وحدث/مرجع CIC من الوحدات الأخرى.',
          en: 'Fiscal Calendar, Base Currency, Company Context, and CIC event/reference triggers.',
        },
        otherModulesOwn: {
          ar: 'المخزون/المشتريات/المبيعات تملك الحدث التشغيلي الأصلي فقط دون كتابة مباشرة في GL.',
          en: 'Inventory/Procurement/Sales own originating operational records only; zero direct GL writes.',
        },
        unresolvedBoundary: {
          ar: 'تفاصيل Chart of Accounts وPosting Rules ونمط Real-Time مقابل Batch (المرحلة 5/6).',
          en: 'Chart of Accounts structure, posting rules, and Real-Time vs Batch execution (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.1–6.3 و§10', en: '§6.1–6.3 & §10' },
          sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
        },
      },
      {
        domainConcept: {
          ar: 'الذمم الدائنة والمدينة والمدفوعات (AP / AR / Payments)',
          en: 'Accounts Payable, Receivable & Payments',
        },
        moduleOwns: {
          ar: 'الذمم الدائنة (AP)، الالتزام المالي، السداد/التحصيل، الذمم المدينة (AR)، والأثر المالي للإيراد.',
          en: 'AP liabilities, Supplier Invoices (financial effect), AR receivables, collections, and revenue postings.',
        },
        consumesOrReferences: {
          ar: 'Shared Party Identity ومراجع PO / الاستلام / Sales Order عند تفعيل التكامل.',
          en: 'Shared Party Identity plus PO / Receipt / Sales Order references when CICs are active.',
        },
        otherModulesOwn: {
          ar: 'Procurement يملك PO وقبول الخدمة؛ Sales يملك Sales Order؛ Inventory يملك الاستلام/الصرف الكمي.',
          en: 'Procurement owns PO & service acceptance; Sales owns SO; Inventory owns physical receipt/issue.',
        },
        unresolvedBoundary: {
          ar: 'مكان توليد فاتورة العميل (Customer Invoice Generation) وملكية/تنسيق Invoice Matching (المرحلة 5/6).',
          en: 'Customer Invoice generation placement and Invoice Matching ownership/orchestration (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.2–6.3 وحدود AP/AR', en: '§6.2–6.3 AP/AR Boundaries' },
          sectionAnchor: 'kh-h-62-finance-procurement',
        },
      },
      {
        domainConcept: {
          ar: 'هوية العميل والمورد والمنتج (Shared Identities vs Context)',
          en: 'Customer, Supplier & Product Identities vs Contexts',
        },
        moduleOwns: {
          ar: 'السياق المالي للطرف (Financial Supplier/Customer Context) فقط.',
          en: 'Financial Party Context (AP/AR/payment/credit controls) only.',
        },
        consumesOrReferences: {
          ar: 'Shared Party Identity من المنصة عند استخدام AP/AR (PCD Conditional).',
          en: 'Shared Platform Party Identity when AP/AR functions are active (Conditional PCD).',
        },
        otherModulesOwn: {
          ar: 'المنصة تملك الهوية الأساسية المشتركة؛ Procurement/Sales يملكان السياق التجاري؛ Inventory يملك سياق المخزون.',
          en: 'Platform owns Shared Party/Item identities; Procurement/Sales own commercial contexts; Inventory owns stock context.',
        },
        unresolvedBoundary: {
          ar: 'نطاق وتفاصيل ملكية صفات الطرف (حسابات بنكية، ضرائب، شروط سداد) في المرحلة 5/6.',
          en: 'Detailed attribute-level ownership (bank accounts, tax info, payment terms) in Phase 5/6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§11 (4) وD-FIN-05', en: '§11 (4) & D-FIN-05' },
          sectionAnchor: 'kh-h-11-القرارات-المفتوحة-والمؤجلة',
        },
      },
      {
        domainConcept: {
          ar: 'محرك الضرائب وتقييم المخزون (Tax & Inventory Costing/Valuation)',
          en: 'Tax Engine & Inventory Costing/Valuation',
        },
        moduleOwns: {
          ar: 'الأثر المحاسبي النهائي والترحيل في الأستاذ عند اعتماده.',
          en: 'Final GL accounting impact once posted.',
        },
        consumesOrReferences: {
          ar: 'Tax Foundation (مشروطة بالتشريع) وأحداث القيمة من المخزون عبر CIC-CORE-INV-FIN-001.',
          en: 'Tax Foundation (conditional) and movement financial effects via CIC-CORE-INV-FIN-001.',
        },
        otherModulesOwn: {
          ar: 'Inventory يملك الكمية الفيزيائية ويمكنه حفظ تكلفة تشغيلية محليًا.',
          en: 'Inventory owns physical quantities and may retain operational cost/value locally.',
        },
        unresolvedBoundary: {
          ar: 'ملكية Tax Engine النهائية (Shared Platform vs Finance) وملكية حساب Costing/Valuation (Shared Candidate) مؤجلة للمرحلة 5/6.',
          en: 'Final Tax Engine ownership (Shared Platform candidate) and Costing/Valuation ownership deferred to Phase 5/6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.1 و§9 الضرائب', en: '§6.1 & §9 Tax' },
          sectionAnchor: 'kh-h-9-أثر-currency-وtax-كاعتماد',
        },
      },
    ],
    deferredBoundaryRationales: [
      {
        topic: {
          ar: 'تصميم الأستاذ العام ودفاتر AP / AR والعمليات المالية (GL, AP, AR, Close)',
          en: 'Detailed GL, Chart of Accounts, AP/AR Processes & Close',
        },
        targetPhase: { ar: 'المرحلة 6 — Finance Functional Blueprint', en: 'Phase 6 — Finance Functional Blueprint' },
        whyDeferredInSource: {
          ar: 'تهدف المرحلة 2 فقط لتثبيت موقع المالية واستقلاليتها وحدود التكامل دون خلط المعمارية العليا بتفاصيل الشاشات وأنواع القيود وجداول البيانات.',
          en: 'Phase 2 strictly establishes module placement, standalone readiness, and boundaries without prematurely locking COA schemas, screens, or journal rules.',
        },
        approvedPhase2Boundary: {
          ar: 'يملك Finance الـ GL Posting والـ AP/AR والمدفوعات، بينما تُصمم قواعدها الوظيفية في المرحلة 6 دون خلق HBMD.',
          en: 'Finance owns GL Posting and AP/AR/Payments conceptually; functional rules will be designed in Phase 6 without introducing HBMDs.',
        },
        sourceRef: {
          sectionLabel: { ar: '§1 و§10 الاستبعادات الصريحة', en: '§1 & §10 Explicit Exclusions' },
          sectionAnchor: 'kh-h-10-حدود-الدراسة-والاستبعادات-الصريحة',
        },
      },
      {
        topic: {
          ar: 'ملكية حساب Costing وInventory Valuation وتوقيت الترحيل (Real-Time vs Batch)',
          en: 'Costing/Valuation Ownership & Integration Execution Timing',
        },
        targetPhase: { ar: 'المرحلة 5 (Integration/API) والمرحلة 6', en: 'Phase 5 (Integration/API) & Phase 6' },
        whyDeferredInSource: {
          ar: 'تشير §6.1 و§11 (7) إلى أن طرق التكلفة (FIFO/AVCO) وتوقيت تنفيذ الأحداث بين المخزون والمالية تحتاج رؤية متكاملة للأنظمة الأربعة وهيكل API/Events في المرحلة 5.',
          en: 'Sections §6.1 and §11 (7) note that valuation methods and event/batch/real-time transport belong to Phase 5 Integration Architecture after all four Core Modules are aligned.',
        },
        approvedPhase2Boundary: {
          ar: 'Inventory يملك الكمية والحركة، وFinance يملك الأثر المالي النهائي في GL؛ ولا يُسمح لأي وحدة غير المالية بالكتابة المباشرة في الأستاذ.',
          en: 'Inventory owns quantities/movements; Finance owns final GL effect; zero direct GL writes from non-Finance modules.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.1 و§11 المؤجلات', en: '§6.1 & §11 Deferred Items' },
          sectionAnchor: 'kh-h-11-القرارات-المفتوحة-والمؤجلة',
        },
      },
      {
        topic: {
          ar: 'ملكية Tax Engine وتصميم Multi-Company / Branch / License Freeze Mechanics',
          en: 'Tax Engine Ownership, Branch Rules & Deactivation Read-Only Policy',
        },
        targetPhase: { ar: 'المرحلة 3 (Tenancy) والمرحلة 5 (Platform/Currency/Tax)', en: 'Phase 3 (Tenancy) & Phase 5 (Platform)' },
        whyDeferredInSource: {
          ar: 'تعتمد قرارات Branch وإتاحة الوصول التاريخي Read-Only بعد انتهاء الترخيص على نموذج Tenancy والحوكمة العامة للمنصة، بينما يتطلب Tax Framework دراسة تشريعية ومعمارية عبر الوحدات.',
          en: 'Branch mandatory rules and post-license historical read-only access belong to Tenancy/Platform governance, while Tax Framework requires cross-module architectural alignment in Phase 5.',
        },
        approvedPhase2Boundary: {
          ar: 'الاتجاه المقترح لـ Tax هو Shared Platform Capability، ومبدأ Freeze, not Delete يحمي التاريخ المالي من الحذف نهائيًا.',
          en: 'Tax is proposed as a Shared Platform Capability, and Freeze, not Delete permanently protects financial history from deletion.',
        },
        sourceRef: {
          sectionLabel: { ar: '§7.2 و§8 و§9', en: '§7.2, §8 & §9' },
          sectionAnchor: 'kh-h-72-deactivation',
        },
      },
    ],
    decisionDetails: {
      'D-FIN-01': {
        decisionId: 'D-FIN-01',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يقرّر هذا البند أن المالية منتج تجاري ومعماري مستقل بذاته (First-Class Sellable) يمكن بيعه وتفعيله وحده دون تغليفه داخل حزمة إجبارية مع بقية الوحدات.',
          en: 'Educational Interpretation: Establishes Finance as an independently marketable and deployable core capability rather than an embedded sub-layer forced to bundle with operational modules.',
        },
        architecturalImplication: {
          ar: 'تُصمم حدود المالية وقدراتها الأساسية بحيث لا تتطلب جداول أو شاشات أو خدمات تجارية من المخزون أو المشتريات أو المبيعات لتعمل.',
          en: 'Finance architecture must operate core GL and financial workflows without requiring runtime artifacts from Inventory, Procurement, or Sales.',
        },
        relevantLimitations: {
          ar: 'لا يعني الاستقلال تحديد الوظائف التفصيلية للأستاذ العام أو الذمم أو الأصول في المرحلة 2؛ كل ذلك مؤجل إلى Phase 6.',
          en: 'Does not specify detailed GL, AP, AR, Fixed Assets, or Financial Close workflows; those remain deferred to Phase 6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§1 تعريف Finance', en: '§1 Finance Definition' }, sectionAnchor: 'kh-h-1-تعريف-finance-داخل-المنتج' },
          { sectionLabel: { ar: '§3 التشغيل المنفرد', en: '§3 Standalone Capability' }, sectionAnchor: 'kh-h-3-ما-يستطيع-finance-فعله-عند-تشغيله-منفردا' },
        ],
      },
      'D-FIN-02': {
        decisionId: 'D-FIN-02',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يترجم D-FIN-01 إلى قاعدة هندسية حازمة تمنع أي اعتمادية تفعيل صلبة (0 HBMD) من المالية نحو أي وحدة أعمال أخرى حتى لو تكاملت معها مستقبلاً.',
          en: 'Educational Interpretation: Translates D-FIN-01 into a strict architectural constraint: zero Hard Business Module Dependencies from Finance toward any peer business module.',
        },
        architecturalImplication: {
          ar: 'عند بناء نموذج التفعيل (Activation Simulator / Runtime Lifecycle)، يبقى Finance قابلًا للتفعيل حتى مع غياب بقية الوحدات الأربع وCRM وHCM والمشاريع.',
          en: 'Module activation logic must keep Finance activatable even when Inventory, Procurement, Sales, CRM, HCM, and Projects are all inactive.',
        },
        relevantLimitations: {
          ar: 'عدم وجود HBMD لا يعني إمكانية تنفيذ التكاملات الآلية عبر الوحدات في غياب الوحدات المقابلة؛ التكاملات المشتركة تتعطل بأمان حتى تُفعّل أطرافها.',
          en: 'Zero HBMD does not provide automated stock or order posting when peer modules are absent; shared workflows wait for peer activation.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§2 مدى استقلالية Finance', en: '§2 Finance Independence' }, sectionAnchor: 'kh-h-2-مدى-استقلالية-finance' },
        ],
      },
      'D-FIN-03': {
        decisionId: 'D-FIN-03',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يضع مبدأ أن استقلال المالية عن الوحدات التجارية يقوم على وجود قاعدة منصة مشتركة (Platform Foundation)، مع الفصل بين قدرات وجودها إلزامي دائمًا وقدرات يُطلب تفعيلها بحسب سيناريو العميل.',
          en: 'Educational Interpretation: Establishes that module independence rests on a shared Platform Foundation, separating universally required platform capabilities from scenario-conditional ones.',
        },
        architecturalImplication: {
          ar: 'يفحص النظام عند تفعيل المالية وجود Tenant وCompany والصلاحيات والتدقيق والتقويم المالي والعملة الأساسية والتقارير والتهيئة فقط، ولا يجبر كل عميل على Exchange Rates أو Tax إذا لم يستخدمها.',
          en: 'Activation gating checks only Required PCDs (Tenant, Company, Auth/RBAC, Audit, Fiscal Calendar, Base Currency, Reporting, Config) without forcing conditional PCDs prematurely.',
        },
        relevantLimitations: {
          ar: 'حد صريح في §4.3: القرار يعتمد مبدأ الاعتماد على المنصة ولا يصمم هيكلة Tenant أو Multi-Company أو محرك الضرائب أو العملات التفصيلي.',
          en: 'Explicit §4.3 limit: adopts the dependency principle only without designing Tenancy, Branch, Currency, or Tax engines.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§4.1–4.3 اعتماديات المنصة وحدود القرار', en: '§4.1–4.3 PCDs & Limits' }, sectionAnchor: 'kh-h-43-حدود-قرار-d-fin-03' },
        ],
      },
      'D-FIN-04': {
        decisionId: 'D-FIN-04',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يفصل بين الحاجة إلى التفعيل الأساسي وبين الحاجة إلى التبادل المالي عند تفعيل نظامين معًا؛ فعقد التكامل (CIC) يُستدعى فقط لتشغيل السيناريو المشترك.',
          en: 'Educational Interpretation: Separates base activation from cross-module data exchange; a Conditional Integration Contract activates strictly for the shared scenario requiring it.',
        },
        architecturalImplication: {
          ar: 'تُنمذج العلاقات بين المالية وكل من المخزون والمشتريات والمبيعات عبر عقود CIC صريحة (CIC-CORE-INV/PROC/SALES-FIN-001) بدل الارتباط الصامت.',
          en: 'Cross-module accounting flows are modeled as explicit CICs (INV-FIN, PROC-FIN, SALES-FIN) rather than implicit tight coupling.',
        },
        relevantLimitations: {
          ar: 'آليات التنفيذ التقنية (Real-Time مقابل Event/Batch) ومالك العقد الفعلي لم يُحسما في المرحلة 2 ويؤجلان للمرحلة 5.',
          en: 'Transport mechanics (Real-Time vs Event/Batch) and Phase 5 operational Contract Owners remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6 حدود التكامل مع الوحدات', en: '§6 Integration Boundaries' }, sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management' },
        ],
      },
      'D-FIN-05': {
        decisionId: 'D-FIN-05',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يرسخ مبدأ «مصدر الحقيقة الواحد» (Single Source of Truth) بمنع المالية من استنساخ سجلات الأصناف أو الأطراف أو المستندات التشغيلية داخلها.',
          en: 'Educational Interpretation: Enforces Single Source of Truth by forbidding Finance from cloning operational stock/order documents or duplicating Shared Party/Item masters.',
        },
        architecturalImplication: {
          ar: 'تحتفظ المالية بالسياق المالي فقط وتستهلك معرفات Shared Party/Item أو مراجع المستندات التشغيلية دون امتلاكها.',
          en: 'Finance stores only financial contexts while referencing shared master identities and operational document IDs.',
        },
        relevantLimitations: {
          ar: 'يحسم القرار منع التكرار وتوزيع المسؤوليات فقط؛ أما التصميم التفصيلي لنموذج Shared Party وملكية صفاته فيؤجل إلى المرحلة 5.',
          en: 'Resolves non-duplication and responsibility boundaries only; detailed Shared Party/Item schemas await Phase 5.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6.2–6.3 و§11 (4)', en: '§6.2–6.3 & §11 (4)' }, sectionAnchor: 'kh-h-63-finance-sales-order-management' },
        ],
      },
      'D-FIN-06': {
        decisionId: 'D-FIN-06',
        educationalExplanation: {
          ar: 'تفسير تعليمي: قاعدة محاسبية ورقابية أساسية تضمن عدم مسح الدفتر المالي أو كسر توازن الحسابات إذا أوقف العميل الوحدة بعد استخدامها.',
          en: 'Educational Interpretation: Safeguards financial auditability and ledger balance by ensuring module deactivation freezes new postings instead of erasing posted history.',
        },
        architecturalImplication: {
          ar: 'يتطلب إيقاف المالية انتقالها لحالة Frozen مع إيقاف صريح للتدفقات المالية الآتية من الوحدات المتكاملة.',
          en: 'Deactivation transitions Finance to Frozen state and requires peer integrated modules to stop emitting unacknowledged financial events.',
        },
        relevantLimitations: {
          ar: 'تفاصيل القراءة فقط بعد انتهاء الترخيص، سياسات الأرشفة والاحتفاظ، وتفاصيل إعادة التفعيل مؤجلة للمراحل اللاحقة.',
          en: 'Post-license Read-Only access, retention/archive policies, and reactivation workflows remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§7.2 قواعد الإيقاف', en: '§7.2 Deactivation' }, sectionAnchor: 'kh-h-72-deactivation' },
        ],
      },
    },
  },

  'inventory-warehouse': {
    moduleId: 'inventory-warehouse',
    purposeAndImpact: {
      whyModuleExists: {
        ar: 'يوجد نظام المخزون وإدارة المستودعات ليكون المالك الحصري للكمية المتوفرة فعليًا (On-hand Quantity)، حركات المخزون الفيزيائية، وسجلات الحجز المخزني (Reservation Records وفق مزامنة D-SALES-06)، مع تمكين المنشآت من تتبع الأرصدة والتحويلات والجرد والتشغيل المستودعي بصورة مستقلة تمامًا عن المحاسبة والمشتريات والمبيعات.',
        en: 'Inventory & Warehouse Management exists as the exclusive owner of physical On-hand Quantity, Inventory Movements, and Physical Reservation Records (aligned with D-SALES-06). It allows businesses to track stock balances, transfers, adjustments, and warehouse operations independently without requiring Finance, Procurement, or Sales.',
      },
      whyModuleExistsSourceRef: {
        sectionLabel: { ar: '§1 تعريف Inventory داخل المنتج', en: '§1 Module Definition' },
        sectionAnchor: 'kh-h-1-تعريف-inventory-warehouse-management-داخل-المنتج',
      },
      businessProblemsAddressed: [
        {
          title: {
            ar: 'إدارة كميات ومستودعات مستقلة دون فرض نظام محاسبة أو بيع',
            en: 'Standalone Stock & Warehouse Operations Without Accounting/Order Coupling',
          },
          explanation: {
            ar: 'تستطيع المنشآت تتبع الأرصدة والحركات والتحويلات والجرد داخل سياق تخزيني واضح، مع الاحتفاظ بمعلومات تكلفة/قيمة تشغيلية عند الحاجة دون اشتراط وجود ترحيل GL.',
            en: 'Supports stock balances, transfers, adjustments, and stocktaking within explicit storage contexts, optionally retaining operational cost/value info without requiring GL posting.',
          },
          sourceRef: {
            sectionLabel: { ar: '§3 ما يستطيع Inventory فعله منفردًا', en: '§3 Standalone Capabilities' },
            sectionAnchor: 'kh-h-3-ما-يستطيع-inventory-فعله-عند-تشغيله-منفردا',
          },
        },
        {
          title: {
            ar: 'منع تشتت ملكية الأرصدة والحجز بين المبيعات والمشتريات والمالية',
            en: 'Preventing Split Stock & Reservation Ownership Across Peer Modules',
          },
          explanation: {
            ar: 'تحصر الوثيقة (ومزامنة D-SALES-06) تعديل On-hand وحفظ سجل الحجز المخزني داخل المخزون حصريًا؛ فأمر البيع يطلب الحجز وأمر الشراء ينتج استلامًا عبر CIC فقط.',
            en: 'Centralizes On-hand mutation and Reservation Record ownership strictly in Inventory (per D-SALES-06); Sales requests reservations and Procurement triggers receipts via CICs without touching stock directly.',
          },
          sourceRef: {
            sectionLabel: { ar: '§6.3 المخزون ↔ المبيعات (الحجز)', en: '§6.3 Inventory ↔ Sales (Reservation)' },
            sectionAnchor: 'kh-h-63-inventory-sales',
          },
        },
        {
          title: {
            ar: 'منع انغلاق هوية الصنف داخل وحدة المخزون أو خلط WMS المتقدم بالنواة',
            en: 'Preventing Item Master Monopolization & Uncontrolled WMS Coupling',
          },
          explanation: {
            ar: 'تُعرَّف هوية الصنف (Product/Item) كبيانات منصة مشتركة لئلا تصبح المبيعات والمشتريات تابعتين صلبًا للمخزون، كما تفصل الوثيقة بين Inventory Core وWarehouse Execution وAdvanced WMS.',
            en: 'Keeps Product/Item Identity in Shared Platform Master Data so Sales and Procurement avoid HBMD on Inventory, while separating Inventory Core, Warehouse Execution, and optional Advanced WMS.',
          },
          sourceRef: {
            sectionLabel: { ar: '§5 حدود الصنف و§7 طبقات المستودعات', en: '§5 Item Master & §7 WMS Layering' },
            sectionAnchor: 'kh-h-7-inventory-vs-warehouse-management-boundary',
          },
        },
      ],
      futureDesignImplications: [
        {
          area: {
            ar: 'الطبقات الثلاث للمخزون والمستودعات (D-INV-07)',
            en: 'Three-Tier Inventory & Warehouse Layering (D-INV-07)',
          },
          approvedConstraint: {
            ar: 'الفصل المفاهيمي بين Inventory Core (Book Stock والحركات)، وWarehouse Execution، وAdvanced WMS (الذي لا يُفترض جزءًا إلزاميًا من النواة ويمكن تغليفه لاحقًا كـ Feature Tier أو Add-on دون إعادة فتح D-INV-07).',
            en: 'Conceptual separation between Inventory Core (Book Stock & movements), Warehouse Execution, and optional Advanced WMS (which may evolve into an add-on or tier without altering Book Stock ownership).',
          },
          deferredToPhase: {
            ar: 'التغليف التجاري وحزم WMS المتقدمة بعد تحديد السوق الأول وPhase 6 Functional Blueprint.',
            en: 'Packaging/licensing of Advanced WMS after Primary Launch Market & Phase 6 Functional Blueprint.',
          },
          sourceRef: {
            sectionLabel: { ar: '§7 Inventory vs Warehouse Boundary', en: '§7 Inventory vs Warehouse Boundary' },
            sectionAnchor: 'kh-h-7-inventory-vs-warehouse-management-boundary',
          },
        },
        {
          area: {
            ar: 'تقييم المخزون والرصيد الافتتاحي المالي (Costing & Opening Valuation)',
            en: 'Costing / Valuation & Later Finance Opening State',
          },
          approvedConstraint: {
            ar: 'يبقى Costing/Valuation التزامًا معماريًا مؤجلًا (Deferred Architecture Commitment). وإذا عُمل المخزون منفردًا ثم فُعّل Finance لاحقًا، فيجب وجود آلية موثقة لبدء التقييم المالي من الحالة الراهنة.',
            en: 'Costing/Valuation remains a Deferred Architecture Commitment. Later Finance activation after Inventory-only operation must provide a documented Opening Valuation handoff.',
          },
          deferredToPhase: {
            ar: 'المرحلة 5/6 لحسم ملكية Costing، وPhase 6/Implementation لآليات Opening Valuation.',
            en: 'Phase 5/6 for Costing ownership; Phase 6/Implementation for Opening Valuation mechanics.',
          },
          sourceRef: {
            sectionLabel: { ar: '§9 Costing & Valuation Boundary', en: '§9 Costing & Valuation Boundary' },
            sectionAnchor: 'kh-h-9-costing-valuation-boundary',
          },
        },
        {
          area: {
            ar: 'هيكل الشركات والفروع والمستودعات (Multi-Company & Owner Dimension)',
            en: 'Multi-Company, Branch & Warehouse Ownership',
          },
          approvedConstraint: {
            ar: 'يجب أن يمتلك كل رصيد مخزني Owner تنظيميًا واضحًا وأن يدعم فصل التوفر والأرصدة عبر الشركات مع تعامل صريح مع حركات Intercompany وIn-Transit.',
            en: 'Every stock balance requires an explicit organizational owner, company-level availability separation, and explicit Intercompany/In-Transit movement handling.',
          },
          deferredToPhase: {
            ar: 'المرحلة 3 لحسم علاقة Warehouse مع Company/Branch وOwner Dimension.',
            en: 'Phase 3 for Warehouse-to-Company/Branch mapping and Owner Dimension.',
          },
          sourceRef: {
            sectionLabel: { ar: '§8 Multi-Company Implications', en: '§8 Multi-Company Implications' },
            sectionAnchor: 'kh-h-8-multi-company-multi-branch-implications',
          },
        },
      ],
    },
    designReasoning: [
      {
        id: 'inv-reason-qty-vs-gl',
        topic: {
          ar: 'فصل ملكية الكميات والحركات عن الترحيل إلى الأستاذ العام (D-INV-06)',
          en: 'Separating Physical Quantity & Movements from GL Posting (D-INV-06)',
        },
        officialReasoning: {
          ar: 'تحسم §6.1 و§9 وD-INV-06 أن المخزون يملك On-hand والحركات الفيزيائية ويمكنه الاحتفاظ ببيانات تكلفة/قيمة تشغيلية عند التشغيل المنفرد، بينما لا يكتب أبدًا مباشرةً في الأستاذ العام بل ينقل الأثر المالي عبر CIC إلى Finance.',
          en: 'Sections §6.1, §9, and D-INV-06 assign On-hand and physical movements to Inventory (allowing operational cost/value tracking standalone) while prohibiting direct GL writes and routing accounting effects via CIC to Finance.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: الدمج القسري بين تتبع الكميات في المستودعات وبين قيود اليومية المحاسبية يجبر المستودعات على التوقف عند إغلاق الفترات المالية أو غياب المالية؛ فصل الملكيتين يحرر التشغيل المستودعي ويحمي سلامة الدفاتر.',
          en: 'Educational Interpretation: Hard-wiring warehouse movements directly into GL posting tables couples physical stock operations to accounting modules; separating quantity ownership from GL posting enables standalone inventory operation.',
        },
        architecturalImplication: {
          ar: 'تُصمم حركات المخزون ككيانات كمية مستقلة تُطلق عند الحاجة عقد CIC-CORE-INV-FIN-001 فقط إذا كانت المالية مفعّلة.',
          en: 'Inventory movements remain quantity-first entities that emit CIC-CORE-INV-FIN-001 only when Finance integration is active.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.1 و§9 الحدود المالية والتقييمية', en: '§6.1 & §9 Financial/Costing Boundary' },
          sectionAnchor: 'kh-h-61-inventory-finance',
        },
      },
      {
        id: 'inv-reason-shared-item',
        topic: {
          ar: 'عدم احتكار Product / Item Master داخل المخزون (D-INV-05)',
          en: 'Non-Monopolized Shared Product / Item Master (D-INV-05)',
        },
        officialReasoning: {
          ar: 'تنص §5 صراحةً على أن Product / Item Identity جزء من Shared Platform Master Data وليس ملكية حصرية للمخزون؛ فالمخزون يضيف Inventory Context فقط، بينما يضيف Sales وProcurement سياقاتهما على نفس الهوية المشتركة.',
          en: 'Section §5 establishes Product/Item Identity as Shared Platform Master Data rather than an Inventory-exclusive master; Inventory owns only its Inventory Context while Sales and Procurement add their own contexts.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: لو كان Product Master مملوكًا حصريًا للمخزون، لاستحال بيع خدمات أو شراء بنود غير مخزنية في Sales أو Procurement دون تفعيل المخزون، وهو ما ينسف مبدأ 0 HBMD. رفع تعريف الصنف إلى مستوى المنصة يجعل الخدمات والسلع تشترك في تعريف منضبط دون تبعية صلبة.',
          en: 'Educational Interpretation: If Inventory owned Product Master exclusively, Sales and Procurement could not reference products/services without activating Inventory, creating an HBMD. Elevating Item Identity to Shared Platform Data preserves 0 HBMD.',
        },
        architecturalImplication: {
          ar: 'يستهلك المخزون Shared Item/Product Master كـ Required PCD، بينما يبقى حرًا في تحديد Inventory Context الخاص بالتخزين لاحقًا.',
          en: 'Inventory requires Shared Item/Product Master as a Required PCD while scoping its owned domain strictly to Inventory Item Context.',
        },
        sourceRef: {
          sectionLabel: { ar: '§5 Shared Item / Product Master Boundary', en: '§5 Shared Item / Product Master' },
          sectionAnchor: 'kh-h-5-shared-item-product-master-boundary',
        },
      },
      {
        id: 'inv-reason-reservation-sync',
        topic: {
          ar: 'حسم ملكية سجل الحجز المخزني (Reservation Record) للمخزون عبر D-SALES-06',
          en: 'Reservation Record Ownership Resolved to Inventory (D-SALES-06 Sync)',
        },
        officialReasoning: {
          ar: 'توضح §6.3 وملاحظة المزامنة في §14 أن دراسة Sales اللاحقة (D-SALES-06) أغلقت الجدل لصالح جعل Reservation Record Ownership من نصيب Inventory، بحيث يطلب Sales الحجز أو ينسّقه عبر CIC بينما يملك Inventory سجل الكمية المحجوزة وتعديلها.',
          en: 'Sections §6.3 and §14 confirm that D-SALES-06 resolved reservation record ownership strictly to Inventory: Sales requests/coordinates reservation intent while Inventory owns and mutates the Physical Reservation Record.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: تجميع كل القيود المؤثرة على الكمية المتاحة (On-hand + Reservations) عند مالك واحد يمنع تضارب الحجوزات عند تعدد قنوات الطلب (مبيعات، تصنيع، مشاريع، تحويلات مستودعية).',
          en: 'Educational Interpretation: Keeping both On-hand and Reservation Records under one authoritative owner prevents overselling or race conditions across multiple future demand sources (Sales, Manufacturing, Projects, Transfers).',
        },
        architecturalImplication: {
          ar: 'لا يحتفظ Sales Order بسجلات خصم كمي خاصة به، بل يعتمد على CIC-CORE-SALES-INV-001 لطلب الحجز والتأكد من التوفر.',
          en: 'Sales Orders never mutate stock availability directly; reservations execute through CIC-CORE-SALES-INV-001.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.3 المخزون ↔ المبيعات و§14', en: '§6.3 Inventory ↔ Sales & §14' },
          sectionAnchor: 'kh-h-63-inventory-sales',
        },
      },
    ],
    absentPeerScenarios: [
      {
        absentPeerName: { ar: 'غياب المالية (Finance)', en: 'Without Finance' },
        absentPeerCode: 'MOD-FIN',
        standaloneBehavior: {
          ar: 'يعمل المخزون لإدارة الكميات والأرصدة والحركات والتحويلات والجرد، ويمكنه حفظ تكلفة/قيمة تشغيلية محلية.',
          en: 'Inventory manages stock balances, movements, transfers, and stocktaking, optionally retaining operational cost/value.',
        },
        unavailableCapabilities: {
          ar: 'لا توجد قيود أستاذ عام (GL) أو تقييم محاسبي مالي؛ وعند تفعيل المالية لاحقًا يلزم مسار Opening Valuation موثق.',
          en: 'No GL postings or financial inventory accounting; activating Finance later requires a documented Opening Valuation path.',
        },
        bridgeContractOrFld: 'CIC-CORE-INV-FIN-001',
        sourceRef: {
          sectionLabel: { ar: '§6.1 و§9', en: '§6.1 & §9' },
          sectionAnchor: 'kh-h-61-inventory-finance',
        },
      },
      {
        absentPeerName: { ar: 'غياب المشتريات (Procurement)', en: 'Without Procurement' },
        absentPeerCode: 'MOD-PROC',
        standaloneBehavior: {
          ar: 'تنفّذ الحركات الناشئة من المخزون (Inventory-originated receipts/adjustments/transfers) بصورة طبيعية.',
          en: 'Inventory-originated receipts, adjustments, and transfers operate independently.',
        },
        unavailableCapabilities: {
          ar: 'يغيب الاستلام المربوط بأمر شراء (Receipt against PO) والمطابقة الثلاثية (Three-Way Match).',
          en: 'PO-linked Goods Receipts and Three-Way Match receipt coordination are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-PROC-INV-001 + FLD Stock Purchase / 3-Way Match',
        sourceRef: {
          sectionLabel: { ar: '§6.2 المخزون ↔ المشتريات', en: '§6.2 Inventory ↔ Procurement' },
          sectionAnchor: 'kh-h-62-inventory-procurement',
        },
      },
      {
        absentPeerName: { ar: 'غياب المبيعات (Sales)', en: 'Without Sales' },
        absentPeerCode: 'MOD-SALES',
        standaloneBehavior: {
          ar: 'يدير المخزون عمليات الصرف والتحويل والجرد الداخلية دون اشتراط أوامر بيع.',
          en: 'Inventory executes internal issues, transfers, and stocktaking without Sales Orders.',
        },
        unavailableCapabilities: {
          ar: 'تغيب طلبات الحجز والصرف الناشئة من أوامر البيع (Stock Sale & Stock Fulfillment).',
          en: 'Sales-order-driven reservation requests and stock fulfillment workflows are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-INV-001 + FLD Stock Sale',
        sourceRef: {
          sectionLabel: { ar: '§6.3 المخزون ↔ المبيعات', en: '§6.3 Inventory ↔ Sales' },
          sectionAnchor: 'kh-h-63-inventory-sales',
        },
      },
    ],
    ownershipBoundaryMatrix: [
      {
        domainConcept: {
          ar: 'الرصيد الفعلي وحركات المخزون (On-hand Quantity & Movements)',
          en: 'On-hand Quantity & Inventory Movements',
        },
        moduleOwns: {
          ar: 'الكمية الفعلية المتوفرة، سجل الحركات، والحالة التشغيلية للاستلام/الصرف/التحويل.',
          en: 'On-hand Quantity, Inventory Movement history, and operational stock receipt/issue/transfer state.',
        },
        consumesOrReferences: {
          ar: 'Shared Product/Item Master وUOM Foundation وInventory Storage Context وCompany Context.',
          en: 'Shared Product/Item Master, UOM Foundation, Storage Context, and Company Context.',
        },
        otherModulesOwn: {
          ar: 'Sales يملك Ordered/Confirmed Qty؛ Procurement يملك PO Ordered Qty؛ Finance يملك GL Posting.',
          en: 'Sales owns Ordered/Confirmed Qty; Procurement owns PO Ordered Qty; Finance owns GL Posting.',
        },
        unresolvedBoundary: {
          ar: 'تبعية Warehouse لـ Company أم Branch وهل يتشارك أكثر من فرع مستودعًا واحدًا (المرحلة 3).',
          en: 'Warehouse mapping to Company vs Branch and shared warehouse Owner Dimension (Phase 3).',
        },
        sourceRef: {
          sectionLabel: { ar: '§6 و§8', en: '§6 & §8' },
          sectionAnchor: 'kh-h-8-multi-company-multi-branch-implications',
        },
      },
      {
        domainConcept: {
          ar: 'سجل الحجز المخزني (Physical Reservation Record)',
          en: 'Physical Reservation Record',
        },
        moduleOwns: {
          ar: 'سجل الكمية المحجوزة وتعديلها وتأثيرها على التوفر (محسوم عبر D-SALES-06).',
          en: 'Reservation Record storage, mutation, and stock availability impact (confirmed via D-SALES-06).',
        },
        consumesOrReferences: {
          ar: 'طلب الحجز ومرجع أمر البيع من Sales عبر CIC-CORE-SALES-INV-001.',
          en: 'Reservation request and Sales Order reference via CIC-CORE-SALES-INV-001.',
        },
        otherModulesOwn: {
          ar: 'Sales يملك Sales Order ونية التنسيق فقط.',
          en: 'Sales owns only the Sales Order and reservation coordination intent.',
        },
        unresolvedBoundary: {
          ar: 'خوارزميات Soft vs Hard Reservation وأولويات التخصيص (Allocation Priority) مؤجلة للمرحلة 6.',
          en: 'Soft vs Hard Reservation rules and Allocation Priority algorithms deferred to Phase 6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6.3 و§12 (6)', en: '§6.3 & §12 (6)' },
          sectionAnchor: 'kh-h-63-inventory-sales',
        },
      },
      {
        domainConcept: {
          ar: 'هوية الصنف مقابل سياق الصنف المخزني (Item Identity vs Context)',
          en: 'Product/Item Identity vs Inventory Context',
        },
        moduleOwns: {
          ar: 'Inventory Operational Item Context فقط.',
          en: 'Inventory Operational Item Context only.',
        },
        consumesOrReferences: {
          ar: 'Shared Item / Product Master من المنصة (Required PCD).',
          en: 'Shared Platform Item / Product Master (Required PCD).',
        },
        otherModulesOwn: {
          ar: 'المنصة تملك الهوية الأساسية؛ Sales يملك Sales Context؛ Procurement يستعمله عند الحاجة.',
          en: 'Platform owns core Item Identity; Sales owns Sales Context; Procurement consumes conditionally.',
        },
        unresolvedBoundary: {
          ar: 'نموذج Product Master التفصيلي، Lot/Serial ownership، وProduct vs Item terminology (المرحلة 5/6).',
          en: 'Detailed Product Master schema, Lot/Serial ownership, and Product vs Item naming (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§5 حدود الصنف المشترك', en: '§5 Shared Item Boundary' },
          sectionAnchor: 'kh-h-5-shared-item-product-master-boundary',
        },
      },
      {
        domainConcept: {
          ar: 'التكلفة والتقييم المالي للمخزون (Costing & Valuation)',
          en: 'Costing & Inventory Valuation',
        },
        moduleOwns: {
          ar: 'بيانات تكلفة/قيمة تشغيلية عند التشغيل بدون المالية.',
          en: 'Operational cost/value data when operating without Finance.',
        },
        consumesOrReferences: {
          ar: 'Currency / Exchange Rates عند التقييم متعدد العملات (Conditional PCD).',
          en: 'Currency / Exchange Rates when multi-currency valuation applies (Conditional PCD).',
        },
        otherModulesOwn: {
          ar: 'Finance يملك الأثر المالي النهائي وGL Posting.',
          en: 'Finance owns final financial effect and GL Posting.',
        },
        unresolvedBoundary: {
          ar: 'ملكية محرك Costing/Valuation نفسه، طرق FIFO/AVCO/Standard، Landed Cost، وOpening Valuation مؤجلة للمرحلة 5/6.',
          en: 'Costing/Valuation engine ownership, methods, Landed Cost, and Opening Valuation deferred to Phase 5/6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§9 Costing & Valuation Boundary', en: '§9 Costing Boundary' },
          sectionAnchor: 'kh-h-9-costing-valuation-boundary',
        },
      },
    ],
    deferredBoundaryRationales: [
      {
        topic: {
          ar: 'ملكية وآليات التكلفة والتقييم (Costing & Valuation & Landed Cost)',
          en: 'Costing, Inventory Valuation & Landed Cost Ownership',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6 (التزام معماري مؤجل)', en: 'Phase 5 / Phase 6 (Deferred Architecture Commitment)' },
        whyDeferredInSource: {
          ar: 'تذكر §9 أن الأبحاث المقارنة تعرض نماذج عالمية متباينة (بعضها يضع التقييم أقرب للمحاسبة وبعضها للمخزون)، لذا يتطلب الحسم اكتمال عقود التكامل المالي في المرحلة 5.',
          en: 'Section §9 notes that global ERP benchmarks split costing ownership between Inventory and Finance; final placement requires Phase 5 integration contract alignment.',
        },
        approvedPhase2Boundary: {
          ar: 'الكمية والحركة ملك المخزون، والقيد في GL ملك المالية؛ والتأجيل التزام معماري صريح لا إهمال.',
          en: 'Quantity/movements belong to Inventory and GL belongs to Finance; costing remains an explicit Deferred Architecture Commitment.',
        },
        sourceRef: {
          sectionLabel: { ar: '§9 Costing & Valuation Boundary', en: '§9 Costing Boundary' },
          sectionAnchor: 'kh-h-9-costing-valuation-boundary',
        },
      },
      {
        topic: {
          ar: 'نطاق وحزم Advanced WMS وتفاصيل التنفيذ المستودعي',
          en: 'Advanced WMS Packaging & Warehouse Execution Workflows',
        },
        targetPhase: { ar: 'بعد Primary Launch Market / المرحلة 6', en: 'Post-Launch Market Gate / Phase 6' },
        whyDeferredInSource: {
          ar: 'تثبت §7 حدود المسؤوليات الثلاثية مع إبقاء Packaging وLicensing مرنَين حتى تحديد القطاع الأول واحتياجات السوق في Pick/Pack/Putaway/Barcode.',
          en: 'Section §7 locks responsibility layering while keeping commercial packaging and deep execution workflows (Pick/Pack/Putaway/Barcode) flexible until Launch Market and Phase 6.',
        },
        approvedPhase2Boundary: {
          ar: 'Inventory Core ثابت كمالك للكمية والحركات؛ لا يُفترض Advanced WMS جزءًا إجباريًا في النواة.',
          en: 'Inventory Core permanently owns Book Stock and movements; Advanced WMS is never forced into mandatory core.',
        },
        sourceRef: {
          sectionLabel: { ar: '§7 Inventory vs Warehouse Boundary', en: '§7 WMS Layering' },
          sectionAnchor: 'kh-h-7-inventory-vs-warehouse-management-boundary',
        },
      },
      {
        topic: {
          ar: 'خوارزميات الحجز والتخصيص وتوقيت التكامل وهيكل المستودعات',
          en: 'Reservation/Allocation Algorithms, Sync Timing & Warehouse Hierarchy',
        },
        targetPhase: { ar: 'المرحلة 3 (Hierarchy) والمرحلة 5 (API) والمرحلة 6 (Algorithms)', en: 'Phase 3, Phase 5 & Phase 6' },
        whyDeferredInSource: {
          ar: 'تحتاج علاقات Warehouse-to-Branch حسم المرحلة 3، ويحتاج Soft/Hard Reservation منطق الأعمال التفصيلي في المرحلة 6.',
          en: 'Warehouse-Branch hierarchy depends on Phase 3 Tenancy, while Soft/Hard reservation and allocation priorities belong to Phase 6 functional logic.',
        },
        approvedPhase2Boundary: {
          ar: 'Reservation Record Ownership محسوم للمخزون عبر D-SALES-06 دون حسم الخوارزميات مبكرًا.',
          en: 'Reservation Record ownership is settled for Inventory (D-SALES-06) without premature algorithmic lock-in.',
        },
        sourceRef: {
          sectionLabel: { ar: '§11 و§12 المؤجلات', en: '§11 & §12 Deferred' },
          sectionAnchor: 'kh-h-12-القرارات-المفتوحة-والمؤجلة',
        },
      },
    ],
    decisionDetails: {
      'D-INV-01': {
        decisionId: 'D-INV-01',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يؤكد أن نظام المخزون والمستودعات قابل للترخيص والتشغيل الأساسي كمنتج مستقل دون إلزام العميل بشراء المالية أو المشتريات أو المبيعات.',
          en: 'Educational Interpretation: Establishes Inventory & Warehouse Management as an independently sellable and operational module without bundling Finance, Procurement, or Sales.',
        },
        architecturalImplication: {
          ar: 'يجب أن تدعم قدرات المخزون الأساسية إنشاء الأرصدة والحركات والتحويلات والجرد بالاعتماد على المنصة فقط.',
          en: 'Core inventory capabilities must support stock balances, movements, transfers, and stocktaking over platform capabilities alone.',
        },
        relevantLimitations: {
          ar: 'حد القرار الصريح: لا يعني ذلك اعتبار Advanced WMS جزءًا إجباريًا من الوحدة؛ عمق قدرات المستودعات يُحسم لاحقًا.',
          en: 'Explicit limit: does not make Advanced WMS mandatory inside the core package; warehouse execution depth is decided later.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§1 تعريف Inventory', en: '§1 Inventory Definition' }, sectionAnchor: 'kh-h-1-تعريف-inventory-warehouse-management-داخل-المنتج' },
          { sectionLabel: { ar: '§3 التشغيل المنفرد', en: '§3 Standalone Capability' }, sectionAnchor: 'kh-h-3-ما-يستطيع-inventory-فعله-عند-تشغيله-منفردا' },
        ],
      },
      'D-INV-02': {
        decisionId: 'D-INV-02',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يرسخ مبدأ 0 HBMD بحيث لا يضع أي اعتماد صلب على المالية أو المبيعات أو المشتريات أو التصنيع أو المشاريع كشرط لتفعيل المخزون.',
          en: 'Educational Interpretation: Locks 0 HBMD for Inventory so neither Finance, Procurement, Sales, Manufacturing, nor Projects can block base activation.',
        },
        architecturalImplication: {
          ar: 'تبقى حركات المخزون الداخلية صالحة ومكتملة كميًا حتى عندما تكون الوحدات التجارية الأخرى في حالة Inactive.',
          en: 'Inventory-originated movements operate cleanly even when all peer business modules remain Inactive.',
        },
        relevantLimitations: {
          ar: 'السيناريوهات التي تتطلب مراجع تجارية أو مالية (استلام PO، صرف SO، ترحيل GL) تتوقف ميزاتها المشروطة فقط عند غياب الطرف المقابل.',
          en: 'Cross-module features (PO receipt, SO fulfillment, GL posting) stay unavailable until the peer module and CIC are active.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§2 مدى استقلالية Inventory', en: '§2 Inventory Independence' }, sectionAnchor: 'kh-h-2-مدى-استقلالية-inventory' },
        ],
      },
      'D-INV-03': {
        decisionId: 'D-INV-03',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يوضح أن تشغيل المخزون منفردًا يستند إلى أرضية منصة تتضمن Shared Item/Product Master وUOM وStorage Context وCompany Context دون افتراض شكل التخزين التفصيلي.',
          en: 'Educational Interpretation: Grounds Inventory independence in Required Platform Capabilities (Shared Item Master, UOM, Storage Context, Company Context) without designing hierarchy details yet.',
        },
        architecturalImplication: {
          ar: 'تشترط بوابة التفعيل وجود Shared Item Master وUOM وStorage Context وTenant/Company/RBAC/Audit، بينما تبقى Branch وCurrency/Exchange Rates وTax مشروطة.',
          en: 'Activation gating validates Required PCDs including Shared Item/UOM/Storage Context, while Branch, Currency, and Tax remain conditional.',
        },
        relevantLimitations: {
          ar: 'حد القرار (§4.3): لا يصمم التسلسل الهرمي لـ Warehouse/Location أو نموذج Product Master أو محرك التكلفة.',
          en: 'Explicit limit (§4.3): does not design Warehouse/Location hierarchies, Product Master schemas, or Costing engines.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§4 اعتماديات المنصة', en: '§4 Platform Dependencies' }, sectionAnchor: 'kh-h-41-required-platform-capabilities' },
        ],
      },
      'D-INV-04': {
        decisionId: 'D-INV-04',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يؤكد أن الاستلام من المشتريات والصرف للمبيعات والترحيل للمالية روابط تكامل مشروطة بالسيناريو (CIC) وليست تبعية هيكلية.',
          en: 'Educational Interpretation: Confirms that PO receiving, SO fulfillment, and GL financial effects are scenario-triggered CICs, never structural dependencies.',
        },
        architecturalImplication: {
          ar: 'تنعزل واجهات التكامل الثلاث في عقود محددة (INV-FIN وPROC-INV وSALES-INV) مستقلة عن دورة التفعيل الأساسية.',
          en: 'Cross-module exchanges are isolated inside INV-FIN, PROC-INV, and SALES-INV contracts independent of base activation.',
        },
        relevantLimitations: {
          ar: 'تفاصيل التنسيق الفعلي لحالات القبول والرفض والمرتجع والشحن مؤجلة إلى Functional Blueprints.',
          en: 'Detailed orchestration states (accepted/rejected/returned/shipping) await Phase 6 Functional Blueprints.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6 حدود التكامل', en: '§6 Integration Boundaries' }, sectionAnchor: 'kh-h-62-inventory-procurement' },
        ],
      },
      'D-INV-05': {
        decisionId: 'D-INV-05',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يقطع الطريق أمام خطأ شائع في أنظمة ERP وهو جعل سجل الصنف ملكًا للمخزون؛ بل هو تعريف منصة مشترك يأخذ منه المخزون سياقه التشغيلي فقط.',
          en: 'Educational Interpretation: Prevents the classic ERP coupling trap of locking Product/Item Master inside Inventory; Inventory adds only stock context onto a shared platform identity.',
        },
        architecturalImplication: {
          ar: 'يمنح Sales وProcurement حرية التعامل مع Shared Product/Item دون اشتراط تفعيل Inventory.',
          en: 'Enables Sales and Procurement to consume Shared Product/Item without introducing an HBMD on Inventory.',
        },
        relevantLimitations: {
          ar: 'حد القرار: تفاصيل Product vs Item وUOM hierarchy وLot/Serial ownership وSellable/Purchasable flags مؤجلة للمرحلة 5/6.',
          en: 'Limit: Product vs Item naming, UOM hierarchy, Lot/Serial ownership, and item flags remain deferred to Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§5 حدود الصنف المشترك', en: '§5 Shared Item Boundary' }, sectionAnchor: 'kh-h-5-shared-item-product-master-boundary' },
        ],
      },
      'D-INV-06': {
        decisionId: 'D-INV-06',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يرسم الخط الفاصل بين الفيزياء والمحاسبة: المخزون يملك الرصيد والحركة والتكلفة التشغيلية عند الحاجة، والمالية تملك القيد النهائي، والتقييم المالي التزام مؤجل.',
          en: 'Educational Interpretation: Separates physical tracking from accounting: Inventory owns physical quantities and optional operational cost; Finance owns GL posting; Costing ownership stays explicitly deferred.',
        },
        architecturalImplication: {
          ar: 'يُمنع المخزون من إنشاء قيود أستاذ مباشرًا، ويجب تصميم نقطة تسليم Opening Valuation عند تفعيل المالية لاحقًا.',
          en: 'Forbids direct GL writes from Inventory and mandates a documented Opening Valuation handoff when Finance is activated later.',
        },
        relevantLimitations: {
          ar: 'طرق Costing (FIFO/AVCO) وPeriodic vs Perpetual وLanded Cost غير محسومة في المرحلة 2.',
          en: 'Costing methods, Periodic/Perpetual accounting, and Landed Cost are outside Phase 2 scope.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6.1 و§9 حدود التكلفة والتقييم', en: '§6.1 & §9 Costing Boundary' }, sectionAnchor: 'kh-h-9-costing-valuation-boundary' },
        ],
      },
      'D-INV-07': {
        decisionId: 'D-INV-07',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يحمي نواة المخزون من تضخم ميزات المستودعات المتقدمة عبر فرض فصل مفاهيمي ثلاثي الطبقات مع إبقاء التغليف التجاري مرنًا.',
          en: 'Educational Interpretation: Protects Inventory Core from Advanced WMS scope creep using a three-layer conceptual split while keeping packaging flexible.',
        },
        architecturalImplication: {
          ar: 'يمكن لاحقًا فصل Advanced WMS كوحدة أو Add-on دون إعادة فتح نموذج Inventory Core أو كسر ملكية Book Stock.',
          en: 'Future modularization or tiering of Advanced WMS can proceed without reopening D-INV-07 or Book Stock ownership.',
        },
        relevantLimitations: {
          ar: 'لا يعتمد القرار الآن حزم الترخيص أو قائمة ميزات WMS التفصيلية مثل Picking/Packing/Putaway.',
          en: 'Does not lock licensing tiers or operational WMS features such as Picking/Packing/Putaway.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§7 طبقات المخزون والمستودعات', en: '§7 Warehouse Layering' }, sectionAnchor: 'kh-h-7-inventory-vs-warehouse-management-boundary' },
        ],
      },
      'D-INV-08': {
        decisionId: 'D-INV-08',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يحفظ تاريخ الحركات والأرصدة المخزنية عبر Freeze, not Delete حتى لا تنقطع سلاسل التتبع أو تتضرر المراجع المشتركة مع المبيعات والمشتريات.',
          en: 'Educational Interpretation: Applies Freeze, not Delete to stock movements and balances so audit trails and historical PO/SO references stay intact.',
        },
        architecturalImplication: {
          ar: 'يفصل التصميم المستقبلي بين منع الحركات الجديدة وبين الاحتفاظ التاريخي، مع إعلان حالة توقف المخزون للوحدات المتكاملة.',
          en: 'Future design must separate halting new movements from retaining history and notify integrated modules when Inventory freezes.',
        },
        relevantLimitations: {
          ar: 'تفاصيل License Deactivation وRead-Only والأرشفة وإعادة التفعيل مؤجلة لمراحل المنصة المناسبة.',
          en: 'License deactivation, Read-Only mode, archiving, retention, and reactivation mechanics remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§10.2 قواعد الإيقاف', en: '§10.2 Deactivation' }, sectionAnchor: 'kh-h-102-deactivation' },
        ],
      },
    },
  },

  procurement: {
    moduleId: 'procurement',
    purposeAndImpact: {
      whyModuleExists: {
        ar: 'يوجد نظام المشتريات (Procurement) بوصفه المالك الحصري للقرار التجاري الشرائي ومستندات الشراء (Requisition / RFQ / Purchase Order)، والسياق التجاري للمورد، وقبول الخدمات غير المخزنية. وتتمحور فائدته المعمارية في تشغيل دورة الشراء التشغيلي منفردة دون فرض المخزون أو المالية في المرحلة التشغيلية.',
        en: 'Procurement exists as the exclusive owner of commercial purchasing decisions, purchasing documents (Requisition / RFQ / Purchase Order), Commercial Supplier Context, and non-stock service acceptance. It enables operational purchasing without requiring Inventory, Sales, or Finance for core PO/service execution.',
      },
      whyModuleExistsSourceRef: {
        sectionLabel: { ar: '§1 تعريف Procurement داخل المنتج', en: '§1 Module Definition' },
        sectionAnchor: 'kh-h-1-تعريف-procurement-داخل-المنتج',
      },
      businessProblemsAddressed: [
        {
          title: {
            ar: 'شراء الخدمات والمصاريف دون الحاجة لنظام مخزون (D-PROC-06)',
            en: 'Service, Expense & Non-Stock Procurement Without Inventory (D-PROC-06)',
          },
          explanation: {
            ar: 'تعالج الوثيقة مشكلة الأنظمة التي تجعل الصنف والمخزون شرطًا لكل أمر شراء؛ فالمشتريات تدعم الخدمات والمصاريف وقبول الخدمات داخلها مباشرة مع بقاء Item Master مشروطًا.',
            en: 'Solves the rigid coupling where every PO must reference stock items; Procurement natively supports services, expenses, and service acceptance with Item Master as a Conditional PCD.',
          },
          sourceRef: {
            sectionLabel: { ar: '§6 حدود الصنف و§9 شراء الخدمات', en: '§6 Item Boundary & §9 Services' },
            sectionAnchor: 'kh-h-9-service-procurement-boundary',
          },
        },
        {
          title: {
            ar: 'الفصل الواعي عن نموذج Odoo (purchase → account) (D-PROC-02)',
            en: 'Intentional Modular Decoupling from Finance vs Odoo Model (D-PROC-02)',
          },
          explanation: {
            ar: 'توثّق الوثيقة (§1 و§14) أن Odoo يفرض اعتمادًا صلبًا من المشتريات على المحاسبة، بينما يختار Teranoo عمدًا تشغيل الشراء تشغيليًا وحصر الفوترة والذمم الدائنة في المالية عبر CIC مشروط.',
            en: 'Explicitly documents (§1, §14) that whereas Odoo forces `purchase → account`, Teranoo intentionally decouples operational purchasing and integrates Supplier Invoices/AP via CIC.',
          },
          sourceRef: {
            sectionLabel: { ar: '§14 سياق قرار الاستقلال عن المالية', en: '§14 Finance Dependency Context' },
            sectionAnchor: 'kh-h-decision-context-finance-dependency-choice',
          },
        },
        {
          title: {
            ar: 'حماية وحدة الشراء من تكرار بيانات المورد ومحرك الموافقات',
            en: 'Preventing Duplicate Supplier Masters & Approval Engines',
          },
          explanation: {
            ar: 'يفصل بين Shared Supplier/Party Identity (المنصة) وCommercial Supplier Context (المشتريات) وFinancial Supplier Context (المالية)، ويستهلك Shared Workflow Engine.',
            en: 'Separates Shared Supplier Identity (Platform) from Commercial Context (Procurement) and Financial Context (Finance), while reusing Shared Platform Workflow.',
          },
          sourceRef: {
            sectionLabel: { ar: '§5 حدود المورد و§10 الموافقات', en: '§5 Supplier Boundary & §10 Workflow' },
            sectionAnchor: 'kh-h-5-supplier-vendor-identity-boundary',
          },
        },
      ],
      futureDesignImplications: [
        {
          area: {
            ar: 'تأجيل ملكية وتنسيق مطابقة الفواتير (Invoice Matching / 3-Way Match)',
            en: 'Deferred Invoice Matching & Three-Way Match Ownership',
          },
          approvedConstraint: {
            ar: 'يُحظر في المرحلة 2 و3 التسلل المسبق لملكية Invoice Matching (هل تتبع Finance/AP أم Procurement أم تنسيقًا مشتركًا)، ويجب حسمها صراحةً في المرحلة 5/6 بعد تثبيت عقود CIC.',
            en: 'Phase 2 intentionally leaves Invoice Matching / Three-Way Match ownership unresolved by design until Finance/Procurement/Inventory integration contracts mature in Phase 5/6.',
          },
          deferredToPhase: {
            ar: 'المرحلة 5/6 (التزام معماري مؤجل صراحةً في §14).',
            en: 'Phase 5/6 (Explicit Deferred Architecture Commitment in §14).',
          },
          sourceRef: {
            sectionLabel: { ar: '§14 التزام Invoice Matching المؤجل', en: '§14 Deferred Invoice Matching' },
            sectionAnchor: 'kh-h-deferred-architecture-commitment-invoice-matching',
          },
        },
        {
          area: {
            ar: 'الشراء المركزي وتعدد الشركات والفروع (Centralized & Multi-Company)',
            en: 'Centralized Procurement & Multi-Company Ownership',
          },
          approvedConstraint: {
            ar: 'لكل مستند شراء مالك قانوني (Company) واضح، ولا يُفترض أن Tenant = Company واحدة، مع ضرورة السماح لاحقًا بـ Centralized Procurement دون كسر ملكية المستندات المحلية.',
            en: 'Every PO needs an explicit Company owner (Tenant ≠ single Company), while allowing future Centralized/Shared Procurement without breaking local document ownership.',
          },
          deferredToPhase: {
            ar: 'المرحلة 3 و6 (Purchasing Organization hierarchy، العقود المركزية، Intercompany).',
            en: 'Phase 3 & 6 (Purchasing Org hierarchy, Central Contracts, Intercompany).',
          },
          sourceRef: {
            sectionLabel: { ar: '§12 أثر Multi-Company وMulti-Branch', en: '§12 Multi-Company Implications' },
            sectionAnchor: 'kh-h-12-multi-company-multi-branch-implications',
          },
        },
        {
          area: {
            ar: 'استقبال الطلبات من المبيعات والتصنيع والمشاريع كـ FLDs فقط',
            en: 'Cross-Module Demand Intake via Feature-Level Dependencies',
          },
          approvedConstraint: {
            ar: 'Drop Ship وBack-to-Back (Sales) وProject/Production/Maintenance Purchase تُعامل كـ Feature-Level Integrations ولا تحوّل الوحدات الطالبة إلى شروط لتفعيل المشتريات.',
            en: 'Drop Ship, Back-to-Back, and Project/Production/Maintenance purchasing are modeled strictly as FLDs and never become activation dependencies on Procurement.',
          },
          deferredToPhase: {
            ar: 'المرحلة 6 لمخططات التوريد التفصيلية والـ Sourcing وService Entry.',
            en: 'Phase 6 for detailed Sourcing, Service Entry, and fulfillment blueprints.',
          },
          sourceRef: {
            sectionLabel: { ar: '§7.3–7.4 المبيعات والمشاريع والتصنيع', en: '§7.3–7.4 Peer Demand Links' },
            sectionAnchor: 'kh-h-73-procurement-sales',
          },
        },
      ],
    },
    designReasoning: [
      {
        id: 'proc-reason-finance-decouple',
        topic: {
          ar: 'الخروج المعماري المقصود عن نموذج Odoo في الفصل بين الشراء والمالية (D-PROC-02)',
          en: 'Intentional Architectural Divergence from Odoo Coupling (D-PROC-02)',
        },
        officialReasoning: {
          ar: 'تذكر §1 و§14 (Decision Context) أن أنظمة مرجعية مثل Odoo تفرض اعتمادية صلبة `purchase → account`، لكن Teranoo يختار عمدًا فصل الدورة الشرائية التشغيلية (Requisition / RFQ / PO / Service Acceptance) عن الذمم الدائنة والفوترة والسداد (Finance) ليتسق مع استقلالية Finance وInventory.',
          en: 'Sections §1 and §14 explicitly state that while Odoo enforces a hard `purchase → account` dependency, Teranoo deliberately separates operational purchasing (Requisition/RFQ/PO/Service Acceptance) from Supplier Invoices/AP/GL in Finance to keep all Core Modules modular.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: يوضح هذا القرار كيف ينتقل المعماري من تقليد الأنظمة الشائعة إلى تصميم حدود مقصودة: المنشأة التي تريد ضبط طلبات الشراء وعروض الموردين قبل ربط المالية (أو مع محاسبة خارجية) تحصل على قيمة كاملة من Procurement دون فرض تفعيل GL.',
          en: 'Educational Interpretation: Demonstrates deliberate boundary engineering rather than copying legacy ERPs: businesses managing requisitions, RFQs, and PO approvals (even with external accounting) can deploy Procurement cleanly without forcing Finance activation.',
        },
        architecturalImplication: {
          ar: 'يبقى PO التزامًا تجاريًا داخل المشتريات ولا يُعامل أبدًا كقيد GL أو فاتورة؛ وتصل الفاتورة للمالية عبر CIC-CORE-PROC-FIN-001.',
          en: 'PO remains a commercial commitment owned by Procurement (never a GL entry); Supplier Invoices and AP execute in Finance via CIC-CORE-PROC-FIN-001.',
        },
        sourceRef: {
          sectionLabel: { ar: '§14 سياق قرار الاستقلال عن المالية', en: '§14 Finance Dependency Choice' },
          sectionAnchor: 'kh-h-decision-context-finance-dependency-choice',
        },
      },
      {
        id: 'proc-reason-service-vs-stock',
        topic: {
          ar: 'شراء الخدمات والبنود غير المخزنية كدليل استقلال عن المخزون (D-PROC-06)',
          en: 'Service & Expense Procurement Proves Inventory Independence (D-PROC-06)',
        },
        officialReasoning: {
          ar: 'تؤكد §6 و§9 أن قبول الخدمات والمصاريف لا يمر عبر Stock Movement ولا يقع داخل Inventory، مما يثبت أن Item Master وStorage Context قدرات مشروطة وليست شرطًا عامًا لكل أمر شراء.',
          en: 'Sections §6 and §9 prove that services and expenses never generate Stock Movements and that Service Acceptance resides in Procurement, keeping Item Master and Storage Context conditional.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: في المشتريات المؤسسية تمثل عقود الصيانة والاستشارات والإيجارات والمصاريف نسبة كبيرة من أوامر الشراء؛ جعل Item/Inventory شرطًا إجباريًا يجبر الفرق على اختلاق «أصناف وهمية» ويكسر نظافة المخزون.',
          en: 'Educational Interpretation: Services, consulting, and operating expenses form a major share of enterprise purchasing; forcing every PO line through Inventory forces artificial dummy stock items and pollutes stock ledgers.',
        },
        architecturalImplication: {
          ar: 'Shared Product / Item Master وInventory Storage Context يُصنَّفان كـ Conditional PCDs في المشتريات (للمشتريات المخزنية فقط).',
          en: 'Shared Product/Item Master and Storage Context remain Conditional PCDs for Procurement, activated strictly for stock-item lines.',
        },
        sourceRef: {
          sectionLabel: { ar: '§6 و§9 حدود الصنف والخدمات', en: '§6 & §9 Item/Service Boundaries' },
          sectionAnchor: 'kh-h-9-service-procurement-boundary',
        },
      },
      {
        id: 'proc-reason-po-vs-receipt',
        topic: {
          ar: 'الفرق الجوهري بين أمر الشراء (PO) والاستلام المخزني وفاتورة المورد (D-PROC-05)',
          en: 'Distinguishing Purchase Order, Goods Receipt & Supplier Invoice (D-PROC-05)',
        },
        officialReasoning: {
          ar: 'تقسم §7.1 و§7.2 و§8 المسؤولية بوضوح: المشتريات تملك PO والكمية المتوقعة/المطلوبة تجاريًا؛ المخزون يملك On-hand والاستلام الكمي للسلع؛ المالية تملك Supplier Invoice والالتزام المالي والـ AP.',
          en: 'Sections §7.1, §7.2, and §8 split responsibility cleanly: Procurement owns the PO and ordered commercial quantity; Inventory owns On-hand and physical Goods Receipt; Finance owns Supplier Invoices, AP, and GL.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: الخلط بين هذه المستندات الثلاثة هو سبب معظم تشوهات الـ ERP؛ فأمر الشراء التزام تجاري قد يتعدل أو يُلغى، والاستلام حدث فيزيائي في المستودع، والفاتورة التزام مالي — ولكل منها دورة حياة ومالك مختلف.',
          en: 'Educational Interpretation: Conflating PO, Goods Receipt, and Supplier Invoice causes severe ERP coupling; each represents a distinct legal/operational truth (commercial intent, physical arrival, financial liability).',
        },
        architecturalImplication: {
          ar: 'لا يملك Inventory أمر الشراء بل يستهلكه مرجعًا عند الاستلام، ولا تملك Procurement سجل الدفع أو الأستاذ العام.',
          en: 'Inventory references the PO during Goods Receipt without owning it; Procurement references AP/payment status without owning financial execution.',
        },
        sourceRef: {
          sectionLabel: { ar: '§8 حدود ملكية PO', en: '§8 PO Ownership Boundary' },
          sectionAnchor: 'kh-h-8-purchase-order-ownership-boundary',
        },
      },
    ],
    absentPeerScenarios: [
      {
        absentPeerName: { ar: 'غياب المالية (Finance)', en: 'Without Finance' },
        absentPeerCode: 'MOD-FIN',
        standaloneBehavior: {
          ar: 'تعمل طلبات الشراء، عروض الأسعار، أوامر الشراء، وقبول الخدمات داخل المشتريات بكامل صلاحياتها التشغيلية.',
          en: 'Requisitions, RFQs, Purchase Orders, and service acceptance run operationally inside Procurement.',
        },
        unavailableCapabilities: {
          ar: 'تغيب فاتورة المورد، الذمم الدائنة (AP)، الالتزام المالي، السداد، المطابقة المالية، والترحيل إلى الأستاذ العام (حد §2 الحرج).',
          en: 'Supplier Invoices, AP liabilities, supplier payments, financial matching, and GL postings are unavailable (explicit §2 limit).',
        },
        bridgeContractOrFld: 'CIC-CORE-PROC-FIN-001',
        sourceRef: {
          sectionLabel: { ar: '§2 حد مهم و§7.1', en: '§2 Key Limit & §7.1' },
          sectionAnchor: 'kh-h-حد-مهم',
        },
      },
      {
        absentPeerName: { ar: 'غياب المخزون (Inventory)', en: 'Without Inventory' },
        absentPeerCode: 'MOD-INV',
        standaloneBehavior: {
          ar: 'يدير النظام شراء الخدمات والمصاريف والبنود غير المخزنية وقبول الخدمات دون أي عقبة.',
          en: 'Service, expense, category-based, and non-stock procurement including service acceptance run unhindered.',
        },
        unavailableCapabilities: {
          ar: 'يغيب شراء الأصناف المخزنية المرتبط بالاستلام الفعلي في المستودعات (Stock Purchase) وThree-Way Match مع الاستلام المخزني.',
          en: 'Stock item purchasing tied to physical warehouse receipts (Stock Purchase FLD) and receipt-based Three-Way Match are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-PROC-INV-001 + FLD Stock Purchase / 3-Way Match',
        sourceRef: {
          sectionLabel: { ar: '§7.2 و§9 شراء الخدمات', en: '§7.2 & §9 Services' },
          sectionAnchor: 'kh-h-72-procurement-inventory',
        },
      },
      {
        absentPeerName: { ar: 'غياب المبيعات (Sales)', en: 'Without Sales' },
        absentPeerCode: 'MOD-SALES',
        standaloneBehavior: {
          ar: 'تعمل دورة الشراء المعتادة بالكامل لاحتياجات المنشأة التشغيلية والمخزنية والخدمية.',
          en: 'Standard operational, service, and stock procurement cycles operate without any impact.',
        },
        unavailableCapabilities: {
          ar: 'تغيب سيناريوهات الشراء المولدة من طلبات العملاء مثل Drop Ship وBack-to-Back.',
          en: 'Sales-triggered supply workflows such as Drop Ship and Back-to-Back Special Orders are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-PROC-001 + FLD Drop Ship',
        sourceRef: {
          sectionLabel: { ar: '§7.3 المشتريات ↔ المبيعات', en: '§7.3 Procurement ↔ Sales' },
          sectionAnchor: 'kh-h-73-procurement-sales',
        },
      },
    ],
    ownershipBoundaryMatrix: [
      {
        domainConcept: {
          ar: 'طلب الشراء وRFQ وأمر الشراء (PO) وقبول الخدمة',
          en: 'Requisition, RFQ, Purchase Order & Service Acceptance',
        },
        moduleOwns: {
          ar: 'المستندات الشرائية، القرار التجاري الشرائي، الكمية المطلوبة، وتأكيد/قبول الخدمات.',
          en: 'Purchasing documents, commercial purchasing decision, ordered quantity, and service acceptance.',
        },
        consumesOrReferences: {
          ar: 'Shared Supplier/Party Identity، Currency، Workflow، وConditional Product/UOM.',
          en: 'Shared Supplier/Party Identity, Currency, Workflow, and Conditional Product/UOM.',
        },
        otherModulesOwn: {
          ar: 'Inventory يملك الاستلام المخزني الفيزيائي؛ Finance يملك فاتورة المورد والسداد وGL.',
          en: 'Inventory owns physical Goods Receipt; Finance owns Supplier Invoice, payment, and GL.',
        },
        unresolvedBoundary: {
          ar: 'سير عمل Requisition/PO statuses وService Entry وتفاصيل حسابات التوجيه (المرحلة 6).',
          en: 'Requisition/PO workflow statuses, Service Entry design, and account assignment rules (Phase 6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§8 و§9 و§13', en: '§8, §9 & §13' },
          sectionAnchor: 'kh-h-8-purchase-order-ownership-boundary',
        },
      },
      {
        domainConcept: {
          ar: 'هوية المورد وسياقاته (Supplier Identity vs Context)',
          en: 'Supplier Identity vs Commercial/Financial Contexts',
        },
        moduleOwns: {
          ar: 'Commercial Procurement Context المرتبط بالمورد.',
          en: 'Commercial Procurement Context for suppliers.',
        },
        consumesOrReferences: {
          ar: 'Shared Supplier / Party Identity من المنصة (Required PCD — D-PROC-04).',
          en: 'Shared Platform Supplier / Party Identity (Required PCD — D-PROC-04).',
        },
        otherModulesOwn: {
          ar: 'المنصة تملك الهوية الأساسية؛ Finance يملك Financial Supplier Context (AP/Liability/Payment).',
          en: 'Platform owns core Party Identity; Finance owns Financial Supplier Context (AP/Liability/Payment).',
        },
        unresolvedBoundary: {
          ar: 'ملكية Supplier sites، البيانات البنكية والضريبية، وتصميم One-time Supplier (المرحلة 5/6).',
          en: 'Supplier sites, bank/tax attributes ownership, and One-time Supplier design (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§5 حدود هوية المورد', en: '§5 Supplier Identity Boundary' },
          sectionAnchor: 'kh-h-5-supplier-vendor-identity-boundary',
        },
      },
      {
        domainConcept: {
          ar: 'الاستلام المخزني مقابل فاتورة المورد ومطابقة الفواتير (Matching)',
          en: 'Goods Receipt vs Supplier Invoice & Invoice Matching',
        },
        moduleOwns: {
          ar: 'مرجع PO المرتبط بالاستلام والفاتورة، والقرار التجاري عند الشراء.',
          en: 'PO reference and commercial purchasing terms.',
        },
        consumesOrReferences: {
          ar: 'حالة الاستلام من المخزون (CIC-CORE-PROC-INV-001) وحالة الفاتورة/الدفع من المالية.',
          en: 'Receipt status from Inventory and invoice/payment references from Finance via CICs.',
        },
        otherModulesOwn: {
          ar: 'Inventory يملك On-hand وGoods Receipt؛ Finance يملك Supplier Invoice وAP وPayment.',
          en: 'Inventory owns On-hand/Goods Receipt; Finance owns Supplier Invoice/AP/Payment.',
        },
        unresolvedBoundary: {
          ar: 'ملكية وتنسيق Invoice Matching / Three-Way Match تظل مؤجلة صراحةً (Feature Owner: Deferred) حتى المرحلة 5/6.',
          en: 'Invoice Matching / Three-Way Match ownership & orchestration remain explicitly deferred until Phase 5/6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§7.1 و§14 التزام Invoice Matching', en: '§7.1 & §14 Invoice Matching' },
          sectionAnchor: 'kh-h-deferred-architecture-commitment-invoice-matching',
        },
      },
    ],
    deferredBoundaryRationales: [
      {
        topic: {
          ar: 'ملكية وتنسيق مطابقة الفواتير والمطابقة الثلاثية (Invoice Matching / 3-Way Match)',
          en: 'Invoice Matching & Three-Way Match Ownership',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6 (التزام معماري مؤجل)', en: 'Phase 5 / Phase 6 (Deferred Architecture Commitment)' },
        whyDeferredInSource: {
          ar: 'تؤكد §14 أن الأنظمة العالمية تتباين بين إلحاق المطابقة بـ Finance/AP أو وضع جزء منها داخل Procurement/MM؛ لذلك يتطلب الحسم تثبيت عقود CIC الثلاثية (PO – Receipt – Invoice) أولًا.',
          en: 'Section §14 observes global systems split between Finance/AP-centric matching and Procurement-centric matching; resolution requires locking PO–Receipt–Invoice contracts first.',
        },
        approvedPhase2Boundary: {
          ar: 'Three-Way Match موصوف كـ FLD مالكه مؤجل (Deferred Owner) ولا ينشئ HBMD.',
          en: 'Three-Way Match is tracked as a Deferred-Owner FLD and creates zero HBMDs.',
        },
        sourceRef: {
          sectionLabel: { ar: '§14 التزام Invoice Matching المؤجل', en: '§14 Deferred Invoice Matching' },
          sectionAnchor: 'kh-h-deferred-architecture-commitment-invoice-matching',
        },
      },
      {
        topic: {
          ar: 'تفاصيل صفات المورد المالية والتجارية وOne-time Supplier',
          en: 'Supplier Attribute Ownership & One-Time Supplier Design',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6', en: 'Phase 5 / Phase 6' },
        whyDeferredInSource: {
          ar: 'بعد حسم منع تكرار Party Master في D-PROC-04، تتطلب التفاصيل البنكية والضريبية وشروط السداد وتأهيل الموردين تنسيقًا مشتركًا مع نموذج Shared Party والمالية.',
          en: 'With Party Master duplication forbidden by D-PROC-04, bank/tax/payment attributes and supplier qualification require Phase 5/6 Shared Party alignment.',
        },
        approvedPhase2Boundary: {
          ar: 'الهوية مشتركة على المنصة، والسياق التجاري للمشتريات، والسياق المالي للمالية.',
          en: 'Shared identity on Platform; commercial context in Procurement; financial context in Finance.',
        },
        sourceRef: {
          sectionLabel: { ar: '§5 و§14', en: '§5 & §14' },
          sectionAnchor: 'kh-h-5-supplier-vendor-identity-boundary',
        },
      },
      {
        topic: {
          ar: 'الشراء المركزي (Centralized Procurement)، الالتزامات الميزانية، وسير عمل الاستلام والخدمة',
          en: 'Centralized Procurement, Encumbrance & Detailed Operational Workflows',
        },
        targetPhase: { ar: 'المرحلة 3 (Org) والمرحلة 6 (Workflows)', en: 'Phase 3 (Org) & Phase 6 (Workflows)' },
        whyDeferredInSource: {
          ar: 'يعتمد Purchasing Organization model على قرارات Tenancy والفروع في المرحلة 3، بينما تنتمي دورات Requisition/RFQ/Sourcing/Service Entry إلى Phase 6 Blueprint.',
          en: 'Purchasing Org hierarchies depend on Phase 3 Tenancy/Branch rules, whereas Requisition/RFQ/Sourcing/Service Entry flows belong to Phase 6.',
        },
        approvedPhase2Boundary: {
          ar: 'يجب احترام Company owner على كل مستند شراء وإتاحة التوسع للشراء المركزي مستقبلًا.',
          en: 'Every PO keeps an explicit Company owner while keeping future Centralized Procurement extensible.',
        },
        sourceRef: {
          sectionLabel: { ar: '§12 و§13 و§14', en: '§12, §13 & §14' },
          sectionAnchor: 'kh-h-14-القرارات-المفتوحة-والمؤجلة',
        },
      },
    ],
    decisionDetails: {
      'D-PROC-01': {
        decisionId: 'D-PROC-01',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يرسّخ قدرة نظام المشتريات على العمل كوحدة تجارية أولية مستقلة تغطي دورة الشراء التشغيلي (طلبات، عروض، أوامر شراء، وقبول خدمات) دون توقف على المخزون أو المالية.',
          en: 'Educational Interpretation: Establishes Procurement as an independently sellable module executing operational buying (Requisitions, RFQs, POs, Service Acceptance) without Inventory or Finance.',
        },
        architecturalImplication: {
          ar: 'يملك النظام دورة مستنداته التشغيلية ويمكن تسويقه وتفعيله منفردًا للجهات التي تركز على ضبط أوامر الشراء والخدمات.',
          en: 'Procurement owns its operational buying lifecycle and can be deployed standalone for organizations managing POs and service approvals.',
        },
        relevantLimitations: {
          ar: 'لا ينشئ دورة مالية كاملة عند العمل منفردًا: الفوترة والـ AP والسداد والترحيل المالي تتطلب Finance عبر CIC.',
          en: 'Does not complete the financial cycle standalone: Supplier Invoices, AP, payments, and GL postings require Finance via CIC.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§1 تعريف Procurement و§2 الحد المهم', en: '§1 Definition & §2 Key Limit' }, sectionAnchor: 'kh-h-حد-مهم' },
        ],
      },
      'D-PROC-02': {
        decisionId: 'D-PROC-02',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يؤكد غياب أي اعتماد تفعيل صلب (0 HBMD) من المشتريات على المالية أو المخزون أو المبيعات أو التصنيع أو المشاريع، كخيار معماري مقصود يختلف عن Odoo.',
          en: 'Educational Interpretation: Establishes zero Hard Business Module Dependencies on Finance, Inventory, Sales, Manufacturing, or Projects—an intentional modular departure from Odoo.',
        },
        architecturalImplication: {
          ar: 'يظل تفعيل المشتريات متاحًا في محرك التفعيل وبيئة الإنتاج دون فرض تنصيب وحدة الحسابات أو المستودعات.',
          en: 'Module activation checks never require Finance or Inventory to be Active before enabling Procurement.',
        },
        relevantLimitations: {
          ar: 'حد القرار الصريح: الخروج عن Odoo `purchase → account` قرار تصميمي مقصود وليس ادعاءً بأن كل أنظمة السوق تفعل المثل.',
          en: 'Explicit limit: intentional departure from Odoo `purchase → account`, not a claim of universal ERP convention.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§14 سياق قرار المالية', en: '§14 Finance Dependency Choice' }, sectionAnchor: 'kh-h-decision-context-finance-dependency-choice' },
        ],
      },
      'D-PROC-03': {
        decisionId: 'D-PROC-03',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يحدد أرضية المنصة الدنيا لتشغيل المشتريات، وتشمل Shared Supplier/Party Identity وCurrency Foundation بجانب Tenant وCompany وRBAC وAudit وReporting وConfig.',
          en: 'Educational Interpretation: Anchors Procurement to Platform Foundation capabilities, requiring Shared Supplier Identity and Currency Foundation alongside core platform services.',
        },
        architecturalImplication: {
          ar: 'يميز بين Required PCDs الدائمة وبين 8 قدرات مشروطة مثل Product/Item وUOM وStorage Context وWorkflow وTax.',
          en: 'Separates mandatory Required PCDs from 8 scenario-conditional PCDs such as Product/Item, UOM, Storage Context, Workflow, and Tax.',
        },
        relevantLimitations: {
          ar: 'حد القرار: يعتمد مبدأ الاحتياج للمنصة ولا يصمم هياكل البيانات أو منظمة المشتريات أو محركات الضريبة/العملة.',
          en: 'Explicit limit: adopts dependency principles only; Purchasing Org hierarchy, Party schemas, and Tax/Currency engines remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§4 اعتماديات المنصة', en: '§4 Platform Dependencies' }, sectionAnchor: 'kh-h-41-required-platform-capabilities' },
        ],
      },
      'D-PROC-04': {
        decisionId: 'D-PROC-04',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يمنع إنشاء جدول موردين منفصل داخل المشتريات ومثيله داخل المالية، مستبدلاً ذلك بهوية مورد مشتركة في المنصة مع سياقات مملوكة لكل وحدة.',
          en: 'Educational Interpretation: Prevents fragmented supplier masters by placing Supplier Identity in Shared Platform Data while giving Procurement commercial context and Finance financial context.',
        },
        architecturalImplication: {
          ar: 'يستهلك Procurement سجل المورد المشترك كـ Required PCD ويخزن فقط بياناته التعاقدية/الشرائية عند تصميمها.',
          en: 'Procurement consumes Shared Supplier Identity as a Required PCD and owns only its Commercial Procurement Context.',
        },
        relevantLimitations: {
          ar: 'حد القرار: لا يحسم نموذج Party التفصيلي ولا مواقع المورد (Sites) ولا ملكية الحسابات البنكية/الضرائب أو المورد لمرة واحدة.',
          en: 'Explicit limit: Party schema, supplier sites, bank/tax attribute ownership, and one-time supplier design await Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§5 حدود هوية المورد', en: '§5 Supplier Identity Boundary' }, sectionAnchor: 'kh-h-5-supplier-vendor-identity-boundary' },
        ],
      },
      'D-PROC-05': {
        decisionId: 'D-PROC-05',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يضبط المثلث الشرائي — المشتريات تملك الـ PO وقبول الخدمة، المخزون يملك الرصيد والاستلام الفيزيائي، والمالية تملك فاتورة المورد والـ GL.',
          en: 'Educational Interpretation: Governs the purchasing triad—Procurement owns PO & Service Acceptance, Inventory owns On-hand & Goods Receipt, and Finance owns Supplier Invoice/AP & GL.',
        },
        architecturalImplication: {
          ar: 'أمر الشراء لا يزيد الكمية المخزنية تلقائيًا ولا ينشئ قيدًا ماليًا مباشرًا؛ بل يمرر المراجع عبر عقود التكامل المشروطة.',
          en: 'PO creation neither alters stock On-hand nor generates GL postings; downstream modules consume PO references via CICs.',
        },
        relevantLimitations: {
          ar: 'حد القرار الصريح: ملكية وتنسيق Invoice Matching / Three-Way Match تظل مؤجلة عمدًا إلى المرحلة 5/6.',
          en: 'Explicit limit: Invoice Matching / Three-Way Match ownership remains intentionally deferred to Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§7.1–7.2 و§8 و§14', en: '§7.1–7.2, §8 & §14' }, sectionAnchor: 'kh-h-71-procurement-finance' },
        ],
      },
      'D-PROC-06': {
        decisionId: 'D-PROC-06',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يحرر عمليات شراء الخدمات والمصاريف والعقود غير المخزنية من اشتراط سجل الصنف المخزني أو نظام المستودعات.',
          en: 'Educational Interpretation: Decouples service, expense, category-based, and non-stock purchasing from requiring a shared catalog Item or active Inventory module.',
        },
        architecturalImplication: {
          ar: 'يجعل Shared Product / Item Master قدرة مشروطة (Conditional PCD) في المشتريات لا قدرة مطلوبة دائمًا.',
          en: 'Classifies Shared Product/Item Master as Conditional (`C`) rather than Required (`R`) in the Procurement PCD Matrix.',
        },
        relevantLimitations: {
          ar: 'لا يحسم القرار هيكل سطور PO التفصيلي أو تصنيفات المشتريات (Procurement Categories) في المرحلة 2.',
          en: 'Does not specify PO line item schemas, product flags, or Procurement Category structures.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6 حدود الصنف و§9 الخدمات', en: '§6 Item & §9 Services' }, sectionAnchor: 'kh-h-6-product-item-dependency-boundary' },
        ],
      },
      'D-PROC-07': {
        decisionId: 'D-PROC-07',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يوحّد آلية ربط المشتريات بمختلف الوحدات عبر CIC للسيناريوهات المشتركة وFLD لميزات مثل Drop Ship وStock Purchase و3-Way Match.',
          en: 'Educational Interpretation: Standardizes cross-module collaboration under CICs and classifies Drop Ship, Stock Purchase, 3-Way Match, Project/Production Purchase as FLDs.',
        },
        architecturalImplication: {
          ar: 'غياب المبيعات أو المشاريع أو التصنيع أو المخزون يعطّل فقط الميزة الفرعية المرتبطة بها ولا يعطّل المشتريات الأساسية.',
          en: 'Absence of Sales, Projects, Manufacturing, or Inventory disables only those specific feature extensions without blocking base Procurement.',
        },
        relevantLimitations: {
          ar: 'آليات التنفيذ الحية لـ Drop Ship وتدفق الطلبات من التصنيع والمشاريع مؤجلة للمراحل الوظيفية والتكاملية اللاحقة.',
          en: 'Execution flows for Drop Ship and project/manufacturing demand intake await Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§7.3–7.4 التكامل وFLD', en: '§7.3–7.4 CIC & FLD' }, sectionAnchor: 'kh-h-74-procurement-manufacturing-projects-maintenance' },
        ],
      },
      'D-PROC-08': {
        decisionId: 'D-PROC-08',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يمنع تكرار بناء محركات الموافقة داخل كل وحدة؛ فالمشتريات تحدد متطلبات الاعتماد لمستنداتها وتستخدم محرك الموافقات المشترك في المنصة.',
          en: 'Educational Interpretation: Prevents duplicate approval engines; Procurement defines document-level approval policies while delegating execution to Shared Platform Workflow.',
        },
        architecturalImplication: {
          ar: 'يصنّف Workflow / Approvals كـ Conditional PCD تبعًا لسياسة العميل؛ إذ لا يُفترض أن كل مستند يمر بموافقة إجبارية.',
          en: 'Treats Workflow / Approvals as a Conditional PCD driven by customer policy rather than forcing approvals on every document.',
        },
        relevantLimitations: {
          ar: 'قواعد Routing وThresholds وDelegations وSegregation of Duties مؤجلة إلى Phase 5/6.',
          en: 'Approval routing, thresholds, delegations, and SoD rules remain deferred to Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§10 حدود الموافقات', en: '§10 Workflow Boundary' }, sectionAnchor: 'kh-h-10-workflow-approval-boundary' },
        ],
      },
      'D-PROC-09': {
        decisionId: 'D-PROC-09',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يضمن عدم حذف تاريخ أوامر الشراء عند إيقاف الوحدة عبر Freeze, not Delete، مع الفصل بين منع معاملات جديدة وإغلاق الأوامر المفتوحة.',
          en: 'Educational Interpretation: Protects PO and purchasing history from destructive deletion under Freeze, not Delete while separating freeze from open-order closure.',
        },
        architecturalImplication: {
          ar: 'يلزم إشعار أو تعامل صريح من التكاملات المرتبطة (المخزون والمالية) عند انتقال المشتريات إلى Frozen.',
          en: 'Integrated modules (Inventory, Finance) must handle Procurement freeze explicitly via declared integration states.',
        },
        relevantLimitations: {
          ar: 'سياسات التعامل مع أوامر الشراء المفتوحة عند إيقاف الترخيص والأرشفة والـ Read-Only مؤجلة.',
          en: 'Open-PO handling, Read-Only licensing, retention, archive, and reactivation rules remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§11.2 قواعد الإيقاف', en: '§11.2 Deactivation' }, sectionAnchor: 'kh-h-112-deactivation' },
        ],
      },
    },
  },

  'sales-order-management': {
    moduleId: 'sales-order-management',
    purposeAndImpact: {
      whyModuleExists: {
        ar: 'يوجد نظام المبيعات وإدارة الطلبات (Sales & Order Management) بوصفه المالك الحصري لعروض الأسعار وأوامر البيع (Sales Order) والالتزام التجاري تجاه العميل والكمية المطلوبة/المؤكدة ونية تنسيق الطلب (Coordination Intent)، مع تشغيله تشغيليًا بصورة مستقلة عن المخزون والمالية والمشتريات وCRM.',
        en: 'Sales & Order Management exists as the exclusive owner of Quotations, Sales Orders, customer commercial commitments, ordered/confirmed quantities, and order coordination intent. It runs operationally standalone without requiring Finance, Inventory, Procurement, or CRM.',
      },
      whyModuleExistsSourceRef: {
        sectionLabel: { ar: '§1 تعريف Sales & Order Management', en: '§1 Module Definition' },
        sectionAnchor: 'kh-h-1-تعريف-sales-order-management-داخل-المنتج',
      },
      businessProblemsAddressed: [
        {
          title: {
            ar: 'فصل دورة الالتزام البيعي والخدمات عن المخزون والمحاسبة وCRM',
            en: 'Operating Quotations, Sales Orders & Services Without Inventory, Finance, or CRM',
          },
          explanation: {
            ar: 'يمكّن بيع الخدمات والبنود غير المخزنية (D-SALES-10) وإدارة أوامر البيع دون فرض تفعيل المخزون (مخالفًا افتراض أن كل بيع يعني خصم مخزون) أو تفعيل CRM أو فرض المالية كما في Odoo `sale → account_payment → account`.',
            en: 'Supports Service/Non-stock sales (D-SALES-10) and Sales Orders without forcing Inventory, CRM, or Finance (explicitly departing from Odoo `sale → account_payment → account`).',
          },
          sourceRef: {
            sectionLabel: { ar: '§1 و§2 و§9 الحدود الاستقلالية', en: '§1, §2 & §9 Independence' },
            sectionAnchor: 'kh-h-2-مدى-استقلالية-sales',
          },
        },
        {
          title: {
            ar: 'حسم معضلة «منسق الطلب» مقابل «مالك التنفيذ والبيانات» (D-SALES-07 & D-SALES-06)',
            en: 'Resolving Order Coordinator vs Execution Data Owner (D-SALES-07 & D-SALES-06)',
          },
          explanation: {
            ar: 'تحل الوثيقة التباسًا شهيرًا في تصميم الـ ERP: المبيعات تنسق دورة الطلب وتُطلق طلبات الحجز والشحن والفوترة، لكنها لا تملك On-hand ولا سجل الحجز المخزني (حُسم لـ Inventory) ولا الفاتورة المالية/AR/GL (Finance) ولا الـ PO (Procurement).',
            en: 'Resolves a central ERP ambiguity: Sales owns Sales Order coordination intent and emits requests/events, while Inventory owns On-hand and Reservation Records (D-SALES-06), Finance owns AR/GL, and Procurement owns POs.',
          },
          sourceRef: {
            sectionLabel: { ar: '§10 حدود التنسيق و§7 الحجز', en: '§10 Orchestration & §7 Reservation' },
            sectionAnchor: 'kh-h-10-order-coordination-orchestration-boundary',
          },
        },
        {
          title: {
            ar: 'التمييز بين كتالوج المنتج/الخدمة وبين المخزون المادي (D-SALES-05)',
            en: 'Product Catalog ≠ Inventory Stock Item (D-SALES-05)',
          },
          explanation: {
            ar: 'يثبت أن سطر البيع يتطلب Shared Product/Service Identity كمعرّف منضبط (وليس سطورًا حرة بلا منتج في المرحلة 2)، لكن وجود تعريف Product/Service لا يعني وجود سياق مخزني أو تفعيل Inventory.',
            en: 'Requires Shared Product/Service Identity for order lines in Phase 2 while clarifying that a Product/Service definition does not imply a Stock Context or Inventory dependency.',
          },
          sourceRef: {
            sectionLabel: { ar: '§5 حدود المنتج والخدمة', en: '§5 Product/Service Boundary' },
            sectionAnchor: 'kh-h-5-product-service-boundary',
          },
        },
      ],
      futureDesignImplications: [
        {
          area: {
            ar: 'التزامات المرحلة 5/6 الثلاثة المؤجلة في المبيعات (§16)',
            en: 'Three Explicit Deferred Architecture Commitments (§16)',
          },
          approvedConstraint: {
            ar: 'تبقى ثلاث حدود محورية غير محسومة عمدًا لئلا تُقيد المراحل القادمة: (A) مكان توليد كائن فاتورة العميل (Sales Billing Document أم Finance Invoice)، (B) موضع Pricing Engine (داخل Sales أم Shared Commercial Pricing Service)، (C) إبقاء التنسيق داخل Sales أم فصل Order Orchestration Service عند التوسع.',
            en: 'Three pivotal boundaries stay open by design: (A) Customer Invoice generation placement, (B) Pricing Engine placement (Sales vs Shared Service), and (C) Sales-internal coordination vs Standalone Order Orchestration Service.',
          },
          deferredToPhase: {
            ar: 'المرحلة 5 / المرحلة 6 (التزامات معمارية مؤجلة في §16).',
            en: 'Phase 5 / Phase 6 (Explicit Deferred Commitments in §16).',
          },
          sourceRef: {
            sectionLabel: { ar: '§16 التزامات التصميم المؤجلة', en: '§16 Deferred Commitments' },
            sectionAnchor: 'kh-h-deferred-architecture-commitments',
          },
        },
        {
          area: {
            ar: 'الائتمان والمخاطر المالية والموافقات (Credit & Workflow)',
            en: 'Credit Risk & Shared Workflow Policies',
          },
          approvedConstraint: {
            ar: 'حد الائتمان والمخاطر المالية ليست ملك Sales Core؛ يُذكر Credit Check مفاهيميًا كنقطة فحص اختيارية على مستوى الميزة في D-SALES-08 عبر Credit Capability (C* في مصفوفة PCD)، وليس مسجلاً كـ FLD مستقل في جدول §6 بالمصفوفة؛ أما بنية Credit Management وملكيتها النهائية (Finance أم Shared Risk) فمؤجلة للمرحلة 5/6، بينما تعمل الموافقات عبر Shared Workflow.',
            en: 'Credit limits and financial risk do not belong to Sales Core; D-SALES-08 references optional Credit Check conceptually alongside Credit Capability (C* in the PCD Matrix) rather than as a separately registered Core FLD in Matrix §6, while final Credit Management architecture and ownership (Finance vs Shared Risk) remain deferred to Phase 5/6 and approvals reuse Shared Platform Workflow.',
          },
          deferredToPhase: {
            ar: 'المرحلة 5/6 لقواعد الائتمان، والتوجيه والموافقات (Routing/SoD/Thresholds).',
            en: 'Phase 5/6 for Credit Management architecture and approval routing/SoD.',
          },
          sourceRef: {
            sectionLabel: { ar: '§11 التسعير والائتمان و§12 الموافقات', en: '§11 Pricing/Credit & §12 Workflow' },
            sectionAnchor: 'kh-h-11-pricing-credit-boundaries',
          },
        },
        {
          area: {
            ar: 'تعدد الشركات وقنوات البيع والشحن العابر للشركات',
            en: 'Multi-Company, Channels & Cross-Company Fulfillment',
          },
          approvedConstraint: {
            ar: 'لكل أمر بيع Company/Legal Entity owner، وإشارة المستودع على السطر لا تعني ملكية Sales للمخزون، بينما Intercompany Sales وCross-Company Fulfillment قدرات صريحة لاحقة.',
            en: 'Every Sales Order belongs to a Company/Legal Entity; referencing a warehouse never grants Sales inventory ownership; Intercompany and Cross-Company fulfillment remain explicit future capabilities.',
          },
          deferredToPhase: {
            ar: 'المرحلة 3 (Org/Branch/Channel) والمرحلة 6/9 (Intercompany & Cross-company fulfillment).',
            en: 'Phase 3 (Org/Branch/Channel) and Phase 6/9 (Intercompany & Cross-company fulfillment).',
          },
          sourceRef: {
            sectionLabel: { ar: '§14 أثر Multi-Company وMulti-Branch', en: '§14 Multi-Company Implications' },
            sectionAnchor: 'kh-h-14-multi-company-multi-branch-implications',
          },
        },
      ],
    },
    designReasoning: [
      {
        id: 'sales-reason-coordination-vs-ownership',
        topic: {
          ar: 'الفرق المعماري بين «تنسيق دورة الطلب» و«ملكية بيانات التنفيذ» (D-SALES-07)',
          en: 'Order Coordination Intent vs Execution Data Ownership (D-SALES-07)',
        },
        officialReasoning: {
          ar: 'توضح §10 وD-SALES-07 أن Sales يملك Sales Order lifecycle وcoordination intent ويطلق Requests/Events إلى Finance وInventory وProcurement، لكنه لا يملك نتيجة التنفيذ داخل تلك المجالات (لا On-hand، لا GL، لا PO، لا Payment). ولا يعتمد الآن وجود Standalone Orchestration Service منفصل.',
          en: 'Section §10 and D-SALES-07 clarify that Sales owns Sales Order lifecycle and coordination intent—emitting requests/events—without owning peer execution data (On-hand, GL, PO, Payment), and without forcing a standalone orchestrator in Phase 2.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: في سلاسل Order-to-Cash تتداخل الطلبات والشحن والفوترة؛ إذا خلط المعماري بين «من ينسق العملية» و«من يملك البيانات الناتجة»، ينتهي النظام إلى تبعيات دائرية (Circular HBMDs). حصر المبيعات في Coordination Intent يحافظ على نقاء حدود كل وحدة.',
          en: 'Educational Interpretation: Confusing process coordination with data ownership creates circular dependencies across Order-to-Cash. Scoping Sales to Coordination Intent keeps data authority clean and dependency graphs acyclic.',
        },
        architecturalImplication: {
          ar: 'يحتفظ Sales بنية التنفيذ والفوترة والتوريد فقط، ويقرأ حالة الحجز والصرف والـ AR والدفع عبر مراجع CIC.',
          en: 'Sales stores coordination intent only, consuming fulfillment, AR, payment, and PO statuses via CIC references.',
        },
        sourceRef: {
          sectionLabel: { ar: '§10 حدود تنسيق الطلب', en: '§10 Order Coordination Boundary' },
          sectionAnchor: 'kh-h-10-order-coordination-orchestration-boundary',
        },
      },
      {
        id: 'sales-reason-service-sales',
        topic: {
          ar: 'بيع الخدمات والبنود غير المخزنية كبرهان ضد الاعتماد الصلب على المخزون (D-SALES-05 & D-SALES-10)',
          en: 'Service & Non-Stock Sales Proving 0 HBMD on Inventory (D-SALES-05 & D-SALES-10)',
        },
        officialReasoning: {
          ar: 'تؤكد §2 و§5 وD-SALES-05 وD-SALES-10 أن Product Catalog ≠ Inventory Item وأن بيع الخدمات والبنود غير المخزنية مسار First-Class لا يتطلب Inventory، بينما تظل الحاجة إلى Inventory محصورة في ميزة Stock Sale & Stock Fulfillment عبر FLD/CIC.',
          en: 'Sections §2, §5, D-SALES-05, and D-SALES-10 establish that Product Catalog ≠ Inventory Item and treat Service/Non-stock sales as a First-Class path requiring zero Inventory module, scoping Stock Sale strictly to FLD + CIC.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: حتى لو كان العميل المستقبلي يبيع سلعًا مخزنية غالبًا، فإن وجود مسار خدماتي مستقل يمنع النظام من افتراض وجود مستودعات في كل سيناريو بيع (الاشتراكات، الاستشارات، التراخيص، رسوم الخدمات).',
          en: 'Educational Interpretation: Even when physical retail is common, making Service/Non-stock sales first-class ensures subscriptions, consulting, digital goods, and fees work without artificial warehouse setup.',
        },
        architecturalImplication: {
          ar: 'Shared Product/Service Identity قدرة منصة مطلوبة (Required PCD)، بينما Inventory Storage/Fulfillment Context قدرة مشروطة (Conditional PCD).',
          en: 'Shared Product/Service Identity is a Required PCD, while Inventory Storage/Fulfillment Context remains Conditional (`C`).',
        },
        sourceRef: {
          sectionLabel: { ar: '§5 حدود المنتج والخدمة وD-SALES-10', en: '§5 Product/Service & D-SALES-10' },
          sectionAnchor: 'kh-h-5-product-service-boundary',
        },
      },
      {
        id: 'sales-reason-reservation-and-odoo',
        topic: {
          ar: 'حسم ملكية الحجز للمخزون والاستقلال المقصود عن المحاسبة وCRM (D-SALES-02 & D-SALES-06)',
          en: 'Inventory Reservation Ownership & Decoupling from Accounting/CRM (D-SALES-02 & D-SALES-06)',
        },
        officialReasoning: {
          ar: 'تحسم §7 (D-SALES-06) أن Physical Reservation Records مملوكة للمخزون لا للمبيعات، كما توثق §1 (D-SALES-02) و§9 خروج Teranoo المقصود عن ربط `sale → account_payment → account` في Odoo وعدم اشتراط CRM لتفعيل Sales.',
          en: 'Section §7 (D-SALES-06) confirms Physical Reservation Records belong to Inventory rather than Sales, while §1 (D-SALES-02) and §9 document intentional decoupling from Odoo `sale → account_payment → account` and future CRM.',
        },
        educationalInterpretation: {
          ar: 'تفسير تعليمي: إبقاء CRM خارج Business Core للمبيعات يمنع تداخل Quote/Order Management مع إدارة الفرص التسويقية (Leads/Pipelines)، بينما يبقي التوسع مفتوحًا لتلقي Quote/Opportunity عبر CIC عند إضافة CRM لاحقًا.',
          en: 'Educational Interpretation: Keeping CRM external to core Sales prevents pipeline management from blocking order execution while preserving a clean CIC intake path for future CRM quotes/opportunities.',
        },
        architecturalImplication: {
          ar: 'تُعالج علاقات Stock Sale (FLD-CORE-01) وCustomer Billing (FLD-CORE-02) وDrop Ship (FLD-CORE-03) كـ FLDs وعقود CIC مسجلة مع 0 HBMD، بينما يرتبط Credit Check المفاهيمي (D-SALES-08) بقدرة Credit Capability (C* — بنية الائتمان وملكيته مؤجلة دون صف FLD/CIC منفصل في المصفوفة).',
          en: 'Stock Sale (FLD-CORE-01), Customer Billing (FLD-CORE-02), and Drop Ship (FLD-CORE-03) operate as registered Core FLDs and CICs with 0 HBMDs, while conceptual Credit Check (D-SALES-08) relies on Credit Capability (C*, with Credit Management architecture and ownership deferred and no standalone §6 FLD/CIC row).',
        },
        sourceRef: {
          sectionLabel: { ar: '§7 الحجز و§9 حدود CRM', en: '§7 Reservation & §9 CRM Boundary' },
          sectionAnchor: 'kh-h-reservation-ownership',
        },
      },
    ],
    absentPeerScenarios: [
      {
        absentPeerName: { ar: 'غياب المخزون (Inventory)', en: 'Without Inventory' },
        absentPeerCode: 'MOD-INV',
        standaloneBehavior: {
          ar: 'تعمل عروض الأسعار وأوامر البيع وبيع الخدمات والبنود غير المخزنية (D-SALES-10) بصورة مستقلة.',
          en: 'Quotations, Sales Orders, and service/non-stock sales (D-SALES-10) run standalone.',
        },
        unavailableCapabilities: {
          ar: 'تغيب ميزة بيع السلع المخزنية والتحقق من التوفر (Availability) والحجز المخزني (Reservation) والصرف والشحن الفعلي.',
          en: 'Stock Sale, stock availability checks, Physical Reservations, and Goods Issue/shipment execution are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-INV-001 + FLD Stock Sale & Fulfillment',
        sourceRef: {
          sectionLabel: { ar: '§2 و§7 المبيعات ↔ المخزون', en: '§2 & §7 Sales ↔ Inventory' },
          sectionAnchor: 'kh-h-7-sales-inventory-warehouse-boundary',
        },
      },
      {
        absentPeerName: { ar: 'غياب المالية (Finance)', en: 'Without Finance' },
        absentPeerCode: 'MOD-FIN',
        standaloneBehavior: {
          ar: 'يدير النظام إنشاء وتأكيد عروض الأسعار وأوامر البيع والالتزامات التجارية تجاه العملاء.',
          en: 'Sales handles quote creation, Sales Order confirmation, and commercial customer commitments.',
        },
        unavailableCapabilities: {
          ar: 'تغيب فوترة العميل المالية (Customer Billing / FLD-CORE-02) والذمم المدينة (AR) والتحصيل والإيراد وGL، وكذلك التحقق الائتماني المالي عند غياب قدرات المخاطر المالية (حد §2 الحرج — مع بقاء بنية Credit Management وملكيتها مؤجلة للمرحلة 5/6).',
          en: 'Financial Customer Billing (FLD-CORE-02), AR, collections, Revenue Posting, GL, and financial Credit Check exposure checks are unavailable (explicit §2 limit; Credit Management architecture and ownership remain deferred to Phase 5/6).',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-FIN-001 + FLD Customer Billing',
        sourceRef: {
          sectionLabel: { ar: '§2 حد مهم و§6 المبيعات ↔ المالية', en: '§2 Key Limit & §6 Sales ↔ Finance' },
          sectionAnchor: 'kh-h-6-sales-finance-boundary',
        },
      },
      {
        absentPeerName: { ar: 'غياب المشتريات (Procurement)', en: 'Without Procurement' },
        absentPeerCode: 'MOD-PROC',
        standaloneBehavior: {
          ar: 'تستمر دورة البيع الأساسية وبيع الخدمات والمخزون دون أي تعطيل.',
          en: 'Core Sales Order cycles for services and stocked items run unaffected.',
        },
        unavailableCapabilities: {
          ar: 'تغيب مسارات الشحن المباشر من المورد للعميل (Drop Ship / Direct Delivery / Back-to-Back).',
          en: 'Drop Ship, Direct Delivery, and Back-to-Back supplier fulfillment workflows are unavailable.',
        },
        bridgeContractOrFld: 'CIC-CORE-SALES-PROC-001 + FLD Drop Ship',
        sourceRef: {
          sectionLabel: { ar: '§8 المبيعات ↔ المشتريات', en: '§8 Sales ↔ Procurement' },
          sectionAnchor: 'kh-h-8-sales-procurement-boundary',
        },
      },
    ],
    ownershipBoundaryMatrix: [
      {
        domainConcept: {
          ar: 'أمر البيع والالتزام التجاري ونية التنسيق (Sales Order & Intent)',
          en: 'Sales Order, Commercial Commitment & Coordination Intent',
        },
        moduleOwns: {
          ar: 'Quote / Sales Order، الكمية المطلوبة/المؤكدة تجاريًا، الشروط التجارية، ونية التنفيذ والفوترة.',
          en: 'Quote/Sales Order, ordered/confirmed commercial quantity, commercial terms, and fulfillment/billing intent.',
        },
        consumesOrReferences: {
          ar: 'Shared Customer/Party Identity، Shared Product/Service Identity، UOM، Currency، Pricing/Credit (C*).',
          en: 'Shared Customer/Party Identity, Product/Service Identity, UOM, Currency, and Pricing/Credit (C*).',
        },
        otherModulesOwn: {
          ar: 'Inventory يملك الحجز والرصيد والشحن؛ Finance يملك AR/الإيراد/GL؛ Procurement يملك PO في Drop Ship.',
          en: 'Inventory owns Reservations/On-hand/Shipping; Finance owns AR/Revenue/GL; Procurement owns Drop-Ship POs.',
        },
        unresolvedBoundary: {
          ar: 'بنية Orchestrator (داخل Sales أم خدمة مستقلة)، وملكية Quote النهائية مع CRM المستقبلي (المرحلة 5/6).',
          en: 'Orchestration implementation (Sales-internal vs dedicated service) and final Quote ownership with future CRM (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§9 و§10 و§16', en: '§9, §10 & §16' },
          sectionAnchor: 'kh-h-10-order-coordination-orchestration-boundary',
        },
      },
      {
        domainConcept: {
          ar: 'سجل الحجز المخزني والتنفيذ الفعلي (Reservation & Fulfillment)',
          en: 'Physical Reservation Record & Stock Fulfillment',
        },
        moduleOwns: {
          ar: 'نية وطلب الحجز والتنفيذ ومرجع الطلب على السطر.',
          en: 'Reservation/fulfillment intent and commercial demand reference.',
        },
        consumesOrReferences: {
          ar: 'Inventory Storage Context (C) وحالة التوفر والحجز والشحن عبر CIC-CORE-SALES-INV-001.',
          en: 'Inventory Storage Context (C) plus availability, reservation, and shipment status via CIC-CORE-SALES-INV-001.',
        },
        otherModulesOwn: {
          ar: 'Inventory يملك On-hand والحركات الفيزيائية وPhysical Reservation Records (D-SALES-06) وGoods Issue.',
          en: 'Inventory owns On-hand, movements, Physical Reservation Records (D-SALES-06), and Goods Issue.',
        },
        unresolvedBoundary: {
          ar: 'خوارزميات Soft vs Hard Reservation، Allocation Priority، وتنسيق الشحن التفصيلي (المرحلة 6).',
          en: 'Soft vs Hard Reservation rules, Allocation Priority, and Shipment orchestration details (Phase 6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§7 الحجز المخزني', en: '§7 Reservation Ownership' },
          sectionAnchor: 'kh-h-7-sales-inventory-warehouse-boundary',
        },
      },
      {
        domainConcept: {
          ar: 'الفوترة والتسعير والائتمان (Customer Billing, Pricing & Credit)',
          en: 'Customer Billing, Pricing Engine & Credit Risk',
        },
        moduleOwns: {
          ar: 'السعر/النتيجة التجارية على مستند البيع وبيانات نية الفوترة فقط.',
          en: 'Commercial price/result on the Sales Order and billing intent data only.',
        },
        consumesOrReferences: {
          ar: 'Pricing Capability (C*) وCredit Capability (C*) عبر عقد تكامل عند التفعيل.',
          en: 'Pricing Capability (C*) and Credit Capability (C*) via contract when enabled.',
        },
        otherModulesOwn: {
          ar: 'Finance يملك AR، التحصيل، الإيراد المحاسبي، وGL Posting؛ أما ملكية وبنية Credit Management والمخاطر المالية (Finance أم Shared Risk) فحدّ مؤجل صريح.',
          en: 'Finance owns AR, Collections, Revenue Accounting, and GL Posting; Credit Management and financial Credit Risk ownership (Finance vs Shared Risk) remains an explicit deferred boundary.',
        },
        unresolvedBoundary: {
          ar: 'مكان توليد كائن فاتورة العميل (Customer Invoice Generation) وموضع Pricing Engine وتصميم وملكية Credit Management مؤجلة (المرحلة 5/6).',
          en: 'Customer Invoice generation placement, Pricing Engine placement, and Credit Management architecture/ownership remain deferred (Phase 5/6).',
        },
        sourceRef: {
          sectionLabel: { ar: '§6 و§11 و§16', en: '§6, §11 & §16' },
          sectionAnchor: 'kh-h-11-pricing-credit-boundaries',
        },
      },
      {
        domainConcept: {
          ar: 'هوية العميل والمنتج/الخدمة (Shared Customer & Product/Service)',
          en: 'Customer & Product/Service Identities',
        },
        moduleOwns: {
          ar: 'Customer Commercial Sales Context وProduct Sales Context فقط.',
          en: 'Customer Commercial Sales Context and Product Sales Context only.',
        },
        consumesOrReferences: {
          ar: 'Shared Customer/Party Identity وShared Product/Service Identity (Required PCDs).',
          en: 'Shared Customer/Party Identity and Shared Product/Service Identity (Required PCDs).',
        },
        otherModulesOwn: {
          ar: 'المنصة تملك الهويات المشتركة؛ Finance يملك Customer Financial Context؛ CRM يملك Relationship Context لاحقًا.',
          en: 'Platform owns shared identities; Finance owns Financial Customer Context; future CRM owns Relationship Context.',
        },
        unresolvedBoundary: {
          ar: 'ملكية صفات العميل التفصيلية (Payment Terms, Tax, Contacts, Pricing Group) مؤجلة للمرحلة 5/6.',
          en: 'Attribute-level ownership (Payment Terms, Tax, Contacts, Pricing Group) deferred to Phase 5/6.',
        },
        sourceRef: {
          sectionLabel: { ar: '§4 و§5 حدود العميل والمنتج', en: '§4 & §5 Customer/Product' },
          sectionAnchor: 'kh-h-4-customer-party-boundary',
        },
      },
    ],
    deferredBoundaryRationales: [
      {
        topic: {
          ar: 'مكان توليد فاتورة العميل (Customer Invoice Generation Boundary)',
          en: 'Customer Invoice Generation Boundary',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6 (التزام مؤجل A)', en: 'Phase 5 / Phase 6 (Deferred Commitment A)' },
        whyDeferredInSource: {
          ar: 'توضح §6 و§16 (A) أن الأنظمة المرجعية تدعم نموذجين صحيحين: توليد الكائن التجاري للفاتورة من Sales أو توليده داخل Finance؛ وفي الحالتين يظل الوجه المالي (AR/GL) ملكًا للمالية.',
          en: 'Sections §6 and §16(A) explain that enterprise benchmarks support two valid models (Sales-generated commercial billing vs Finance-created invoice), while AR/Revenue/GL always stay in Finance.',
        },
        approvedPhase2Boundary: {
          ar: 'Sales يملك Sales Order ونية الفوترة، وFinance يملك AR والتحصيل وGL؛ وFLD Customer Billing موسوم بتأجيل الفاتورة.',
          en: 'Sales owns SO/billing intent and Finance owns AR/GL; Customer Billing FLD explicitly marks invoice generation deferred.',
        },
        sourceRef: {
          sectionLabel: { ar: '§16 التزام A: فاتورة العميل', en: '§16 Commitment A: Customer Invoice' },
          sectionAnchor: 'kh-h-deferred-architecture-commitments',
        },
      },
      {
        topic: {
          ar: 'موضع وملكية محرك التسعير وإدارة الائتمان (Pricing Engine & Credit)',
          en: 'Pricing Engine Placement & Credit Management Architecture',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6 (التزام مؤجل B + C* PCD)', en: 'Phase 5 / Phase 6 (Deferred Commitment B + C*)' },
        whyDeferredInSource: {
          ar: 'تشير §11 و§16 (B) إلى وجود نموذجين عالميين: محرك تسعير داخل المبيعات أو خدمة تسعير تجارية مشتركة (Shared Commercial Pricing Service)؛ كما أن Credit Limit مرتبط بمخاطر المالية.',
          en: 'Sections §11 and §16(B) highlight valid alternatives (Sales-resident Pricing vs Shared Commercial Pricing Service), while Credit Risk touches Finance exposure.',
        },
        approvedPhase2Boundary: {
          ar: 'يستهلك Sales التسعير والائتمان بوسم `C*` (مشروط مع تأجيل المالك) ويملك السعر الناتج على المستند التجاري.',
          en: 'Pricing and Credit appear as `C*` in the PCD matrix; Sales owns only the resulting commercial document price.',
        },
        sourceRef: {
          sectionLabel: { ar: '§11 و§16 التزام B: التسعير', en: '§11 & §16 Commitment B: Pricing' },
          sectionAnchor: 'kh-h-pricing',
        },
      },
      {
        topic: {
          ar: 'آلية تنسيق الطلبات (Order Orchestration) وخوارزميات الحجز/الشحن',
          en: 'Order Orchestration Implementation & Reservation/Shipment Algorithms',
        },
        targetPhase: { ar: 'المرحلة 5 / المرحلة 6 (التزام مؤجل C)', en: 'Phase 5 / Phase 6 (Deferred Commitment C)' },
        whyDeferredInSource: {
          ar: 'يمنع تأجيل قرار «خدمة Orchestration منفصلة أم داخل Sales» والامتناع عن تصميم Soft/Hard Reservation في المرحلة 2 فرض تعقيد هندسي مبكر قبل حسم بنية الأحداث في المرحلة 5.',
          en: 'Deferring standalone orchestrator topology and Soft/Hard reservation rules prevents premature service proliferation before Phase 5 event architecture.',
        },
        approvedPhase2Boundary: {
          ar: 'Sales يملك coordination intent، وInventory يملك Reservation Record Ownership (D-SALES-06).',
          en: 'Sales owns coordination intent; Inventory owns Reservation Records (D-SALES-06).',
        },
        sourceRef: {
          sectionLabel: { ar: '§10 و§16 التزام C: التنسيق', en: '§10 & §16 Commitment C: Orchestration' },
          sectionAnchor: 'kh-h-deferred-architecture-commitments',
        },
      },
    ],
    decisionDetails: {
      'D-SALES-01': {
        decisionId: 'D-SALES-01',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يعتمد المبيعات وإدارة الطلبات كوحدة أولية مستقلة قادرة على إدارة عروض الأسعار وأوامر البيع والخدمات تشغيليًا دون توقف على بقية الوحدات.',
          en: 'Educational Interpretation: Establishes Sales & Order Management as a First-Class Sellable standalone module capable of handling quotes, Sales Orders, and service sales operationally.',
        },
        architecturalImplication: {
          ar: 'يجب أن تعمل دورة الالتزام التجاري مع العميل بالكامل حتى مع غياب المخزون أو المالية أو المشتريات أو CRM.',
          en: 'Customer commercial commitment workflows must run end-to-end operationally even when Inventory, Finance, Procurement, and CRM are inactive.',
        },
        relevantLimitations: {
          ar: 'لا يغلق النظام وحده دورة Order-to-Cash كاملة: الشحن المخزني والفوترة المالية والشحن المباشر تحتاج عقود CIC مشروطة.',
          en: 'Does not complete full Order-to-Cash standalone: stock fulfillment, billing/AR, and Drop Ship require peer CICs.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§1 تعريف Sales و§2 الحد المهم', en: '§1 Definition & §2 Key Limit' }, sectionAnchor: 'kh-h-1-تعريف-sales-order-management-داخل-المنتج' },
        ],
      },
      'D-SALES-02': {
        decisionId: 'D-SALES-02',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يؤكد غياب أي HBMD على المالية أو المخزون أو المشتريات أو CRM، مسجلاً بوضوح أن هذا انفصال مقصود عن بنية Odoo `sale → account_payment → account`.',
          en: 'Educational Interpretation: Enforces 0 HBMDs on Finance, Inventory, Procurement, and CRM, explicitly contrasting Teranoo against Odoo’s `sale → account_payment → account` coupling.',
        },
        architecturalImplication: {
          ar: 'لا يفرض نظام المبيعات تفعيل المحاسبة أو المستودعات عند التفعيل الأساسي داخل المنصة.',
          en: 'Module activation gating enforces zero peer-module preconditions on Sales.',
        },
        relevantLimitations: {
          ar: 'حد القرار الصريح: اختيار تصميمي مقصود لتيرانو لا يدّعي أن جميع أنظمة ERP العالمية تتبعه.',
          en: 'Explicit limit: intentional modular choice by Teranoo rather than a claim about universal ERP practice.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§2 مدى استقلالية Sales', en: '§2 Sales Independence' }, sectionAnchor: 'kh-h-2-مدى-استقلالية-sales' },
        ],
      },
      'D-SALES-03': {
        decisionId: 'D-SALES-03',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يربط تشغيل المبيعات المستقل بقدرات المنصة وبيانات الأعمال المشتركة (Shared Customer/Product + UOM + Currency)، مع إبقاء Pricing وCredit وStorage وTax مشروطة.',
          en: 'Educational Interpretation: Grounds standalone Sales in Platform and Shared Business Foundations (Customer, Product/Service, UOM, Currency) while keeping Pricing, Credit, Storage, and Tax conditional.',
        },
        architecturalImplication: {
          ar: 'يفصل بوضوح في مصفوفة PCD بين 9 قدرات مطلوبة (`R`) و6 مشروطة (`C`) وقدرتين بوسم `C*` (Pricing & Credit).',
          en: 'Produces 9 Required (`R`), 6 Conditional (`C`), and 2 `C*` (Pricing & Credit) rows in the PCD Matrix.',
        },
        relevantLimitations: {
          ar: 'حد القرار: لا يعتمد تصميم هياكل Tenant/Branch/Sales Org أو محرك التسعير أو نماذج Customer/Product التفصيلية.',
          en: 'Explicit limit: does not design Tenancy, Sales Org hierarchy, Pricing Engine, or Customer/Product schemas.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§3 اعتماديات المنصة', en: '§3 Platform Dependencies' }, sectionAnchor: 'kh-h-31-required-platform-capabilities' },
        ],
      },
      'D-SALES-04': {
        decisionId: 'D-SALES-04',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يفصل هوية العميل المشتركة على مستوى المنصة عن ثلاث سياقات متمايزة: تجاري في المبيعات، ومالي في المالية، وعلاقات عملاء في CRM المستقبلي.',
          en: 'Educational Interpretation: Splits Shared Customer Party Identity (Platform) from Commercial Sales Context (Sales), Financial Context (Finance), and Relationship Context (future CRM).',
        },
        architecturalImplication: {
          ar: 'تمنع تداخل البيانات وتكرار العملاء وتبقي CRM اختياريًا تمامًا لتشغيل أوامر البيع.',
          en: 'Prevents customer record duplication while ensuring CRM never becomes a prerequisite for Sales Orders.',
        },
        relevantLimitations: {
          ar: 'توزيع الصفات التفصيلية (Payment Terms, Tax, Contacts, Pricing Group) مؤجل إلى المرحلة 5/6.',
          en: 'Attribute-level ownership (Payment Terms, Tax, Contacts, Pricing Group) remains deferred to Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§4 حدود العميل والطرف', en: '§4 Customer / Party Boundary' }, sectionAnchor: 'kh-h-4-customer-party-boundary' },
        ],
      },
      'D-SALES-05': {
        decisionId: 'D-SALES-05',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يحسم فارقًا دقيقًا: كل سطر بيعي يحتاج تعريف Product/Service مشتركًا (لضبط الكتالوج في المرحلة 2)، لكن التعريف نفسه لا يستلزم وجود مخزون أو سياق مستودع.',
          en: 'Educational Interpretation: Clarifies that order lines consume a Shared Product/Service Identity (Required PCD in Phase 2), without implying stock tracking or Inventory activation.',
        },
        architecturalImplication: {
          ar: 'Product Catalog ≠ Inventory Item؛ نفس الهوية تخدم بيع الخدمات والاشتراكات والسلع المادية بمرونة.',
          en: 'Enforces Product Catalog ≠ Inventory Item across service, subscription, and physical product lines.',
        },
        relevantLimitations: {
          ar: 'لا تُعتمد سطور البيع الحرة بلا منتج (Free-form productless lines) كحالة أساسية في المرحلة 2؛ أي استثناء مستقبلي قرار وظيفي لاحق.',
          en: 'Free-form productless lines are not adopted as a Phase 2 baseline; any future allowance is a functional policy decision.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§5 حدود المنتج والخدمة', en: '§5 Product / Service Boundary' }, sectionAnchor: 'kh-h-5-product-service-boundary' },
        ],
      },
      'D-SALES-06': {
        decisionId: 'D-SALES-06',
        educationalExplanation: {
          ar: 'تفسير تعليمي: أهم قرار حدودي في المبيعات: يفصل بين الثلاثي التجاري (Sales Order/Ordered Qty) والفيزيائي (Inventory On-hand + Reservation Record + Goods Issue) والمالي (Finance AR/Revenue/GL).',
          en: 'Educational Interpretation: The keystone ownership decision for Sales—separating commercial (Sales Order/Ordered Qty), physical (Inventory On-hand, Reservations, Goods Issue), and financial (Finance AR/Revenue/GL) authority.',
        },
        architecturalImplication: {
          ar: 'حُسم به نهائيًا أن Physical Reservation Record مملوك لـ Inventory لا لـ Sales، مما أُكد أيضًا بملاحظة المزامنة في وثيقة Inventory.',
          en: 'Settled Reservation Record ownership definitively for Inventory, synchronized back into INVENTORY_MODULE_MODEL.md.',
        },
        relevantLimitations: {
          ar: 'حد القرار: مكان توليد Customer Invoice وتفاصيل Shipment orchestration والخوارزميات الحجزية تظل مؤجلة.',
          en: 'Explicit limit: Customer Invoice generation placement, shipment orchestration, and reservation algorithms remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§6 و§7 حدود المالية والمخزون والحجز', en: '§6 & §7 Finance/Inventory/Reservation' }, sectionAnchor: 'kh-h-reservation-ownership' },
        ],
      },
      'D-SALES-07': {
        decisionId: 'D-SALES-07',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يقرّ بدور Sales كـ«صاحب نية التنسيق» (Coordination Intent) للطلب الذي يطلق الطلبات والأحداث للوحدات الأخرى دون امتلاك جداولها التنفيذية.',
          en: 'Educational Interpretation: Establishes Sales as the holder of order coordination intent, triggering peer modules via requests/events without owning their execution tables.',
        },
        architecturalImplication: {
          ar: 'تبقى أوامر الشراء الخاصة بـ Drop Ship داخل Procurement والحجز داخل Inventory والفوترة المالية داخل Finance.',
          en: 'Drop-Ship POs remain in Procurement, stock reservations in Inventory, and AR/GL in Finance.',
        },
        relevantLimitations: {
          ar: 'حد القرار: لا يعتمد وجود خدمة Orchestration مستقلة الآن؛ يُؤجل الاختيار بين التنسيق الداخلي أو الخدمة المستقلة للمرحلة 5/6.',
          en: 'Explicit limit: defers choosing between Sales-internal orchestration and a standalone Orchestration Service until Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§10 حدود تنسيق الطلبات', en: '§10 Order Coordination' }, sectionAnchor: 'kh-h-10-order-coordination-orchestration-boundary' },
        ],
      },
      'D-SALES-08': {
        decisionId: 'D-SALES-08',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يضبط كافة الروابط الخارجية كعقود CIC واعتماديات ميزة FLD دون إغلاق لتفعيل المبيعات؛ وتسجّل المصفوفة (§6) ثلاثة FLDs أساسية للمبيعات (Stock Sale: FLD-CORE-01، وCustomer Billing: FLD-CORE-02، وDrop Ship: FLD-CORE-03)، بينما يرتبط Credit Check المفاهيمي بـ Credit Capability (C* — بنية الائتمان وملكيته مؤجلة) وتبقى Project Sale وMTO توسعات مستقبلية.',
          en: 'Educational Interpretation: Keeps all peer links governed by CICs and FLDs without blocking core Sales activation; Matrix §6 registers three Sales Core FLDs (Stock Sale: FLD-CORE-01, Customer Billing: FLD-CORE-02, Drop Ship: FLD-CORE-03), while conceptual Credit Check relies on Credit Capability (C*, Credit architecture/ownership deferred) and Project Sale/MTO represent future extensions.',
        },
        architecturalImplication: {
          ar: 'يتم عزل تعطل أي طرف خارجي داخل الميزة المتصلة به فقط بينما يظل نظام المبيعات الأساسي قابلًا للتشغيل.',
          en: 'Unavailability of any peer module impacts only its corresponding FLD feature while core Sales stays active.',
        },
        relevantLimitations: {
          ar: 'لا يُعد Credit Check اعتمادية ميزة أساسية مسجّلة في §6 ولا عقد CIC مستقلًا، وتبقى ملكية Credit Management والتصميم التفصيلي لـ Customer Billing وDrop Ship وCredit Check مؤجلة للمرحلة 5/6.',
          en: 'Credit Check is not a separately registered §6 Core FLD or standalone Core CIC; Credit Management ownership and detailed operational workflows for Customer Billing, Drop Ship, and Credit Check remain deferred until Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§8 و§11 و§16', en: '§8, §11 & §16' }, sectionAnchor: 'kh-h-8-sales-procurement-boundary' },
        ],
      },
      'D-SALES-09': {
        decisionId: 'D-SALES-09',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يوجب استخدام محرك الموافقات المشترك في المنصة لأي سياسات اعتماد أو حظر (Blocks/Exceptions) على عروض الأسعار والطلبات والخصومات والائتمان.',
          en: 'Educational Interpretation: Mandates Shared Platform Workflow/Approvals for quote/SO approvals, discount exceptions, and credit blocks instead of duplicating a workflow engine.',
        },
        architecturalImplication: {
          ar: 'يعامل الموافقات كقدرة مشروطة بالتهيئة (Configuration-dependent) لا كخطوة مفروضة صلبًا على كل أمر بيع.',
          en: 'Approval workflows remain configuration-driven Conditional PCDs rather than hardcoded pipeline gates.',
        },
        relevantLimitations: {
          ar: 'قواعد Routing وThresholds وDelegations وSoD مؤجلة إلى المرحلة 5/6.',
          en: 'Routing, thresholds, delegations, and SoD policies remain deferred to Phase 5/6.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§12 حدود الموافقات', en: '§12 Workflow Boundary' }, sectionAnchor: 'kh-h-12-workflow-approval-boundary' },
        ],
      },
      'D-SALES-10': {
        decisionId: 'D-SALES-10',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يرفع بيع الخدمات والبنود غير المخزنية إلى مسار من الدرجة الأولى داخل المبيعات، ما يكرّس عدم حاجته للمخزون مع إبقاء تنفيذ الخدمة لاحقًا منفصلًا.',
          en: 'Educational Interpretation: Elevates Service and Non-Stock Sales into a First-Class Sales path completely independent of Inventory while keeping downstream Service Execution separate.',
        },
        architecturalImplication: {
          ar: 'يسمح بتشغيل نماذج أعمال خدمية ومختلطة دون تضخيم متطلبات التفعيل.',
          en: 'Enables pure service and hybrid business models without inflating module activation requirements.',
        },
        relevantLimitations: {
          ar: 'تفاصيل تسليم وتنفيذ الخدمات نفسها (Service Execution) تُعالج لاحقًا كقدرة منفصلة.',
          en: 'Downstream Service Execution and delivery tracking remain separate future capabilities.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§2 و§5 حدود الخدمات', en: '§2 & §5 Service Sales' }, sectionAnchor: 'kh-h-5-product-service-boundary' },
        ],
      },
      'D-SALES-11': {
        decisionId: 'D-SALES-11',
        educationalExplanation: {
          ar: 'تفسير تعليمي: يطبق قاعدة Freeze, not Delete على تاريخ المبيعات وأوامر البيع، مع التمييز الصارم بين إيقاف الوحدة وتعطيل عميل وإغلاق طلب مفتوح والأرشفة.',
          en: 'Educational Interpretation: Applies Freeze, not Delete to Sales history while distinguishing Functional Freeze, Customer Inactivation, Order Closure, and Archiving.',
        },
        architecturalImplication: {
          ar: 'يمنع حذف أوامر البيع التي يرتبط بها تاريخ أو مستندات مالية/مخزنية، ويلزم التكاملات بحالة معلنة عند التوقف.',
          en: 'Protects Sales Orders linked to audit/document history from physical deletion and requires declared integration freeze states.',
        },
        relevantLimitations: {
          ar: 'سياسات License Deactivation وRead-Only والاحتفاظ وإعادة التفعيل وأوامر البيع المفتوحة مؤجلة.',
          en: 'License deactivation, Read-Only mode, open-order disposition, retention, and reactivation remain deferred.',
        },
        relatedSourceSections: [
          { sectionLabel: { ar: '§13.2 قواعد الإيقاف', en: '§13.2 Deactivation' }, sectionAnchor: 'kh-h-132-deactivation' },
        ],
      },
    },
  },
};
