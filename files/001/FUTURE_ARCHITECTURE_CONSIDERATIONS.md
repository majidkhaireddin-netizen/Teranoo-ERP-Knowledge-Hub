# Teranoo ERP — Future Architecture Considerations Register

> **الحالة:** 📝 Living Backlog / Not Approved Decisions  
> **الغرض:** حفظ الأفكار المعمارية والمنتجية المهمة التي لا نريد اعتمادها أو تصميمها الآن، مع ربط كل فكرة بالمرحلة أو Trigger المناسب حتى لا تُنسى.

---

## كيفية استخدام هذا الملف

- وجود الفكرة هنا **لا يعني أنها معتمدة**.
- لا يتم تحويل أي بند إلى Requirement أو Architecture Decision تلقائيًا.
- عند الوصول إلى `Owner Phase / Trigger`:
  1. نراجع هل ما زالت الفكرة مهمة.
  2. نجري البحث عند الحاجة.
  3. نقرر: Adopt / Modify / Reject / Defer.
  4. إذا اعتمدت، تُنقل إلى الملف الرسمي المناسب ويُحدّث Status هنا.

### حالات الأفكار

- `WATCH` — نحافظ عليها في الرادار فقط.
- `REVIEW LATER` — يجب مراجعتها في مرحلة محددة.
- `RESEARCH REQUIRED` — تحتاج بحثًا قبل القرار.
- `PROMOTED` — تحولت إلى قرار/Guardrail رسمي.
- `REJECTED` — تمت مراجعتها ورفضها مع سبب.

---

# Consideration Register

## FAC-001 — Licensing / Entitlement Model

**Status:** REVIEW LATER  
**Owner:** Phase 3 Control Plane + Phase 5 Configuration/Feature Management + Commercial/Product planning

### الفكرة

يجب الفصل مستقبلًا بين مفاهيم مثل:

- Commercial entitlement / license.
- Module availability.
- Functional activation.
- Company-level availability إذا تم دعمها.
- Configuration readiness.
- Suspension / maintenance entitlement.

### أسئلة لاحقة

- ماذا يحدث عند انتهاء عقد الصيانة أو حق التحديث؟
- هل يبقى النظام عاملًا مع إيقاف التحديثات؟
- كيف يعمل On-Prem / offline entitlement؟
- هل يوجد grace period؟
- هل Entitlement يكون Tenant-level فقط أم يمكن أن يكون أكثر دقة؟

### ملاحظة

لا يتم اعتماد أي سياسة تجارية أو enforcement الآن.

---

## FAC-002 — Localization Packs / Country Packs

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Localization Framework + Phase 8 Industry/Market expansion

### الفكرة

دراسة فصل التوطين القانوني/الضريبي القابل للتغير عن Product Core قدر الإمكان، مثل:

- Jordan localization pack.
- Saudi localization pack.
- UAE localization pack.

قد تشمل لاحقًا:

- Tax rules/configuration.
- E-Invoicing integration/rules.
- Statutory reports.
- Legal document formats.
- Withholding/local registration requirements.

### الهدف

السماح بتحديث المتطلبات التنظيمية للدولة دون تحويل كل تغيير تشريعي إلى تغيير عميق في Core، مع بقاء Localization منتجًا رسميًا من Teranoo وليس Customer customization عشوائيًا.

### غير محسوم

- هل تكون Packages مستقلة Versioned؟
- ما الذي يبقى في Core وما الذي يذهب إلى Localization؟
- كيف تتعامل Company واحدة داخل Tenant مع Jurisdiction مختلفة عن Company أخرى؟

---

## FAC-003 — Product Packaging Model

**Status:** REVIEW LATER  
**Owner:** بعد استقرار Phase 5 وقبل Commercial Packaging / Launch

### الفكرة

عدم الخلط لاحقًا بين:

- Module.
- Feature.
- Add-on.
- Advanced Capability.
- Industry Extension.
- Edition.

### أمثلة تحتاج قرارًا لاحقًا

- Advanced WMS: Module أم capability/add-on؟
- Advanced Pricing.
- Consolidation.
- Advanced Analytics.
- Budgeting/EPM.

### الهدف

إبقاء Architecture مستقلة عن التسميات التجارية قدر الإمكان، مع توفير Packaging واضح وقابل للبيع دون خلق Dependencies مصطنعة.

---

## FAC-004 — Business Date / Timezone Model

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 3 Organizational/Company boundaries + Phase 5 Calendar foundations + Phase 10 validation

### الفكرة

يجب عدم افتراض أن:

`Server Time = User Time = Company Business Date = Accounting Date`

يجب لاحقًا التمييز بين مفاهيم مثل:

- UTC technical timestamp.
- User timezone.
- Company/business timezone.
- Business date.
- Document date.
- Accounting/posting date.

### لماذا مهم؟

Teranoo يدعم Multi-Company وقد توجد Companies/Branches في دول ومناطق زمنية مختلفة.

### غير محسوم

- مستوى ownership للTimezone.
- كيفية تحديد Business Date.
- قواعد cut-off / close.
- أثر Branch timezone.

---

## FAC-005 — Feature / API Deprecation Lifecycle

**Status:** REVIEW LATER  
**Owner:** Phase 5 Integration/Extension Framework + Phase 10 Backward Compatibility

### الفكرة

إيجاد سياسة واضحة لاحقًا لإزالة أو استبدال:

- Public API.
- Event contract.
- Extension point.
- Feature/configuration option.

بدون كسر العملاء فجأة.

### أسئلة لاحقة

- Deprecation notice period.
- Compatibility window.
- Migration tooling/documentation.
- End-of-support behavior.

**ملاحظة:** المبدأ العام لحماية Public Contracts تم ترقيته بالفعل إلى `CROSS_PHASE_PRODUCT_GUARDRAILS.md`؛ هذا البند يحتفظ فقط بتفاصيل lifecycle غير المعتمدة.

---

## FAC-006 — Sandbox / Clone / Refresh & Data Masking

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 4 Environments/Deployment + Phase 10 Security/Operations

### الفكرة

دراسة قدرة العميل لاحقًا على امتلاك UAT/Sandbox وRefresh من Production بصورة محكومة.

### يجب تقييم

- Tenant/environment clone semantics.
- Production → UAT refresh.
- Masking/anonymization للبيانات الحساسة.
- منع إرسال credentials/secrets الحقيقية إلى Sandbox.
- document/file handling.
- integration disablement أو replacement في non-production.

### الهدف

توفير بيئة اختبار حقيقية للتحديثات والتخصيصات دون نسخ بيانات حساسة بصورة غير آمنة.

---

## FAC-007 — Data Archiving / Hot vs Historical Data

**Status:** REVIEW LATER  
**Owner:** Phase 4 Database/Storage + Phase 10 Retention/Performance

### الفكرة

مع سنوات الاستخدام قد نحتاج الفصل بين:

- Active operational data.
- Historical/read-mostly data.
- Archived data.

### يجب بحثه لاحقًا

- Retention vs archive.
- Search/reporting over archived data.
- legal/audit accessibility.
- performance implications.
- attachments/documents.

### Guardrail مبدئي غير ملزم

Archive لا يجب أن يعني فقدان سلامة التاريخ أو كسر auditability.

---

## FAC-008 — Product Usage Telemetry / Operational Product Analytics

**Status:** WATCH  
**Owner:** Phase 10 Observability / Product Operations

### الفكرة

دراسة Telemetry تساعد Teranoo على معرفة:

- Versions in use.
- module/feature adoption.
- health/failure patterns.
- upgrade readiness.
- performance signals.

مع فصلها بوضوح عن Business Analytics للعميل.

### مخاطر يجب دراستها

- Privacy.
- On-Prem opt-in/constraints.
- عدم جمع business content دون ضرورة وموافقة/سياسة واضحة.
- tenant isolation.

---

## FAC-009 — Trial / Demo / Partner Tenants

**Status:** WATCH  
**Owner:** Phase 3 Tenant Lifecycle / Control Plane + Commercial planning

### الفكرة

قد نحتاج لاحقًا Tenant types أو lifecycle policies تدعم:

- Trial.
- Demo.
- Training.
- Partner/implementation environments.

### ملاحظة

لا نعتمد الآن أن `Tenant Type` يجب أن يصبح جزءًا من Domain Model؛ الفكرة فقط محفوظة كي تتم مراجعتها عند تصميم provisioning/lifecycle.

---

## FAC-010 — Customer Implementation Governance

**Status:** REVIEW LATER  
**Owner:** Phase 10 / Handoff and future implementation methodology

### الفكرة

بعد اكتمال المنتج، نجاح التنفيذ لدى العملاء يحتاج methodology منفصلة عن Product Architecture، تشمل لاحقًا مثلًا:

- Discovery / Fit-Gap.
- Configuration workbook.
- Data migration cycles.
- Integration readiness.
- UAT.
- Cutover.
- Opening balance reconciliation.
- Go-live readiness.
- Hypercare.

### لماذا نسجلها؟

حتى لا نخلط بناء المنتج مع طريقة تطبيقه لدى العميل، وفي الوقت نفسه لا نبني منتجًا يصعب تنفيذه عمليًا.

---

## FAC-011 — AI & Intelligent Automation Framework

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Platform Capabilities + Phase 10 Enterprise-Wide Requirements + dedicated AI research before adoption

### الفكرة

دراسة إطار AI موحد للمنتج بدل إضافة قدرات AI متفرقة داخل كل Module بصورة غير محكومة.

قد يغطي مستقبلًا:

- ERP Copilot / conversational assistance.
- Natural-language reporting/query assistance.
- Document extraction/classification.
- Suggested reconciliation/matching.
- anomaly detection.
- forecasting where evidence/data quality allow it.
- knowledge-base support assistant.
- suggested drafts/actions/workflows.

### مبادئ تم ترقيتها رسميًا

تم اعتماد `AI Safety, Governance & ERP Control Preservation` داخل `CROSS_PHASE_PRODUCT_GUARDRAILS.md`؛ لذلك هذه الفكرة لا تعيد فتح مبادئ الأمان، بل تحفظ تصميم الـAI Platform نفسه للبحث لاحقًا.

### أسئلة لاحقة

- هل نحتاج `Teranoo AI Gateway`؟
- Provider abstraction / multiple providers / local models؟
- RAG / vector/search architecture؟
- Model/prompt versioning؟
- tenant-level AI enablement / quotas / cost controls؟
- evaluation, hallucination and quality gates؟
- ما العمليات التي يسمح فيها Suggest فقط، وما العمليات التي يمكن أن تصل إلى governed execution؟

---

## FAC-012 — Teranoo Customer Portal / Service Desk

**Status:** RESEARCH REQUIRED  
**Owner:** Product Operations / Phase 10 Administration & Supportability + Commercial/Support planning

### الفكرة

عدم بناء Ticketing منفصل فقط، بل دراسة **Teranoo Customer Portal** كواجهة تشغيلية بين العميل وشركة Teranoo.

قد يشمل مستقبلًا:

- My Products / Modules.
- My Tenants / Environments.
- Licenses / Entitlements.
- Maintenance Contracts.
- Support Tickets.
- Updates / Release Notes.
- Knowledge Base / Documentation.
- On-Prem downloads where applicable.
- Maintenance windows.
- Service status.
- Feature requests.

### Ticket Classification Principle to Research

يجب تجنب أن يصبح كل طلب `Ticket` غير مصنف. نحتاج لاحقًا Classification مثل:

- Incident.
- Bug / Defect.
- How-to / Support Question.
- Configuration Request.
- Change Request.
- Feature Request.
- Security Issue.

### Traceability Requirement to Research

المسار المستهدف مفاهيميًا:

`Customer Ticket → Support Analysis → Bug/Change → Engineering Work Item → Fix → Release → Customer Deployment → Verification → Closure`

والهدف أن نستطيع تتبع سبب أي تغيير من طلب العميل إلى الإصدار الذي أصلحه.

### غير محسوم

- هل Customer Portal جزء من نفس deployment أم Product Operations application منفصل؟
- ما حدود وصوله إلى Tenant/ERP data؟
- integrations with engineering/project systems.
- SLA workflow.
- support access model.

---

## FAC-013 — Maintenance Contracts & SLA Management

**Status:** REVIEW LATER  
**Owner:** Commercial/Product Operations + Customer Portal/Service Desk design

### الفكرة

بما أن Teranoo ERP سيباع مع عقود صيانة، يجب دراسة نموذج يربط العميل تشغيليًا بـ:

- Tenant / Product subscription references.
- Purchased modules / support coverage.
- Contract start/end.
- Support tier.
- SLA policy.
- supported versions.
- update/maintenance entitlement.

### يجب التفريق لاحقًا بين

- License/entitlement.
- Maintenance contract.
- Support eligibility.
- Update entitlement.
- SLA response/resolution targets.

### مثال تصنيف غير معتمد

`P1 / P2 / P3 / P4` أو ما يعادله، لكن لا نعتمد Severity model الآن قبل البحث.

---

## FAC-014 — Product Feedback / Feature Request Governance

**Status:** REVIEW LATER  
**Owner:** Product Governance + Support/Product Operations

### الفكرة

منع تحويل كل طلب عميل تلقائيًا إلى Customer Customization.

المسار المقترح للمراجعة لاحقًا:

`Customer Request → Product Assessment → Customer-Specific Extension OR General Product Capability`

إذا كانت الميزة عامة ومناسبة للرؤية:

- تدخل Product Backlog.
- تخضع للبحث/التصميم المعتاد.
- تدخل Core/Module/Extension رسمي في Release لاحق.

### الهدف

الحفاظ على Product Core واحد، وتقليل تراكم Customizations، وتحويل التعلم من العملاء إلى تحسينات منتج عندما تكون عامة فعلًا.

---

## FAC-015 — Versioned Knowledge Base & Contextual Help

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 10 Documentation/Supportability + Customer Portal + AI support capabilities

### الفكرة

دراسة Knowledge/Documentation architecture تعرف السياق والإصدار بدل وثائق عامة لا تعرف ما يعمل لدى العميل.

قد تحتاج Metadata مثل:

- Product/Core version.
- Module/version.
- Localization.
- Role/audience.
- feature availability.

### قدرات محتملة

- Versioned user documentation.
- contextual in-app help.
- known issues.
- troubleshooting guides.
- release notes.
- AI Support Assistant grounded only in applicable documentation/version.

### الهدف

منع إعطاء العميل تعليمات لميزة غير موجودة في نسخته أو غير مفعلة لديه.

---

## FAC-016 — Partner / Extension / Connector Ecosystem

**Status:** WATCH  
**Owner:** Post-core maturity / Phase 5 Extension Framework + future commercial ecosystem planning

### الفكرة

حفظ إمكانية نمو Teranoo مستقبلًا إلى Ecosystem منظم، مثل:

- Certified implementation/support partners.
- Partner Portal.
- approved connectors.
- Product-owned localization/connectors.
- third-party extensions under governance.
- Connector Catalog.
- Marketplace concept مستقبلًا إذا كان له مبرر تجاري وتقني.

### مبدأ

لا نعتمد Marketplace الآن، ولا نبني Architecture حوله مبكرًا؛ المطلوب فقط ألا نغلق الباب أمام ecosystem منضبط ومتوافق مع Extension/Compatibility Guardrails.

---

## FAC-017 — Tenant-Level Recovery / Restore

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 4 Database/Isolation/Backup Strategy + Phase 10 DR/Operations validation

### الفكرة

عند اختيار نموذج Multi-Tenant storage لاحقًا، يجب دراسة سؤال مستقل عن Backup العام:

> هل وكيف يمكن استرجاع Tenant واحد إلى حالة صحيحة دون إعادة جميع العملاء أو الإضرار بالـShared deployment؟

### سيناريوهات يجب بحثها

- accidental tenant-level data corruption/deletion.
- restore into isolated recovery environment.
- point-in-time tenant recovery where technically feasible.
- dependencies on files/search/indexes/background jobs.
- consistency بين business data وattachments/integration state.

### ملاحظة

وجود هذا البند لا يفترض أن Tenant-level point-in-time restore ممكن أو اقتصادي في كل isolation model؛ المطلوب أن يكون جزءًا صريحًا من تقييم Phase 4 بدل اكتشاف المشكلة بعد اختيار قاعدة البيانات/العزل.

---

## FAC-018 — Enterprise Approval & Workflow Architecture

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Workflow & Approvals Framework + dedicated Deep Research before architecture adoption

### لماذا نسجلها الآن؟

الموافقة في Teranoo لا يجب أن تُفهم كشاشة ثابتة أو كقائمة مستخدمين فقط. الفكرة المرشحة هي **Approval & Workflow Platform مشتركة على مستوى المنتج** يمكن أن تستخدمها Modules المختلفة، لكن لا يتم اعتماد Domain Model أو Rule Model النهائي قبل Deep Research.

### النموذج المقترح الذي يجب على البحث اختباره — وليس افتراض صحته

دراسة نموذج ديناميكي يسمح بتعريف Approval حسب:

- `Approval Subject / Business Object Type` بدل حصر الفكرة في «نوع سند» مالي فقط.
- Trigger مثل Submit / Change / Cancel / Release أو غيرها حسب الـModule.
- Requester / Initiator context.
- Conditions / business attributes.
- Amount / percentage / other value bands.
- Approval route / levels.
- Sequential / parallel / group approval patterns.
- Status/display texts مع الفصل بين Semantic State والنص المعروض.

أمثلة Business Objects محتملة للبحث:

- Purchase Order / Purchase Requisition.
- Sales Order / Quotation.
- Journal / Payment.
- Inventory Adjustment.
- Supplier creation/change or bank-account change.
- Customer Credit Limit.
- Leave / HR requests مستقبلًا.
- Project / Contract / Budget objects حيث ينطبق.

### Requester / Initiator Resolution — يجب بحثه

هل يمكن تحديد الجهة الطالبة بناءً على:

- User.
- Employee.
- Department.
- Organizational Unit.
- Role / Position.
- Company / Branch context.
- Project or business ownership context.
- Hierarchical relationships.

ولا نعتمد الآن قائمة نهائية للأنواع قبل اكتمال Organizational Model وDeep Research.

### Approval Bands / Policy Matrix — يجب بحثه

دراسة إمكانية بناء شرائح ديناميكية مثل:

- Amount bands.
- Discount percentage bands.
- Currency-aware limits.
- Risk/category/supplier/customer attributes.
- Requester-specific or organizational approval limits.

مثال توضيحي فقط:

`PO 0–5,000 → Purchasing Manager`

`PO 5,001–25,000 → Purchasing Manager → Finance Manager`

`PO > 25,000 → Purchasing Manager → Finance Manager → General Manager`

أو:

`Discount > 20% → Sales Manager + additional approval path`

هذه أمثلة لا تمثل Rules معتمدة.

### Approver Resolution — يجب بحثه

دراسة أن يكون الموافق واحدًا أو أكثر من:

- Specific User.
- Role.
- Position.
- Manager of Requester.
- Manager Hierarchy.
- Approval Group.
- Department/Unit Manager.
- Project/Cost Center/Business Owner.
- Dynamic relationship مثل manager of previous approver حيث يكون ذلك منطقيًا.

### Workflow Patterns التي يجب أن يغطيها البحث

- Sequential approvals.
- Parallel approvals.
- Any-of / All-of / Consensus where appropriate.
- FYI / informational steps.
- Delegation / substitute approver.
- Escalation / timeout / reminders.
- Rejection.
- Return for Correction.
- Withdraw / Recall / Resubmit.
- Cancellation.
- Ad-hoc approvers إن كان دعمهم آمنًا ومفيدًا.

### أسئلة Enterprise يجب ألا تُنسى

1. Self-Approval prevention.
2. Segregation of Duties (SoD).
3. Approval limits per person/role/position.
4. Currency conversion for amount bands.
5. Reapproval rules بعد تعديل المستند المعتمد.
6. ماذا يحدث للمستندات الجارية عند تغيير Workflow.
7. Workflow / Rule versioning وEffective Dates.
8. Draft → Test/Validate → Publish → Supersede lifecycle.
9. Simulation/Test قبل Publish.
10. Rule precedence/conflict detection إذا انطبقت عدة قواعد.
11. Missing approver / inactive user / organizational change / absence handling.
12. Failure/fallback حتى لا تعلق المعاملة بلا مسار.
13. Comments / attachments / evidence.
14. Notifications and reminders.
15. Mobile approval مع الالتزام بـOnline-Only Guardrail.
16. Cross-Company approval implications.
17. Emergency/exception approval governance.
18. API/integration-initiated approvals.
19. Audit Trail كامل للقرار والمسار والتغييرات.
20. Performance/governance عند وجود آلاف Approval Rules.
21. Configuration Transport بين UAT/Production بما يتوافق مع Project Guardrails.
22. AI يمكنه الاقتراح والتحليل فقط ضمن AI Guardrail ولا يتجاوز Governance.

### Architecture Boundary يجب اختباره في البحث

الافتراض المبدئي الذي يجب تقييمه هو:

> Workflow/Approval Platform coordinates and resolves policy/approval decisions, while the owning Business Module remains authoritative for its business object, validations, state transition, and final execution.

أي لا نريد أن يصبح Workflow Engine مالكًا لـPurchase Order أو Journal أو Sales Order، ولا مسارًا لتجاوز Module validation. هذا **Research Hypothesis** وليس قرارًا نهائيًا بعد.

### Deep Research المقترح

عنوان مرشح:

> **Deep Research — Enterprise Approval & Workflow Architecture for Teranoo ERP**

ويجب أن يقارن بالدرجة الأولى المصادر الرسمية لـ:

- SAP S/4HANA Flexible Workflow.
- Oracle Fusion Approval Management / BPM.
- Microsoft Dynamics 365 Workflow.
- Oracle NetSuite SuiteFlow.
- Infor workflow/approval capabilities.
- Odoo approvals/workflows where relevant.

### المخرجات المطلوبة من البحث لاحقًا

لا نريد Screens فقط. نريد على الأقل توصيات بحثية حول:

- Approval Domain Model.
- Approval Subject Registry.
- Approval Policy / Rule Model.
- Workflow Model.
- Requester Resolution Model.
- Approver Resolution Model.
- Approval Matrix / Band Model.
- Versioning / Effective-Date Model.
- In-flight Change Model.
- Audit Model.
- Failure / Exception Model.
- Module Integration Contract.
- Security / SoD boundaries.
- Configuration / Transport implications.

### ما لم يُعتمد الآن

- Workflow engine technology.
- BPMN أو أي notation بعينها.
- Rule-expression language.
- Low-code designer shape.
- exact requester/approver types.
- exact voting/parallel semantics.
- exact approval states.
- database model.
- UI screens.
- implementation approach.

---

## FAC-019 — Master Data Governance & Stewardship

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 3 Shared vs Company-specific Master Data + Phase 5 Shared Master Data Framework + Phase 10 Data Governance validation

التفاصيل محفوظة في:

`FAC-019_MASTER_DATA_GOVERNANCE_AND_STEWARDSHIP.md`

يغطي البحث Ownership/Lifecycle/Data Quality/Duplicate Detection/Merge & Survivorship/Sensitive Master Changes/Data Stewardship/External IDs/Provenance/Historical Integrity/Privacy، مع هدف واضح: **Governed ERP Master Data دون بناء MDM product منفصل غير ضروري.**

---

## FAC-020 — Resource Governance, Workload Isolation & Noisy Neighbor Protection

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 4 Deployment & Database Strategy + Phase 5 Shared Platform Capabilities + Phase 10 Performance/Availability/Observability validation

التفاصيل محفوظة في:

`FAC-020_RESOURCE_GOVERNANCE_AND_WORKLOAD_ISOLATION.md`

يغطي البحث Tenant/workload fairness, rate limiting, queues, workload priority, reports/imports/exports, storage, AI/extension resource control, graceful degradation, observability, automatic containment، وإمكانية الانتقال إلى Dedicated Capacity دون تغيير Tenant identity.

---

## FAC-021 — Document Numbering, Sequence & Business Identifier Framework

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Shared Platform Capabilities + Phase 6/7 Module Functional Blueprints + Phase 8 Localization + Phase 10 Audit/Compliance validation

التفاصيل محفوظة في:

`FAC-021_DOCUMENT_NUMBERING_SEQUENCE_AND_BUSINESS_IDENTIFIER_FRAMEWORK.md`

يغطي البحث الفصل بين Technical ID وBusiness Number، Sequence Scope، formatting/tokens، Draft vs Final numbering، legal/regulated series، gaps/cancellation/reset، concurrency/idempotency، External/Legacy/Government IDs، duplicate external document detection، Migration، E-Invoicing، Audit، وConfiguration Transport.

الحد المعماري المرشح للبحث:

> **The owning Business Module remains authoritative for its document; a shared numbering capability allocates/governs identifiers without owning the business object itself.**

---

## FAC-022 — Enterprise Search, Navigation & Discoverability Framework

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Shared Platform Capabilities + Phase 6/7 Module Functional Blueprints + Phase 10 Security / Performance / Accessibility / Supportability validation

التفاصيل محفوظة في:

`FAC-022_ENTERPRISE_SEARCH_NAVIGATION_AND_DISCOVERABILITY_FRAMEWORK.md`

يغطي البحث Product-wide search, authorization-aware retrieval, Tenant/Company context, identifier search, Arabic/English normalization, ranking, command/navigation discovery, recent/favorites, saved-view boundaries, archive behavior, document search, AI-assisted search, telemetry، وresource limits.

الحد المعماري المرشح للبحث:

> **Search and navigation may discover authorized business objects, while the owning Module remains authoritative for opening, validating, and executing against those objects.**

---

## FAC-023 — Metadata, Custom Fields & Safe Business Object Extensibility

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Configuration / Extension Framework + Phase 6/7 Business Object Design + Phase 8 Localization + Phase 10 Security / Upgrade / Compatibility validation

التفاصيل محفوظة في:

`FAC-023_METADATA_CUSTOM_FIELDS_AND_SAFE_BUSINESS_OBJECT_EXTENSIBILITY.md`

يغطي البحث الفصل بين Core/Product/Localization/Customer fields، supported field types، metadata scope، business-object registration، UI placement، validation boundaries، controlled references، dependency awareness، stable metadata identity، lifecycle/deprecation، historical integrity، security/privacy، Search/Reporting/Template/API/Integration integration، Configuration Transport، dependency analysis، ownership، وupgrade compatibility.

الحد المعماري المرشح للبحث:

> **Teranoo may extend approved ERP Business Objects through governed metadata without allowing customer-defined metadata to bypass authoritative domain rules, security, ownership, accounting integrity, or upgrade-safe product boundaries.**

ولا يعني `FAC-023` اعتماد Custom Objects أو arbitrary scripting أو تحويل Teranoo إلى Low-Code Platform مفتوحة.

---

## FAC-024 — Central Reporting, Document Rendering & Configurable Output Platform

**Status:** RESEARCH REQUIRED  
**Owner:** Phase 5 Reporting / Analytics / Shared Platform Capabilities + Phase 6/7 Module Functional Blueprints + Phase 8 Localization + Phase 10 Security / Performance / Audit / Supportability validation

التفاصيل محفوظة في:

`FAC-024_CENTRAL_REPORTING_DOCUMENT_RENDERING_AND_CONFIGURABLE_OUTPUT_PLATFORM.md`

يغطي البحث منصة Reporting & Output مركزية منطقيًا، Reporting/Semantic Data Contracts، Product/Localization/Tenant-owned Report Definitions، Self-Service Reporting المحكوم، Business Document Templates، PDF/Excel/CSV/Print، Scheduling/Background Execution، Generated Artifacts، Delivery، Template/Report Versioning، Historical Integrity، Dependency Tracking، Configuration Transport، Resource Governance، وReporting Database/Read-Model options دون افتراض topology مسبق.

الحدان المعماريان المرشحان للبحث:

> **Business Modules remain authoritative for their data, rules, and state; the Reporting & Output Platform consumes only governed, authorized reporting/output contracts.**

> **Tenant/customer-configurable reports must be metadata/configuration over stable reporting semantics—not customer-specific report code or unrestricted SQL against internal module tables.**

المركزية هنا Logical Platform Capability؛ لا يعني `FAC-024` اعتماد Microservice أو Reporting Database مستقلة أو Report Engine بعينه الآن.

---

# Ideas Already Promoted to Official Guardrails

هذه الأفكار لم تعد Backlog فقط؛ تم توثيقها رسميًا في:

`teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md`

- `PROMOTED` — Single Product Line & Upgrade-Safe Extensions.
- `PROMOTED` — Configuration Transport & Environment Promotion.
- `PROMOTED` — Versioned Public Integration & Extension Contracts.
- `PROMOTED` — Controlled Customer Data Migration & Data Exit.
- `PROMOTED` — Shared Background Processing & Product Supportability.
- `PROMOTED` — AI Safety, Governance & ERP Control Preservation.
- `PROMOTED` — Online-Only Transaction Processing & Safe Draft Preservation.

---

# Review Rule

يجب مراجعة هذا الملف عند الأقل في النقاط التالية:

1. عند إغلاق Phase 3.
2. أثناء Phase 4 عندما تظهر قرارات Deployment/Database/Environment.
3. أثناء Phase 5 عندما تتحدد Shared Platform Capabilities.
4. قبل Decision Gate A إذا كان أحد البنود يؤثر في السوق الأول.
5. قبل إغلاق Phase 10.
6. قبل Product Baseline في Phase 11.

أي فكرة جديدة من هذا النوع — ليست Feature عادية ولا قرارًا نحتاجه الآن لكنها قد تؤثر في قابلية تشغيل المنتج طويلًا — تُسجل هنا بدل تركها في المحادثات أو الذاكرة فقط.