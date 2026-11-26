---
id: kh-doc-cross-phase-guardrails-ar
slug: cross-phase-product-guardrails
title:
  ar: "ضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md)"
  en: "Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)"
subtitle:
  ar: "الضوابط الثمانية المعتمدة العابرة لجميع مراحل التخطيط والمعمارية"
  en: "Eight approved product-wide architectural guardrails applying across all planning and architecture phases"
description:
  ar: "النص الرسمي الكامل لضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md — Approved)، شاملة الضوابط الثمانية من خط المنتج الموحد حتى حوكمة التهيئة والميزات."
  en: "Complete verbatim Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md — Approved) establishing all eight project-wide architectural guardrails."
language: ar
type: architecture-document
classification: official
editorialStatus: published
publicationStatus: public
approvalStatus: approved
implementationStatus: not-applicable
depth: L3
journeyStages:
  - architecture
  - functional-design
  - detailed-system-design
phaseRefs:
  - phase-1
  - phase-3
  - phase-4
  - phase-5
  - phase-6
  - phase-10
moduleRefs: []
domainRefs:
  - integration
  - configuration
  - extensions
  - audit-trail
  - workflow-approvals
topics:
  - architecture
  - upgradeability
  - extensibility
  - data-governance
  - security
  - governance
tags:
  - teranoo-erp
  - project-foundations
  - guardrails
  - single-product-line
  - upgrade-safe
  - batch-001
traceability:
  decisionIds: []
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: constrains
    targetId: kh-doc-project-work-plan-ar
    label:
      ar: "ضوابط ملزمة عبر مراحل خطة عمل المشروع"
      en: "Binding guardrails across Project Work Plan phases"
  - type: related-to
    targetId: kh-doc-decision-register-ar
    label:
      ar: "مدرجة كوثيقة حاكمة معتمدة في سجل القرارات الرسمي"
      en: "Listed as an approved Governing Artifact in DECISION_REGISTER.md"
  - type: related-to
    targetId: kh-doc-future-architecture-considerations-ar
    label:
      ar: "تضم سبع أفكار رُقّيت من سجل الاعتبارات المعمارية المستقبلية"
      en: "Incorporates seven ideas promoted from FUTURE_ARCHITECTURE_CONSIDERATIONS.md"
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md
  sourceTitle: "Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)"
  commitSha: 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f
  treeSha: db531de6b2ab452578a550e07c5fd80e4bfe6b64
  gitBlobSha: 05dc98f61b79f0436c395de8c06650c723476e48
  rawSourceSha256: 839b15aef92b9a654a1d84ce539101d68e3b757f77aba6facef2cc9f63bc6081
  storedBodySha256: 9500f4d735d0f4c1abba2b648b883bcf515c11be86c22ca7b47c8d45334af1cd
  verificationStatus: git-blob-verified-lf-normalized
  lineEndingNormalization: crlf-to-lf
  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: mixed
  sourceDocumentDate: null
  reviewDate: "2026-11-26"
  publicationDate: "2026-11-26"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-004 BATCH-001 Authorized Release"
  scopeNote:
    ar: "وثيقة حاكمة معتمدة (Governing Artifact بدون معرفات D-* منفصلة) مستوردة بالكامل ضمن BATCH-001."
    en: "Approved governing artifact (without standalone D-* IDs) ingested verbatim in BATCH-001."
  completeness: complete
versioning:
  revision: 1
  sourceVersion: "397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f"
  lastVerifiedDate: "2026-11-26"
collectionSequence:
  collectionId: kh-col-project-foundations
  order: 4
---

# Teranoo ERP — Cross-Phase Product Guardrails

> **الحالة:** ✅ Approved / Project-Wide Guardrails  
> **الغرض:** تثبيت المبادئ التي يجب أن تحافظ عليها جميع مراحل التصميم القادمة لأنها تؤثر في قابلية تشغيل المنتج وصيانته وترقيته ودعمه على المدى الطويل، حتى لو كانت تفاصيل التنفيذ مؤجلة إلى مراحل لاحقة.

---

## 1. Guardrail — Single Product Line & Upgrade-Safe Extensions

المرجع التفصيلي الحالي موجود أيضًا في:

`teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md`

### المبدأ

> **Teranoo ERP maintains one canonical, upgradeable Product Core. Customer-specific behavior must not create a normal product model based on customer-specific Core forks.**

### ما يترتب عليه

- الإصدارات العامة تخرج من Product Core واحد.
- تخصيص العميل يكون بالأولوية عبر:
  `Configuration → Supported Extension / Metadata → Integration`.
- أي Customer Extension تبقى منفصلة عن Core وتخضع لـCompatibility Contract عند تصميم الآلية.
- تحديث خاص بعميل لا يعني إنشاء Core مستقل له.
- أي Custom Feature تصبح عامة تخضع لـProduct Review لإدخالها إلى Core/Module رسمي إذا كانت مناسبة.

### التفاصيل المؤجلة

- Versioning scheme النهائي.
- Release channels / LTS.
- SaaS rollout mechanics.
- On-Prem updater/package format.
- Database migration implementation.
- Rollback/recovery implementation.

**Owner Phases:** Phase 4 + Phase 5 + Phase 10.

---

## 2. Guardrail — Configuration Transport & Environment Promotion

### المبدأ

> **Business configuration that affects production behavior must be transportable, version-aware, auditable, and promotable between controlled environments; production configuration must not depend on undocumented manual recreation as the normal operating model.**

### لماذا هذا ملزم مبكرًا؟

Teranoo ERP سيحتوي لاحقًا على إعدادات يمكن أن تغيّر السلوك بصورة جوهرية، مثل:

- Workflows & Approvals.
- Feature / module configuration.
- Custom fields / metadata حيث يتم دعمها.
- Reports / templates حيث يتم دعم نقلها.
- Integration mappings/configuration.
- Rules and controlled business settings.

### Guardrails

1. يجب الفصل مفاهيميًا بين `Configuration Data` و`Business Transaction Data`.
2. الإعدادات القابلة للنقل يجب أن تحمل هوية/Version أو ما يعادلها عند تصميم الآلية.
3. يجب أن يمكن التحقق من Dependencies قبل Promotion.
4. يجب أن يكون نقل التغيير Audit-able.
5. لا يجوز أن تكون إعادة إدخال الإعداد يدويًا في Production هي آلية النشر الأساسية.
6. يجب مراعاة Environment-specific values مثل secrets/endpoints وعدم نسخها بصورة عمياء.
7. يجب أن يسمح التصميم لاحقًا بالكشف عن Configuration Drift عندما يكون ذلك مهمًا.

### التفاصيل المؤجلة

- شكل Package النهائي.
- DEV/UAT/PROD topology.
- Approval workflow للنقل.
- Diff engine.
- Rollback semantics.
- Secret-management implementation.

**Owner Phases:** Phase 4 (Environments/Deployment implications) + Phase 5 (Configuration Framework) + Phase 10 (Operational validation).

---

## 3. Guardrail — Versioned Public Integration & Extension Contracts

### المبدأ

> **Public APIs, business integration contracts, events, and supported extension points are product contracts and must evolve through explicit compatibility/versioning/deprecation rules rather than being broken implicitly by internal refactoring.**

### Guardrails

1. Internal code structure لا يساوي Public Contract.
2. تعديل Architecture الداخلي لا يبرر كسر API/Event مستخدم خارجيًا دون lifecycle واضح.
3. Public Contracts يجب أن تكون قابلة للتعريف والإصدار والتتبع.
4. Breaking changes تحتاج مسار Migration/Deprecation واضح عند تصميم السياسة.
5. Extension Compatibility يجب أن تُفحص مع Core/Module versions.
6. لا تعتمد Integrations على الوصول المباشر غير المحكوم إلى Core database structures كمسار رسمي.
7. يجب تجنب أن يعرّف كل Module سياسة Versioning خاصة به بصورة متعارضة مع المنتج.

### التفاصيل المؤجلة

- REST/GraphQL/event technology choices.
- API version format.
- Deprecation periods.
- Compatibility window.
- Event broker / delivery implementation.

**Owner Phases:** Phase 5 (Integration/API + Extension Framework) + Phase 10 (Backward Compatibility / Deprecation validation).

---

## 4. Guardrail — Controlled Customer Data Migration & Data Exit

### المبدأ

> **Teranoo ERP must be designed so a customer can be onboarded through controlled, validated migration and can later export/exit with its business data through governed processes; neither onboarding nor offboarding should depend on uncontrolled direct database manipulation.**

### Onboarding Guardrails

المسار المستهدف مفاهيميًا:

`Extract → Map → Validate → Dry Run → Reconcile → Approve → Import → Evidence`

ويجب أن يسمح لاحقًا بالتعامل مع أنواع مثل:

- Party / Customer / Supplier data.
- Product / Item master data.
- Opening balances.
- Inventory opening quantities/values.
- Open receivables/payables.
- Assets and other approved opening positions.
- Historical data only when scope requires it.

### Data Exit Guardrails

1. العميل يجب أن يملك مسار Export منظمًا للبيانات التي يملكها ضمن السياسة المعتمدة.
2. Offboarding لا يعني حذفًا فوريًا للبيانات؛ retention/legal obligations تبقى حاكمة.
3. يجب الفصل بين Export capability وبين direct database access.
4. Documents/attachments/configuration/audit-relevant exports يجب تقييمها ضمن scope لاحقًا.
5. يجب أن تكون عمليات Migration قابلة للمراجعة وإنتاج Evidence/Reconciliation عند الحاجة.

### التفاصيل المؤجلة

- Import file formats.
- ETL tooling.
- Historical migration depth.
- Data-exit package format.
- Retention periods.
- Customer contractual/legal export obligations.

**Owner Phases:** Phase 5 (Import/config/shared services implications) + Phase 10 (Migration/Export/Retention operational requirements) + implementation planning later.

---

## 5. Guardrail — Shared Background Processing & Product Supportability

### المبدأ

> **Cross-cutting asynchronous processing, diagnostics, and supportability must be platform-governed capabilities; individual modules must not independently invent incompatible schedulers, retry semantics, diagnostic models, or uncontrolled support-access paths.**

### Background Processing Guardrails

أي Background/Batch Job يجب أن يستطيع لاحقًا حمل Context واضحًا حيث ينطبق، مثل:

`Tenant → Company → Module → Operation`

ويجب أن يغطي التصميم عند الوصول إليه:

- Job identity/status.
- Retry/failure handling.
- Idempotency where required.
- Scheduling.
- Tenant/company context propagation.
- Monitoring and operational visibility.
- Prevention of cross-tenant leakage.

أمثلة مستقبلية:

- Scheduled reports.
- Integration jobs.
- Recurring transactions.
- Notifications.
- Posting/batch processes.
- Imports.
- Revaluation/valuation jobs where applicable.

### Supportability Guardrails

المنتج يجب أن يكون قابلًا للتشخيص والدعم بدون منح وصول غير محدود لبيانات العميل.

يجب دراسة لاحقًا:

- Correlation / trace identifiers.
- Failed jobs / integration diagnostics.
- Tenant/module health.
- Technical logs vs business audit separation.
- Diagnostic bundles.
- Controlled and audited support access.

### التفاصيل المؤجلة

- Scheduler technology.
- Queue/broker technology.
- Log/trace stack.
- Support tooling implementation.
- Support-access workflow and authorization.

**Owner Phases:** Phase 5 (Platform capabilities) + Phase 10 (Observability / Administration / Supportability validation).

---

## 6. Guardrail — AI Safety, Governance & ERP Control Preservation

### المبدأ

> **AI capabilities in Teranoo ERP must respect the same Tenant, Company, identity, permission, audit, data-ownership, workflow, and business-control boundaries as non-AI operations. AI must not become an alternate path around ERP controls, and sensitive or irreversible actions require governed execution and approval appropriate to their risk.**

### Guardrails

1. **Same Authorization Boundary** — AI لا يحصل على بيانات أو صلاحيات أوسع من المستخدم أو الخدمة التي يعمل نيابةً عنها.
2. **Tenant / Company Isolation** — أي AI search, retrieval, embeddings, indexes, caches أو knowledge context يجب أن يحترم Tenant/Company boundaries المعتمدة؛ لا يجوز تسريب معرفة Tenant إلى آخر.
3. **No Direct Core Database Bypass** — AI لا يكتب مباشرة إلى Core database كمسار رسمي؛ تنفيذ الأعمال يتم من خلال Business Commands / APIs / Workflows المعتمدة وبنفس validations والcontrols.
4. **Human/Governed Approval for Sensitive Actions** — العمليات الحساسة أو غير القابلة للعكس — مثل posting, payments, payroll, supplier bank changes, inventory adjustments, permission changes أو ما يماثلها — لا تُنفذ تلقائيًا دون policy/approval مناسبة للمخاطر.
5. **AI Suggestions ≠ Business Truth** — مخرجات AI يجب ألا تتحول تلقائيًا إلى حقائق محاسبية/قانونية أو Master/Transaction data دون validation مناسب.
6. **Auditability** — يجب أن يمكن لاحقًا تتبع AI-assisted actions بشكل كافٍ: من طلبها، أي capability/model/version استخدم، وما الإجراء النهائي الذي تم اعتماده، بما يتناسب مع privacy/security requirements.
7. **Provider Independence Principle** — Product Architecture لا يجب أن تجعل ERP Domain معتمدًا بصورة لا يمكن فصلها عن AI provider/model واحد؛ provider selection والتبديل/fallback يدرسان لاحقًا.
8. **Data Minimization & Privacy** — إرسال business/customer data إلى AI provider يجب أن يخضع لسياسة واضحة للحد الأدنى من البيانات، classification, residency/privacy والقيود التعاقدية عند الحاجة.
9. **Cost & Availability Controls** — AI capability يجب أن تكون قابلة للتحكم على مستوى المنتج/tenant/feature حيث يلزم، ولا يجب أن يؤدي تعطل AI provider إلى تعطيل وظائف ERP الأساسية غير المعتمدة عليه.
10. **Controlled Automation** — الانتقال من `AI Suggests` إلى `ERP Executes` يجب أن يكون صريحًا ومحكومًا؛ درجة autonomy تختلف حسب نوع العملية ومخاطرها.

### أمثلة قدرات محتملة — ليست Scope معتمدًا الآن

- ERP Copilot / natural-language assistance.
- Natural-language reporting/query assistance.
- Document data extraction.
- Suggested reconciliation/matching.
- Anomaly detection.
- Forecasting.
- Knowledge-base support assistant.
- Suggested drafts/actions/workflows.

### التفاصيل المؤجلة

- AI provider/model selection.
- Cloud vs local models.
- RAG/vector technology.
- Prompt/model versioning implementation.
- AI Gateway architecture.
- Model routing/fallback.
- Token/cost policy.
- Exact autonomous-action classes.
- AI evaluation/testing framework.

**Owner Phases:** Phase 5 (Identity/Integration/Platform capabilities where relevant) + Phase 10 (Security/Audit/Observability/Enterprise AI requirements) + dedicated AI research before functional adoption.

---

## 7. Guardrail — Online-Only Transaction Processing & Safe Draft Preservation

### المبدأ

> **Teranoo ERP is an online transactional system. Business transactions are not executed or committed while connectivity to the authoritative backend is unavailable. Temporary connectivity loss must stop server-dependent actions without causing the user to lose work already entered but not yet committed.**

### Guardrails

1. **Online-Only Business Processing** — لا يتم اعتماد Offline transaction execution أو Offline posting أو Offline approval كجزء من نموذج المنتج الطبيعي.
2. **Authoritative Backend** — الـBackend المعتمد يبقى المصدر الرسمي للحالة والمعاملات؛ أي بيانات مؤقتة على جهاز المستخدم ليست Business Truth ولا مصدرًا موازيًا للبيانات.
3. **Connectivity Loss Stops Commit Actions** — عند فقد الاتصال يتم إيقاف `Save / Submit / Post / Approve / Delete` وأي عملية تحتاج Server confirmation حتى عودة الاتصال.
4. **Safe Draft Preservation** — فقد الاتصال المؤقت لا يجب أن يؤدي إلى خسارة المدخلات الحالية التي أدخلها المستخدم ولم تُحفظ بعد، ضمن ضوابط أمان مناسبة.
5. **Draft Preservation ≠ Offline Processing** — حفظ Form state أو Draft مؤقت لا يسمح بإنشاء معاملات نهائية محليًا أو تنفيذ Business Rules قد تصبح قديمة أثناء الانقطاع.
6. **Revalidation After Reconnect** — عند عودة الاتصال يجب إعادة التحقق من Session/Permissions/Record state/Business Rules/period status وأي شروط مؤثرة قبل Commit.
7. **Concurrency Protection** — إذا تغير السجل على الخادم أثناء انقطاع الاتصال، لا يجوز الكتابة فوق التغيير بصمت؛ يجب اكتشاف Version/Concurrency conflict والتعامل معه بصورة محكومة.
8. **Secure Temporary Storage** — إذا استخدمت آلية Local/Client-side draft preservation، فيجب تقليل البيانات الحساسة، وتحديد lifecycle/expiration مناسب، وعدم حفظ secrets، ومسح النسخة المؤقتة بعد نجاح الحفظ حيث ينطبق.
9. **Server-Side Drafts Preferred Where Appropriate** — عندما تسمح طبيعة المستند، يمكن استخدام Draft رسمي محفوظ على الخادم أثناء الاتصال لتقليل خطر فقد العمل؛ تفاصيل Auto-save/Draft model تُقرر لاحقًا.
10. **Mobile Does Not Imply Offline** — أي Mobile/Web/PWA clients مستقبلية تلتزم بنفس المبدأ: اتصال مطلوب لتنفيذ المعاملات، ويمكن فقط تحسين تجربة فقد الاتصال دون بناء Sync engine للمعاملات.

### السلوك المستهدف مفاهيميًا عند انقطاع الاتصال

`Connection Lost → Preserve Current Input → Disable Server-Dependent Actions → Detect Reconnection → Revalidate → Continue / Resolve Conflict → Commit`

### التفاصيل المؤجلة

- Auto-save cadence.
- Local draft technology.
- Browser/PWA storage choice.
- Encryption/secure-storage implementation.
- Server-side Draft lifecycle.
- Conflict-resolution UX.
- Session-expiration behavior during outages.

**Owner Phases:** Phase 4 (Connectivity/deployment expectations) + Phase 5 (Configuration/UI platform and draft-support implications where relevant) + Phase 6/7 module blueprints for document-specific Draft semantics + Phase 10 (Security/Availability/UX validation).

---

## 8. Guardrail — Product Configuration & Feature Control

### المبدأ

> **Teranoo ERP must allow selected product behavior to vary through explicit, typed, governed configuration contracts defined by the product in advance; configuration must not become a mechanism for editing Source Code, redefining Core invariants, or creating disguised customer forks.**

الهدف هو تقليل الحاجة إلى تعديلات Core لكل اختلاف مشروع بين العملاء، مع الحفاظ على Product Core واحد آمن وقابل للترقية.

أمثلة على الأنواع التي قد يدعمها الـFramework لاحقًا:

- **Feature Toggle** — تشغيل أو إيقاف Capability مصرح بها.
- **Behavior Policy** — مثل `Allow / Warning / Block`.
- **Business Parameter** — نسبة أو حد أو مدة أو قيمة ضمن Domain contract واضح.
- **Product Configuration** — إعداد وظيفي أوسع ضمن حدود Capability محددة مسبقًا.
- **Release / Rollout Control** — استهداف ونشر Version أو Feature على نطاقات معتمدة.

مثال مفاهيمي:

`Blocked Supplier Behavior = Allow / Warning / Block`

هذا المثال لا يعتمد القيمة الافتراضية أو من يملك حق التغيير؛ يثبت فقط نوع القدرة المطلوبة.

### فصل المسؤوليات

#### Business Modules / Domain Capabilities

الـModule أو Capability المالكة للمعنى الوظيفي هي التي تحدد مسبقًا:

- ما الذي يسمح أصلًا بأن يكون Configurable.
- Semantic meaning لكل Setting.
- Type والقيم/النطاقات المسموح بها.
- Default behavior.
- Validation وBusiness invariants التي لا يجوز تجاوزها.
- Scopes التي يسمح المنتج بتطبيق الإعداد ضمنها.
- كيفية تطبيق السلوك أثناء Runtime.

> **Control Plane لا يعرّف معنى Business Setting ولا يخترع سلوكًا غير موجود في Product Contract.**

#### Shared Platform — Product Configuration Framework

القدرة المشتركة في Phase 5 يجب أن تبحث وتحدد Framework موحدًا لمفاهيم مثل:

- Stable configuration identifiers.
- Typed definitions / schemas بدل unrestricted generic key/value behavior.
- Defaults and effective-value evaluation.
- Scope / targeting semantics.
- Precedence and conflict resolution.
- Validation.
- Version compatibility.
- Auditability.
- Configuration lifecycle.
- علاقة Product Configuration مع Environment Promotion وUpgradeability.

هذه قائمة نطاق بحث وليست تصميم implementation معتمدًا الآن.

#### Control Plane

بحث `Control Plane Responsibilities` الحالي يجب أن يحدد فقط **حدود الإدارة المركزية** التي قد تشمل، عند اعتمادها:

- Targeting عبر product-wide / tenant group / tenant scopes أو بدائلها المدروسة.
- Controlled rollout / activation state.
- Version/release association.
- Publishing / promotion orchestration حيث تكون مسؤولية Control Plane مناسبة.
- Rollback / previous-effective-state coordination.
- Central audit / governance visibility.

ولا يجوز أن تتحول هذه المسؤوليات إلى Ownership للـBusiness semantics نفسها.

### Guardrails

1. **Configuration ≠ Source Code Editing** — لا تعديل Source Code من داخل النظام كجزء من هذه القدرة.
2. **Configuration Is Product-Declared** — المطور/المنتج يعرّف مسبقًا نقاط التهيئة المسموحة؛ العميل أو الـAdmin لا ينشئ Business behavior اعتباطيًا خارج العقود المعتمدة.
3. **No Core-Invariant Override** — الإعداد لا يجوز أن يكسر Tenant Isolation أو Data Ownership أو Accounting Integrity أو Security/Authorization أو Module Dependency invariants أو أي Guardrail معتمد.
4. **No Disguised Forks** — لا نستخدم عشرات الإعدادات لإعادة بناء نسخة مختلفة جذريًا من Domain Model لعميل واحد؛ عند تجاوز حدود التهيئة نعود إلى `Supported Extension / Metadata → Integration` وفق الحوكمة المعتمدة.
5. **Typed and Validated** — لا يعتمد التصميم على unrestricted `SettingName / SettingValue` كآلية عامة بلا contract؛ كل Setting يجب أن تكون قابلة للتعريف والتحقق وفق نوعها ومعناها.
6. **Explicit Scope** — وجود Setting لا يعني أنها قابلة تلقائيًا للـGlobal/Tenant/Company/Branch override؛ الـallowed scopes جزء من Product Contract لكل setting/capability.
7. **Deterministic Effective Value** — إذا دعم أكثر من scope أو targeting level فيجب أن تكون precedence/conflict semantics صريحة وقابلة للتفسير، لا تعتمد على ترتيب ضمني أو آخر كتابة فقط.
8. **Version & Upgrade Safety** — تعريفات الإعدادات وتغييراتها يجب أن تكون متوافقة مع Product Versioning/Upgrade rules، بما في ذلك deprecation/migration عند الحاجة.
9. **Auditability** — التغييرات المؤثرة على Product/Business behavior يجب أن تكون قابلة للتدقيق مع actor، scope، previous/effective value، والتوقيت حسب Owner Phase.
10. **Safe Rollout / Rollback** — عندما تسمح القدرة بالنشر التدريجي أو التراجع، يجب ألا يؤدي rollback إلى كسر Business Data أو تحويل تاريخ المعاملات إلى معنى جديد بصمت.
11. **Entitlement / Authorization / Configuration Are Separate** — Feature availability أو license entitlement أو user permission لا تُدمج ضمن setting واحد غامض؛ علاقاتها تُعرّف صراحة في Owner Phases.
12. **Same Product Core** — اختلاف Effective Configuration بين العملاء لا ينشئ Product Core مختلفًا.

### ما لم يُعتمد الآن

لم نعتمد بعد:

- exact targeting hierarchy مثل `Global → Tenant Group → Tenant`.
- precedence model النهائي.
- Feature Flag technology/provider.
- storage/schema implementation.
- cache/distribution mechanism.
- rollout percentages/rings.
- approval workflow.
- exact rollback semantics.
- configuration UI.
- من يملك حق تعديل كل نوع من الإعدادات.
- Tenant Group ككيان معماري مستقل.
- Company/Branch overrides كقاعدة عامة.
- runtime evaluation implementation.

هذه التفاصيل تخضع للبحث في Owner Phase المناسب.

**Owner Phases:** Phase 3 (Control Plane responsibility boundary only) + Phase 5 (`Product Configuration & Feature Control Framework`) + Phase 10 (Security, audit, operational and upgrade validation).

---

# Governance Rule

هذه المبادئ **معتمدة كـGuardrails فقط** وليست تصميمًا تقنيًا نهائيًا.

عند الوصول إلى Owner Phase لكل مبدأ:

1. يتم إجراء البحث المناسب عند الحاجة.
2. يتم تحويل المبدأ إلى Architecture/Platform decisions تفصيلية.
3. إذا كشف البحث أن Guardrail يحتاج تعديلًا جوهريًا، يتم Reopen صريح ومبرر.
4. لا يجوز لقرار محلي داخل Module أن يكسر Guardrail project-wide ضمنيًا.

---

# Relationship to Future Considerations

الأفكار المهمة التي لم تُعتمد كـGuardrails بعد يتم تسجيلها في:

`teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md`

وجود الفكرة في ذلك الملف **لا يعني اعتمادها**؛ بل يعني أنها محفوظة للمراجعة في المرحلة المناسبة.