# Procurement Module Model

> **الحالة:** ✅ Approved / Closed
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **الغرض:** تحديد موقع Procurement داخل Teranoo ERP من حيث الاستقلالية والاعتماديات وحدود الملكية والتكامل والتفعيل، دون الدخول في الوظائف الشرائية التفصيلية.
> **مرجع البحث:** `../../01-market-research/04-procurement-module-architecture/02_PROCUREMENT_MODULE_ARCHITECTURE_RESEARCH.md`

---

## 1. تعريف Procurement داخل المنتج

Procurement هو أحد **Business Core Modules** في Teranoo ERP.

يُعتمد في Phase 2 كـ **First-Class Sellable Module** قادر على تشغيل دورة الشراء التشغيلية الأساسية بصورة مستقلة عن Inventory وSales، وبصورة مستقلة عن Finance على مستوى إنشاء وإدارة الطلبات والعروض وأوامر الشراء والقبول الخدمي، مع الحاجة إلى Finance فقط عندما يدخل السيناريو في Supplier Invoice / AP / Financial Posting أو أي أثر مالي معتمد.

هذا استقلال معماري مقصود، ولا يعني أن كل الأنظمة المرجعية تتبع النموذج نفسه؛ Odoo مثلًا يفرض Hard Dependency من `purchase` إلى `account`. Teranoo يعتمد عمدًا نموذجًا أكثر Modular بما يتوافق مع قرارات Finance وInventory المعتمدة.

لا تحدد هذه الوثيقة تفاصيل Requisition / RFQ / PO lifecycle / Sourcing / Agreements / Matching / Approvals / Supplier Portal / Reports؛ هذه تؤجل إلى Phase 6.

---

## 2. مدى استقلالية Procurement

### النموذج المعتمد

- Procurement **Standalone-capable على المستوى التشغيلي**.
- لا يوجد Hard Business Module Dependency على:
  - Finance
  - Inventory & Warehouse Management
  - Sales & Order Management
  - Manufacturing / Production
  - Projects
  - Maintenance / EAM
- التكامل مع Business Modules الأخرى لا يحولها تلقائيًا إلى Dependencies.
- إذا وصل السيناريو إلى أثر مالي أو مخزني أو طلب ناشئ من Module آخر، يصبح عقد التكامل الخاص بذلك السيناريو مطلوبًا فقط.

> **Module Dependency ≠ Integration Requirement**

### حد مهم

Procurement بدون Finance لا يعني دورة مالية كاملة؛ يمكن أن يدير العملية الشرائية التشغيلية، لكن Supplier Invoice / AP / Liability / Payment / GL Posting تقع خارج قدرته المستقلة وتحتاج Finance عند استخدامها.

---

## 3. ما يستطيع Procurement فعله عند تشغيله منفردًا

على المستوى المعماري فقط، يجب أن يستطيع Procurement العمل دون Inventory أو Sales، ودون Finance في الجزء التشغيلي من دورة الشراء، من خلال القدرة على:

- إدارة Procurement-owned documents مثل Requisition / RFQ / Purchase Order وفق ما يُعتمد وظيفيًا لاحقًا.
- التعامل مع Supplier/Party Identity مشتركة مع المنصة.
- إدارة Commercial Procurement Context الخاص بالمورد دون تكرار هويته العامة أو سياقه المالي.
- شراء خدمات ومصاريف وبنود غير مخزنية دون الحاجة إلى Inventory.
- استخدام Shared Product / Item Master عند شراء أصناف معرفة، دون أن يكون Item إلزاميًا لكل سيناريو شراء.
- قبول/تأكيد الخدمات داخل Procurement عند اعتماد Service Procurement لاحقًا.
- تطبيق الصلاحيات والتدقيق والحوكمة المطلوبة.
- استخدام Workflow/Approval Framework المشترك عند تفعيل سياسات الموافقة.
- إنتاج تقارير ومؤشرات Procurement من خلال Reporting Infrastructure.

**لا تحسم هذه النقاط أي Workflow تفصيلي أو Document States أو Matching Rules أو Supplier Onboarding design.**

---

## 4. Platform Dependencies

هذه الوثيقة تعتمد **مبدأ الاحتياج** فقط، ولا تعتمد تصميم Platform Foundation التفصيلي.

### 4.1 Required Platform Capabilities

| Platform Capability | التصنيف | الملاحظة |
|---|---|---|
| Tenant Context | Required | كل بيانات Procurement تقع داخل Tenant معزول |
| Company / Legal Entity Context | Required | كل عملية شراء يجب أن ترتبط بمالك تنظيمي واضح |
| Users / Roles / Permissions | Required | الوصول وإنشاء/تعديل/اعتماد المستندات يجب أن يكون مضبوطًا |
| Audit Trail | Required | تاريخ القرارات والتغييرات يجب أن يبقى قابلًا للتتبع |
| Shared Supplier / Party Identity | Required | Procurement يستهلك هوية مورد مشتركة بدل إنشاء Master مستقل |
| Currency Foundation | Required as Platform Availability | Procurement يحتاج سياق عملة للمستندات التجارية؛ تفاصيل العملات تؤجل |
| Reporting Infrastructure | Required | التقارير والتحليل تعتمد على إطار مشترك |
| Configuration / Feature Management | Required | السلوك والتفعيل Configuration-Driven |
| Integration / API Framework | Required as Platform Availability | الإطار جزء من المنصة؛ لا يعني وجود تكامل فعلي دائمًا |
| Localization Framework | Required as Platform Availability | المنصة قابلة للتوطين؛ الاستخدام الفعلي يعتمد على السوق |

### 4.2 Conditionally Required Platform Capabilities

| Platform Capability | متى يصبح مطلوبًا؟ |
|---|---|
| Branch / Business Unit / Operating Context | إذا اعتمد Phase 3 استخدامه على مستوى المستند أو المسؤولية الشرائية |
| Workflow / Approvals | عندما تتطلب سياسة العميل موافقات؛ وجود المحرك في المنصة لا يعني إلزام كل مستند به |
| Shared Product / Item Master | عند شراء أصناف معرفة؛ Service/Expense/Category/Free-form procurement لا يجب أن يعتمد عليه دائمًا |
| UOM Foundation | عند وجود بند كمي/صنف يحتاج وحدة قياس |
| Tax Foundation | عند وجود معاملات أو تشريعات ضريبية |
| Exchange Rates | عند اختلاف عملة المعاملة عن العملة الوظيفية ذات الصلة |
| Inventory Storage / Delivery Context | عند شراء أصناف تتطلب استلامًا مخزنيًا أو تسليمًا إلى موقع تخزين |
| Documents & Attachments | عند العمليات التي تتطلب عروضًا أو عقودًا أو أدلة مرفقة |

### 4.3 خارج هذه المرحلة

لا تُصمم هنا:
- Tenant / Company / Branch hierarchy
- Procurement Organization model
- Shared Party data model
- Supplier onboarding model
- Workflow engine
- Currency / Tax frameworks
- Integration execution model
- Document schemas

---

## 5. Supplier / Vendor Identity Boundary

المبدأ المعتمد:

- **Supplier / Vendor Identity = Shared Platform Party Data.**
- Procurement لا يملك هوية المورد العامة بصورة حصرية ولا يكررها في Master مستقل.
- Procurement يملك **Commercial Procurement Context** المرتبط بالمورد، مثل ما يحتاجه للعملية الشرائية عندما يُعتمد لاحقًا.
- Finance يملك **Financial Supplier Context** المرتبط بـ AP / Liability / Payment / Financial controls عندما يُعتمد لاحقًا.

لا تحسم هذه الوثيقة:
- Party model التفصيلي.
- Supplier sites.
- Bank/tax ownership التفصيلي.
- Qualification / scoring.
- Payment terms ownership النهائي.
- One-time supplier design.

هذه التفاصيل تؤجل إلى Phase 5/6.

---

## 6. Product / Item Dependency Boundary

قرار Inventory السابق يبقى ساريًا:

> **Product / Item Identity = Shared Platform Master Data.**

Procurement يستهلك هذه الهوية عندما يشتري صنفًا معرفًا، لكنه لا يعتمد عليها كشرط لكل عملية شراء.

يجب أن يبقى معماريًا قادرًا على دعم سيناريوهات:
- Service procurement.
- Expense procurement.
- Category-based procurement.
- Free-form / non-stock procurement.

بحيث لا يصبح Inventory أو Item Master شرطًا صلبًا لكل PO.

لا تُحسم هنا تفاصيل سطور PO أو Product flags أو Procurement Categories.

---

## 7. حدود التكامل مع Business Core Modules

### 7.1 Procurement ↔ Finance

**Procurement يملك:**
- القرار التجاري بالشراء.
- Requisition / RFQ / Purchase Order والمستندات الشرائية التي تقع ضمن نطاقه لاحقًا.
- Commercial Supplier Context.
- Service acceptance / confirmation عندما يكون السيناريو خدميًا ويُعتمد ذلك وظيفيًا.

**Finance يملك:**
- Supplier Invoice / AP record.
- Financial Liability.
- Payment.
- Financial Ledger Posting.

**قواعد Phase 2:**
- Procurement لا يكتب مباشرة إلى GL.
- PO نفسه لا يُعامل كـGL posting.
- عندما يحتاج السيناريو Invoice/AP/Accrual/Commitment أو أثرًا ماليًا، يتم ذلك عبر Contract/Boundary مع Finance.
- ملكية **Invoice Matching** التفصيلية لا تُحسم الآن بسبب اختلاف الأنظمة المرجعية؛ تبقى Boundary Decision لاحقة.

**نوع العلاقة:** `Conditional Integration Contract`.

### 7.2 Procurement ↔ Inventory

**Procurement يملك:**
- PO والكمية المطلوبة/المتوقعة على المستوى التجاري.

**Inventory يملك وفق D-INV:**
- On-hand Quantity.
- Inventory Movements.
- الأثر الكمي الفعلي عند دخول/خروج المخزون.

لذلك:
- شراء الخدمات لا يحتاج Inventory.
- عند شراء Stock Item، يصبح Receipt-to-Inventory Integration مطلوبًا للسيناريو المشترك.
- لا يجوز أن يغير PO نفسه On-hand Quantity.

ملكية Receiving orchestration التفصيلية وحالات Accepted/Rejected/Returned تؤجل إلى Functional Blueprints.

**نوع العلاقة:** `Conditional Integration Contract`.

### 7.3 Procurement ↔ Sales

لا توجد Hard Dependency بينهما.

سيناريوهات مثل:
- Drop Ship
- Direct Delivery
- Back-to-Back
- Special Order Purchase

تُعامل كـ **Feature-Level Dependencies / Conditional Integrations** بين Sales وProcurement، لا كسبب لجعل أحد الـModules شرطًا لتفعيل الآخر.

### 7.4 Procurement ↔ Manufacturing / Projects / Maintenance

Procurement يمكن أن يستقبل Demand/Request من Modules أخرى دون أن يعتمد عليها لتفعيله.

Project Purchase / Production Purchase / Maintenance Purchase هي **Feature-Level Integrations**؛ المرجع الخارجي مثل Project/Work Order/Production Order لا يتحول إلى Module-Level Dependency.

---

## 8. Purchase Order Ownership Boundary

المبدأ المعتمد:

- **Purchase Order = Procurement-owned business document.**
- PO لا يملكه Inventory ولا Finance.
- Inventory يستهلك PO كمرجع عند الاستلام المخزني.
- Finance يستهلك PO/Receipt references عند الفوترة أو المطابقة عندما يكون التكامل المالي مفعّلًا.

على مستوى Phase 2 فقط، PO يحتاج إلى Context تنظيمي ومورد وبند قابل للشراء، لكن لا تُحسم هنا:
- تفاصيل الحقول.
- Header/Line schema.
- Status lifecycle.
- Approval routing.
- Tax/currency calculation.
- Account assignment details.

---

## 9. Service Procurement Boundary

Service Procurement هو دليل معماري قوي على استقلال Procurement عن Inventory.

المبدأ المعتمد:
- الخدمات لا تمر عبر Stock Movement.
- قبول/تأكيد الخدمة يقع داخل Procurement أو Contract واضح معه، وليس داخل Inventory.
- Supplier Invoice الناتجة عن الخدمة تبقى Finance/AP responsibility عند تفعيل Finance.

لا تُحسم هنا تفاصيل Service Entry / Work Confirmation / Acceptance workflow.

---

## 10. Workflow / Approval Boundary

Procurement يحتاج **Shared Workflow / Approval Capability** كقدرة منصة متاحة، لكنه لا يجب أن يملك Approval Engine خاصًا به.

- وجود Shared Workflow في المنصة: Required as Platform Availability.
- استخدام Approval على كل Requisition / PO: Configuration / Policy-dependent.
- Procurement يعرّف document-specific approval requirements/rules، بينما Engine نفسه مشترك.

تفاصيل routing / thresholds / delegations / SoD تؤجل إلى Phase 5/6.

---

## 11. Activation / Deactivation

### 11.1 Activation

لتفعيل Procurement يجب أن تكون Platform Foundation المطلوبة متاحة بالحد الأدنى، وبالأخص:
- Tenant Context
- Company / Legal Entity Context
- Shared Supplier / Party Identity
- Users / Roles / Permissions
- Audit
- Currency Foundation
- Configuration / Feature Management

ولا يجب أن يتطلب Activation تفعيل:
- Finance
- Inventory
- Sales
- Manufacturing
- Projects

Shared Product / Item وInventory Delivery Context تصبح مطلوبة فقط للسيناريوهات التي تستخدمها.

### 11.2 Deactivation

> **Deactivation = Freeze, not Delete**

بعد وجود مستندات أو تاريخ شراء:
- لا تُحذف البيانات التاريخية.
- لا يُسمح بحذف PO أو Supplier Procurement history بصورة تكسر Integrity.
- يجب الفصل بين منع معاملات جديدة وبين إغلاق المستندات المفتوحة والاحتفاظ بالتاريخ.
- يجب أن تدخل التكاملات المرتبطة بالموديول في حالة معلنة عند توقف Procurement.

تفاصيل:
- License Deactivation
- Read-Only access
- Handling of open POs
- Contract closure
- Archive / Retention
- Reactivation

تؤجل إلى مراحلها المناسبة.

---

## 12. Multi-Company / Multi-Branch Implications

Procurement يفرض على التصميم المستقبلي:
- أن يكون لكل مستند شراء Company / Legal Entity owner واضح.
- ألا يفترض النظام أن Tenant = Company واحدة.
- أن يسمح لاحقًا بنموذج Centralized Procurement / Shared Procurement دون كسر ملكية المستندات المحلية.
- أن يفرق بين Supplier Identity المشتركة وبين company-specific commercial/financial context عند الحاجة.
- أن يعامل Branch / BU / Procurement Organization كعناصر سياق يتم حسمها في Phase 3.

ولا يُحسم هنا:
- Purchasing Organization hierarchy.
- Central contracts model.
- Cross-company sourcing.
- Intercompany procurement.
- Branch-level authority model.

---

## 13. الاستبعادات الصريحة

هذه الوثيقة لا تحدد:
- Requisition lifecycle
- RFQ / RFP process
- Supplier quotation comparison
- Sourcing events
- Supplier qualification
- PO lifecycle/statuses
- Blanket / Purchase Agreements
- Contract authoring
- Detailed Service Entry
- Detailed Goods Receipt
- Invoice Matching rules
- Three-way matching design
- AP accounting
- Payment processing
- Procurement Analytics details
- Supplier Portal
- Database Schema
- API implementation
- UI/UX
- Source Code

---

## 14. القرارات المفتوحة والمؤجلة

هذه النقاط لا تعيد فتح Procurement في Phase 2، وتبقى التزامات لمراحلها الرسمية:

1. المصطلحات الرسمية العامة للـDependencies — بعد دراسة Business Core الأربع.
2. Invoice Matching ownership / orchestration — Phase 5/6 بعد تثبيت Finance/Procurement/Inventory contracts.
3. Supplier financial/commercial attribute ownership التفصيلي — Phase 5/6.
4. One-time Supplier design — Phase 6.
5. Requisition / RFQ / Sourcing scope — Phase 6.
6. Service Entry / Work Confirmation design — Phase 6.
7. Centralized Procurement / Procurement Organization model — Phase 3/6.
8. Real-Time vs Event-driven vs Batch — Phase 5 Integration/API.
9. Commitment / Encumbrance — Finance/Phase 6 لاحقًا.
10. Read-Only / Archive / Open-PO handling after license deactivation — Platform / Enterprise-wide phases.

### Deferred Architecture Commitment — Invoice Matching

**Invoice Matching Boundary is intentionally unresolved by design.**

البحث يثبت نماذج مختلفة عالميًا: بعض الأنظمة تضع المطابقة أقرب إلى Finance/AP، وأخرى تضع جزءًا مهمًا منها داخل Procurement/MM. لذلك لا يتم حسم المالك النهائي في Phase 2؛ يجب أن يُعاد هذا القرار صراحة في Phase 5/6 بعد تثبيت Integration Contracts بين Procurement وInventory وFinance.

### Decision Context — Finance Dependency Choice

اعتماد عدم وجود Hard Dependency من Procurement إلى Finance هو **قرار معماري مقصود** لـTeranoo، وليس استنتاجًا بأن جميع الأنظمة المرجعية تتبع ذلك. تم توثيق البديل بوضوح: Odoo يفرض `purchase → account` كتَبعية صلبة، بينما Teranoo اختار الفصل التشغيلي مع `Conditional Integration Contract` عند الفوترة/الترحيل، اتساقًا مع مبادئ D-FIN وD-INV ومع هدف المنتج Modular.

هذا السياق جزء من سجل القرار داخل هذه الوثيقة ويجب الحفاظ عليه عند بناء Dependency Model النهائي.

---

## 15. القرارات المعتمدة

### D-PROC-01 — Standalone Procurement
اعتماد Procurement كـ **First-Class Sellable Standalone Module على المستوى التشغيلي**، قادر على العمل دون Inventory أو Sales ودون Finance في Requisition/RFQ/PO/Service Procurement، مع الحاجة إلى Finance عند Invoice/AP/Liability/Payment/Financial Posting.

### D-PROC-02 — No Hard Business Module Dependency
اعتماد أن Procurement لا يحتاج Finance أو Inventory أو Sales أو أي Business Module آخر لكي يتم تفعيله وتشغيله الأساسي.

**حد القرار:** هذا خروج معماري مقصود عن نموذج Odoo `purchase → account`، وليس ادعاءً بأن جميع الأنظمة العالمية تتبع نفس النموذج.

### D-PROC-03 — Platform-Based Dependency
اعتماد أن Dependencies الإلزامية لـProcurement تأتي من Platform Foundation، مع التمييز بين Required وConditionally Required.

**حد القرار:** يعتمد مبدأ الاحتياج فقط ولا يعتمد تصميم Platform Foundation التفصيلي.

### D-PROC-04 — Shared Supplier / Vendor Identity
اعتماد Supplier / Vendor Identity كـ **Shared Platform Party Data**، مع Procurement Commercial Context وFinance Financial Context دون تكرار الهوية الأساسية.

**حد القرار:** لا يحسم Party Model أو ownership التفصيلي للBank/Tax/Payment attributes.

### D-PROC-05 — Procurement Document & Physical/Financial Boundaries
اعتماد أن:
- Procurement يملك Purchase Order والقرار التجاري بالشراء.
- Inventory يملك On-hand Quantity وInventory Movement الناتج عن الاستلام المخزني.
- Finance يملك Supplier Invoice/AP وFinancial Ledger Posting.
- Service acceptance لا يمر عبر Inventory.

**حد القرار:** Invoice Matching ownership يبقى مؤجلًا صراحة.

### D-PROC-06 — Product / Item Is Conditional, Not Universal Dependency
اعتماد أن Procurement يستهلك Shared Product / Item Master عند شراء أصناف معرفة، لكنه يجب ألا يعتمد عليه لكل عملية شراء؛ Service / Expense / Category / Free-form procurement تبقى ممكنة دون Inventory Item.

### D-PROC-07 — Conditional Integration & Feature-Level Dependency Principle
اعتماد أن التكامل مع Finance وInventory وSales وبقية Modules يتم عبر `Conditional Integration Contract` عند السيناريو المشترك، وأن Drop Ship / Stock Purchase / 3-Way Match / Project Purchase / Production Purchase أمثلة Feature-Level Dependencies لا Module-Level Dependencies.

### D-PROC-08 — Shared Workflow Principle
اعتماد Workflow / Approval Engine كـ **Shared Platform Capability** وليس محركًا مكررًا داخل Procurement، مع كون استخدام الموافقة على كل مستند Configuration/Policy-dependent.

### D-PROC-09 — Safe Deactivation Principle
اعتماد **Freeze, not Delete** بعد وجود مستندات/تاريخ Procurement، مع منع الحذف الذي يكسر Audit/Integrity وتأجيل تفاصيل Read-Only / Archive / Open Document handling إلى مراحلها.

---

## 16. قرار الإغلاق

تم اعتماد D-PROC-01 إلى D-PROC-09، وبذلك تُغلق دراسة **Procurement Module Architecture & Dependencies** ضمن Phase 2.

تبقى الالتزامات والأسئلة المؤجلة في القسم 14 لمراحلها الرسمية ولا تعيد فتح هذه الدراسة إلا إذا ظهر تعارض جوهري موثق لاحقًا.

**الحالة:** ✅ Approved / Closed

**العمل التالي:** Sales & Order Management Module Architecture & Dependencies.
