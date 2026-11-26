# Sales & Order Management Module Model

> **الحالة:** ✅ Approved / Closed for Phase 2
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **الغرض:** تحديد موقع Sales & Order Management داخل Teranoo ERP من حيث الاستقلالية والاعتماديات وحدود الملكية والتكامل والتفعيل، دون الدخول في الوظائف التفصيلية للمبيعات.
> **مرجع البحث:** `../../01-market-research/05-sales-order-management-architecture/02_SALES_ORDER_MANAGEMENT_ARCHITECTURE_RESEARCH.md`

---

## 1. تعريف Sales & Order Management داخل المنتج

Sales & Order Management هو أحد **Business Core Modules** في Teranoo ERP.

يعتمد في Phase 2 كـ **First-Class Sellable Standalone Module على المستوى التشغيلي**: يستطيع إدارة الالتزام التجاري مع العميل حتى Quote / Sales Order / Confirmation والبيع الخدمي وغير المخزني، دون أن يتطلب Finance أو Inventory أو Procurement أو CRM لكي يتم تفعيله وتشغيله الأساسي.

هذا لا يعني أن Sales يغلق دورة Order-to-Cash كاملة منفردًا. عند الحاجة إلى أثر مالي أو مخزني أو شرائي أو ائتماني، يصبح عقد التكامل الخاص بذلك السيناريو مطلوبًا فقط.

> **Module Dependency ≠ Integration Requirement**

كما أن هذا استقلال معماري مقصود؛ لا تدّعي Teranoo أن كل الأنظمة المرجعية تتبع النموذج نفسه. Odoo مثلًا يربط `sale` بالمحاسبة بنيويًا، بينما Teranoo يستهدف فصلًا Modular أوضح ومتسقًا مع قرارات Finance وInventory وProcurement المعتمدة.

---

## 2. مدى استقلالية Sales

### النموذج المعتمد

- Sales & Order Management **Standalone-capable تشغيليًا**.
- لا يوجد Hard Business Module Dependency على:
  - Finance
  - Inventory & Warehouse Management
  - Procurement
  - CRM
  - Manufacturing / Production
  - Projects
  - Service / EAM
- Service / Non-stock Sales لا يجب أن يحتاج Inventory.
- Stock Sales يحتاج Inventory فقط عند السيناريو الذي يتطلب availability / reservation / fulfillment / goods issue.
- Billing / AR / Payment / Revenue / GL تحتاج Finance فقط عندما يدخل السيناريو في الأثر المالي.
- Drop Ship / Back-to-Back تحتاج Procurement كـ Feature-Level Integration، لا Module-Level Dependency.

### حد مهم

Sales بدون Finance لا يعني دورة مالية مكتملة؛ وSales بدون Inventory لا يعني بيع سلع مخزنية مكتمل التنفيذ. الاستقلال المقصود هو استقلال **القدرة التشغيلية الأساسية** مع عقود تكامل شرطية عند توسيع السيناريو.

---

## 3. Platform Dependencies

هذه الوثيقة تعتمد مبدأ الاحتياج فقط، ولا تعتمد تصميم Platform Foundation التفصيلي.

### 3.1 Required Platform Capabilities

| Platform Capability | التصنيف | الملاحظة |
|---|---|---|
| Tenant Context | Required | كل بيانات Sales تقع داخل Tenant معزول |
| Company / Legal Entity Context | Required | كل التزام تجاري يجب أن يرتبط بمالك قانوني/تنظيمي واضح |
| Users / Roles / Permissions | Required | الوصول وإنشاء/تعديل/اعتماد المستندات يجب أن يكون مضبوطًا |
| Audit Trail | Required | تاريخ التغييرات والقرارات يجب أن يبقى قابلًا للتتبع |
| Shared Customer / Party Identity | Required | Sales يستهلك هوية عميل مشتركة بدل Master مستقل |
| Shared Product / Service Identity | Required | كل سطر بيعي قابل للتعامل يحتاج تعريف Product/Service مشترك؛ لا يعني ذلك Inventory dependency |
| UOM Foundation | Required | الكمية ووحدة التعامل جزء من سياق البند البيعي |
| Currency Foundation | Required as Platform Availability | العملة جزء من الالتزام التجاري؛ تفاصيل الإطار تؤجل |
| Reporting Infrastructure | Required | التقارير والتحليل تعتمد على إطار مشترك |
| Configuration / Feature Management | Required | السلوك والتفعيل Configuration-Driven |
| Integration / API Framework | Required as Platform Availability | وجود الإطار إلزامي؛ التكامل الفعلي مشروط بالسيناريو |
| Localization Framework | Required as Platform Availability | المنصة قابلة للتوطين؛ الاستخدام الفعلي حسب السوق |

### 3.2 Conditionally Required Platform Capabilities

| Platform Capability | متى يصبح مطلوبًا؟ |
|---|---|
| Branch / Business Unit / Sales Context | إذا اعتمد Phase 3 وجوده على مستوى المستند أو المسؤولية البيعية |
| Workflow / Approvals | عند تفعيل سياسات موافقة أو Block / Exception |
| Tax Foundation | عند وجود معاملات خاضعة للضريبة |
| Exchange Rates | عند اختلاف عملة المعاملة عن العملة الوظيفية ذات الصلة |
| Pricing Capability | Required functionally for priced sales; موضع المحرك وملكيته النهائية مؤجلان |
| Inventory Storage / Fulfillment Context | عند بيع أصناف مخزنية تتطلب fulfillment |
| Documents & Attachments | عند الحاجة إلى عروض/مستندات/مرفقات |
| Credit Capability | عند تفعيل Credit Check / Credit Hold |

### 3.3 خارج هذه المرحلة

لا تُصمم هنا:
- Tenant / Company / Branch hierarchy
- Sales Organization hierarchy
- Customer/Party data model التفصيلي
- Product Master data model التفصيلي
- Workflow engine
- Tax / Currency frameworks
- Pricing engine design
- Integration execution model
- Sales document schemas

---

## 4. Customer / Party Boundary

المبدأ المعتمد:

- **Customer Identity = Shared Platform Party Data.**
- Sales لا يملك هوية العميل العامة بصورة حصرية ولا يكررها في Master مستقل.
- Sales يملك **Customer Commercial Sales Context** المرتبط بالعلاقة التجارية والتنفيذ البيعي عندما تُعتمد تفاصيله لاحقًا.
- Finance يملك **Customer Financial Context** المرتبط بـ AR / Payment / Credit / Financial controls عندما تُعتمد تفاصيله لاحقًا.
- CRM — إذا أضيف لاحقًا — يملك Relationship / Lead / Opportunity Context دون أن يصبح شرطًا لتشغيل Sales Order Management.

لا تُحسم هنا ملكية كل attribute تفصيلي مثل Payment Terms / Tax / Contacts / Pricing Group؛ هذه تؤجل إلى Phase 5/6.

---

## 5. Product / Service Boundary

قرار Inventory السابق يبقى ساريًا:

> **Product / Item Identity = Shared Platform Master Data.**

Sales يستهلك Product/Service Identity مشتركة ويضيف **Sales Context** فقط.

على المستوى المعماري:
- Product/Service definition مطلوب لسطر بيع قابل للتعامل.
- Service / Non-stock Product لا يحتاج Inventory Module.
- Product Catalog لا يساوي Inventory Item؛ نفس الهوية قد تحمل Sales Context دون Stock Context.
- Sales لا ينشئ Product Master منفصلًا ولا يكرر تعريف الصنف.

لا تُعتمد Free-form productless lines كحالة أساسية في Phase 2؛ إن لزم ذلك مستقبلًا فهو قرار Functional/Policy لاحق.

---

## 6. Sales ↔ Finance Boundary

**Sales يملك:**
- Customer commercial commitment.
- Quote / Sales Order والمستندات البيعية الواقعة ضمن نطاقه لاحقًا.
- Ordered / Confirmed quantity.
- Commercial terms and billing intent/data اللازمة لطلب الفوترة.

**Finance يملك:**
- Accounts Receivable.
- Financial Customer Context.
- Payment / Collection.
- Revenue Posting / Revenue Accounting.
- Financial Ledger Posting.

قواعد Phase 2:
- Sales لا يكتب مباشرة إلى GL.
- Sales Order نفسه ليس GL posting.
- Finance ليس شرطًا لإنشاء/تأكيد Sales Order.
- عند الوصول إلى Billing / AR / Revenue / Payment يصبح `Conditional Integration Contract` مع Finance مطلوبًا.
- **مكان توليد Customer Invoice / Sales Billing Document لا يُحسم في Phase 2**؛ الأنظمة المرجعية تدعم نموذجين صحيحين.

---

## 7. Sales ↔ Inventory / Warehouse Boundary

**Sales يملك:**
- Ordered / Confirmed Quantity.
- Commercial fulfillment intent.
- Sales Order lifecycle/state.

**Inventory يملك وفق D-INV:**
- On-hand Quantity.
- Inventory Movements.
- Physical reservation records.
- Goods Issue / Inventory effect.

**Warehouse / Inventory execution يملك:**
- Physical shipment / picking / execution state عندما تقع هذه القدرات ضمن النطاق المعتمد لاحقًا.

لذلك:
- Sales Order لا يغير On-hand مباشرة.
- Sales يمكن أن يطلب Availability / Reservation / Fulfillment، لكنه لا يملك الرصيد.
- Stock Sale يجعل Sales↔Inventory integration مطلوبًا للسيناريو فقط.
- Service / Non-stock Sales لا يحتاج Inventory.

### Reservation ownership

نتيجة بحث Sales تغلق الاتجاه المعماري السابق لصالح:

> **Reservation Record Ownership = Inventory.**

Sales / Order Management يطلب أو ينسق الحجز، بينما Inventory يملك سجل الكمية المحجوزة ويعدلها.

لا تُحسم هنا خوارزميات Soft/Hard Reservation أو Allocation Priority.

---

## 8. Sales ↔ Procurement Boundary

لا توجد Hard Dependency بين Sales وProcurement.

سيناريوهات مثل:
- Drop Ship
- Direct Delivery
- Back-to-Back
- Special / Individual Procurement

هي **Feature-Level Dependencies / Conditional Integrations**.

Sales قد يطلق `Supply Request` أو مرجع طلب شراء، لكن Purchase Order يبقى ملك Procurement وفق D-PROC.

---

## 9. Sales ↔ CRM Boundary

- Lead / Opportunity / Pipeline ليست جزءًا من Business Core Sales & Order Management.
- CRM ليس شرطًا لتفعيل Sales.
- Sales Order يبقى Sales-owned document.
- Quote يمكن أن يوجد داخل Sales، ويمكن مستقبلًا استقبال Quote/Opportunity context من CRM عبر Integration Contract.

ملكية Quote النهائية بين Sales وCRM لا تحتاج حسمًا في Phase 2 لأن CRM ليس Business Core حاليًا؛ تفاصيلها تؤجل إلى Phase 6/CRM future design.

---

## 10. Order Coordination / Orchestration Boundary

البحث يثبت فرقًا مهمًا بين:

- **من ينسق دورة الطلب**
- **من ينفذ أو يملك البيانات الفعلية**

المبدأ المعتمد لـ Teranoo:

- Sales يملك **Sales Order lifecycle and coordination intent**.
- يمكنه إطلاق requests/events إلى Finance / Inventory / Procurement / future modules.
- لا يملك نتيجة التنفيذ داخل تلك المجالات: لا On-hand، لا GL، لا PO، لا Payment.
- لا نعتمد الآن وجود **Standalone Order Orchestration Service** منفصل.
- شكل التنفيذ — coordination داخل Sales أم خدمة Orchestration مستقلة عند التوسع — يبقى قرارًا لاحقًا في Phase 5/6.

بهذا نثبت حد المسؤولية دون فرض بنية تقنية مبكرة.

---

## 11. Pricing & Credit Boundaries

### Pricing

Sales يحتاج قدرة Pricing وظيفية، لكن البحث يثبت نماذج مختلفة:
- Pricing داخل/قريب من Sales.
- Shared Commercial Pricing Service.

لذلك تعتمد Phase 2 فقط:
- Sales يستهلك Pricing ويملك **السعر/النتيجة التجارية على المستند**.
- مكان Pricing Engine وOwnership للقواعد/Price Lists التفصيلية **Deferred Architecture Commitment** إلى Phase 5/6.

### Credit

- Credit Limit / Exposure / Financial Risk ليست ملك Sales Core.
- Credit Check داخل دورة Sales يمكن أن يكون Feature-Level checkpoint اختياريًا.
- عند تفعيل Credit Management، يستدعي Sales قدرة Finance/Shared Risk عبر Integration Contract.

لا تُصمم Credit Rules الآن.

---

## 12. Workflow / Approval Boundary

- Workflow / Approval Engine = **Shared Platform Capability**.
- Sales لا يملك Approval Engine مستقلًا.
- استخدام الموافقات أو Blocks على Quote/SO/Discount/Credit Exception يعتمد Configuration / Policy.
- وجود Workflow Framework في المنصة لا يعني أن كل مستند يجب أن يمر بموافقة.

تفاصيل routing / thresholds / delegations / SoD تؤجل إلى Phase 5/6.

---

## 13. Activation / Deactivation

### 13.1 Activation

لتفعيل Sales يجب أن تكون Platform Foundation المطلوبة متاحة بالحد الأدنى، وبالأخص:
- Tenant Context
- Company / Legal Entity Context
- Shared Customer / Party Identity
- Shared Product / Service Identity
- UOM
- Users / Roles / Permissions
- Audit
- Currency Foundation
- Configuration / Feature Management

ولا يجب أن يتطلب Activation تفعيل:
- Finance
- Inventory
- Procurement
- CRM
- Manufacturing
- Projects

تكاملات Billing / Inventory Fulfillment / Credit / Drop Ship تصبح مطلوبة فقط للسيناريوهات التي تستخدمها.

### 13.2 Deactivation

> **Deactivation = Freeze, not Delete**

بعد وجود مستندات أو تاريخ Sales:
- لا تُحذف البيانات التاريخية.
- لا يُحذف Sales Order / customer commercial history بصورة تكسر Audit / document flow.
- يجب الفصل بين منع معاملات جديدة، إغلاق الطلبات المفتوحة، تعطيل العميل، والأرشفة.
- التكاملات المرتبطة بالموديول يجب أن تدخل حالة معلنة عند توقف القدرة.

تفاصيل License Deactivation / Read-Only / Open Orders / Archive / Retention / Reactivation تؤجل.

---

## 14. Multi-Company / Multi-Branch Implications

Sales يفرض فقط متطلبات على Phase 3، ولا يحسم النموذج التنظيمي هنا:

- لكل Sales Order Company / Legal Entity owner واضح.
- Tenant لا يُفترض أنه Company واحدة.
- Customer Identity يمكن أن تكون Shared مع contexts مختلفة حسب Company.
- Branch / Business Unit / Sales Channel قد تكون سياقات تشغيلية/بيعية وفق Phase 3.
- Warehouse / Site reference لا تعني ملكية Sales للمخزون.
- Centralized Sales / Cross-Company Fulfillment / Intercompany Sales تبقى قدرات صريحة لاحقة.

لا تُحسم هنا:
- Sales Organization hierarchy.
- Branch ownership model.
- Cross-company fulfillment design.
- Intercompany billing design.
- Shared price-list scope.

---

## 15. الاستبعادات الصريحة

هذه الوثيقة لا تحدد:
- Quotation workflow
- Sales Order lifecycle/statuses التفصيلية
- Pricing rules / discount algorithms
- Promotions
- Availability algorithms
- Reservation algorithms
- Allocation priorities
- Picking / Packing / Shipping workflow
- Returns process
- Customer Invoice workflow
- Collection / Payment process
- Credit scoring
- Commission calculations
- Revenue Recognition details
- CRM opportunity flow
- Database Schema
- API implementation
- UI/UX
- Source Code

---

## 16. القرارات المفتوحة والمؤجلة

هذه النقاط لا تمنع إغلاق Sales في Phase 2:

1. المصطلحات الرسمية العامة للDependencies — بعد دراسة Business Core الأربع.
2. Customer Invoice generation boundary: Sales Billing Document vs Finance-created Invoice — Phase 5/6.
3. Pricing Engine placement / ownership — Phase 5/6.
4. Quote ownership detail عند وجود CRM — Phase 6 / future CRM.
5. Standalone Order Orchestration Service vs Sales-internal coordination — Phase 5/6 عند الحاجة.
6. Soft vs Hard Reservation / Allocation algorithms — Phase 6.
7. Credit Management architecture — Finance/Phase 5/6.
8. Shipment orchestration details vs Warehouse execution — Phase 6.
9. Real-Time vs Event-driven vs Batch — Phase 5 Integration/API.
10. Intercompany Sales / Cross-company fulfillment — Phase 3/6/9.
11. Advanced Pricing — later Feature Layer.
12. Read-Only / Archive / Open-order handling after license deactivation — Platform / Enterprise-wide phases.

### Deferred Architecture Commitments

**A. Customer Invoice Generation Boundary**

الوجه المالي للفاتورة وAR/GL ملك Finance، لكن مكان توليد الكائن التجاري للفاتورة يختلف عالميًا. لا يُحسم في Phase 2.

**B. Pricing Engine Placement**

Sales يحتاج Pricing، لكن هل يكون المحرك Shared Commercial Service أم Sales-owned service قرار مؤجل عمدًا.

**C. Order Orchestration Implementation**

يعتمد Phase 2 مبدأ أن Sales يملك Lifecycle/coordination intent، لكنه لا يقرر الآن هل يوجد Orchestrator مستقل أم يبقى التنسيق داخل Sales في البداية.

---

## 17. القرارات المعتمدة

### D-SALES-01 — Standalone Sales & Order Management
اعتماد Sales & Order Management كـ **First-Class Sellable Standalone Module على المستوى التشغيلي**، قادر على إدارة الالتزام التجاري الأساسي دون Finance أو Inventory أو Procurement أو CRM، مع الحاجة إلى التكامل عند السيناريوهات المالية/المخزنية/الشرائية.

### D-SALES-02 — No Hard Business Module Dependency
اعتماد عدم وجود Hard Dependency على Finance أو Inventory أو Procurement أو CRM أو أي Business Module آخر لتفعيل Sales الأساسي.

**حد القرار:** هذا خروج معماري مقصود عن نموذج Odoo `sale → account_payment → account`، وليس ادعاءً بأن جميع الأنظمة العالمية تتبع نفس النموذج.

### D-SALES-03 — Platform-Based Dependency
اعتماد أن Dependencies الإلزامية لـSales تأتي من Platform Foundation وShared Business Foundation، مع Required وConditionally Required.

**حد القرار:** لا يعتمد تصميم Tenant / Company / Branch / Sales Organization أو بقية Foundations.

### D-SALES-04 — Shared Customer / Party Identity
اعتماد Customer Identity كـ **Shared Platform Party Data**، مع Commercial Sales Context داخل Sales وFinancial Customer Context داخل Finance، وCRM Relationship Context خارج Business Core عند إضافته لاحقًا.

### D-SALES-05 — Shared Product / Service Identity
اعتماد أن Sales يستهلك **Shared Product / Service Identity** ويضيف Sales Context فقط، وأن بيع Service/Non-stock لا يحتاج Inventory. Product/Service definition مطلوب للسطر البيعي الأساسي، لكن Stock Context ليس مطلوبًا لكل منتج.

### D-SALES-06 — Commercial / Physical / Financial Ownership Boundary
اعتماد أن:
- Sales يملك Sales Order وOrdered/Confirmed Quantity والشروط التجارية.
- Inventory يملك On-hand وInventory Movements وGoods Issue.
- Reservation record ownership = Inventory؛ Sales يطلب/ينسق الحجز.
- Physical shipment execution = Inventory/Warehouse domain.
- Finance يملك AR / Payment / Revenue / Financial Ledger Posting.

**حد القرار:** مكان توليد Customer Invoice وShipment orchestration التفصيلي يبقيان مؤجلين.

### D-SALES-07 — Order Coordination Principle
اعتماد أن Sales يملك Sales Order lifecycle و**coordination intent** ويطلق Requests/Events للقدرات الأخرى، دون امتلاك بيانات التنفيذ في Finance/Inventory/Procurement.

**حد القرار:** لا يعتمد وجود Orchestration Service مستقل في هذه المرحلة.

### D-SALES-08 — Conditional Integration & Feature-Level Dependency Principle
اعتماد `Conditional Integration Contract` للعلاقات مع Finance / Inventory / Procurement / CRM / Projects / Manufacturing، وأن Stock Sale / Billing / Drop Ship / Credit Check / Project Sale / MTO وغيرها Feature-Level Dependencies لا Module-Level Dependencies.

### D-SALES-09 — Shared Workflow Principle
اعتماد Workflow / Approval Engine كـ Shared Platform Capability، مع كون استخدام Approval / Blocks Configuration-dependent وليس شرطًا صلبًا لتشغيل Sales.

### D-SALES-10 — Service Sales Independence Principle
اعتماد Service / Non-stock Sales كمسار First-Class لا يحتاج Inventory، مع إبقاء Service Execution كقدرة منفصلة لاحقة.

### D-SALES-11 — Safe Deactivation Principle
اعتماد **Freeze, not Delete** بعد وجود تاريخ Sales، مع الفصل بين Functional Freeze / Customer Inactivation / Order Closure / Archive وتأجيل تفاصيل License/Read-Only/Retention.

---

## 18. إغلاق Phase 2 لـ Sales

تم اعتماد **D-SALES-01 إلى D-SALES-11** بتاريخ **2026-09-09** وإغلاق دراسة Sales & Order Management رسميًا ضمن Phase 2.

تبقى الالتزامات والأسئلة المؤجلة في القسم 16 مفتوحة لمراحلها الرسمية، ولا تعيد فتح هذه القرارات إلا إذا كشف بحث لاحق عن تعارض مادي موثق.

الخطوة التالية ليست Phase 3 مباشرة؛ يتم أولًا تنفيذ **Phase 2 Assumption Safety Review** على Module Models الأربعة للتأكد من عدم تسرب افتراضات غير معتمدة تخص Tenant / Multi-Company / Multi-Branch / Shared-vs-Company-specific Master Data أو Organizational Ownership قبل الانتقال إلى Phase 3.
