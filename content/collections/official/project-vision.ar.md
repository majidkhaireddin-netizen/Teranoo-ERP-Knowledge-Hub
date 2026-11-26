---
id: kh-doc-project-vision-ar
slug: project-vision
title:
  ar: "رؤية المنتج (⁦00_PROJECT_VISION.md⁩)"
  en: "Product Vision (00_PROJECT_VISION.md)"
subtitle:
  ar: "الوثيقة التأسيسية الرسمية الكاملة لرؤية منتج Teranoo ERP والتموضع والحدود ومعايير النجاح"
  en: "Complete official founding vision document defining Teranoo ERP positioning, boundaries, modules, principles, and success criteria"
description:
  ar: "النص الرسمي الكامل غير المختصر لوثيقة رؤية المنتج (00_PROJECT_VISION.md — Approved / Phase 1 Closed، محدثة بتاريخ 2026-10-02) بما يشمل الأقسام العشرة كاملة."
  en: "Complete verbatim official Product Vision document (00_PROJECT_VISION.md — Approved / Phase 1 Closed, updated 2026-10-02) preserving all ten sections."
language: ar
type: product-vision
classification: official
editorialStatus: published
publicationStatus: public
approvalStatus: approved
implementationStatus: not-applicable
depth: L1
journeyStages:
  - product-discovery
  - architecture
phaseRefs:
  - phase-1
  - phase-4
moduleRefs:
  - finance
  - inventory-warehouse
  - procurement
  - sales-order-management
domainRefs: []
topics:
  - architecture
  - deployment
  - governance
  - upgradeability
  - extensibility
tags:
  - teranoo-erp
  - project-foundations
  - product-vision
  - batch-001
  - saas-first
  - postgresql
traceability:
  decisionIds:
    - D-DEP-05
    - D-DEP-06
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: supersedes
    targetId: kh-doc-product-vision-ref-ar
    label:
      ar: "يحل محل الملخص المرجعي التاريخي المشتق من اللقطة التخطيطية السابقة"
      en: "Supersedes the earlier snapshot-derived Product Vision reference summary"
  - type: related-to
    targetId: kh-doc-project-work-plan-ar
    label:
      ar: "خطة عمل المشروع الرسمية (PROJECT_WORK_PLAN.md)"
      en: "Official Project Work Plan (PROJECT_WORK_PLAN.md)"
  - type: related-to
    targetId: kh-doc-cross-phase-guardrails-ar
    label:
      ar: "ضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md)"
      en: "Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)"
  - type: related-to
    targetId: kh-doc-decision-register-ar
    label:
      ar: "سجل القرارات الرسمي (DECISION_REGISTER.md)"
      en: "Official Decision Register (DECISION_REGISTER.md)"
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md
  sourceTitle: "Product Vision (00_PROJECT_VISION.md)"
  commitSha: 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f
  treeSha: db531de6b2ab452578a550e07c5fd80e4bfe6b64
  gitBlobSha: 7206f4d747e8befc0d47400a666850aa259b7055
  rawSourceSha256: 64bc2e1a6333ae4d109101a3c1cdd202015b4c9cd29db7476bb2574a5db61fa7
  storedBodySha256: 69bce606580f28a6fc7a90bd743416ffc45ab26fe487c7630d5905c2a6e75aad
  verificationStatus: git-blob-verified-lf-normalized
  lineEndingNormalization: crlf-to-lf
  interpretationNote:
    ar: "ملاحظة تفسيرية من مركز المعرفة: يحتفظ القسم 7.3 في النص الأصلي بعبارة تاريخية تفيد بأن نموذج عزل العملاء التفصيلي لم يُحسم بعد عند إغلاق المرحلة 1، بينما تم حسمه رسميًا لاحقًا في المرحلة 3 عبر القرارات D-ISO-01..D-ISO-12 الموثقة في سجل القرارات الرسمي."
    en: "Knowledge Hub interpretation note: Section 7.3 preserves a historical Phase 1 remark stating that detailed tenant isolation had not yet been decided; this was subsequently resolved in Phase 3 via D-ISO-01..D-ISO-12 in DECISION_REGISTER.md."
  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: mixed
  sourceDocumentDate: "2026-10-02"
  reviewDate: "2026-11-26"
  publicationDate: "2026-11-26"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-004 BATCH-001 Authorized Release"
  scopeNote:
    ar: "مصدر رسمي معتمد ومستورد بالكامل ضمن الدفعة BATCH-001 (المراجعة المرجعية 2026-11-26) دون تعديل أو اختصار لنص الوثيقة الأصلية."
    en: "Complete authorized official source ingested verbatim in BATCH-001 (reviewed 2026-11-26) without altering or summarizing original wording."
  completeness: complete
versioning:
  revision: 1
  sourceVersion: "397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f"
  supersedesId: kh-doc-product-vision-ref-ar
  lastVerifiedDate: "2026-11-26"
collectionSequence:
  collectionId: kh-col-project-foundations
  order: 1
---

# Project Vision

> الحالة: Approved / Phase 1 Closed

هذا الملف هو المرجع الرسمي لرؤية منتج Teranoo ERP. تم بناؤه تدريجيًا من خلال النقاش والبحث والاعتماد، ولا تُضاف إليه افتراضات غير معتمدة.

## 1. تعريف المنتج

Teranoo ERP هو نظام ERP احترافي متعدد القطاعات، مبني على Core موحّد مع Modules مستقلة نسبيًا وIndustry Extensions قابلة للإضافة حسب نشاط العميل.

المنتج مخصص للبيع لعملاء متعددين، ولا يُفترض أن يشتري كل عميل كامل النظام؛ يمكن ترخيص وتفعيل مجموعة محددة من الـModules حسب احتياجه.

## 2. المشكلة التي يعالجها النظام

يستهدف Teranoo ERP الشركات المتوسطة والكبيرة التي تحتاج إلى إدارة عملياتها ضمن منصة مؤسسية مترابطة، دون أن تضطر إلى استخدام مجموعة أنظمة منفصلة أو الاعتماد على تخصيصات برمجية خاصة بكل عميل كأسلوب تشغيل أساسي.

المشكلات التي يستهدف المنتج معالجتها تشمل:
- تشتت البيانات والعمليات بين أنظمة أو أدوات متعددة غير مترابطة.
- تكرار البيانات وضعف وجود مصدر موحد وموثوق للمعلومات التشغيلية والمالية.
- ضعف الترابط بين العمليات المالية والمشتريات والمبيعات والمخزون والأنظمة المؤسسية الأخرى.
- صعوبة ضبط الصلاحيات والموافقات والتدقيق عند نمو الشركة وتعدد فروعها وشركاتها.
- الاعتماد المفرط على Hard-Code أو تخصيصات خاصة تجعل النظام أصعب في التحديث والصيانة والتوسع.
- الحاجة إلى شراء نظام ضخم بالكامل رغم أن العميل قد يحتاج جزءًا فقط من قدراته.
- صعوبة إضافة أنظمة أو قدرات جديدة دون التأثير على الأنظمة القائمة.

يقدم Teranoo ERP مقابل ذلك منتجًا Modular وConfiguration-Driven قدر الإمكان، مبنيًا على Platform Foundation مشتركة، بحيث يستطيع العميل تشغيل الوحدات التي يحتاجها ضمن نموذج تكامل واعتماديات واضح وقابل للتوسع.

## 3. العملاء المستهدفون

السوق المستهدف الأساسي لـ Teranoo ERP هو **الشركات المتوسطة والكبيرة**.

يجب أن يُبنى المنتج من البداية ليستوعب احتياجات هذا المستوى من الشركات، بما في ذلك التعقيد التنظيمي والتشغيلي وتعدد الشركات والفروع والصلاحيات والتكاملات وحجم العمليات.

يبقى التصميم Modular بحيث يمكن لاحقًا تقديم حزم أو نطاقات أخف للشركات الأصغر دون إنشاء منتج منفصل أو إضعاف قدرات الـCore الأساسية.

## 4. القطاعات المستهدفة

القطاعات الأساسية المستهدفة في المرحلة الأولى هي:

1. **Trading & Wholesale Distribution — التجارة والتوزيع**
2. **Manufacturing — التصنيع**
3. **Construction & Contracting — المقاولات والإنشاءات**
4. **Professional & Project-Based Services — الخدمات المهنية والمشاريع**

هذه القطاعات تمثل Primary Industries للمنتج في مرحلته الأولى، لأنها تشترك في جزء كبير من قدرات ERP الأساسية، مع احتياجات قطاعية يمكن إضافتها من خلال Industry Extensions دون تحويل النظام إلى منتجات منفصلة.

القطاعات الأخرى مثل Retail وLogistics وHealthcare وHospitality ليست خارج الرؤية، لكنها مؤجلة إلى مراحل لاحقة بعد استقرار الـCore والقدرات القطاعية الأساسية.

## 5. مستوى المنتج المستهدف

Teranoo ERP يستهدف أن يكون **Enterprise-Grade Modular ERP** قويًا واحترافيًا وقابلًا للعمل فعليًا لدى الشركات المتوسطة والكبيرة، ضمن نطاق يمكن تصميمه وتنفيذه واختباره وصيانته بجودة عالية.

المقصود بـ Enterprise-Grade هنا هو جودة المنتج في المجالات التي يتم اعتمادها، مثل:
- سلامة العمليات والبيانات.
- الصلاحيات والحوكمة والتدقيق.
- قابلية التوسع وتعدد الشركات والفروع والعملاء.
- التكامل بين الـModules.
- الاعتمادية والأداء والأمان.
- قابلية الإعداد والتطوير والتوسع مستقبلًا.

لا يستهدف المشروع في مرحلته الأولى تحقيق التكافؤ الشامل مع منصات ضخمة مثل SAP أو Oracle أو Microsoft Dynamics في عدد المنتجات والخصائص والتخصصات المتراكمة لديها.

القاعدة هي: **نطاق أقل ولكن مكتمل وموثوق أفضل من نطاق ضخم غير قابل للإكمال أو الصيانة.**

يتم توسيع Teranoo ERP تدريجيًا من خلال Modules وExtensions جديدة بعد نضج واستقرار ما تم اعتماده بالفعل.

## 6. الحدود العامة للنطاق

### 6.1 Mandatory Platform Foundation

هذه الطبقة إلزامية تقنيًا لجميع تركيبات Teranoo ERP، لكنها **ليست Business Modules للبيع بشكل مستقل**. وهي الأساس المشترك الذي تعمل فوقه جميع الوحدات الحالية والمستقبلية.

تشمل مبدئيًا:
- **Tenant / Company / Branch Model**
- **Users, Roles & Permissions**
- **Workflow & Approvals Framework**
- **Audit Trail**
- **Shared Master Data Framework**
- **Localization Framework**
- **Integration / API Framework**
- **Reporting & Analytics Framework**
- **Documents & Attachments Framework**

يجب أن تُصمم هذه الطبقة بحيث تكون مشتركة وقابلة لإعادة الاستخدام عبر جميع الـModules، وألا يتم تكرار قدراتها داخل كل Module بصورة منفصلة.

### 6.2 Business Core ERP Modules

الوحدات التالية تمثل **Business Core** الأساسي للمنتج:

1. **Finance**
2. **Procurement**
3. **Sales & Order Management**
4. **Inventory & Warehouse Management**

مصطلح Core هنا لا يعني أن هذه هي كل أنظمة Teranoo ERP، ولا يعني أن العميل ملزم بشرائها جميعًا. المقصود أنها النواة التجارية المشتركة التي يُبنى حولها المنتج وتُدار بينها الاعتماديات والتكاملات الأساسية.

### 6.3 Enterprise Modules

يمكن إضافة Modules مؤسسية أخرى حسب حاجة السوق والعملاء، مثل:
- Projects & Project Accounting
- Human Capital Management
- Payroll
- CRM
- Enterprise Asset Management / Maintenance
- Advanced Budgeting & Performance Management

هذه الوحدات مهمة للمنتج لكنها ليست جزءًا إلزاميًا من Business Core لكل عميل.

### 6.4 Industry & Advanced Extensions

يمكن إضافة قدرات أو Modules متخصصة لقطاعات أو سيناريوهات محددة، مثل:
- Manufacturing
- Advanced Supply Chain Planning
- Quality Management
- Transportation / Logistics
- Construction & Contracting Extensions
- Professional Services Extensions
- Distribution Extensions

Teranoo ERP يجب أن يبقى **Extensible by Design** بحيث يمكن إضافة Modules جديدة لاحقًا دون إعادة تعريف الـCore أو كسر الوحدات القائمة.

## 7. المبادئ الأساسية للمنتج

### 7.1 Modular ERP
- كل Module يجب أن يكون قابلًا للعمل باستقلالية عندما يكون ذلك منطقيًا وظيفيًا.
- بعض الـModules ستحتاج Dependencies إجبارية عندما لا يكون تشغيلها منفردة منطقيًا أو آمنًا.
- العلاقات والاعتماديات بين الـModules يجب أن تكون معلنة ومضبوطة وليست ضمنية.

### 7.2 Module Activation & Integration Control
- مالك/مشغل النظام يحتاج Control Plane / لوحة إدارة مركزية لإدارة العملاء وتفعيل الـModules وربط الأنظمة المسموح بربطها.
- التفعيل والترخيص والاعتماديات بين الـModules يجب أن تكون قابلة للإدارة دون تعديلات برمجية خاصة بكل عميل.

### 7.3 Multi-Tenant
- النظام مصمم ليخدم عدة عملاء (Tenants) ضمن منتج واحد.
- عزل بيانات وإعدادات وصلاحيات كل Tenant مبدأ إلزامي.
- نموذج العزل التفصيلي للـTenants لم يُحسم بعد وسيتم بحثه معماريًا.

### 7.4 Multi-Company & Multi-Branch
- كل Tenant يمكن أن يحتوي شركة واحدة أو عدة شركات.
- كل شركة يمكن أن تحتوي فروعًا متعددة.
- العلاقة بين Tenant / Company / Branch يجب أن تكون جزءًا أصيلًا من نموذج النظام وليست إضافة لاحقة.

### 7.5 Configuration-Driven Product
- إعدادات الأعمال التي تختلف بين العملاء يجب أن تكون ديناميكية وقابلة للإدارة من خلال الإعدادات أو البيانات المرجعية قدر الإمكان.
- لا يتم Hard-Code لسلوك عميل محدد.
- القواعد التي يجب أن تكون ثابتة لأسباب محاسبية أو أمنية أو تقنية أو تكاملية يمكن تثبيتها عند وجود مبرر واضح.
- لا يعني مبدأ الديناميكية جعل كل شيء قابلًا للتعديل؛ Core invariants تبقى ثابتة عندما تتطلب سلامة النظام ذلك.

### 7.6 Deployment Flexibility
- المنتج يجب أن يُخطط له ليكون قابلًا للتشغيل كـCloud/SaaS أو On-Premises متى كان ذلك عمليًا.
- الهدف هو الحفاظ على منتج واحد قدر الإمكان مع Deployment Profiles مختلفة بدل إنشاء منتجين منفصلين.

### 7.7 Database Strategy
- ~~لم يتم اعتماد محرك قاعدة البيانات بعد.~~ **حُسم في Phase 4: PostgreSQL هو المحرك الوحيد المدعوم إنتاجياً لكل من SaaS وConnected On-Prem (`D-DEP-05`/`D-DEP-06` — `05-platform-requirements/DATABASE_ENGINE_EVALUATION.md`).**
- الهدف هو تقليل الارتباط غير الضروري بمحرك قاعدة بيانات محدد، دون التضحية بالأمان أو الأداء أو القدرات المهمة.
- ~~دعم أكثر من Database Engine قرار مفتوح وليس متطلبًا معتمدًا حتى الآن.~~ **حُسم: لا دعم إنتاجي لمحرك آخر (`D-DEP-06`).** (اختلاف المزوّد أو خدمة مُدارة متوافقة ≠ محرك آخر.)
- ~~سيتم اختيار الاستراتيجية بعد دراسة...~~ **اكتمل الاختيار في Phase 4** بعد تقييم: Multi-Tenancy، العزل، الأداء، Cloud، On-Premises، النسخ الاحتياطي، التوسع، التكلفة، التراخيص، وخصائص الأمان.

## 8. ما الذي لا نريد أن يكون عليه النظام

- ERP مغلق لا يسمح ببيع Modules بشكل منفصل.
- نظام يعتمد على تخصيص الكود لكل عميل كطريقة تشغيل أساسية.
- نظام تصبح فيه إعدادات العملاء Hard-Coded.
- بنية تمنع لاحقًا التشغيل Cloud أو On-Premises دون سبب قوي.
- Core متضخم يفرض Modules غير لازمة على جميع العملاء.
- نطاق ضخم غير قابل للإكمال أو الاختبار أو الصيانة بجودة عالية.

## 9. معايير نجاح الرؤية

تُعتبر رؤية Teranoo ERP ناجحة عندما يتحقق الآتي:

1. **قابلية التشغيل الفعلية:** الوحدات المعتمدة يمكن استخدامها في بيئة عمل حقيقية لدى الشركات المستهدفة، وليست مجرد Prototype أو عرض وظيفي.
2. **جودة قبل الاتساع:** كل Capability تدخل النطاق تكون مكتملة وقابلة للاختبار والصيانة قبل التوسع إلى قدرات إضافية.
3. **Modularity حقيقية:** يمكن ترخيص وتفعيل Modules مختلفة حسب العميل ضمن Dependencies معلنة، دون فرض Suite كاملة عليه.
4. **تكامل منضبط:** الوحدات المتكاملة تتبادل البيانات والآثار التشغيلية والمالية بصورة متسقة دون تكرار مسؤوليات أو منطق أعمال غير ضروري.
5. **Platform Foundation موحدة:** الصلاحيات والموافقات والتدقيق والبيانات المشتركة والتقارير والتكاملات والخدمات العامة لا يعاد بناؤها بشكل منفصل داخل كل Module.
6. **Configuration-Driven:** اختلافات العملاء الطبيعية يتم استيعابها بالإعدادات والبيانات المرجعية قدر الإمكان، وليس بتفرعات كود خاصة لكل عميل.
7. **دعم الهيكل المؤسسي المستهدف:** يستطيع المنتج التعامل بصورة صحيحة مع Tenant / Multi-Company / Multi-Branch وفق النموذج الذي سيتم اعتماده لاحقًا. *(اعتُمد في Phase 3 — `TENANT_MODEL` / `MULTI_COMPANY_MODEL` / `MULTI_BRANCH_MODEL`.)*
8. **Enterprise-Grade ضمن النطاق:** ما يتم بناؤه يحقق مستوى مناسبًا من الأمان والتدقيق والاعتمادية والأداء وسلامة البيانات بما يتناسب مع الشركات المتوسطة والكبيرة.
9. **Extensibility مثبتة:** يمكن إضافة Module أو Extension جديد دون إعادة بناء الـCore أو كسر العقود والقدرات القائمة.
10. **قابلية الاستمرار:** يبقى حجم المنتج وتعقيده ضمن مستوى يمكن لفريق المشروع ومنظومة Teranoo تطويره واختباره وتشغيله وصيانته فعليًا.

المؤشرات الرقمية التفصيلية للأداء والتوافر والأمان والأحجام التشغيلية لا تُحدد في Project Vision؛ يتم اعتمادها لاحقًا ضمن Enterprise-Wide Requirements وNon-Functional Requirements.

## 10. القرارات المفتوحة بعد إغلاق الرؤية

القرارات التالية مقصود تأجيلها إلى مراحلها المحددة في خطة المشروع، ولا تعتبر نقصًا في Project Vision:

> **حالة هذه القرارات (2026-10-02):** #1–#4 ✅ **محسومة** (#1 → Phase 2 · #2–#3 → Phase 3 · #4 → Phase 4) · #5 أُجيب معماريًا في Phase 4 ويلزمه قرار تجاري للإطلاق (Phase 11).

1. قواعد استقلالية واعتماديات الـModules — ✅ **حُسم في Phase 2** (`DEPENDENCY_MODEL` + `MODULE_DEPENDENCY_MATRIX` + Lifecycle/Extension Rules).
2. نموذج Multi-Tenant وعزل البيانات — ✅ **حُسم في Phase 3** (`D-TEN-01..07` + `D-ISO-01..12`).
3. نموذج Tenant / Company / Branch بالتفصيل — ✅ **حُسم في Phase 3** (`D-COMP-01..11` · `D-BR-01..12` · `D-ORG-01..15`).
4. استراتيجية قاعدة البيانات والمحرك الأساسي — ✅ **حُسم في Phase 4** (`D-DEP-05` + `D-DEP-06`: PostgreSQL محرك وحيد مدعوم).
5. حدود Cloud وOn-Premises المطلوبة للنسخة الأولى — ⚠️ **أُجيب معماريًا في Phase 4** (SaaS-first؛ On-Prem = architecture-ready لا التزام V1 — `R-ONP-10`)؛ **الالتزام التجاري للإطلاق قرار منتج** يُثبَّت في Product Baseline (Phase 11 — OBS-1).
