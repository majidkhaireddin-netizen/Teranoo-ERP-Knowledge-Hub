---
id: kh-doc-module-lifecycle-rules-ar
slug: module-lifecycle-rules
title:
  ar: "قواعد دورة حياة وتفعيل وإيقاف الوحدات (MODULE_LIFECYCLE_RULES.md)"
  en: "General Module Activation & Deactivation Rules (MODULE_LIFECYCLE_RULES.md)"
subtitle:
  ar: "الفصل بين الترخيص والحالة الوظيفية (Inactive / Active / Frozen)، شروط التفعيل والإيقاف، التجميد بدل الحذف، وإعادة التفعيل"
  en: "Entitlement vs functional states (Inactive / Active / Frozen), activation/deactivation preconditions, Freeze-not-Delete, and reactivation continuity"
description:
  ar: "الوثيقة الحاكمة المعتمدة لدورة حياة الوحدات التجارية: الحالات المفاهيمية الدنيا (Inactive / Active / Frozen)، شروط التفعيل والإيقاف، أثر الإيقاف على FLD وCIC والبيانات المشتركة، ومبدأ Freeze, not Delete."
  en: "Approved governing artifact standardizing module lifecycle: entitlement vs functional states (Inactive, Active, Frozen), activation/deactivation preconditions, open work handling, Freeze-not-Delete, and reactivation."
language: ar
type: architecture-document
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
  - inventory-warehouse
  - procurement
  - sales-order-management
domainRefs:
  - configuration
  - audit-trail
  - identity-access
  - integration
topics:
  - architecture
  - governance
  - data-governance
  - compliance
tags:
  - teranoo-erp
  - phase-2
  - batch-002
  - module-lifecycle
  - freeze-not-delete
  - activation
  - deactivation
  - governing-artifact
traceability:
  decisionIds:
    - D-FIN-06
    - D-INV-08
    - D-PROC-09
    - D-SALES-11
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: references
    targetId: kh-doc-dependency-model-ar
    label:
      ar: "نموذج الاعتماديات والحوكمة (DEPENDENCY_MODEL.md)"
      en: "Dependency Model & Governance (DEPENDENCY_MODEL.md)"
  - type: references
    targetId: kh-doc-module-dependency-matrix-ar
    label:
      ar: "مصفوفة الاعتماديات البينية (MODULE_DEPENDENCY_MATRIX.md)"
      en: "Core Module Dependency Matrix (MODULE_DEPENDENCY_MATRIX.md)"
  - type: related-to
    targetId: kh-doc-decision-register-ar
    label:
      ar: "وثيقة حاكمة معتمدة في DECISION_REGISTER.md"
      en: "Listed as an approved Governing Artifact in DECISION_REGISTER.md"
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md
  sourceTitle: "General Module Activation & Deactivation Rules (MODULE_LIFECYCLE_RULES.md)"
  commitSha: 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f
  treeSha: db531de6b2ab452578a550e07c5fd80e4bfe6b64
  gitBlobSha: ee58a40b83d6aa9bfda6a37914812bf90fbe9b54
  rawSourceSha256: 5c83a4b71fbc8817ccb739674edf2de05687e7ece452ed0593abc7bedf106d87
  storedBodySha256: 48b2e498841e8f97ea88837ff249359200e8abc8531f350fe3bddfc218f07658
  verificationStatus: git-blob-verified-lf-normalized
  lineEndingNormalization: crlf-to-lf
  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: mixed
  sourceDocumentDate: "2026-09-09"
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
  order: 7
---

# Teranoo ERP — General Module Activation & Deactivation Rules

> **الحالة:** ✅ Approved / Phase 2
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **تاريخ الاعتماد:** 2026-09-09
> **المراجع الحاكمة:** `DEPENDENCY_MODEL.md`, `MODULE_DEPENDENCY_MATRIX.md`
> **الغرض:** توحيد قواعد تفعيل وإيقاف Business Modules دون خلط الترخيص، التفعيل الوظيفي، تكامل السيناريوهات، أو حفظ التاريخ.

---

## 1. القواعد العليا

1. **Module Activation مستقل افتراضيًا** ما لم يوجد `HBMD` صريح ومعتمد.
2. **PCD Required** يجب أن تكون متاحة ومهيأة قبل تفعيل الـModule الأساسي.
3. `CIC` لا يمنع تفعيل الـModule؛ يمنع فقط السيناريو المشترك الذي يحتاجه عند عدم الجاهزية.
4. `FLD` لا يمنع تفعيل الـModule؛ يمنع Feature المحددة فقط عند عدم تحقق اعتمادياتها.
5. **Deactivation = Freeze, not Delete** بعد وجود Business History أو Transactions أو Records ذات أثر تدقيقي.
6. إيقاف Module لا يمنح حق حذف Shared Master Data أو بيانات مملوكة لمجالات أخرى.
7. أي تغيير Lifecycle يجب أن يكون **صريحًا، قابلًا للتدقيق، وغير صامت** في أثره على Integrations وFeatures التابعة.

---

## 2. الفصل بين Entitlement وFunctional State

Teranoo يفصل مفاهيميًا بين:

### A. Entitlement / Licensing State

هل الـTenant/Customer مسموح له باستخدام الـModule وفق سياسة المنتج/الترخيص؟

### B. Functional Lifecycle State

هل الـModule مهيأ وقابل للتشغيل وظيفيًا الآن؟

هذا الفصل يمنع اعتبار انتهاء الترخيص مساويًا لحذف البيانات أو كسر التاريخ.

> **ملاحظة:** نموذج التسعير، grace periods، مدة Historical Access، وسياسة الترخيص التفصيلية خارج Phase 2.

---

## 3. Functional Lifecycle States المعتمدة مفاهيميًا

تعتمد Phase 2 الحد الأدنى التالي من الحالات المفاهيمية:

| State | المعنى |
|---|---|
| `Inactive` | الـModule غير مفعّل وظيفيًا ولا يقبل معاملات جديدة |
| `Active` | الـModule مفعّل ويمكنه تشغيل قدراته الأساسية والـFeatures الجاهزة |
| `Frozen` | الـModule يحتفظ بالتاريخ والقراءة/المراجع اللازمة للسلامة، لكنه لا يقبل معاملات جديدة ضمن النطاق المجمد |

### حدود القرار

- هذه ليست UI states أو database enums إلزامية.
- لا تحسم Phase 2 حالات تقنية فرعية مثل Provisioning / Maintenance / Suspended / Error.
- يمكن لاحقًا إضافة حالات تنفيذية أدق دون تغيير المبادئ أعلاه.

---

## 4. Module Activation Preconditions

قبل تحويل Module إلى `Active` يجب التحقق من:

1. **Entitlement / Product Permission** متاح وفق Control Plane policy المستقبلية.
2. جميع `PCD: Required` متاحة ومهيأة بالحد الأدنى.
3. جميع `HBMD` المعتمدة — إن وجدت مستقبلًا — Active ومتوافقة.
4. لا توجد HBMD cycle أو dependency violation.
5. Mandatory organizational/context references اللازمة للـModule موجودة وفق Phase 3، مثل Tenant وCompany/Legal Entity عندما تكون مطلوبة.
6. Security / Roles / Audit foundations المطلوبة متاحة.
7. Minimum configuration baseline للـModule صالح.
8. لا تُشترط CIC أو FLD غير المستخدمة لتفعيل القدرة الأساسية.

### قاعدة

> **عدم جاهزية Scenario اختياري أو Feature إضافية لا يمنع Module Activation إذا كانت القدرة الأساسية مستقلة عنها.**

---

## 5. Feature Activation Rules

عند تفعيل Feature داخل Module:

1. يجب تحقق جميع `FLD` الخاصة بها.
2. يجب تحقق `PCD: Conditionally Required` المرتبطة بها.
3. إذا كانت Feature تنفذ سيناريو Cross-Module، يجب أن يكون CIC المرتبط في حالة جاهزة.
4. فشل Feature readiness لا يجب أن يحول تلقائيًا إلى تعطيل الـModule بالكامل.
5. يجب إظهار سبب عدم الجاهزية بصورة قابلة للتدقيق والإدارة.

---

## 6. CIC Runtime Readiness

قبل تنفيذ Scenario مشترك:

- Participating Modules المطلوبة للسيناريو يجب أن تكون Active أو في حالة تسمح بالعقد وفق السياسة المعتمدة لاحقًا.
- CIC يجب أن يكون Enabled/Ready وفق Integration Governance.
- Preconditions الخاصة بالعقد يجب أن تكون متحققة.
- إذا أصبح Target Module غير متاح، لا يجوز `Silent Success`.
- السيناريو يدخل حالة واضحة مثل Blocked/Pending/Failed حسب تصميم Phase 5/6.

لا تحدد Phase 2 transport أو retry أو queue implementation.

---

## 7. Deactivation Preconditions

طلب Deactivation يجب أن يمر بفحص أثر قبل التنفيذ:

1. هل توجد Business History أو Transactions؟
2. هل توجد Open Documents / Open Balances / Active commitments؟
3. هل توجد Features في Modules أخرى تعتمد عليه عبر `FLD`؟
4. هل توجد CIC نشطة تعتمد على هذا الـModule؟
5. هل يوجد Module آخر يعتمد عليه عبر `HBMD` مستقبلًا؟
6. هل توجد Shared Data / References يجب الحفاظ عليها؟
7. هل توجد التزامات Audit / Retention / Compliance؟

### HBMD guard

إذا ظهر مستقبلًا Module تابع عبر HBMD:

> لا يجوز Deactivate للـRequired Module بينما Dependent Module ما زال Active، إلا بعد معالجة الاعتمادية صراحةً.

---

## 8. Freeze, not Delete

إذا كان للـModule تاريخ فعلي:

- لا تُحذف Transaction History.
- لا تُحذف Business Documents التي تحتاجها Audit/Traceability.
- لا تُحذف Cross-Module references التي تكسر Integrity.
- لا تُحذف Shared Identities بسبب توقف Module واحد.
- يتم منع أو ضبط New Transactions وفق حالة الـModule.
- تبقى البيانات التاريخية متاحة بالقدر الذي تتطلبه السلامة والسياسات اللاحقة.

### لا تحسم Phase 2

- مدة الاحتفاظ.
- حق الوصول بعد انتهاء الترخيص.
- Archive storage tier.
- legal retention لكل دولة.
- data purge after statutory expiry.

هذه قرارات Platform/Enterprise-wide لاحقة.

---

## 9. Open Work Handling عند Deactivation

لا يجوز إيقاف Module مع Open Work بطريقة تؤدي إلى حالة غير معلنة أو كسر التكامل.

المبدأ العام:

> **Open work must be resolved, closed, transferred through an approved mechanism, or explicitly frozen with a known state before final deactivation.**

تفاصيل كل نوع مستند تؤجل إلى Functional Blueprints.

أمثلة غير تفصيلية:
- Open PO — Procurement Blueprint يحدد قواعده.
- Open Sales Order — Sales Blueprint يحدد قواعده.
- On-hand / open inventory movements — Inventory Blueprint يحدد قواعدها.
- Open financial periods/balances — Finance Blueprint يحدد قواعدها.

---

## 10. أثر Deactivation على FLD

إذا توقف Module مطلوب لFeature في Module آخر:

- الـFeature التابعة تصبح `Unavailable/Disabled` وفق قواعدها.
- الـModule المصدر يبقى Active إن لم يوجد HBMD.
- لا يجوز ترقية FLD تلقائيًا إلى HBMD بسبب أهمية الـFeature.

مثال:

Sales يبقى Active بدون Inventory، لكن Stock Fulfillment feature لا تكون جاهزة.

---

## 11. أثر Deactivation على CIC

إذا توقف أحد أطراف CIC:

- العقد/السيناريو يدخل حالة غير جاهزة معلنة.
- لا تُقبل عمليات جديدة تعتمد على العقد إذا لم يمكن تنفيذها بأمان.
- Existing in-flight work يحتاج handling صريح في Phase 5/6.
- لا يجوز إسقاط أو تزوير نجاح التكامل.
- Correlation/Audit history السابقة تبقى محفوظة.

---

## 12. Shared Data Safety

Deactivation لـBusiness Module لا يعني حذف Shared Foundation Data.

أمثلة:
- إيقاف Sales لا يحذف Customer/Party Identity المشتركة.
- إيقاف Procurement لا يحذف Supplier/Party Identity المشتركة.
- إيقاف Inventory لا يحذف Product/Item Identity المشتركة.
- إيقاف Finance لا يحذف Party Identity التي تحتاجها Modules أخرى.

Data ownership وretention تطبقان وفق Source of Truth وليس وفق حالة Module مستهلك واحد.

---

## 13. Reactivation Principle

Reactivation يجب أن:

1. تعيد فحص Entitlement.
2. تعيد فحص `PCD Required`.
3. تعيد فحص HBMD إن وجدت.
4. تعيد فحص configuration compatibility.
5. لا تنشئ تاريخًا جديدًا بدل التاريخ السابق.
6. تحافظ على نفس identity/reference continuity.
7. تعيد CIC/FLD فقط بعد تحقق readiness الخاصة بها.

تفاصيل migration/version upgrade عند Reactivation تؤجل إلى مراحل التقنية والتنفيذ.

---

## 14. Core Module Consistency Check

| Module | Standalone Activation | Freeze not Delete | تاريخ محفوظ | CIC لا يمنع Base Activation | FLD لا يمنع Base Activation | النتيجة |
|---|---|---|---|---|---|---|
| Finance | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Inventory | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Procurement | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Sales | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |

لا يوجد تعارض مع Module Models الأربعة أو `DEPENDENCY_MODEL.md`.

---

## 15. قواعد الحوكمة النهائية

1. Activation dependency لا تُستنتج؛ يجب أن تكون PCD Required أو HBMD صريحة.
2. CIC/FLD لا تمنع Base Module Activation.
3. Deactivation impact analysis إلزامي.
4. Freeze, not Delete هو default بعد وجود Business History.
5. Shared data لا تُحذف بسبب Module deactivation.
6. Dependent features تتعطل بدل إسقاط Module المصدر بالكامل.
7. HBMD dependents — إن ظهرت مستقبلًا — تمنع deactivation غير المنضبط للRequired Module.
8. Reactivation يحافظ على history/identity continuity.
9. التفاصيل الوظيفية للمستندات المفتوحة تؤجل إلى Phase 6.
10. التفاصيل التقنية للـintegration lifecycle تؤجل إلى Phase 5 وما بعدها.

---

## 16. قرار Phase 2

تم اعتماد هذه القواعد كـ **General Module Lifecycle Governance** لجميع Business Modules الحالية والمستقبلية ما لم يوجد قرار صريح يضيف قيدًا خاصًا بوحدة معينة.

**الحالة النهائية:** ✅ Approved / Phase 2
