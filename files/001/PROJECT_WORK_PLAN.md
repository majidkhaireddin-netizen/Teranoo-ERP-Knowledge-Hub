# Teranoo ERP — Project Work Plan

> الحالة: Active
> الغرض: المرجع التنفيذي الرسمي لترتيب أعمال التحضير والبحث قبل تسليم المشروع إلى منظومة Teranoo.

## قاعدة التنفيذ

نعمل **مرحلة واحدة في كل مرة**.

لا ننتقل إلى المرحلة التالية إلا بعد:
1. إكمال البحث المطلوب عند الحاجة.
2. مناقشة النتائج.
3. اعتماد القرار.
4. توثيق القرار في الملف المناسب.
5. تحديث هذا الملف وREADME بحالة التقدم.

لا يوجد كود في هذه الخطة. هذه الخطة تخص التحضير والبحث والتصميم الوظيفي والمفاهيمي فقط.

المرجع المركزي لفهرسة القرارات المعتمدة هو:

`teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md`

وهو **Index فقط**؛ المصدر النهائي لكل قرار يبقى ملفه الرسمي.

## حالات العمل

- ✅ Completed — مكتمل ومعتمد
- 🔄 In Progress — قيد العمل الآن
- ⏳ Pending — لم يبدأ
- 🔬 Research Required — يحتاج بحثًا قبل القرار
- ⛔ Blocked — متوقف بسبب قرار سابق غير محسوم

---

# Phase 1 — Product Foundation & Vision

الهدف: تثبيت هوية المنتج وحدوده ومبادئه الأساسية قبل الدخول في تفاصيل الأنظمة.

| البند | الحالة |
|---|---|
| قواعد وطريقة العمل | ✅ |
| تعريف المنتج Modular ERP | ✅ |
| السوق المستهدف: الشركات المتوسطة والكبيرة | ✅ |
| القطاعات الأساسية المستهدفة | ✅ |
| مستوى المنتج: Enterprise-Grade ضمن نطاق واقعي | ✅ |
| Business Core Modules | ✅ |
| Platform Foundation | ✅ |
| قابلية إضافة Enterprise Modules وIndustry Extensions | ✅ |
| تعريف المشكلة التي يعالجها المنتج | ✅ |
| معايير نجاح رؤية المنتج | ✅ |
| مراجعة وإغلاق Project Vision بالكامل | ✅ |

**الحالة:** ✅ Completed / Closed

---

# Phase 2 — Module Architecture & Dependency Rules

الهدف: تحديد كيف تعيش الـModules داخل منظومة Teranoo، وكيف تعمل منفردة ومتكاملة، وكيف يتم بيعها وتفعيلها دون خلق ترابط فوضوي.

هذه المرحلة معمارية/تنظيمية على مستوى الـModules، وليست دراسة للوظائف التفصيلية داخل كل Module.

1. ✅ Finance — Deep Research + `FINANCE_MODULE_MODEL.md` معتمدان ومغلقان.
2. ✅ Inventory & Warehouse Management — Deep Research + `INVENTORY_MODULE_MODEL.md` معتمدان ومغلقان.
3. ✅ Procurement — Deep Research + `PROCUREMENT_MODULE_MODEL.md` معتمدان ومغلقان.
4. ✅ Sales & Order Management — Deep Research + `SALES_ORDER_MANAGEMENT_MODULE_MODEL.md` معتمدان ومغلقان.
5. ✅ `PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` — `PASS with Guardrails`؛ لا Reopen مطلوب.
6. ✅ `DEPENDENCY_MODEL.md` — اعتماد `PCD / HBMD / CIC / FLD` وقواعد Enforcement / Governance.
7. ✅ Required / Conditional / Optional semantics — معتمدة داخل Dependency Model وليست Dependency Types إضافية.
8. ✅ `MODULE_DEPENDENCY_MATRIX.md` — Core Matrix + Relationship Registers + PCD/Data Ownership registers.
9. ✅ `MODULE_LIFECYCLE_RULES.md` — General Module Activation / Deactivation Governance.
10. ✅ `FUTURE_MODULE_EXTENSION_RULES.md` — Future Module / Core Impact Governance.
11. ✅ `PHASE_2_CLOSURE_REVIEW.md` — Final Exit Gate = PASS.

### النتيجة المعمارية النهائية لـPhase 2

- Business Core Modules الأربعة **First-Class Sellable / Standalone-capable** ضمن حدودها المعتمدة.
- لا يوجد أي HBMD معتمد بينها.
- `HBMD edges = 0`.
- `HBMD cycles = 0`.
- CIC تستخدم للسيناريوهات المشتركة.
- FLD تستخدم لاعتماد Feature معينة دون إسقاط Base Module.
- PCD منفصلة عن Business Module relationships.
- Data Ownership مستقلة عن Dependency Types.
- `Freeze, not Delete` هو المبدأ العام بعد وجود Business History.
- Future Modules لا يجوز أن تنشئ Core back-dependency أو تغير Core Ownership ضمنيًا.

### مراجع Phase 2

- `teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md`
- `teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md`
- `teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md`
- `teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md`
- `teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md`
- `teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md`
- `teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md`
- `teranoo-erp-planning/03-modules/FUTURE_MODULE_EXTENSION_RULES.md`
- `teranoo-erp-planning/00-project-foundation/PHASE_2_ASSUMPTION_SAFETY_REVIEW.md`
- `teranoo-erp-planning/00-project-foundation/PHASE_2_CLOSURE_REVIEW.md`

**الحالة:** ✅ Completed / Closed

**حدود المرحلة:** التفاصيل الوظيفية تؤجل إلى Functional Blueprints ضمن Phase 6.

---

# Phase 3 — Platform & Tenancy Model

الهدف: تثبيت النموذج المؤسسي المشترك الذي ستعمل فوقه جميع الـModules.

1. ✅ **Tenant model** — Deep Research archived + `05-platform-requirements/TENANT_MODEL.md` معتمد ومغلق بـ`D-TEN-01..D-TEN-07`.
2. ✅ **Multi-Company model** — Deep Research archived + `05-platform-requirements/MULTI_COMPANY_MODEL.md` معتمد ومغلق بـ`D-COMP-01..D-COMP-11`.
3. ✅ **Multi-Branch model** — Deep Research archived + `05-platform-requirements/MULTI_BRANCH_MODEL.md` معتمد ومغلق بـ`D-BR-01..D-BR-12`.
4. ✅ **Organizational hierarchy boundaries** — Deep Research archived + `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` معتمد ومغلق بـ`D-ORG-01..D-ORG-15`.
5. ✅ **Shared vs Company-specific master data** — Deep Research archived + `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` معتمد ومغلق بـ`D-MD-01..D-MD-15`.
6. ✅ **User / Role / Permission boundaries** — Deep Research archived + `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` معتمد ومغلق بـ`D-AUTH-01..D-AUTH-16`.
7. ✅ **Multi-Tenant data isolation models** — Deep Research archived + `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` معتمد ومغلق بـ`D-ISO-01..D-ISO-12`.
8. ✅ **Control Plane responsibilities** — Deep Research archived + `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` معتمد ومغلق بـ`D-CP-01..D-CP-07`.
9. ✅ **Tenant lifecycle: provisioning / suspension / archive / offboarding** — Deep Research archived + `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` معتمد ومغلق بـ`D-LC-01..D-LC-08`.
10. ✅ اعتماد النموذج النهائي — **Final Phase 3 Approval = PASS** (راجع `PHASE_3_CLOSURE_REVIEW.md`).
11. ✅ **Phase 3 Backward Compatibility Check** مقابل Module Models الأربعة وPhase 2 governance baselines = **PASS / SAFE — Material Conflict = 0 · Reopen = 0**.

### Tenant Model — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/TENANT_MODEL.md`

تم اعتماد `D-TEN-01..D-TEN-07`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/06-tenant-model/`

**Guardrail:** Tenant هو Logical Boundary، وليس Company / Subscription / Environment / Deployment / Database. Cross-Tenant يبقى External Integration Boundary، وتفاصيل Physical isolation وغيرها تبقى في بنودها الرسمية.

### Multi-Company Model — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/MULTI_COMPANY_MODEL.md`

تم اعتماد `D-COMP-01..D-COMP-11`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/07-multi-company-model/`

**Guardrails:**
- Company = First-Class Legal / Accounting Ownership Context.
- كل Business Transaction ذات أثر قانوني/مالي/تشغيلي لها Owning Company واحدة واضحة.
- `Company ≠ Branch ≠ Business Unit ≠ Warehouse ≠ Location ≠ Ledger ≠ COA`.
- Centralized Operations لا تطمس Buying / Selling / Owning Company.
- Intercompany يحافظ على Ownership مستقل لكل Company.
- Company Context في Inventory لا يعني تلقائيًا legal ownership للبضاعة في كل السيناريوهات.
- لا يُعتمد أن Platform/Tenant Admin يرى Business Data لجميع Companies تلقائيًا.
- compatibility = ✅ PASS / SAFE؛ Reopen Required = 0.

### Multi-Branch Model — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/MULTI_BRANCH_MODEL.md`

تم اعتماد `D-BR-01..D-BR-12`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/08-multi-branch-model/`

**Guardrails:**
- Branch = Optional Operational / Organizational / Regulatory Context داخل Company؛ ليست Independent Legal Entity ولا Accounting Ownership Boundary.
- `Branch → Company` انتماء واحد؛ Company تعمل بدون Branch.
- `Branch ≠ Site ≠ Location ≠ Warehouse ≠ Business Unit ≠ Department ≠ Project`.
- Branch Identity مستقلة عن Physical Location وعن hierarchy.
- Branch Context سياقي وليس Mandatory عالميًا على كل Transaction.
- Intercompany يحدده اختلاف Company فقط.
- Temporary Project Site لا يصبح Branch تلقائيًا.
- `Freeze / Close / Archive — not Delete` بعد Business History.
- compatibility = ✅ PASS / SAFE؛ Reopen Required = 0.

### Organizational Hierarchy Boundaries — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md`

تم اعتماد `D-ORG-01..D-ORG-15`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/09-organizational-hierarchy/`

**Guardrails:**
- Multiple Purpose-Specific Hierarchies بدل One Giant Enterprise Tree.
- `Business Entity Identity ≠ Hierarchy Membership ≠ Reporting / Aggregation Node ≠ Cross-Entity Relationship ≠ Transaction Ownership`.
- Company وBranch First-Class entities ولا تصبحان Generic Org Unit subtypes.
- Reference Memberships بدل نسخ الكيانات.
- Hierarchy Version الواحدة Single-parent وAcyclic.
- Hierarchies Effective-Dated / Versioned؛ Reorganization لا يعيد كتابة التاريخ.
- `Rollup / Grouping / Membership ≠ Ownership`.
- Native business hierarchy لا تعبر Tenant.
- Authorization / Workflow يمكن أن تستهلك hierarchy لكنها لا تستبدل نماذجها.
- compatibility = ✅ PASS / SAFE؛ Reopen Required = 0.

### Shared vs Company-Specific Master Data — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/SHARED_MASTER_DATA_MODEL.md`

تم اعتماد `D-MD-01..D-MD-15`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/10-shared-master-data/`

**Guardrails:**
- `Identity ≠ Attributes ≠ Context ≠ Visibility ≠ Applicability ≠ Ownership ≠ Authorization`.
- Product / Item Identity وParty Identity Tenant-scoped Shared Platform identities.
- Customer / Supplier = Roles / Company Contexts على Party.
- Company-specific context لا ينسخ Shared Master كاملًا.
- وجود Shared Identity لا يفعّل استخدامها تلقائيًا في كل Companies.
- Scope semantic/type-specific أولًا؛ لا Universal field-level dynamic scope.
- Master Data Sharing لا تُشتق من hierarchy أو Branch.
- Shared Master lifecycle مستقل عن Company applicability؛ لا physical delete بعد Business History.
- Scope change Shared ↔ Company-specific = Migration / Governance Event.
- Sharing Sets / Reference Sets optional capability وليست baseline dependency.
- `Company Identity ≠ Party Identity`؛ Party Representation ممكنة عند الحاجة.
- compatibility = ✅ PASS / SAFE؛ Reopen Required = 0.

### User / Role / Permission Boundaries — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md`

تم اعتماد `D-AUTH-01..D-AUTH-16` بعد مراجعة البحث وتصحيح ثلاث صياغات معمارية.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/11-user-role-permission/`

**Guardrails:**
- `Identity ≠ Tenant Membership ≠ Role ≠ Permission ≠ Data Scope ≠ Current Working Context ≠ Entitlement`.
- Person/Employee ≠ User Account؛ Human Principal ≠ Machine Principal.
- Role Definition reusable؛ Scope وValidity ضمن Assignment.
- `Atomic Grant = Capability + Scope + Validity`؛ لا Cartesian recombination بين Grants.
- Default Deny + Least Privilege + Fail-Safe.
- Company Scope first-class؛ Branch Scope contextual/per-object ولا يوجد Global branchless fail-closed rule.
- `Current Context ⊆ Authorized Scope`؛ context switching لا يمنح access.
- Tenant/Security/Platform Administration ≠ Business Superuser؛ لا Business Data access تلقائيًا.
- SoD متطلب معماري.
- Shared Master permissions تفصل Shared Identity / Company Context / Applicability؛ `Visibility ≠ Applicability`.
- Entitlement / Authorization / Applicability / Workflow / Business Rules بوابات مستقلة.
- Permission IDs مستقرة وقابلة للترقية.
- compatibility مع Phase 2 وكل قرارات Phase 3 السابقة = ✅ PASS / SAFE؛ Reopen Required = 0.

### Multi-Tenant Data Isolation Models — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md`

تم اعتماد `D-ISO-01..D-ISO-12` بعد مراجعة البحث وتصحيح ثلاث نقاط معمارية.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/12-multi-tenant-data-isolation/`

**Guardrails:**
- `Tenant Isolation ≠ Authorization ≠ Database Topology ≠ Deployment Topology`.
- Defense-in-Depth إلزامية؛ pooled data store يحتاج independent data-store enforcement layer، دون اعتماد RLS بعينها الآن.
- كل Business Request/Job/Event/Import يعمل داخل Tenant Context واحد؛ Missing/Invalid context = Fail Closed.
- Tenant Context يتحقق server-side؛ client parameter لا يمنح Tenant access.
- لا Native Cross-Tenant Business FK / Join / shared transaction ownership.
- Tenant ownership للBusiness History لا يتغير كعملية عادية؛ النقل Controlled Migration.
- Isolation تمتد إلى jobs/events/cache/search/files/attachments/import/export/reporting surfaces.
- `Tenant Identity ≠ Database / Schema / Deployment / Region`.
- Architecture = Hybrid-capable direction؛ لا التزام بتنفيذ Shared Schema/Schema-per-Tenant/DB-per-Tenant كلها في V1.
- Pooled ↔ Dedicated migration تحافظ على Tenant Identity وCanonical Product Core.
- On-Prem لا يُفترض أنه Tenant واحد؛ deployment cardinality مؤجلة إلى Phase 4.
- exact Engine/topology/RLS/backup/DR details مؤجلة إلى Phase 4.
- compatibility = ✅ PASS / SAFE؛ Reopen Required = 0.

**Guardrails الأساسية المحمولة إلى Control Plane Responsibilities:**
- Stable Tenant Identity مستقلة عن Data Location.
- Control Plane metadata لا تمنح Business Data access تلقائيًا.
- Routing/Data Location mapping ليست مسؤولية Business Modules.
- Isolation-tier migration لها governed migration state.
- Provisioning/Lifecycle يجب أن يحافظا على isolation invariants.
- Support/Platform administration لا تتجاوز `D-AUTH-10`.
- Control Plane لا يختار Database Engine أو topology تفصيلية قبل Phase 4.

### Control Plane Responsibilities — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md`

تم اعتماد `D-CP-01..D-CP-07`.

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/13-control-plane/`

**Guardrails:**
- `Control Plane coordinates and governs; Business/Data Plane executes ERP business behavior`.
- authoritative Tenant Control Registry للـoperational/control metadata، دون خلط Tenant Identity بالـlocator/subdomain/deployment.
- Control Plane يملك references/state/coordination لا physical routing/deployment/migration mechanisms.
- `Entitlement ≠ Authorization ≠ Configuration ≠ Dependency`.
- Product Configuration central management لا يملك Business Configuration semantics.
- Platform/Control Plane Administration ≠ Tenant Administration ≠ Business Administration.
- لا Business Data access تلقائي للـPlatform Admin؛ support access explicit/bounded/temporary/auditable.
- Operational Audit منفصل عن Business Audit ownership.
- Unplanned Control Plane failure لا يجب أن يشل العمليات التجارية القائمة دون ضرورة.
- compatibility = ✅ PASS / SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`.

### Tenant Lifecycle — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/TENANT_LIFECYCLE_MODEL.md`

تم اعتماد `D-LC-01..D-LC-08` بتاريخ 2026-10-02 بعد مراجعة حزمة البحث كاملة (40 مصدراً Tier 1).

حزمة البحث المؤرشفة: `teranoo-erp-planning/01-market-research/14-tenant-lifecycle/`

**Guardrails:**
- النموذج الأدنى: 4 حالات مستقرة (`ACTIVE / SUSPENDED / ARCHIVED / CLOSED`) + عمليتان (`PROVISIONING / OFFBOARDING`) + عملية خارجية واحدة (`PURGED/DELETED` — ليست حالة).
- دورة الحياة تصف التشغيل فقط: لا تُعيد تعريف الهوية/الملكية/العزل/التفويض، ولا تحذف أبداً تلقائياً.
- `SUSPENDED` = منع mutation معماري مع ثبات كل المرجعيات؛ `expiry → Suspension` عبر policy ولا يحذف.
- `ARCHIVED` = تصميم Teranoo خاص (بلا سابقة بائعية — مصرَّح به)؛ `Archive ≠ Delete`؛ العودة عبر controlled restore فقط.
- `OFFBOARDING` = عملية Control Plane بنقطة لاعودة معلنة ونقطة Closed — لا زر Delete، ولا تلقائية.
- `PURGED` بشروط الخمسة: صريح + مفوَّض منفصل + موثق + واعٍ بالاحتفاظ + لا رجوع.
- `Entitlement ≠ Lifecycle ≠ Authorization`؛ Platform Admin ليس Superuser تجارياً؛ مسار الطوارئ منفصل (B).
- كتالوج Control Plane مصدر الحقيقة الوحيد للحالة؛ الوحدات تقرأ ولا تكتب.
- compatibility مع كل قرارات Phase 3 وPhase 2 = ✅ PASS / SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`.

**الحالة:** ✅ Completed / Closed — Final Phase 3 Approval = PASS؛ Backward Compatibility Check = PASS (راجع `PHASE_3_CLOSURE_REVIEW.md`)؛ **Phase 4 معتمدة رسمياً ومبتدأة (2026-10-02)**.

---

# Cross-Phase Architecture Guardrail — Single Product Line & Upgrade-Safe Extensions

> **الحالة:** ✅ Approved Project-Wide Guardrail

> **Teranoo ERP maintains one canonical, upgradeable Product Core. Customer-specific behavior must be implemented through configuration, supported extension contracts, or isolated integrations; customer-specific changes must not fork or directly modify the Product Core as the normal product model.**

### قواعد ملزمة للمراحل القادمة

1. Single Product Line — Product Core رسمي واحد.
2. General Updates — الإصلاحات والتحسينات العامة تصدر كVersioned Releases.
3. Customer-Specific Customization Order — `Configuration → Supported Extension / Metadata → Integration`.
4. Upgrade-Safe Extensions — منفصلة عن Core وتعتمد على supported contracts/extension points.
5. No Customer Core Forks by Default.
6. Configuration and Extensions Survive Compatible Core Upgrades.
7. Versioned Upgrade Path يجب أن يغطي Application/Modules/Data Schema/Configuration migrations لاحقًا.
8. Safe Rollout Principle مع pre-check/post-validation/stop-on-failure.
9. Customer-Specific Updates توزع كتكوين أو Extension/Integration package مستقل قدر الإمكان.
10. Generalizable Customer Features تخضع Product Review ويمكن ترقيتها إلى Core/Module رسمي.

تفاصيل versioning/updater/package/database migration/rollback/release channels/LTS/cadence مؤجلة لOwner Phases.

---

# Phase 4 — Deployment & Database Strategy

1. ✅ **Cloud/SaaS deployment requirements** — `05-platform-requirements/CLOUD_SAAS_DEPLOYMENT_REQUIREMENTS.md` معتمد (خط أساس `R-DEP-1..10` + `D-DEP-01..D-DEP-02`).
2. ✅ **On-Premises deployment requirements** — `05-platform-requirements/ON_PREMISES_DEPLOYMENT_REQUIREMENTS.md` معتمد (نموذج `Connected On-Prem Data Plane` + `R-ONP-1..12` + `D-DEP-03`).
3. ✅ **تحديد ما يجب أن يبقى موحدًا بين نمطي التشغيل** — `05-platform-requirements/DEPLOYMENT_PROFILE_UNIFICATION_BOUNDARIES.md` معتمد (قوائم U/V/Prohibited + `R-UNI-1..11` + `D-DEP-04`).
4. ✅ **Database engine evaluation** — `05-platform-requirements/DATABASE_ENGINE_EVALUATION.md` معتمد (Confirmation Passed + `D-DEP-05` — PostgreSQL محرك أساسي وافتراضي للملفين).
5. ✅ **قرار: محرك واحد — PostgreSQL فقط** (`D-DEP-06` — Single-Engine Policy؛ حُسم سؤال Multi-Engine بالرفض).
6. ✅ **Backup / restore / disaster recovery principles** — `05-platform-requirements/BACKUP_RESTORE_DR_PRINCIPLES.md` معتمد (`D-DEP-07` · `R-BKP-1..12` + مصفوفة مسؤوليات SaaS/On-Prem).
7. ✅ **Scalability and performance expectations** — `05-platform-requirements/SCALABILITY_PERFORMANCE_EXPECTATIONS.md` معتمد (`D-DEP-08` · `R-SCL-1..13` · أرقام/تحقق → Phase 10).
8. ✅ **Upgrade delivery & migration architecture** — `05-platform-requirements/UPGRADE_DELIVERY_MIGRATION_ARCHITECTURE.md` معتمد (`D-DEP-09` · `R-UPG-1..14` · قناتان بعقد واحد + 7 خطوات محكومة).
9. ✅ **اعتماد Deployment & Database Strategy** — `05-platform-requirements/DEPLOYMENT_DATABASE_STRATEGY_ADOPTION.md` معتمد (`D-DEP-10` — اعتماد تجميعي للحزمة دون تعديل أي قرار).

**Phase 4 Guardrail:** لا تتحول المرحلة إلى Cloud Infrastructure Framework ضخم. المطلوب قرارات كافية حول deployment model، database strategy، SaaS/On-Prem boundaries، upgradeability، وbaseline recovery/scalability دون implementation تفصيلي سابق لأوانه.

### Cloud/SaaS Deployment Requirements — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/CLOUD_SAAS_DEPLOYMENT_REQUIREMENTS.md`

- خط أساس ملزم: **10 متطلبات `R-DEP-1..10`** مشتقّة بالكامل من قرارات معتمدة (لا Deep Research مطلوباً لهذا البند — Need-to-Decide-Now مُحقَّق).
- القرارات: `D-DEP-01` (One Product Core + Deployment Profiles) و`D-DEP-02` (خط الأساس ملزم — أي تعارض لاحق يتطلب Reopen صريحاً).
- الحدود: لا Provider/Kubernetes/Topology/Engine/أرقام SLA — كلها مُحالَة لبنود 2–9 وPhase 10.
- compatibility مع Phase 3 وSingle Product Line = ✅ PASS / SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`.

### On-Premises Deployment Requirements — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/ON_PREMISES_DEPLOYMENT_REQUIREMENTS.md`

- النموذج المعتمد: **Connected On-Prem Data Plane** (Customer-Hosted Data Plane + Teranoo Cloud Control Plane) — بمبادئ الـ12 المعتمدة من Majed.
- خط أساس ملزم: **12 متطلبات `R-ONP-1..12`** بtraceability كاملة (SaaS-first · بيانات محلية · نطاق CP حد أقصى · لا وصول دائم · Support الخمسة · قناة تحديث موقّعة · Grace/Offline بمبدأ فقط · ليس V1 · One Product Core · قاعدة Reopen).
- القرار: **`D-DEP-03`** — قرار واحد فقط (أقل عدد ممكن كما طُلب).
- تمييز حاسم موثق: انقطاع **Control Plane** ≠ انقطاع **Backend المحلي** — Guardrail 7 (Online-Only) سارية دون تخفيف.
- 🔬: البحث الخارجي غير مطلوب (مبادئ المالك + مصادر داخلية كافية — Need-to-Decide-Now مُحقَّق).
- الحدود: لا Provider/Kubernetes/Topology/شبكة/VPN/Agent/محرك/SLA/cardinality/مدة Grace.
- compatibility مع `R-DEP-1..10` و`D-DEP-01/02` وPhase 3 = ✅ PASS / SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`؛ **لا STOP**.

### Deployment Profile Unification Boundaries — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/DEPLOYMENT_PROFILE_UNIFICATION_BOUNDARIES.md`

- المبدأ المعتمد من Majed: منتج كانوني واحد — ملف النشر يغيّر التشغيل والاستضافة فقط لا منطق الأعمال.
- **قوائم مغلقة ثلاث:** `U1..U14` (يبقى موحداً — 14 بُعداً منتجياً) · `V1..V10` (يُسمح اختلافه — 10 أبعاد تشغيلية) · الممنوعات (أي اختلاف خارج V ممنوع افتراضياً؛ أي اختلاف في U = Core ثانٍ/fork = STOP).
- خط أساس ملزم: **11 متطلبات `R-UNI-1..11`** بtraceability كاملة.
- القرار: **`D-DEP-04`** (Deployment Profile Equivalence Boundary) — قرار واحد فقط.
- 🔬: لا Deep Research (حُسم داخلياً — مبدأ المالك + مصادر معتمدة كافية).
- compatibility مع `D-DEP-01..03` و`R-DEP-1..10` و`R-ONP-1..12` وSingle Product Line وPhase 2/3 = ✅ SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`؛ **لا STOP**.

### Database Engine Evaluation — النتيجة المعتمدة

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/DATABASE_ENGINE_EVALUATION.md`

- **Confirmation Passed: PostgreSQL مناسب** — لا مانع معماري · يدعم `D-ISO-*` (منها بيئة independent enforcement layer) و`D-LC-*` و`D-CP-*` و`D-DEP-01..04` · محرك **واحد في كلا الملفين** (يعزّز `D-DEP-01/04`).
- مقارنة خفيفة blocker-only ضد SQL Server/MySQL/Oracle = **لا بديل قاهر** (MySQL بلا RLS · Oracle مكلف · SQL Server يضعف On-Prem/التكلفة) — **لا Deep Research فُتح**.
- القرار: **`D-DEP-05`** (PostgreSQL primary & default للملفين) — قرار واحد.
- حدود مثبتة: Portability policy + Version/Support Window policy + خدمات مُدارة متوافقة بشروط — **بلا** topology/RLS نهائي/backup design/provider/أرقام إصدارات.
- ~~**Multi-Engine يبقى لبند 5** (Vision §7.7 — `D-DEP-05` لا يحسمه).~~ **حُسم في بند 5: `D-DEP-06` — محرك واحد فقط.**
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ `Reopen Required = 0`؛ **لا STOP**.

### Single-Engine Policy — النتيجة المعتمدة (بند 5)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/DATABASE_ENGINE_EVALUATION.md` (§4 — `D-DEP-06`)

- اعتماد Majed: **PostgreSQL هو المحرك الوحيد المدعوم رسمياً كخيار إنتاجي** لكل من SaaS وConnected On-Prem — لا محرك آخر.
- `D-DEP-06` يتعلق بـ`D-DEP-05`: 05 حدد Primary/Default وأثبت الصلاحية؛ 06 يُغلق Multi-Engine ويجعله **الوحيد** — يبني عليه ولا ينقضه (سياساتهما سارية معاً).
- `تعدد المزوّدين ≠ تعدد المحركات`: أي خدمة مُدارة تدّعي توافق PostgreSQL لا تُقبل تلقائياً — تخضع لشروط التوافق السلوكي + Portability + extensions (`D-DEP-05` §2.4).
- تصحيح موثق في المقارنة: غياب RLS في MySQL لا يُثبت استحالة `D-ISO-02` (القرار يطلب طبقة enforcement مستقلة بأي آلية صالحة) — لم تتغير التوصية.
- تحديث `00_PROJECT_VISION.md` §7.7 + §10 #4: لا يظهر سؤال المحرك/التعدد كقرار مفتوح بعد الآن.
- compatibility = ✅ SAFE (لا Reopen لأي قرار قائم)؛ **لا STOP**.

### Backup / Restore / DR Principles — النتيجة المعتمدة (بند 6)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/BACKUP_RESTORE_DR_PRINCIPLES.md`

- المبادئ المشتركة: **`R-BKP-1..12`** — نظام قابل للاستعادة (DB + مرفقات + إعدادات) · حماية النسخ · **Backup success ≠ Restore success** (اختبار دوري إلزامي المبدأ) · استعادة آمنة (restore-as-new/controlled) · انسجام مع `D-LC-06`.
- **مصفوفة مسؤوليات 8 عمليات** لكل نمط — بلا خلية بلا مالك · **لا رفع تلقائي لنسخ On-Prem إلى سحابة Teranoo** (`R-BKP-8`).
- فصل حاسم: **استعادة Tenant واحد** (قدرة محفوظة `D-ISO-12` — **ليست التزام إطلاق**) ≠ **DR البيئة الكاملة** (فئة مستقلة → Phase 10).
- **حادث بيانات ≠ فشل ترقية**: آليات الترقية مُحالة لبند 8 (`R-BKP-10`) · إطار RTO/RPO مؤجل بلا أرقام (`R-BKP-11`).
- القرار: **`D-DEP-07`** (قرار واحد) · القرارات المفتوحة O-1..O-6 موثقة في الوثيقة.
- compatibility مع `D-ISO-12`/`R-ONP-3/5/8`/`V6`/`D-LC-06`/`D-DEP-01..06` = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Scalability & Performance Expectations — النتيجة المعتمدة (بند 7)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/SCALABILITY_PERFORMANCE_EXPECTATIONS.md`

- المبادئ: **`R-SCL-1..13`** — توقعات مشتركة/قيم sizing مختلفة (V7) · أولويات أحمال · **Noisy Neighbor مُرقّى لتوقع ملزم (R-SCL-3)** · تدهور رشيق · حوكمة تقارير/استيراد/وظائف/تخزين/AI/إضافات (مبادئ) · نمو البيانات قاعدة · فصل Resource Policy عن الخطط التجارية · تصعيد سعة دون كسر الهوية · On-Prem أيضاً · إسناد القياس.
- **FAC-020:** مبدؤه البحثي رُقّي جزئياً إلى `R-SCL-3`؛ الآليات/الحدود/القيم مؤجلة؛ **ترقية Guardrail الرسمي تُقيَّم في Phase 10** (§22).
- **الأرقام والتحقق** → Phase 10 (Vision §9) · **سلوك الترقية أدائياً** → بند 8 · cardinality يبقى مؤجلاً (C-ISO-03).
- القرار: **`D-DEP-08`** · القرارات المفتوحة O-1..O-5 في الوثيقة.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Upgrade Delivery & Migration Architecture — النتيجة المعتمدة (بند 8)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/UPGRADE_DELIVERY_MIGRATION_ARCHITECTURE.md`

- المبادئ: **`R-UPG-1..14`** — قناتان بعقد واحد (`R-UPG-2`: SaaS مُدار / On-Prem حزم موقّعة + Runner محلي) · **حماية قبلية Fail-Closed** (`R-UPG-3`) · Pre/Post gates + stop-on-failure بلا تقدم جزئي (`R-UPG-4/5`) · مسار تعافٍ معلن مسبقاً (`R-UPG-6`) · **فصل ترقية المنتج عن ترحيل البيانات** بأدلة منفصلة (`R-UPG-7` + §4) · توافق موحد (`R-UPG-8`) · لا Core forks (`R-UPG-9`) · غير العكوس بموافقة + حماية (`R-UPG-10`) · سلامة حزمة On-Prem (`R-UPG-12`) · ملكية واضحة (`R-UPG-13`) · حفظ التاريخ (`R-UPG-14`).
- تسلسل 7 خطوات معتمد (§3): Preparation → Protection → Pre-check → Execution → Post-validation → Evidence → Recovery Path.
- القرار: **`D-DEP-09`** · القرارات المفتوحة O-1..O-6 في الوثيقة.
- compatibility مع `R-DEP-7`/`R-ONP-8`/`R-UNI-6`/`R-BKP-3/5/10`/`D-DEP-01/03/04`/`D-LC-06`/`R-SCL-13` = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Deployment & Database Strategy Adoption — النتيجة المعتمدة (بند 9)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/DEPLOYMENT_DATABASE_STRATEGY_ADOPTION.md`

- **اعتماد تجميعي:** بنود 1–8 + `D-DEP-01..09` + خطوط الأساس الست = **Deployment & Database Strategy الرسمية** لـPhase 5+ — دون تعديل أي قرار أو حد.
- فحص اتساق داخلي = **صفر تناقض**؛ متطلبات فريدة بعدّها مطابقة (10/12/11/12/13/14)؛ توافق Phase 2/3/Single Product Line = ✅.
- السجل الموحد للمؤجلات (Phase 10 / Phase 5 / مفتوحة) موثق · **OBS-1** (التزام V1 لـOn-Prem قرار منتج — يُثبَّت في Product Baseline) · `Material Conflict = 0`.
- القرار: **`D-DEP-10`**.
- **بوابة ما بعد المرحلة:** تخص تكليف Majed — **Phase 5 لم تُفتح**.

---

# Phase 5 — Shared Platform Capabilities

1. ✅ **Identity, Users, Roles & Permissions** — `05-platform-requirements/IDENTITY_ACCESS_FRAMEWORK.md` معتمد (`D-PLAT-01` · `R-IDN-1..16` · داخل حدود D-AUTH بلا تعديل).
2. ✅ **Workflow & Approvals Framework** — `05-platform-requirements/WORKFLOW_APPROVALS_FRAMEWORK.md` معتمد (`D-PLAT-02` · `R-WFL-1..14` · نماذج Domain/Rule مؤجلة لبحث FAC-018).
3. ✅ **Audit Trail** — `05-platform-requirements/AUDIT_TRAIL_FRAMEWORK.md` معتمد (`D-PLAT-03` · `R-AUD-1..14` · الفصل الثلاثي Audit≠Backup≠Logs).
4. ✅ **Shared Master Data Framework** — `05-platform-requirements/SHARED_MASTER_DATA_FRAMEWORK.md` معتمد (`D-PLAT-04` · `R-MDM-1..17` · النماذج التفصيلية مؤجلة لبحث FAC-019).
5. ✅ **Localization Framework** — `05-platform-requirements/LOCALIZATION_FRAMEWORK.md` معتمد (`D-PLAT-05` · `R-L10N-1..15` · بلا ضرائب/عملات/تقويم — البند 6).
6. ✅ **Tax / Currency / Calendar foundations** — `05-platform-requirements/TAX_CURRENCY_CALENDAR_FOUNDATIONS.md` معتمد (`D-PLAT-06` · `R-FND-1..14` · بلا جداول/محرك/مزوّد).
7. ✅ **Document & Attachment Framework** — `05-platform-requirements/DOCUMENT_ATTACHMENT_FRAMEWORK.md` معتمد (`D-PLAT-07` · `R-DOC-1..16` · ربط/عزل/دورة حياة؛ العرض → FAC-024).
8. ✅ **Notification Framework** — `05-platform-requirements/NOTIFICATION_FRAMEWORK.md` معتمد (`D-PLAT-08` · `R-NOT-1..14` · فصل قرار/توجيه؛ webhooks → بند 9).
9. ✅ **Integration / API Framework** — `05-platform-requirements/INTEGRATION_API_FRAMEWORK.md` معتمد (`D-PLAT-09` · `R-INT-1..16` · عقود G3 · Machine identity · أحداث).
10. ✅ **Reporting & Analytics Framework** — `05-platform-requirements/REPORTING_ANALYTICS_FRAMEWORK.md` معتمد (`D-PLAT-10` · `R-RPT-1..16` · U13/فصل/عزل؛ المعمارية → FAC-024/Phase 10).
11. ✅ **Configuration & Feature Management** — `05-platform-requirements/CONFIGURATION_FEATURE_MANAGEMENT.md` معتمد (`D-PLAT-11` · `R-CFG-1..16` · Typed contracts/بوابات 4/نقل G2).
12. ✅ **Extension Framework / Compatibility Contracts** — `05-platform-requirements/EXTENSION_FRAMEWORK.md` معتمد (`D-PLAT-12` · `R-EXT-1..16` · ترتيب SPL/عزل/Compatibility Contracts).
13. ✅ **مراجعة واعتماد Platform Foundation التفصيلية** — `05-platform-requirements/PLATFORM_FOUNDATION_ADOPTION.md` معتمد (`D-PLAT-13` — اعتماد تجميعي لبنود 1–12).

### Identity & Access Framework — النتيجة المعتمدة (بند 1)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/IDENTITY_ACCESS_FRAMEWORK.md`

- القدرات: **CAP-1..7** (هوية/عضوية/حساب بشري بحالات · Machine Principal بدورة منفصلة · ربط حساب↔عضوية · دعوة/إنهاء · Delegation مؤجلة صراحةً).
- النموذج: الطبقات الثماني · **Grant ذرّي (Capability×Scope×Validity)** بمنع إعادة التركيب · Role Definition قابلة لإعادة الاستخدام · Context ⊆ Authorized Scope · **البوابات الخمس المستقلة** · SoD ثابت/حركي · قنوات authorization-aware · **Explainability Record**.
- دورة الحياة: سحب فوري عند التعليق/الإنهاء + حفظ الأثر · expiry تلقائي للصلاحيات المؤقتة · access review/certification قدرة مؤجلة التفصيل.
- القرار: **`D-PLAT-01`** (داخل `D-AUTH-01..16` — لا تعديل/لا Reopen) · قرارات مفتوحة O-1..O-9 (IdP/MFA/SCIM/جلسات/Delegation/Break-Glass/certification/SoD/role deprecation).
- الحدود: لا IdP/OAuth/SAML/SCIM/MFA · لا schema/RLS · لا SoD engine/ABAC/masking · لا provider/topology.
- compatibility مع D-AUTH/D-TEN/D-ISO/D-CP/D-LC/D-DEP-01/04/SPL/Phase 2 = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Workflow & Approvals Framework — النتيجة المعتمدة (بند 2)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/WORKFLOW_APPROVALS_FRAMEWORK.md`

- القدرات: **`CAP-WFL-1..11`** — state/transition · **أهلية الموافق = Grant قائم ∩ سياسة** · Definition lifecycle + in-flight pinning · configurability contract · context binding · SoD hooks · outcomes ست · no-stuck fallback · evidence/explainability · machine-initiated · واجهات خارجية.
- **فصل الحالات الأربعة:** مستند/كيان (الوحدة) ≠ Tenant (`D-LC`) ≠ عضوية/حساب (`R-IDN`) ≠ وحدة (Phase 2) — lifecycle gate يمنع actions دون كتابة حالة المستند.
- **قواعد الاستهلاك الخمس:** Transition ⟺ Grant ∧ state/conditions ∧ بقية البوابات · Pending ≠ Right · لا minting · التشخيص يفصل workflow عن Permission.
- **قيد حاكم:** لا Domain/Rule/Route/Band Models قبل Deep Research مخصص (`FAC-018`) — `R-WFL-14`.
- القرار: **`D-PLAT-02`** · قرارات مفتوحة O-1..O-8.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Audit Trail Framework — النتيجة المعتمدة (بند 3)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/AUDIT_TRAIL_FRAMEWORK.md`

- النطاق: فئات أحداث **A–D** (أعمال/أمن/حوكمة/Tenant-visible) — التفصيل per-module → Phase 6 عبر العقد.
- الخصائص: **`P-1..P-8`** — إلحاقي (Amendment لا overwrite) · غير قابل لإعادة الكتابة · Tamper-evident · إسناد كامل · استمرار عبر الحالات · tenant-scoped · Data minimization · عقد أحداث موحد.
- **الفصل الثلاثي:** Audit ≠ Backup (`Restore ≠ Correction` + R-AUD-7 حماية الأدلة) ≠ Technical Logs (`D-CP-07`/G5).
- القرار: **`D-PLAT-03`** · قرارات مفتوحة O-1..O-8 (تقنية/مدد/أحداث المصادقة/أدوار القراءة).
- compatibility مع D-AUTH-16/R-IDN/CAP-WFL-9/D-LC-06/R-BKP/D-ISO-08/SPL = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Shared Master Data Framework — النتيجة المعتمدة (بند 4)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/SHARED_MASTER_DATA_FRAMEWORK.md`

- الفئات الأربع + **الفصل السبعي Invariant** + النطاق (Tenant-scoped Identity · Company Context بلا نسخ · Applicability صريحة · Reference عالمي منفصل).
- القدرات: **`CAP-MDM-1..12`** — registry semantics · applicability · lifecycle مزدوج (Freeze-not-Delete + Merged) · Governance عبر `D-PLAT-02` والأدلة عبر `D-PLAT-03` · stewardship capability · duplicate-awareness · data-quality tiers · external IDs/provenance · effective dating · history protection · integration-safe.
- **التجميد الحاكم:** Domain Model/lifecycle states/مطابقة/AI/merge/steward roles/حقول حساسة — كلها قبل بحث `FAC-019` المخصص (`R-MDM-17`).
- القرار: **`D-PLAT-04`** · مفتوحات O-1..O-9.
- compatibility مع D-MD/D-PLAT/D-AUTH/D-TEN/ISO/D-DEP(U4)/SPL/Phase 2/FAC-019 = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Localization Framework — النتيجة المعتمدة (بند 5)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/LOCALIZATION_FRAMEWORK.md`

- Locale ثلاثي (Platform/Tenant/User) + fallback لا-فارغ · مفاتيح نصوص **Namespaced Versioned** كعقود منتج · دورة ترجمة أربع مراحل مرتبطة بالإصدار + إهلاك موثق.
- الاتجاه RTL/LTR من اللغة (mirroring بإحالة Design System) · صيَغ عرض محلية **بلا تغيير دلالة** · ترجمات العميل داخل عقد Extension وتنجو من الترقيات · صلاحيات/تدقيق عبر D-PLAT.
- القدرات: **`CAP-L10N-1..10`** · القرار **`D-PLAT-05`** · مفتوحات O-1..O-7.
- **خارج الإطار:** الضرائب/العملات/التقويمات (بند 6) · تقنيات/قواميس/ترجمة بيانات الأعمال.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Tax / Currency / Calendar Foundations — النتيجة المعتمدة (بند 6)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/TAX_CURRENCY_CALENDAR_FOUNDATIONS.md`

- العملة: Definition مرجعي عالمي ≠ Functional Currency سياق Company ≠ عرض Locale (`D-PLAT-05`) — قواعد التحويل/التقييم → Finance Blueprint.
- الضريبة: Tax Registration سياق منفصل · **Tax Definition capability بلا جداول/معدلات/محرك** (`D-MD §7` مؤجل صراحةً) · ليست Permission (`D-AUTH-13`).
- التقويم: عرض/تحويل مع تخزين معياري · **Fiscal Calendar = PCD** تُستهلك من Finance (`DEPENDENCY_MODEL` L56) · Business Calendar capability · **Timezone model مؤجل** (FUTURE).
- الحوكمة عبر `D-PLAT-01/02/03` — بلا نماذج جديدة · القدرات **`CAP-FND-1..8`** · القرار **`D-PLAT-06`** · مفتوحات O-1..O-8.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Document & Attachment Framework — النتيجة المعتمدة (بند 7)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/DOCUMENT_ATTACHMENT_FRAMEWORK.md`

- الربط: `Attachment = Artifact + Metadata + Binding(Tenant+Owner+Context)` · وصول المرفق ⊆ صلاحية الكيان المالك · سطح عزل `D-ISO-08` صريح.
- الحوكمة: قنوات `D-AUTH-14` (View≠Export≠Bulk) · لا مشاركة خارجية افتراضية · تحقق-قبل-الإتاحة (مبدأ) · تدقيق كل الأحداث + بصمة سلامة.
- الدورة: سلسلة إصدارات/استبدال بلا overwrite · **Freeze-not-Delete** · Purge بالشروط الخمسة شاملاً النسخ · **ضمن النظام القابل للاستعادة** (`R-BKP-1/5`).
- القدرات: **`CAP-DOC-1..10`** · القرار **`D-PLAT-07`** · مفتوحات O-1..O-9 (تخزين/فحص/معاينة FAC-024/e-sign/مشاركة/حدود/مدد/إصدارات/OCR).
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Notification Framework — النتيجة المعتمدة (بند 8)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/NOTIFICATION_FRAMEWORK.md`

- القاعدة العليا: **Notification informs — does not decide/authorize** — القرار في `D-PLAT-02`؛ التنفيذ لا يمنح وصولاً.
- الفئات `N1..N4` (N2 أمنية إلزامية) · Routing آمن بالنطاق (`Delivery ≠ Access` + إعادة تحقق) · محتوى أدنى (لا أسرار/PII زائدة) · Tenant-bound (`D-ISO-08`).
- قنوات كفئات + تفضيلات (Category×Channel) · قوالب versioned/مترجمة (`D-PLAT-05`) · حوكمة/تدقيق C · فشل التسليم ops-log لا Business Audit · workload governance (`R-SCL`).
- **Webhooks/نظام-لنظام → بند 9** (حد صريح) · مفتوحات O-1..O-8 · `R-NOT-1..14` · `D-PLAT-08`.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Integration / API Framework — النتيجة المعتمدة (بند 9)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/INTEGRATION_API_FRAMEWORK.md`

- عقود **G3** مطبقة: Public صريح/versioned · Internal refactor لا يكسر · لا Core DB مباشر · سياسة إصدار موحدة.
- Machine identity (`D-AUTH-02`): Client مسمّى/مغرض/مملوك/محدود بGrants ذرّية · Revoke فوري · إسناد كامل.
- الأحداث: عقود namespaced/versioned · اشتراك بGrant · **لا exactly-once وعداً** · لا نشر لحدث مُنع ببوابة.
- الحوكمة: Registry/Subscriptions/تدقيق/workload · provider-agnostic · `R-INT-1..16` · `D-PLAT-09`.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Reporting & Analytics Framework — النتيجة المعتمدة (بند 10)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/REPORTING_ANALYTICS_FRAMEWORK.md`

- الفئات R1–R6 (R6 Self-Service غير معتمدة) · التعريف = عقد Namespaced/Versioned · التنفيذ بـGrants قائمة · Export قناة منفصلة.
- **U13 ملزمة**: الدلالات من الوحدات · فصل رباعي Definition/Config/Output/Delivery · Reporting ≠ Transactions/Audit/Telemetry.
- عزل: Tenant-bound · Scope-bounded (لا Parameter يتجاوز) · Aggregation safety · no unbounded cross-company queries (R-SCL-5).
- المعمارية التفصيلية → **FAC-024** (رندر/مخرجات) + Phase 10 (BI/مستودع) · `R-RPT-1..16` · `D-PLAT-10`.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Configuration & Feature Management — النتيجة المعتمدة (بند 11)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/CONFIGURATION_FEATURE_MANAGEMENT.md`

- فئات **CFG-1..4** بعقود **Typed معلنة** (G8) · Slim: لا Key/Value حر · Allowed Scopes ضمن العقد · قيمة فعالة حتمية (Precedence النهائي مؤجل).
- **بوابات الميزة الأربع منفصلة:** Entitlement ∧ Config ∧ Dependency ∧ Rollout · Toggle لا يمنح صلاحية/لا يتجاوز Workflow-SoD (`D-AUTH-13`).
- حوكمة/تدقيق: صلاحيات `D-PLAT-01` + اعتماد `D-PLAT-02` للحساس + تدقيق C بـbefore/after عبر `D-PLAT-03` + Rollback آمن + Versioned/upgrade-safe.
- النقل (G2): versioned/diff/audit + لا إعادة إنشاء يدوية + drift capability + أسرار مستثناة.
- `R-CFG-1..16` · `D-PLAT-11` · مفتوحات O-1..O-9 (تقنية/Precedence/Rollout/Approval/...) · Custom Fields → FAC-023.
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Extension Framework / Compatibility Contracts — النتيجة المعتمدة (بند 12)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/EXTENSION_FRAMEWORK.md`

- الترتيب الملزم (SPL): **Configuration → Supported Extension/Metadata → Integration** · تعريف Extension = حزمة على عقود منشورة بلا Core/DB مباشر.
- الفئات E0–E3 (E3 Marketplace FUTURE غير معتمد) · عزل Namespaces + حوكمة متساوية + Workload Containment (FAC-020 §15).
- **Compatibility Contracts:** نطاق إصدارات يُفحص عند install/activate/upgrade · ترقية متوافقة تحافظ · عدم توافق = حظر صريح بحالة (لا كسر صامت).
- حوكمة: دورة مزدوجة Publisher/Tenant + اعتماد قبل التفعيل + تدقيق كامل + إعدادات ضمن D-PLAT-11.
- `R-EXT-1..16` · `D-PLAT-12` · مفتوحات O-1..O-8 (نقاط فعلية/Phase 6 · runtime · توقيع · Marketplace · Trust · Approval · إزالة · Quotas).
- compatibility = ✅ SAFE؛ `Material Conflict = 0`؛ **لا STOP**.

### Platform Foundation Detailed Adoption — النتيجة المعتمدة (بند 13)

المرجع الرسمي: `teranoo-erp-planning/05-platform-requirements/PLATFORM_FOUNDATION_ADOPTION.md`

- **اعتماد تجميعي:** بنود 1–12 + `D-PLAT-01..12` + خطوط الأساس الاثنا عشر = **Detailed Platform Foundation** الرسمية لـPhase 6+ (دون تعديل أي قرار أو حد).
- فحص اتساق: سلسلة قرارات مترابطة + **7 ثوابت عابرة** (بوابات خمس · لا سلطة صلاحيات موازية · Namespaces/عقود · فصل حاكم · lifecycle gates · Handoffs · قيود FAC) = **صفر تناقض**.
- توافق Phase 2/3/4/SPL/G* = ✅ · **سجل مؤجلات موحد ب5 مالكين** (Phase 6 · Phase 10 · بحوث FAC · منتج/إطلاق · تقنية build-out).
- OBS-5-1/5-2/5-3 (فجوات بحث FAC قبل البناء · قرار مصادقة موحد · V1 On-Prem بيد الإطلاق) — لا Blockers.
- القرار: **`D-PLAT-13`** · **الخطوة التالية: Decision Gate A — لا تبدأ إلا بتكليف Majed صريح**.

---

# Continuous Market Evidence Collection — Non-Phase Track

> **الحالة:** 🔄 Ongoing Evidence Collection

مسار جمع Evidence حقيقية مبكرًا لدعم `Decision Gate A` دون فتح Phase معمارية موازية. يشمل المشاكل المتكررة، الاستعداد للدفع، تعقيد التنفيذ والتوطين، المنافسة، سهولة الوصول للعملاء، وعبء الدعم.

**Guardrails:**
- لا قرار `Primary Launch Market` قبل Decision Gate A.
- القطاعات الأربعة Target Industries وليست V1 متزامنة.
- Evidence لا تتحول إلى Scope/Decision دون بوابة اعتماد.

---

# Decision Gate A — Primary Launch Market / First Industry Priority

- ✅ **مكتملة — Approved (Conditional) 2026-10-02** · القرار: **`D-MKT-01`** (قرار سوقي مستقل — خارج عدّاد D-*).
- المرجع الرسمي: `teranoo-erp-planning/02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md`
- المضمون: **الأردن أولاً + Trading & Wholesale Distribution كأولوية إطلاق وحيدة + ICP معتمد + V1 غير متزامن**.
- **شرط نفاذ حاكم:** O-2 (تحقق ميداني لاستعداد الدفع — 5–10 مقابلات) **إلزامي قبل التسعير وقبل Product Baseline**.
- القطاعات الأربعة ليست V1 Scope متزامنًا — ممنوع رسمياً؛ Manufacturing = الثاني (بعد Phase 8)، Construction/PS مؤجلان.

---

# Phase 6 — Core Module Functional Blueprints

الترتيب الأولي:
1. ⏳ Finance
2. ⏳ Inventory & Warehouse Management
3. ⏳ Procurement
4. ⏳ Sales & Order Management

لكل Module نغطي Purpose/Scope, capabilities, masters, transactions, workflows, rules, approvals, accounting impact, dependencies, reporting, configuration, audit, security, industry variations, research, exclusions, approved decisions.

**قاعدة:** لا ننتقل إلى Module آخر قبل إغلاق Blueprint الحالي.

---

# Phase 6.5 — Core Cross-Module Contract Validation

**Exit Gate إلزامية بعد Core Blueprints الأربعة وقبل Phase 7.**

تراجع على الأقل Procure-to-Pay وOrder-to-Cash وInventory-to-Finance وRecord-to-Report touchpoints وجميع Core CICs الستة.

لكل Contract/Scenario تثبت Trigger، مالك Documents/States، Source of Truth، transition contract، financial/inventory effects، cancel/failure/reverse semantics، traceability، وRequired/Conditional/Feature-level semantics.

لا انتقال إلى Phase 7 قبل نفي Hidden HBMD وOwnership ambiguity وفجوات traceability، ومراجعة جميع Core CICs.

---

# Phase 7 — Strategic Enterprise Modules

مرشحون حاليًا:
- Projects & Project Accounting
- Human Capital Management
- Payroll
- CRM
- Enterprise Asset Management / Maintenance
- Advanced Budgeting & Performance Management

الترتيب غير معتمد بعد ويخضع للأولوية التجارية وFirst Industry Priority ونتائج Phase 6.5.

---

# Phase 8 — Industry Extensions

القطاعات الأساسية:
1. Trading & Wholesale Distribution
2. Manufacturing
3. Construction & Contracting
4. Professional & Project-Based Services

يبدأ التحليل من First Industry Priority المعتمد، مع تحديد ما يغطيه Core وإضافة Extensions فقط للفجوات القطاعية المثبتة.

---

# Phase 9 — Extended Cross-Module Business Processes

Phase 9 توسع العمليات بعد استقرار Core Contracts في Phase 6.5 وإضافة Enterprise Modules/Industry Extensions. أمثلة: Project-to-Cash، Hire-to-Retire، Manufacturing/Construction/Service-specific processes، وتوسعات P2P/O2C الناتجة عن قدرات لاحقة.

لا تعيد Phase 9 تعريف Core Ownership ضمنيًا دون Reopen رسمي.

---

# Phase 10 — Enterprise-Wide Requirements

يشمل Security, Audit & Compliance, Performance, Availability, Scalability, Data Retention, Import/Export, Integration, Observability, Administration, Localization, Accessibility, Reporting & Analytics, Upgradeability, Extensibility, Backward/Extension Compatibility, Migration Safety, Failed-Upgrade Recovery, Release & Support Lifecycle.

---

# Phase 11 — Scope Consolidation & Product Baseline

1. ⏳ تجميع القرارات المعتمدة.
2. ⏳ إزالة التكرار والتعارض.
3. ⏳ تحديد In Scope / Out of Scope.
4. ⏳ تحديد Deferred capabilities.
5. ⏳ تحديد Dependencies والمخاطر المفتوحة.
6. ⏳ مراجعة قابلية التنفيذ.
7. ⏳ اعتماد Product Baseline.

---

# Phase 12 — Teranoo Handoff Preparation

1. ⏳ Executive Project Brief.
2. ⏳ Approved Product Vision.
3. ⏳ Approved Scope.
4. ⏳ Module Map & Dependencies.
5. ⏳ Platform Requirements.
6. ⏳ Functional Blueprints.
7. ⏳ Industry requirements.
8. ⏳ Open Decisions / Risks إن بقيت ضرورية.
9. ⏳ Final preparation review.
10. ⏳ التسليم إلى دورة Teranoo الرسمية.

---

# Current Position

**Phase 5 — Shared Platform Capabilities** 🔄 Current (بُدئت 2026-10-02)

الحالة:
- Phase 1 ✅ Closed
- Phase 2 ✅ Closed
- Phase 3 ✅ Closed (2026-10-02) — Final Approval PASS + Backward Compatibility Check PASS / SAFE
- Phase 4 ✅ Closed (2026-10-02) — بنود 1–9 · `D-DEP-01..10`
- Phase 5 ✅ Completed (2026-10-02) — بنود 1–13 · `D-PLAT-01..13`
- Decision Gate A ✅ Approved (Conditional) (2026-10-02) — `D-MKT-01` (قرار سوقي مستقل) · شرط O-2 قبل التسعير/Product Baseline

المكتمل داخل Phase 3:
- ✅ Tenant Model — `D-TEN-01..D-TEN-07`.
- ✅ Multi-Company Model — `D-COMP-01..D-COMP-11`.
- ✅ Multi-Branch Model — `D-BR-01..D-BR-12`.
- ✅ Organizational Hierarchy Boundaries — `D-ORG-01..D-ORG-15`.
- ✅ Shared vs Company-Specific Master Data — `D-MD-01..D-MD-15`.
- ✅ User / Role / Permission Boundaries — `D-AUTH-01..D-AUTH-16`.
- ✅ Multi-Tenant Data Isolation Models — `D-ISO-01..D-ISO-12`؛ compatibility = PASS / SAFE؛ Reopen = 0.
- ✅ Control Plane Responsibilities — `D-CP-01..D-CP-07`؛ Material Conflict = 0؛ Reopen = 0.
- ✅ Tenant Lifecycle — `D-LC-01..D-LC-08`؛ compatibility = PASS / SAFE؛ Reopen = 0.
- ✅ Final Phase 3 Approval — PASS.
- ✅ Phase 3 Backward Compatibility Check مقابل Phase 2 — PASS / SAFE؛ Material Conflict = 0.

المكتمل داخل Phase 4:
- ✅ البند 1 — Cloud/SaaS deployment requirements (`D-DEP-01..02` · خط أساس `R-DEP-1..10`).
- ✅ البند 2 — On-Premises deployment requirements (`D-DEP-03` · خط أساس `R-ONP-1..12` · نموذج Connected On-Prem Data Plane).
- ✅ البند 3 — Unification Boundaries (`D-DEP-04` · خط أساس `R-UNI-1..11` · قوائم U/V/Prohibited المغلقة).
- ✅ البند 4 — Database engine evaluation (`D-DEP-05` · PostgreSQL Confirmation Passed للملفين).
- ✅ البند 5 — Single-Engine Policy (`D-DEP-06` · PostgreSQL وحيد مدعوم إنتاجياً · Multi-Engine مرفوض).
- ✅ البند 6 — Backup/Restore/DR Principles (`D-DEP-07` · `R-BKP-1..12` + مصفوفة مسؤوليات).
- ✅ البند 7 — Scalability & Performance Expectations (`D-DEP-08` · `R-SCL-1..13` · أرقام → Phase 10).
- ✅ البند 8 — Upgrade Delivery & Migration Architecture (`D-DEP-09` · `R-UPG-1..14` · قناتان بعقد واحد).
- ✅ البند 9 — Deployment & Database Strategy Adopted (`D-DEP-10` — اعتماد تجميعي).

المكتمل داخل Phase 5:
- ✅ البند 1 — Identity & Access Framework (`D-PLAT-01` · `R-IDN-1..16`).
- ✅ البند 2 — Workflow & Approvals Framework (`D-PLAT-02` · `R-WFL-1..14`).
- ✅ البند 3 — Audit Trail (`D-PLAT-03` · `R-AUD-1..14`).
- ✅ البند 4 — Shared Master Data Framework (`D-PLAT-04` · `R-MDM-1..17`).
- ✅ البند 5 — Localization Framework (`D-PLAT-05` · `R-L10N-1..15`).
- ✅ البند 6 — Tax / Currency / Calendar Foundations (`D-PLAT-06` · `R-FND-1..14`).
- ✅ البند 7 — Document & Attachment Framework (`D-PLAT-07` · `R-DOC-1..16`).
- ✅ البند 8 — Notification Framework (`D-PLAT-08` · `R-NOT-1..14`).
- ✅ البند 9 — Integration / API Framework (`D-PLAT-09` · `R-INT-1..16`).
- ✅ البند 10 — Reporting & Analytics Framework (`D-PLAT-10` · `R-RPT-1..16`).
- ✅ البند 11 — Configuration & Feature Management (`D-PLAT-11` · `R-CFG-1..16`).
- ✅ البند 12 — Extension Framework / Compatibility Contracts (`D-PLAT-12` · `R-EXT-1..16`).
- ✅ البند 13 — Platform Foundation Detailed Adoption (`D-PLAT-13` — اعتماد تجميعي).

Governance controls الحالية:
- ✅ `DECISION_REGISTER.md` — **126** قرارات D-* معتمدة مفهرسة.
- ✅ Single Product Line & Upgrade-Safe Extensions.
- 🔄 Continuous Market Evidence Collection.
- ⏳ Phase 6.5 — Core Cross-Module Contract Validation.

المخرجات المرجعية للإغلاق:
- `PHASE_3_CLOSURE_REVIEW.md` — Final Approval + Backward Compatibility Check (تستوعب نتائج مراجعات سبتمبر المنقولة — أُلغيت وثيقتا `PHASE_3_FINAL_APPROVAL_REVIEW.md` و`PHASE_3_BACKWARD_COMPATIBILITY_CHECK.md` بموجب قرار الدمج 2026-10-02).

العمل الحالي:

> **اكتملت Decision Gate A — Approved (Conditional) (2026-10-02):** `D-MKT-01` — الأردن + Trading & Wholesale أولاً · **شرط O-2 إلزامي قبل التسعير/Product Baseline**.
> **الخطوة التالية: Phase 6 — Core Functional Blueprints — لا تبدأ إلا بتكليف منفصل.**

**قيود ملزمة:** االتزام `Phase 4 Guardrail` أعلاه — لا تصميم Provider/Kubernetes/Topology تفصيلي قبل الحاجة.

**قيد مستقل (قرار Majed 2026-10-02):** مخرجات `dd033d2` (System Sync) تُعامل كنظام مستقل وليست جزءاً من قرارات Teranoo ERP التخطيطية — لا تفعيل للوكيلين الجديدين Django/Flutter إلا بTrigger واضح وموافقة صحيحة، ولا استخدام لقدرات runtime/commands كسبب لتجاوز بوابات العمل، وSystem Sync Safety Review منفصلة تُطلب قبل أي تفعيل هندسي فعلي لاحق (غير مطلوبة كشرط لبدء هذه المرحلة التخطيطية).

---

# Change Rule

إذا كشف البحث عن مرحلة مفقودة أو ترتيب أفضل:
- نوثق السبب.
- نحدث الخطة.
- نحافظ على المراحل المكتملة دون Reopen إلا بسبب مؤثر جوهري موثق.