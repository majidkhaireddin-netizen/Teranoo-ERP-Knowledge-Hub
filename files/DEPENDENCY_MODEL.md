# Teranoo ERP — Dependency Model & Governance

> **الحالة:** ✅ Approved / Phase 2
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **تاريخ الاعتماد:** 2026-09-09
> **الغرض:** تعريف الأنواع الرسمية للاعتماديات في Teranoo ERP، وحدود إنفاذها، وقواعد الحوكمة التي تمنع تحول التكامل أو مشاركة البيانات إلى Hard Dependencies غير مقصودة.

---

## 1. القاعدة العليا

> **الأصل أن كل Business Module مستقل في التفعيل، ولا يصبح Business Module آخر شرطًا عليه إلا بقرار Hard Business Module Dependency صريح ومعتمد. أما التكامل أو البيانات المشتركة أو اعتماد Feature معينة فلا يحول تلقائيًا إلى اعتماد على مستوى الـModule.**

وبالإنجليزية:

> **A Business Module is independently activatable unless an explicitly approved Hard Business Module Dependency says otherwise. Integration requirements, shared data usage, and feature dependencies do not by themselves create module-level activation dependencies.**

ثلاث قواعد حاكمة:

1. **No implicit HBMD.**
2. **HBMD graph must remain acyclic.**
3. **Data ownership and integration do not create module dependency by themselves.**

---

## 2. الأنواع الرسمية للاعتماديات

تعتمد Teranoo ERP أربعة أنواع فقط:

| Code | النوع | الغرض | هل يمنع Module Activation؟ |
|---|---|---|---|
| `PCD` | Platform Capability Dependency | اعتماد Module على قدرة من Platform / Shared Business Foundation | أحيانًا، حسب Required/Conditional |
| `HBMD` | Hard Business Module Dependency | اعتماد Business Module على Business Module آخر لتفعيله أو تشغيل قدرته الأساسية | نعم |
| `CIC` | Conditional Integration Contract | عقد تكامل مطلوب لتنفيذ Business Scenario مشترك بين Modules مستقلة | لا على مستوى Module؛ قد يمنع السيناريو |
| `FLD` | Feature-Level Dependency | اعتماد Feature محددة على Module/Capability أخرى | لا على مستوى Module؛ يمنع الـFeature فقط |

لا تعتمد Teranoo أنواعًا مستقلة باسم:
- Soft Dependency
- Optional Dependency
- Data Dependency
- Process Dependency

يتم التعبير عن هذه الحالات من خلال الأنواع الأربعة مع Usage / Enforcement semantics واضحة.

---

## 3. `PCD` — Platform Capability Dependency

### التعريف

اعتماد Business Module على قدرة موجودة في **Mandatory Platform Foundation** أو **Shared Business Foundation**، وليس على Business Module آخر.

أمثلة:
- Sales → Shared Customer / Party Identity.
- Inventory → Shared Product / Item Master.
- Finance → Fiscal Calendar / Base Currency Foundation.
- Procurement → Users / Roles / Permissions / Audit.

### التصنيف

#### `Required`
القدرة يجب أن تكون متاحة ومهيأة لتفعيل أو تشغيل القدرة الأساسية للـModule.

#### `Conditionally Required`
القدرة تصبح مطلوبة فقط إذا تم تفعيل Scenario / Feature / Policy يحتاجها.

#### `Optional`
قدرة محسنة يمكن استخدامها دون أن تكون شرطًا للقدرة الأساسية أو للسيناريو المحدد.

### Enforcement Scope

- `PCD: Required` → **Module Activation / Configuration Validation**.
- `PCD: Conditionally Required` → **Feature or Scenario Activation / Runtime Readiness**.
- `PCD: Optional` → لا يمنع التشغيل الأساسي.

### قاعدة

وجود Shared Platform Data أو Shared Service لا يعني أن أي Business Module يملكها حصريًا.

---

## 4. `HBMD` — Hard Business Module Dependency

### التعريف

يوجد HBMD فقط عندما يكون Business Module آخر شرطًا صريحًا لتفعيل أو تشغيل **القدرة الأساسية المعتمدة** للـModule التابع.

إذا كان:

`A → B = HBMD`

فهذا يعني أن Teranoo لا يسمح بتفعيل A دون B.

### Enforcement Scope

يُفرض HBMD عند:
- Module Activation.
- Licensing validation عندما يرتبط الترخيص بالتفعيل.
- Deployment / provisioning validation عند الحاجة.
- Control Plane dependency validation.

### قاعدة منع HBMD غير الصريح

> **لا يوجد HBMD ضمني في Teranoo ERP.**

لا يجوز استنتاج HBMD من أي من الآتي وحده:
- Foreign Key.
- API call.
- Package / library reference.
- Event subscription.
- Shared database object.
- UI navigation.
- Shared master data.
- Business process flow.
- Integration requirement.

أي HBMD جديد يجب أن يحتوي على الأقل:
- Decision ID.
- Dependent Module.
- Required Module.
- Business justification.
- Why PCD/CIC/FLD is insufficient.
- Activation impact.
- Deactivation impact.
- Approval status.

### منع الدورات

> **HBMD graph MUST be acyclic.**

ممنوع:
- `A → B` و`B → A`.
- أي دورة أطول مثل `A → B → C → A`.

إذا ظهر احتياج دائري، يجب إعادة تقييم الحدود معماريًا عبر أحد الحلول:
- نقل Capability إلى Platform Foundation.
- إنشاء Shared Capability / Shared Service مناسب.
- تحويل العلاقة إلى CIC.
- إعادة تعريف Feature كـFLD.
- تصحيح Module Boundary.

### حالة Business Core الحالية

حتى نهاية دراسات Finance / Inventory / Procurement / Sales:

> **لا يوجد أي HBMD معتمد بين Business Core Modules الأربعة.**

---

## 5. `CIC` — Conditional Integration Contract

### التعريف

عقد تكامل بين Modules مستقلة في التفعيل، يصبح مطلوبًا فقط عند تنفيذ **Business Scenario مشترك** يحتاج تعاونها.

مثال:
- Procurement مستقل عن Inventory.
- لكن `Receipt against PO into stock` يحتاج Procurement ↔ Inventory CIC.

### Enforcement Scope

يُفرض CIC عند:
- Scenario readiness validation.
- Integration readiness.
- Runtime execution للسيناريو المشترك.

عدم توفر CIC لا يمنع تفعيل الـModules المشاركة، لكنه يمنع أو يوقف **السيناريو الذي يعتمد عليه** بحالة معلنة وقابلة للتدقيق.

### Usage Semantics

#### `Required for Scenario`
لا يمكن تنفيذ السيناريو المعتمد بدون العقد.

#### `Optional Enhancement`
التكامل يحسن السيناريو أو الأتمتة لكنه ليس شرطًا لصحة العملية الأساسية المعتمدة.

لا تُستخدم عبارة `Optional Dependency`؛ الاختيارية صفة لاستخدام CIC وليست Dependency Type جديدة.

### Minimum CIC Metadata

كل CIC معتمد يجب أن يحتوي على الأقل:

1. `Contract ID`
2. `Participating Modules`
3. `Business Scenario`
4. `Trigger / Initiator`
5. `Source Owner`
6. `Target Owner`
7. `Business Object / Data References`
8. `Required Preconditions`
9. `Expected Outcome`
10. `Failure / Unavailable Behavior`
11. `Idempotency / Duplicate Handling Principle`
12. `Audit Requirement`
13. `Activation Condition`
14. `Version`
15. `Contract Owner`
16. `Status`

### خارج Phase 2

لا يحدد CIC في هذه المرحلة:
- Endpoint URLs.
- Payload schemas.
- Message broker technology.
- Transport protocol.
- Retry timings.
- Authentication implementation.
- API implementation details.

هذه تُدرس في Phase 5 وما بعدها.

---

## 6. `FLD` — Feature-Level Dependency

### التعريف

اعتماد **Feature محددة** داخل Module على Module أو Capability أخرى، مع بقاء الـModule الأساسي مستقلًا.

أمثلة:
- `Sales.DropShip → Procurement`.
- `Sales.StockFulfillment → Inventory`.
- `Sales.CustomerBilling → Finance` عندما يتطلب السيناريو Finance.
- `Sales.MakeToOrder → Manufacturing` مستقبلًا.
- `Procurement.ThreeWayMatch → Procurement + Receipt capability + Finance` وفق النموذج الذي سيُعتمد لاحقًا.

### Enforcement Scope

يُفرض FLD عند:
- Feature Activation.
- Feature configuration validation.
- Feature execution readiness.

إذا لم تتوفر الاعتمادية:
- يُمنع تفعيل الـFeature أو تشغيلها.
- لا يُمنع تشغيل الـModule الأساسي.

---

## 7. الفصل الرسمي بين FLD وCIC

### FLD يجيب عن:

> **ما الذي تحتاجه Feature لكي تصبح متاحة أو قابلة للتشغيل؟**

### CIC يجيب عن:

> **كيف تتعاون Modules مستقلة لتنفيذ Business Scenario مشترك؟**

يمكن أن يظهرا معًا في نفس السيناريو.

مثال `Drop Ship`:

- `FLD`: Sales.DropShip يحتاج Procurement.
- `CIC`: Sales ↔ Procurement يحدد عقد تنفيذ Drop Ship.

إذن:

> **FLD = Availability Dependency**
>
> **CIC = Execution / Integration Contract**

ولا يجوز دمجهما في نوع واحد.

---

## 8. Enforcement Scope — ملخص رسمي

| النوع | Enforcement Scope الرئيسي | ما الذي يُمنع عند عدم توفره؟ |
|---|---|---|
| `PCD Required` | Module Activation / Configuration | Module capability الأساسية |
| `PCD Conditional` | Feature/Scenario activation | Feature أو Scenario |
| `HBMD` | Control Plane / Module Activation / Licensing | Module التابع بالكامل |
| `CIC` | Scenario / Integration Readiness / Runtime | السيناريو المشترك فقط |
| `FLD` | Feature Activation / Execution | Feature فقط |

أي Enforcement جديد يجب أن يصرح بنطاقه؛ لا يجوز توسيع أثره تلقائيًا من Feature/Scenario إلى Module-level activation.

---

## 9. Data Ownership Metadata — مستقل عن Dependency Types

### القاعدة

> **Data Ownership ليست Dependency Type.**

كون Module ما يملك Business Object وتستهلكه Modules أخرى لا يخلق HBMD أو CIC تلقائيًا.

مثال:
- Sales Order Owner = Sales.
- Inventory / Finance / Procurement قد تكون Reference Consumers حسب السيناريو.
- هذا لا يجعل Inventory أو Finance أو Procurement dependent على Sales لتفعيل Modules الخاصة بها.

### Metadata المقترحة

عند توثيق Business Object أو Shared Identity يمكن استخدام:

- `Business Object / Identity`
- `System of Record / Owner`
- `Context Owner`
- `Reference Consumers`
- `Mutation Authority`
- `Read Authority`
- `Lifecycle Authority`
- `Source of Truth`
- `Shared Identity?`
- `Cross-Module Contract Required?`

### أمثلة معتمدة من Core

- Product / Item Identity = Shared Platform Master Data.
- Customer / Supplier Party Identity = Shared Platform Party Data.
- Sales Order = Sales-owned document.
- Purchase Order = Procurement-owned document.
- On-hand / Inventory Movements / Reservation Record = Inventory-owned.
- Financial Ledger Posting = Finance-owned.

هذه Ownership Boundaries مستقلة عن Dependency Taxonomy.

---

## 10. قواعد الحوكمة

1. **Module Dependency ≠ Integration Requirement.**
2. **No implicit HBMD.**
3. **HBMD must be explicitly approved.**
4. **HBMD graph must remain acyclic.**
5. **Shared data does not create module dependency.**
6. **Data ownership does not create module dependency.**
7. **CIC does not create activation dependency.**
8. **FLD must never be promoted to HBMD merely because the Feature is commercially important.**
9. **Required/Conditional/Optional are semantics, not additional Dependency Types.**
10. **Any future Business Module must be evaluated against this model before approval.**
11. **Any implementation artifact that appears to create a stronger dependency than the approved model is an architecture defect until explicitly reviewed and approved.**
12. **Control Plane enforcement must reflect approved dependency metadata, not infer relationships from code structure.**

---

## 11. تطبيق النموذج على Business Core الحالي

### Finance
- No HBMD on Inventory / Procurement / Sales.
- Uses PCDs for Platform Foundation.
- Uses CICs for shared financial scenarios.

### Inventory & Warehouse Management
- No HBMD on Finance / Procurement / Sales.
- Uses PCDs for Shared Product/UOM/Storage Context and Platform capabilities.
- Uses CICs for receipts, stock sales and financial integration scenarios.

### Procurement
- No HBMD on Finance / Inventory / Sales.
- Uses PCDs for Supplier/Party and Platform capabilities.
- Uses CICs for stock receipt / Finance / cross-module scenarios.
- Uses FLDs for Drop Ship / project / manufacturing-related procurement features where applicable.

### Sales & Order Management
- No HBMD on Finance / Inventory / Procurement / CRM.
- Uses PCDs for Customer/Party, Product/Service, UOM and Platform capabilities.
- Uses CICs for stock fulfillment, billing/finance, drop ship and future cross-module scenarios.
- Uses FLDs for Stock Sale, Drop Ship, Credit Check, MTO and similar features.

---

## 12. قرار Phase 2

تعتمد Teranoo ERP رسميًا الأنواع الأربعة التالية فقط:

1. `PCD — Platform Capability Dependency`
2. `HBMD — Hard Business Module Dependency`
3. `CIC — Conditional Integration Contract`
4. `FLD — Feature-Level Dependency`

وتعتمد معها رسميًا:
- Enforcement Scope.
- منع HBMD غير الصريح.
- منع HBMD Cycles.
- Minimum CIC Metadata.
- الفصل الرسمي بين FLD وCIC.
- استقلال Data Ownership Metadata عن Dependency Types.
- Required / Conditionally Required / Optional كـsemantics لا كأنواع إضافية.

**الحالة:** ✅ Approved

**العمل التالي:** بناء `MODULE_DEPENDENCY_MATRIX` للـBusiness Core الأربعة وفق هذا النموذج.