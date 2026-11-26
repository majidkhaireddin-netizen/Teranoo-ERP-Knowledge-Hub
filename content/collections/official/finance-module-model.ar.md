---
id: kh-doc-finance-module-model-ar
slug: finance-module-model
title:
  ar: "نموذج وحدة المالية (FINANCE_MODULE_MODEL.md)"
  en: "Finance Module Model (FINANCE_MODULE_MODEL.md)"
subtitle:
  ar: "معمارية وحدة المالية واستقلاليتها واعتماديات المنصة وحدود التكامل وقرارات D-FIN-01 إلى D-FIN-06"
  en: "Finance module architecture, standalone boundaries, platform dependencies, integration contracts, and decisions D-FIN-01..06"
description:
  ar: "النص الرسمي الكامل لنموذج وحدة المالية في المرحلة 2: الاستقلالية التامة عن الوحدات التجارية، الاعتماد على المنصة المشتركة، حدود الأثر المالي والدفتر العام، ومبدأ التجميد بدل الحذف."
  en: "Complete verbatim Phase 2 Finance Module Model covering standalone activation, platform capability dependencies, ledger posting ownership, conditional integration boundaries, and decisions D-FIN-01 through D-FIN-06."
language: ar
type: module-model
classification: official
editorialStatus: published
publicationStatus: public
approvalStatus: approved
implementationStatus: not-started
depth: L3
journeyStages:
  - architecture
phaseRefs:
  - phase-2
moduleRefs:
  - finance
domainRefs:
  - identity-access
  - audit-trail
  - calendar
  - currency
  - reporting
  - configuration
  - integration
  - localization
  - tax
  - workflow-approvals
  - shared-master-data
  - documents-attachments
topics:
  - architecture
  - accounting
  - governance
  - data-governance
tags:
  - teranoo-erp
  - phase-2
  - batch-002
  - finance
  - module-model
  - standalone
  - freeze-not-delete
traceability:
  decisionIds:
    - D-FIN-01
    - D-FIN-02
    - D-FIN-03
    - D-FIN-04
    - D-FIN-05
    - D-FIN-06
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: references
    targetId: kh-doc-dependency-model-ar
    label:
      ar: "نموذج الاعتماديات والحوكمة الرسمي (DEPENDENCY_MODEL.md)"
      en: "Official Dependency Model & Governance (DEPENDENCY_MODEL.md)"
  - type: references
    targetId: kh-doc-module-dependency-matrix-ar
    label:
      ar: "مصفوفة الاعتماديات البينية وسجلات العقود (MODULE_DEPENDENCY_MATRIX.md)"
      en: "Core Module Dependency Matrix & Registers (MODULE_DEPENDENCY_MATRIX.md)"
  - type: references
    targetId: kh-doc-module-lifecycle-rules-ar
    label:
      ar: "قواعد التفعيل والإيقاف العامة للوحدات (MODULE_LIFECYCLE_RULES.md)"
      en: "General Module Activation & Deactivation Rules (MODULE_LIFECYCLE_RULES.md)"
  - type: related-to
    targetId: kh-doc-phase-2-closure-review-ar
    label:
      ar: "مراجعة إغلاق المرحلة 2 (PHASE_2_CLOSURE_REVIEW.md)"
      en: "Phase 2 Closure Review (PHASE_2_CLOSURE_REVIEW.md)"
  - type: supported-by-evidence
    deferredRef: "teranoo-erp-planning/01-market-research/02-finance-module-architecture/02_FINANCE_MODULE_ARCHITECTURE_RESEARCH.md"
    label:
      ar: "البحث المقارن لمعمارية وحدة المالية (بانتظار دفعة الأبحاث)"
      en: "Comparative Finance Module Architecture Research (awaiting research batch)"
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md
  sourceTitle: "Finance Module Model (FINANCE_MODULE_MODEL.md)"
  commitSha: 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f
  treeSha: db531de6b2ab452578a550e07c5fd80e4bfe6b64
  gitBlobSha: 6b76307065d851377b8e4e08cf2c2e18fc6e909e
  rawSourceSha256: 88e02ca63f2181d7157b5cc07adcfa3d7561530e1b936bba0e581a005b3a6c1d
  storedBodySha256: 4638fa9334a96274a7c5ddf5ebbd2642ac435d84a00b6f1ff71877fa4399ad2b
  verificationStatus: git-blob-verified-lf-normalized
  lineEndingNormalization: crlf-to-lf
  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: mixed
  sourceDocumentDate: null
  reviewDate: "2026-11-26"
  publicationDate: "2026-11-26"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-005 BATCH-002 Authorized Release"
  scopeNote:
    ar: "وثيقة معمارية رسمية للمرحلة 2 مستوردة حرفيًا بالكامل ضمن BATCH-002 بعد التحقق التشفيري من Git Blob SHA-1؛ تمثل معمارية وحدودًا معتمدة وليست تنفيذًا برمجيًا أو مخططًا وظيفيًا تفصيليًا."
    en: "Complete verbatim Phase 2 official architecture document ingested in BATCH-002 with verified Git Blob SHA-1 integrity; defines approved architectural boundaries, not functional blueprints or ERP software implementation."
  completeness: complete
versioning:
  revision: 1
  sourceVersion: "397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f"
  lastVerifiedDate: "2026-11-26"
collectionSequence:
  collectionId: kh-col-core-module-architecture
  order: 1
---

# Finance Module Model

> **الحالة:** ✅ Approved / Closed for Phase 2
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **الغرض:** تحديد موقع Finance داخل Teranoo ERP من حيث الاستقلالية والاعتماديات وحدود التكامل والتفعيل، دون الدخول في الوظائف المالية التفصيلية.
> **مرجع البحث:** `../../01-market-research/02-finance-module-architecture/02_FINANCE_MODULE_ARCHITECTURE_RESEARCH.md`

---

## 1. تعريف Finance داخل المنتج

Finance هو أحد **Business Core Modules** في Teranoo ERP، ويُعامل كـ **First-Class Sellable Module** يمكن ترخيصه وتفعيله بصورة مستقلة عن Inventory وProcurement وSales.

المقصود بالاستقلال هنا أن Finance لا يحتاج إلى Business Module آخر حتى يصبح قابلًا للتشغيل. لكنه يعمل دائمًا فوق **Mandatory Platform Foundation** ويستهلك قدرات مشتركة من المنصة حسب السيناريو المستخدم.

لا تعني هذه الوثيقة أن كل وظائف Finance التفصيلية قد حُسمت؛ نطاق GL وAP وAR وCash وAssets وTax وClose وغيرها يؤجل إلى Phase 6 — Finance Functional Blueprint.

---

## 2. مدى استقلالية Finance

### النموذج المعتمد

- Finance **Standalone-capable**.
- لا يوجد **Hard Business Module Dependency** على:
  - Inventory & Warehouse Management
  - Procurement
  - Sales & Order Management
  - CRM
  - HCM / Payroll
  - Projects
- التكامل مع الوحدات الأخرى لا يحولها تلقائيًا إلى Dependencies.
- عند تفعيل Finance مع Module تشغيلي آخر، يصبح **عقد التكامل مطلوبًا فقط للسيناريو المشترك الذي يحتاج ذلك التكامل**، دون أن يصبح أحد الـModules شرطًا لتفعيل الآخر.

### قاعدة معمارية معتمدة

> **Module Dependency ≠ Integration Requirement**

وجود تدفق بيانات أو Accounting Event بين وحدتين لا يعني أن إحداهما Required Dependency للأخرى.

---

## 3. ما يستطيع Finance فعله عند تشغيله منفردًا

على مستوى Phase 2 فقط، يجب أن يكون Finance قادرًا على العمل كبيئة مالية مستقلة دون الحاجة إلى Inventory أو Procurement أو Sales.

يشمل ذلك معماريًا القدرة على:
- امتلاك السجلات والترحيلات المالية الخاصة به.
- العمل داخل Company / Legal Entity context واضح.
- العمل ضمن Fiscal Calendar / Accounting Period context.
- العمل بعملة أساسية للشركة.
- تطبيق الصلاحيات والتدقيق والحوكمة المطلوبة.
- إنتاج المخرجات المالية عبر Reporting Infrastructure.
- إنشاء معاملات مالية مباشرة من داخل Finance عندما تسمح الوظائف المعتمدة لاحقًا بذلك.

**مهم:** لا تحدد هذه النقاط وظائف Finance التفصيلية ولا الشاشات أو أنواع القيود أو دورات AP/AR؛ ذلك مؤجل إلى Phase 6.

---

## 4. Required Platform Dependencies

يجب التفريق بين:

1. **Platform capability must exist** — قدرة يجب أن تكون موجودة في المنتج.
2. **Capability must be actively used** — قد تكون مشروطة بسيناريو العميل.

### 4.1 Required Platform Capabilities

| Platform Capability | التصنيف في Finance | ملاحظة |
|---|---|---|
| Tenant Context | Required | كل Finance data تعمل داخل Tenant معزول |
| Company / Legal Entity Context | Required | كل معاملة مالية يجب أن تنتمي إلى كيان محاسبي واضح |
| Users / Roles / Permissions | Required | لا تشغيل مالي بدون وصول وصلاحيات مضبوطة |
| Audit Trail | Required | سلامة وتتبّع العمليات المالية متطلب أساسي |
| Fiscal Calendar / Accounting Period Foundation | Required | Finance يحتاج سياق فترة مالية حتى لو لم تُصمم آليته هنا |
| Base / Functional Currency Foundation | Required | يجب وجود عملة أساسية للسياق المالي |
| Reporting Infrastructure | Required | Finance يعتمد على بنية التقارير المشتركة للعرض والتحليل |
| Configuration / Feature Management | Required | المنتج Configuration-Driven ولا يعتمد على Hard-Code لكل عميل |
| Integration / API Framework | Required as Platform Availability | وجود الـFramework جزء من المنصة؛ استخدام Integration فعلي ليس مطلوبًا لتشغيل Finance منفردًا |
| Localization Framework | Required as Platform Availability | يجب أن تكون المنصة قابلة للتوطين؛ التوطين الفعلي يعتمد على البلد |

### 4.2 Conditionally Required Platform Capabilities

| Platform Capability | متى يصبح مطلوبًا؟ |
|---|---|
| Branch / Operating Context | عند اعتماد Branch كجزء من المعاملة أو التقارير حسب Phase 3 |
| Workflow / Approvals | عند وجود عملية تتطلب موافقة أو Segregation of Duties |
| Exchange Rates | عند استخدام أكثر من عملة |
| Tax Foundation | عند وجود معاملات أو تشريعات تتطلب ضريبة |
| Shared Party / Customer / Supplier Identity | عند استخدام وظائف تتعامل مع Customer/Supplier مثل AP/AR |
| Documents & Attachments | عند العمليات التي تتطلب مستندات أو أدلة مرفقة؛ متطلب Enterprise مهم لكنه ليس شرطًا لتشغيل Finance تقنيًا |

### 4.3 حدود قرار D-FIN-03

اعتماد Platform-Based Dependency هنا **يعتمد المبدأ فقط**: Finance يحتاج قدرات من Platform Foundation، وبعضها Required وبعضها Conditional حسب السيناريو.

هذا القرار **لا يعتمد التصميم التفصيلي للـPlatform Foundation** ولا يسبق قرارات Phase 3 أو Phase 5.

هذه الوثيقة لا تصمم:
- Tenant architecture
- Multi-Company architecture
- Branch model
- Permission model
- Workflow engine
- Currency engine
- Tax engine
- Localization engine
- Integration architecture

هذه الموضوعات تؤجل إلى مراحلها الرسمية.

---

## 5. Optional Integrations

Finance يمكن أن يتكامل لاحقًا مع:

- Inventory & Warehouse Management
- Procurement
- Sales & Order Management
- Projects & Project Accounting
- CRM
- HCM / Payroll
- Enterprise Asset Management / Maintenance
- Banking / Payment services
- Tax / Government services
- External systems through Integration / API Framework

وجود هذه التكاملات لا يجعل الوحدات المذكورة Required Dependencies لتشغيل Finance.

---

## 6. حدود التكامل مع Business Core Modules

### 6.1 Finance ↔ Inventory & Warehouse Management

**Inventory يملك تشغيليًا:**
- المخزون والكميات.
- المستودعات والمواقع.
- حركات المخزون التشغيلية.
- البيانات التشغيلية الخاصة بالاستلام والصرف والنقل.

**Finance يملك:**
- الأثر المالي المعتمد للحركة.
- السجلات والترحيلات المالية الناتجة عنها.
- السلطة النهائية على الكتابة في السجل المالي/الدفتر وفق النموذج الذي سيُعتمد لاحقًا.

**لا يُحسم الآن:**
- ملكية Costing التفصيلية.
- توقيت Real-Time vs Event/Batch.
- تصميم Accounting Event.
- حسابات Inventory Valuation أو Costing Methods.

**نوع العلاقة المعتمد داخل نموذج Finance:** `Conditional Integration Contract` عند تفعيل السيناريو المالي المشترك بين الوحدتين. هذا العقد ليس شرطًا لتفعيل Finance أو Inventory منفردًا.

---

### 6.2 Finance ↔ Procurement

**Procurement يملك تشغيليًا:**
- طلبات وعمليات الشراء.
- أوامر الشراء.
- علاقات الشراء التشغيلية مع الموردين.
- عمليات التفاوض/التوريد التي تقع ضمن نطاق Procurement لاحقًا.

**Finance يملك ماليًا:**
- الذمم الدائنة والأثر المالي للفواتير والمدفوعات عندما تُعتمد هذه الوظائف في Phase 6.
- الترحيل المالي الناتج عن أحداث Procurement.

**Shared:**
- هوية Supplier/Party يجب ألا تُكرر كنسخة مستقلة داخل كل Module؛ نموذج الملكية النهائي يؤجل إلى Phase 5.

**سيناريو مهم:** شراء الخدمات يجب ألا يجعل Inventory شرطًا بين Procurement وFinance.

**نوع العلاقة المعتمد داخل نموذج Finance:** `Conditional Integration Contract` عند تفعيل السيناريو المالي المشترك بين Finance وProcurement. هذا العقد ليس شرطًا لتفعيل أي منهما منفردًا.

---

### 6.3 Finance ↔ Sales & Order Management

**Sales يملك تشغيليًا:**
- عروض/أوامر البيع والالتزامات التشغيلية الخاصة بالبيع ضمن نطاقه لاحقًا.
- تنفيذ دورة الطلب والتسليم/الفوترة التشغيلية حسب ما يُعتمد في Blueprint الخاص به.

**Finance يملك ماليًا:**
- الذمم المدينة والتحصيل والأثر المالي النهائي عندما تُعتمد هذه الوظائف في Phase 6.
- الترحيل المالي الناتج عن Sales events.

**Shared:**
- هوية Customer/Party لا يجب أن تكون نسخة مملوكة حصريًا لـFinance أو Sales.

**سيناريو مهم:** بيع الخدمات يجب ألا يجعل Inventory شرطًا بين Sales وFinance.

**نوع العلاقة المعتمد داخل نموذج Finance:** `Conditional Integration Contract` عند تفعيل السيناريو المالي المشترك بين Finance وSales. هذا العقد ليس شرطًا لتفعيل أي منهما منفردًا.

---

## 7. Activation / Deactivation

### 7.1 Activation

لتفعيل Finance يجب أن تكون Platform Foundation المطلوبة متاحة ومهيأة بالحد الأدنى اللازم، وبالأخص:
- Tenant context
- Company / Legal Entity context
- Users / Roles / Permissions
- Audit
- Fiscal Calendar / Period context
- Base Currency context
- Configuration / Feature Management

لا يجب أن يتطلب Activation تفعيل Inventory أو Procurement أو Sales.

التكاملات مع Business Modules تُفعّل بصورة مستقلة حسب Modules المرخصة والسيناريو المطلوب.

### 7.2 Deactivation

**المبدأ المعتمد:**

> **Deactivation = Freeze, not Delete**

بعد وجود معاملات مالية، لا يجوز أن يؤدي إيقاف Finance إلى حذف البيانات التاريخية أو كسر سلامة السجل المالي.

يحسم D-FIN-06 **عدم الحذف والمحافظة على السلامة التاريخية فقط**. ولا يحسم في Phase 2 تفاصيل:
- License Deactivation
- Functional Deactivation
- Read-Only / Historical Access
- Data Retention / Archive

ويجب أن تتعامل الوحدات المتكاملة مع حالة Finance بصورة واضحة؛ لا يجوز أن تستمر بإرسال أحداث مالية إلى Module موقوف دون سياسة معلنة.

**قرار تجاري مفتوح:** هل يبقى الوصول التاريخي متاحًا للعميل بعد انتهاء ترخيص Finance؟

---

## 8. أثر Multi-Company وMulti-Branch كمتطلبات

### Multi-Company

Finance يفرض على التصميم المستقبلي أن:
- كل حركة مالية تُحدد Company / Legal Entity واضحة.
- الإعدادات المالية يمكن أن تختلف حسب Company عندما يكون ذلك مطلوبًا.
- الحدود بين الشركات لا تكون ضمنية.
- النظام لا يفترض أن Tenant = Company واحدة.
- Cross-Company وIntercompany وConsolidation تُعامل كقدرات مستقبلية صريحة، لا كسلوك تلقائي مخفي.

### Multi-Branch

Finance يجب أن يكون **Branch-capable by design** لأن الرؤية تعتمد Multi-Branch.

لكن لا يُحسم هنا:
- هل Branch حقل إلزامي لكل معاملة؟
- هل Branch كيان محاسبي أم بُعد تشغيلي/تقارير؟
- هل له P&L مستقل؟
- كيف يرث إعداداته من Company؟

هذه القرارات تؤجل إلى Phase 3 — Platform & Tenancy Model.

---

## 9. أثر Currency وTax كاعتماد

### Currency

- وجود Base / Functional Currency للشركة: **Required**.
- القدرة على Multi-Currency: يجب أن تكون المنصة قادرة عليها، لكن استخدامها ليس إلزاميًا لكل عميل.
- Exchange Rates تصبح Required فقط عند وجود معاملات متعددة العملات.
- Reporting / Parallel currencies لا تُفرض كمتطلب تشغيل أساسي في هذه المرحلة.

تصميم Currency Framework يؤجل إلى Phase 5.

### Tax

الاتجاه المقترح هو التعامل مع Tax كـ **Shared Platform Capability** تُستهلك من Finance وSales وProcurement وغيرها، بدل Hard-Code للمنطق الضريبي داخل كل Module.

- توفر Tax Foundation في المنتج: مطلوب ضمن البنية المستهدفة.
- استخدام Tax في كل Tenant أو كل معاملة: مشروط بالتشريعات والسيناريو.
- Finance ليس بالضرورة المالك المعماري الحصري لـTax Engine.

القرار النهائي وتصميم Tax Framework يؤجلان إلى Phase 5.

---

## 10. حدود الدراسة والاستبعادات الصريحة

هذه الوثيقة لا تحدد:

- Chart of Accounts design
- General Ledger detailed functionality
- Journals / Posting rules
- Accounts Payable processes
- Accounts Receivable processes
- Payments / Collections
- Bank Reconciliation
- Fixed Assets
- Financial Close
- Revenue Recognition
- Cost Accounting
- Budgeting
- Financial Statements design
- Tax calculations
- Currency calculations
- Database schema
- APIs implementation
- UI/UX
- Source code

ولا تحدد التصميم التفصيلي لأي Platform Foundation capability.

كل ما سبق يؤجل إلى Phase 3 / Phase 5 / Phase 6 أو المراحل اللاحقة حسب موضوعه.

---

## 11. القرارات المفتوحة والمؤجلة

هذه النقاط **لا تمنع إغلاق Finance في Phase 2** لأنها تخص مراحل لاحقة أو النموذج العام بعد دراسة بقية الوحدات:

1. **Dependency terminology على مستوى Teranoo ERP بالكامل:** تم اعتماد `Conditional Integration Contract` داخل Finance، أما المصطلحات الرسمية العامة فتُحسم بعد دراسات Business Core الأربع.
2. **Historical access after license deactivation:** هل يبقى الوصول التاريخي Read-Only متاحًا بعد انتهاء الترخيص؟
3. **Branch transaction requirement:** هل سيكون Branch إلزاميًا على كل حركة مالية أم يُحدد حسب Company/Configuration؟ — Phase 3.
4. **Shared Party scope:** D-FIN-05 يحسم منع التكرار فقط، ولا يحسم تفاصيل ملكية أو نطاق Shared Party/Item — Phase 5 والـEnterprise Modules.
5. **Tax ownership:** الاتجاه المقترح Shared Platform Capability؛ القرار المعماري النهائي في Phase 5.
6. **Single Posting Authority:** هل يصبح Finance الجهة الوحيدة المخولة بإنشاء/اعتماد postings في Financial Ledger؟ يبقى Strong Architecture Candidate إلى أن تُدرس Inventory وProcurement وSales.
7. **Integration execution model:** Real-Time vs Event-driven vs Batch يؤجل إلى Integration/API Architecture في Phase 5.
8. **Read-Only / Archive mechanics:** تفاصيل الإيقاف والاحتفاظ والأرشفة تؤجل إلى مراحل Platform / Enterprise-Wide Requirements المناسبة.

---

## 12. القرارات المعتمدة لإغلاق Finance في Phase 2

### ✅ D-FIN-01 — Standalone Finance
Finance هو **First-Class Sellable Standalone Module**.

### ✅ D-FIN-02 — No Hard Business Module Dependency
Finance لا يحتاج Inventory أو Procurement أو Sales أو أي Business Module آخر لكي يتم تفعيله وتشغيله.

### ✅ D-FIN-03 — Platform-Based Dependency
Dependencies الإلزامية لـFinance تأتي من Platform Foundation، مع التمييز بين Required وConditionally Required. هذا القرار يعتمد **مبدأ الاعتماد** ولا يعتمد تصميم Platform Foundation التفصيلي.

### ✅ D-FIN-04 — Conditional Integration Boundaries
التكامل مع Inventory وProcurement وSales لا يجعلها Hard Dependencies. `Conditional Integration Contract` يصبح مطلوبًا فقط عند تشغيل السيناريو المشترك الذي يحتاج هذا التكامل، وليس شرطًا لتفعيل Finance.

### ✅ D-FIN-05 — Data Responsibility Boundary
Finance لا يملك السجلات التشغيلية الخاصة بالمخزون أو الشراء أو البيع، ولا يكرر Shared Party / Item master كبيانات مستقلة خاصة به. هذا القرار يحسم **عدم التكرار وحدود المسؤولية** ولا يحسم تفاصيل ملكية Shared Party/Item النهائية.

### ✅ D-FIN-06 — Safe Deactivation Principle
اعتماد مبدأ **Freeze, not Delete** للبيانات المالية بعد وجود معاملات. هذا القرار يحسم عدم حذف البيانات أو كسر سلامتها التاريخية، بينما Read-Only وArchive وسياسات الترخيص والتشغيل تؤجل لمراحلها.

---

## 13. قرار الإغلاق

تم اعتماد القرارات D-FIN-01 إلى D-FIN-06 وإغلاق دراسة **Finance Module Architecture & Dependencies** ضمن Phase 2.

الأسئلة المؤجلة في القسم 11 لا تعيد فتح هذه الدراسة ما لم يظهر لاحقًا تعارض جوهري موثق أثناء دراسة بقية الـBusiness Core Modules.

**الحالة النهائية لهذه المرحلة:** ✅ Closed / Approved

---

## Research Notes

القرارات المعتمدة أعلاه مبنية على البحث المقارن المحفوظ في:

`teranoo-erp-planning/01-market-research/02-finance-module-architecture/`

ويجب عدم اعتبار أي `[Research Hint]` في ملف البحث قرارًا لـTeranoo ERP ما لم يُعتمد صراحة في وثائق المشروع.