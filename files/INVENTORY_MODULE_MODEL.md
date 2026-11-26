# Inventory & Warehouse Management Module Model

> **الحالة:** ✅ Approved / Closed
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **الغرض:** تحديد موقع Inventory & Warehouse Management داخل Teranoo ERP من حيث الاستقلالية والاعتماديات وحدود التكامل والتفعيل، دون الدخول في الوظائف التشغيلية التفصيلية.
> **مرجع البحث:** `../../01-market-research/03-inventory-module-architecture/02_INVENTORY_MODULE_ARCHITECTURE_RESEARCH.md`

---

## 1. تعريف Inventory & Warehouse Management داخل المنتج

Inventory & Warehouse Management هو أحد **Business Core Modules** في Teranoo ERP.

يعتمد في Phase 2 كـ **First-Class Sellable Module** قادر على العمل بصورة مستقلة عن Finance وProcurement وSales، مع اعتماده دائمًا على Mandatory Platform Foundation.

اسم الـModule التجاري الحالي يشمل **Inventory Core** وقدرات Warehouse الأساسية اللازمة لتشغيل المخزون عمليًا. أما حدود **Advanced WMS** وعمق وظائف Warehouse Execution فلا تُحسم هنا، بل تُحدد لاحقًا في Functional Blueprint وقرارات المنتج المناسبة.

هذا يعني أن اسم/تغليف `Inventory & Warehouse Management Module` يمكن أن يتطور أو يتفرع لاحقًا إذا أثبتت الدراسة الوظيفية أو السوقية ذلك، دون تغيير القرار الثابت بأن **Inventory Core هو مالك الكمية وحركات المخزون**.

لا تحدد هذه الوثيقة وظائف Inventory التفصيلية مثل أنواع الحركات، المواقع، الحجز، الالتقاط، التعبئة، الجرد، Lot/Serial، Costing Methods أو Barcode؛ هذه تؤجل إلى Phase 6.

---

## 2. مدى استقلالية Inventory

### النموذج المعتمد

- Inventory & Warehouse Management **Standalone-capable**.
- لا يوجد Hard Business Module Dependency على:
  - Finance
  - Procurement
  - Sales & Order Management
  - Manufacturing / Production
  - Projects
  - CRM
  - HCM / Payroll
- التكامل مع Business Modules الأخرى لا يحولها تلقائيًا إلى Dependencies.
- عند تشغيل سيناريو مشترك بين Inventory وأي Module آخر، يمكن أن يصبح **عقد التكامل الخاص بالسيناريو مطلوبًا** دون أن يصبح أحد الـModules شرطًا لتفعيل الآخر.

> **Module Dependency ≠ Integration Requirement**

---

## 3. ما يستطيع Inventory فعله عند تشغيله منفردًا

على المستوى المعماري فقط، يجب أن يستطيع Inventory العمل دون Finance أو Procurement أو Sales من خلال:

- امتلاك On-hand Quantity وسجل الحركات المخزنية الخاصة به.
- العمل داخل Company / Legal Entity context واضح.
- العمل داخل Storage Context واضح يمثل المكان الذي تُحفظ فيه الكمية.
- تنفيذ Inventory-originated movements التي لا تحتاج مرجعًا تجاريًا من Module آخر.
- دعم التحويلات والتسويات والجرد على مستوى المبدأ دون حسم أنواعها أو Workflow الخاص بها.
- تطبيق الصلاحيات والتدقيق والحوكمة المطلوبة.
- إنتاج تقارير الكميات والتوفر من خلال Reporting Infrastructure.
- الاحتفاظ بمعلومات تكلفة/قيمة تشغيلية عند الحاجة دون اشتراط وجود GL Posting.

**لا تحسم هذه النقاط أي Transaction Types أو شاشات أو خوارزميات أو Costing Methods.**

---

## 4. Platform Dependencies

هذه الوثيقة تعتمد **مبدأ الاحتياج** فقط، ولا تعتمد تصميم Platform Foundation التفصيلي.

### 4.1 Required Platform Capabilities

| Platform Capability | التصنيف | الملاحظة |
|---|---|---|
| Tenant Context | Required | كل بيانات Inventory تقع داخل Tenant معزول |
| Company / Legal Entity Context | Required | كل رصيد وحركة يجب أن يكون لهما مالك تنظيمي واضح |
| Users / Roles / Permissions | Required | الوصول والحركات يجب أن تكون مضبوطة بالصلاحيات |
| Audit Trail | Required | تاريخ الحركة والتغيير يجب أن يبقى قابلًا للتتبع |
| Shared Item / Product Master | Required | Inventory يستهلك تعريف صنف/منتج مشترك بدل إنشاء هوية مستقلة له |
| UOM Foundation | Required | Inventory يحتاج Units of Measure مشتركة مرتبطة بالمنتج |
| Inventory Storage Context | Required | يجب وجود سياق تخزين كمي؛ هل هو Warehouse/Location/Branch hierarchy يُحسم لاحقًا |
| Reporting Infrastructure | Required | عرض On-hand والحركة والتحليل يعتمد على بنية تقارير مشتركة |
| Configuration / Feature Management | Required | تفعيل السلوك والقدرات يجب أن يكون Configuration-Driven |
| Integration / API Framework | Required as Platform Availability | وجود الإطار إلزامي في المنصة، لكن التكامل الفعلي ليس شرطًا لتشغيل Inventory منفردًا |
| Localization Framework | Required as Platform Availability | المنصة قابلة للتوطين؛ الاستخدام الفعلي مشروط بالسوق |

### 4.2 Conditionally Required Platform Capabilities

| Platform Capability | متى يصبح مطلوبًا؟ |
|---|---|
| Branch / Operating Context | إذا اعتمد Phase 3 وجوده على مستوى الحركة أو الرصيد |
| Workflow / Approvals | عندما تتطلب عملية مخزنية موافقة أو فصل صلاحيات |
| Currency / Exchange Rates | عند استخدام Valuation أو تكامل مالي متعدد العملات |
| Tax Foundation | عبر سيناريوهات Sales/Procurement التي تحتاج Tax؛ ليست Dependency أصلية لتشغيل الكمية |
| Shared Party | عند وجود تكامل مع Customer/Supplier أو أطراف خارجية |
| Documents & Attachments | عندما تتطلب العملية أدلة أو مستندات مرفقة |

### 4.3 خارج هذه المرحلة

لا تُصمم هنا:
- Tenant / Company / Branch hierarchy
- Warehouse / Location hierarchy
- Permission model
- Workflow engine
- Product Master data model
- Currency / Tax frameworks
- Costing engine
- Integration execution model

---

## 5. Shared Item / Product Master Boundary

المبدأ المعتمد:

- **Product / Item Identity = Shared Platform Master Data.**
- Inventory لا يملك هوية مستقلة للصنف ولا يكرر Product Master داخل Module خاص به.
- Inventory يملك فقط **Inventory Context** المرتبط بالصنف، مثل المعلومات اللازمة لإدارته كمخزون عندما تُعتمد لاحقًا.
- Sales وProcurement وManufacturing وغيرها تملك سياقاتها الوظيفية الخاصة حول نفس Product Identity.

لا تحسم هذه الوثيقة:
- نموذج Product Master التفصيلي.
- Product vs Item terminology.
- UOM hierarchy.
- Sellable/Purchasable flags.
- Lot/Serial ownership.
- Cost attributes.

هذه التفاصيل تُدرس في Phase 5 وPhase 6.

---

## 6. حدود التكامل مع Business Core Modules

### 6.1 Inventory ↔ Finance

**Inventory يملك:**
- On-hand Quantity.
- Inventory movements.
- حالة المخزون والتوفر.
- البيانات التشغيلية اللازمة لفهم تكلفة/قيمة المخزون دون أن تعني ذلك ملكية GL.

**Finance يملك:**
- Financial Ledger.
- GL Posting.
- الأثر المالي المعتمد النهائي للحركات التي تتطلب Accounting.

**القاعدة المعتمدة:**
- Inventory لا يكتب مباشرة إلى GL.
- عند تفعيل التكامل المالي، تنتقل العواقب المالية عبر Contract/Posting Boundary معلنة.
- Costing / Valuation ليست محسومة كملكية حصرية لـInventory أو Finance؛ البحث يثبت نماذج مختلفة عالميًا، لذا تبقى **Shared / Boundary Candidate** حتى دراستها التفصيلية في مراحلها.
- Inventory-only يمكنه الاحتفاظ ببيانات تكلفة/قيمة تشغيلية دون اشتراط Financial Posting.

**نوع العلاقة المعتمد في هذه الدراسة:** `Conditional Integration Contract`.

### 6.2 Inventory ↔ Procurement

**Procurement يملك:**
- Purchase Requisition / Purchase Order وما يتعلق بقرار الشراء.
- العلاقات التجارية والتفاوضية مع المورد ضمن نطاقه.

**Inventory يملك:**
- الأثر الكمي الفعلي الناتج عن الاستلام عندما تدخل البضاعة إلى المخزون.
- On-hand الناتج عن الاستلام.
- الحركات المخزنية التي لا تحتاج PO عندما يسمح Functional Blueprint بذلك.

وجود Procurement ليس شرطًا لتشغيل Inventory.

**نوع العلاقة المعتمد في هذه الدراسة:** `Conditional Integration Contract` عندما يكون هناك Receipt against PO أو سيناريو مشترك مشابه.

### 6.3 Inventory ↔ Sales

**Sales يملك:**
- Sales Order والالتزام التجاري تجاه العميل.

**Inventory يملك:**
- On-hand والكمية المتاحة.
- الأثر الكمي الفعلي للصرف/الشحن عندما يدخل ضمن نطاق Inventory/Warehouse.
- **Physical Reservation Records** وفق القرار اللاحق D-SALES-06.

بقرار **D-SALES-06** اللاحق، تم حسم **Reservation Record Ownership = Inventory**. تبقى خوارزميات Soft/Hard Reservation وAllocation Priority وShipment orchestration التفصيلية مؤجلة إلى Phase 6.

وجود Sales ليس شرطًا لتشغيل Inventory.

**نوع العلاقة المعتمد في هذه الدراسة:** `Conditional Integration Contract`.

---

## 7. Inventory vs Warehouse Management Boundary

البحث العالمي يثبت أكثر من نموذج:
- أنظمة تفصل Inventory عن WMS كمنتج أو طبقة متقدمة.
- أنظمة تبقي Inventory وWarehouse modules داخل نفس SCM.
- أنظمة تدمجهما داخل تطبيق واحد.

لذلك لا نعتمد الآن نموذجًا تجاريًا جامدًا من ثلاث طبقات.

### المبدأ المعتمد لـ Teranoo ERP

1. **Inventory Core** يجب أن يبقى واضحًا كمالك للكمية وحركات المخزون.
2. **Warehouse Execution** هو نطاق تنفيذ فيزيائي يجب فصله مفاهيميًا عن Financial Posting، لكن حدود وظائفه داخل نفس Module تُحدد لاحقًا.
3. **Advanced WMS** لا يُفترض تلقائيًا أنه جزء إلزامي من Business Core؛ يمكن أن يصبح Feature Tier أو Add-on/Extension بعد دراسة الحاجة والقطاع الأول.

بهذا نثبت Boundary دون حسم Packaging أو Licensing أو Feature list مبكرًا.

**التزام حوكمي:** هذا القرار يثبت حدود المسؤوليات، لا الاسم التجاري النهائي ولا شكل التغليف التجاري. لذلك يمكن لاحقًا إعادة تسمية أو تفريع Warehouse capabilities دون إعادة فتح D-INV-07، ما دام Inventory Core يبقى مالك Book Stock والكمية وحركات المخزون.

---

## 8. Multi-Company / Multi-Branch Implications

Inventory يفرض على التصميم المستقبلي:
- أن يكون لكل رصيد مخزني Owner تنظيمي واضح.
- أن يكون النظام Multi-Company capable من البداية.
- ألا يفترض أن Tenant = Company واحدة.
- أن يدعم فصل التوفر والأرصدة حسب السياق التنظيمي المناسب.
- أن يعامل Cross-Company / Intercompany movements كقدرات صريحة وليس كسلوك مخفي.

ولا يُحسم هنا:
- هل Warehouse يتبع Company أو Branch واحدًا.
- هل Warehouse يمكنه خدمة عدة Branches أو Companies.
- Owner Dimension.
- Intercompany transfer design.
- In-transit model.

هذه القرارات تؤجل إلى Phase 3 وما بعده.

---

## 9. Costing & Valuation Boundary

البحث لا يدعم جعل Costing ملكًا حصريًا لـFinance أو Inventory في جميع الأنظمة.

لذلك تعتمد Phase 2 فقط الحدود التالية:

- **Quantity ownership = Inventory.**
- **Financial Ledger Posting ownership = Finance.**
- Inventory يمكن أن يحتفظ بمعلومات Cost / Value تشغيلية حتى بدون Finance إذا احتاج المنتج ذلك.
- Costing / Valuation calculation ownership والتفاصيل تبقى قرارًا لاحقًا.
- عند تفعيل Finance بعد فترة تشغيل Inventory-only، يلزم وجود آلية موثقة لبدء Financial Valuation من Current State، لكن طريقة Opening Valuation نفسها ليست قرار Phase 2.

**التزام صريح:** تأجيل Costing/Valuation ليس حذفًا للموضوع من التصميم؛ هو **Deferred Architecture Commitment** يجب حسمه في Phase 5/6 قبل اكتمال عقد التكامل المالي التفصيلي بين Inventory وFinance.

لا تُدرس هنا Costing Methods أو Periodic/Perpetual calculations أو Landed Cost أو Inventory Accounting.

---

## 10. Activation / Deactivation

### 10.1 Activation

لتفعيل Inventory يجب أن تكون Platform Foundation المطلوبة متاحة بالحد الأدنى، وبالأخص:
- Tenant Context
- Company / Legal Entity Context
- Shared Item / Product Master + UOM
- Inventory Storage Context
- Users / Roles / Permissions
- Audit
- Configuration / Feature Management

ولا يجب أن يتطلب Activation تفعيل:
- Finance
- Procurement
- Sales
- Manufacturing
- Advanced WMS

### 10.2 Deactivation

> **Deactivation = Freeze, not Delete**

بعد وجود أرصدة أو حركات:
- لا تُحذف البيانات التاريخية.
- لا يُسمح بحذف سجل مخزون له أرصدة أو Movement History بصورة تكسر Integrity.
- يجب أن يكون منع الحركات الجديدة منفصلًا عن الاحتفاظ بالبيانات والتاريخ.
- يجب أن تتوقف التكاملات التي تولد Inventory events أو تدخل حالة معلنة عند توقف Inventory.

وتؤجل تفاصيل:
- License Deactivation
- Read-Only access
- Archive
- Retention
- Reactivation

إلى مراحلها المناسبة.

---

## 11. الاستبعادات الصريحة

هذه الوثيقة لا تحدد:
- Item setup details
- Warehouse / Location setup
- Stock transaction types التفصيلية
- Picking / Packing / Putaway
- Reservation / Allocation logic
- Replenishment
- Cycle Count / Physical Inventory process
- Lot / Serial workflows
- Barcode / Mobile execution
- Costing Methods
- Landed Cost
- Detailed Inventory Accounting
- Advanced WMS functionality
- Database Schema
- API implementation
- UI/UX
- Source Code

---

## 12. القرارات المفتوحة والمؤجلة

هذه النقاط لا تعيد فتح Inventory في Phase 2 إلا إذا ظهر لاحقًا تعارض جوهري موثق:

1. المصطلحات الرسمية العامة للـDependencies — بعد دراسة Business Core الأربع.
2. Historical access بعد انتهاء الترخيص.
3. Branch / Warehouse relationship — Phase 3.
4. Shared Warehouse / Owner Dimension — Phase 3 أو مرحلة لاحقة.
5. **Costing / Valuation ownership التفصيلي — Deferred Architecture Commitment في Phase 5/6.**
6. Reservation Record Ownership حُسم لاحقًا في D-SALES-06 لصالح Inventory؛ Soft/Hard Reservation وAllocation algorithms — Phase 6.
7. Real-Time vs Event-driven vs Batch — Phase 5 Integration/API.
8. Advanced WMS packaging/licensing — بعد Primary Launch Market وقبل/أثناء Functional Blueprint.
9. Opening Valuation mechanics إذا فُعّل Finance لاحقًا — Phase 6/Implementation design.

---

## 13. القرارات المعتمدة

### D-INV-01 — Standalone Inventory & Warehouse Management
Inventory & Warehouse Management هو **First-Class Sellable Standalone Module** قابل للتفعيل والتشغيل الأساسي دون Finance أو Procurement أو Sales.

**حد القرار:** لا يعني أن Advanced WMS جزء إلزامي من الـModule؛ عمق Warehouse capabilities يُحدد لاحقًا.

### D-INV-02 — No Hard Business Module Dependency
Inventory لا يحتاج Finance أو Procurement أو Sales أو أي Business Module آخر لكي يتم تفعيله وتشغيله الأساسي.

### D-INV-03 — Platform-Based Dependency
Dependencies الإلزامية لـInventory تأتي من Platform Foundation، مع Required وConditionally Required.

**حد القرار:** هذا يعتمد مبدأ الاحتياج ولا يعتمد تصميم Platform Foundation التفصيلي أو Hierarchy التخزين.

### D-INV-04 — Conditional Integration Boundaries
التكامل مع Finance وProcurement وSales لا يجعلها Hard Dependencies، وIntegration Contract يصبح مطلوبًا فقط للسيناريو المشترك الذي يحتاجه، وليس شرطًا لتفعيل Inventory.

### D-INV-05 — Shared Item / Product Identity
Product / Item Identity جزء من Shared Platform Master Data وليس ملكية حصرية لـInventory.

**حد القرار:** Inventory يملك Inventory Context فقط؛ نموذج Product Master التفصيلي يؤجل إلى Phase 5/6.

### D-INV-06 — Quantity vs Financial Posting Boundary
Inventory يملك Quantity وInventory Movements، بينما Finance يملك Financial Ledger Posting.

- لا كتابة مباشرة إلى GL من Inventory.
- Inventory يمكن أن يحتفظ بمعلومات Cost/Value تشغيلية بدون Finance.
- لا يحسم هذا القرار ملكية Costing/Valuation calculation؛ تبقى مؤجلة كالتزام معماري صريح يجب حسمه في Phase 5/6.

### D-INV-07 — Warehouse Layering Principle
اعتماد الفصل المفاهيمي بين:
- Inventory Core
- Warehouse Execution
- Advanced WMS

**حد القرار:** لا يعتمد الآن Packaging أو Licensing أو Feature List أو حتى كون Advanced WMS Module مستقلًا؛ فقط يمنع خلط Book Stock وPhysical Execution وAdvanced WMS في طبقة واحدة غير منضبطة. ويمكن أن يتطور الاسم التجاري أو التغليف لاحقًا دون تغيير ملكية Inventory Core للكمية وحركات المخزون.

### D-INV-08 — Safe Deactivation Principle
اعتماد **Freeze, not Delete** بعد وجود أرصدة/حركات، مع منع الحذف الفيزيائي الذي يكسر التاريخ أو Integrity.

تفاصيل Read-Only / Archive / Retention / License policy تؤجل.

---

## 14. قرار الإغلاق

تم اعتماد D-INV-01 إلى D-INV-08 وإغلاق دراسة **Inventory & Warehouse Management Module Architecture & Dependencies** ضمن Phase 2.

الأسئلة المؤجلة في القسم 12 تبقى التزامات للمراحل المحددة ولا تعيد فتح هذه الدراسة ما لم يظهر لاحقًا تعارض جوهري موثق.

**ملاحظة مزامنة لاحقة:** القرار D-SALES-06 حسم `Reservation Record Ownership = Inventory` دون إعادة فتح بقية قرارات Inventory أو حسم خوارزميات الحجز/التخصيص.

**الحالة النهائية:** ✅ Approved / Closed
