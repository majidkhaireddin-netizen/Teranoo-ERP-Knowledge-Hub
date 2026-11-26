# Phase 2 Assumption Safety Review

> **الحالة:** ✅ Completed / PASS with Guardrails
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **الغرض:** التحقق من أن Module Models الأربعة المعتمدة لم تتسلل منها افتراضات غير معتمدة تخص Tenant / Multi-Company / Multi-Branch / Shared Master Data / Organizational Ownership قبل الانتقال إلى Phase 3.
> **تاريخ المراجعة:** 2026-09-09

---

## 1. نطاق المراجعة

تمت مراجعة الملفات المعتمدة التالية:

1. `../03-modules/finance/FINANCE_MODULE_MODEL.md`
2. `../03-modules/inventory/INVENTORY_MODULE_MODEL.md`
3. `../03-modules/procurement/PROCUREMENT_MODULE_MODEL.md`
4. `../03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md`

تركز المراجعة على سؤال واحد:

> هل اعتمد أي Module في Phase 2 نموذجًا تنظيميًا أو Tenancy/Master-Data structure يفترض نتيجة يفترض أن تُحسم فقط في Phase 3 أو Phase 5؟

هذه المراجعة لا تعيد دراسة استقلالية الـModules ولا وظائفها التفصيلية.

---

## 2. النتيجة التنفيذية

**النتيجة: PASS with Guardrails.**

- **0** قرارات تحتاج Reopen.
- **0** تعارضات جوهرية بين Module Models ومرحلة Phase 3 المستقبلية.
- **1** ملاحظة مزامنة توثيقية تم إصلاحها: Inventory كان ما يزال يذكر أن Reservation ownership غير محسومة، بينما D-SALES-06 حسم لاحقًا `Reservation Record Ownership = Inventory`.
- جميع القرارات التنظيمية الثقيلة بقيت مؤجلة في أماكنها الصحيحة.

لا يوجد سبب لإعادة فتح Finance أو Inventory أو Procurement أو Sales.

---

## 3. نتائج المراجعة حسب Module

### 3.1 Finance — SAFE

المراجعة أكدت أن Finance:

- يطلب `Company / Legal Entity Context` كمالك واضح للمعاملة، لكنه **لا يحدد** Tenant→Company cardinality أو hierarchy.
- ينص صراحةً أن `Tenant ≠ Company واحدة` كافتراض.
- يجعل Branch capability مطلبًا مستقبليًا دون حسم هل Branch كيان محاسبي أو reporting/operating dimension.
- لا يحسم Consolidation / Intercompany / Cross-Company behavior.
- لا يحسم Tax/Currency frameworks أو Shared Party model.
- لا يحتوي قرارًا بأن Chart of Accounts موحد على مستوى Tenant أو منفصل لكل Company.

**الحكم:** لا يوجد افتراض سابق لأوانه يقيّد Phase 3.

### 3.2 Inventory & Warehouse Management — SAFE after documentation sync

المراجعة أكدت أن Inventory:

- يطلب Organizational Owner واضح لكل رصيد/حركة، لكنه لا يقرر شكل هذا الـOwner.
- لا يفترض أن Tenant = Company واحدة.
- لا يحسم علاقة Warehouse مع Company أو Branch.
- يترك Shared Warehouse / Owner Dimension / Intercompany transfers مؤجلة.
- يستخدم `Inventory Storage Context` كمطلب مفاهيمي فقط، دون فرض Warehouse/Location/Branch hierarchy.
- Shared Product/Item يعني **هوية مشتركة على مستوى المنصة**، ولا يقرر Scope المشاركة بين Companies.

**ملاحظة المزامنة:**
تم تحديث الوثيقة لتتوافق مع القرار اللاحق D-SALES-06:

> `Reservation Record Ownership = Inventory`

مع بقاء Soft/Hard Reservation وAllocation algorithms وShipment orchestration مؤجلة إلى Phase 6.

**الحكم:** لا Reopen مطلوب.

### 3.3 Procurement — SAFE

المراجعة أكدت أن Procurement:

- يطلب `Company / Legal Entity Context` دون فرض Purchasing Organization hierarchy.
- يجعل Branch / Business Unit / Operating Context مشروطًا بنتيجة Phase 3.
- Shared Supplier/Party Identity لا تعني أن المورد global across all Companies؛ تعني فقط عدم تكرار الهوية داخل Business Modules.
- لا يحسم Supplier Sites أو financial/commercial scoping النهائي.
- لا يحسم delivery/storage organization model.
- لا يحسم Intercompany / centralized procurement architecture.

**الحكم:** لا يوجد افتراض يعطل Phase 3.

### 3.4 Sales & Order Management — SAFE

المراجعة أكدت أن Sales:

- يطلب Company/Legal Entity owner واضح للـSales Order دون تعريف Sales Organization hierarchy.
- ينص صراحةً أن Tenant لا يفترض Company واحدة.
- يسمح Shared Customer Identity مع Company-specific contexts دون تقرير شكل الـsharing النهائي.
- Branch / Business Unit / Sales Channel تبقى سياقات محتملة حسب Phase 3.
- Warehouse/Site reference لا تعني ownership أو hierarchy.
- Centralized Sales / Cross-Company Fulfillment / Intercompany Sales مؤجلة.
- Shared Product/Service Identity لا يقرر tenant-global vs company-specific catalog policy.

**الحكم:** لا يوجد افتراض تنظيمي سابق لأوانه.

---

## 4. Guardrails ملزمة لـ Phase 3 وما بعده

### G-ASSUMP-01 — Shared ≠ Tenant-Global by default

مصطلحات:
- Shared Party Identity
- Shared Product / Item Identity
- Shared Supplier / Customer Identity

تعني أن الهوية والخدمة المشتركة لا تُكرر داخل كل Module.

**لا تعني تلقائيًا** أن كل Record مشترك بين جميع Companies داخل Tenant.

Scope المشاركة — Tenant-wide / Company-specific / hybrid — قرار Phase 3/5.

### G-ASSUMP-02 — Company / Legal Entity Context ≠ Organizational Model

اشتراط أن كل معاملة/رصيد/مستند له Company أو Legal Entity owner واضح هو **Integrity requirement** فقط.

لا يحدد:
- عدد Companies داخل Tenant.
- hierarchy بينها.
- Parent/Subsidiary model.
- consolidation model.
- intercompany mechanics.

### G-ASSUMP-03 — Tenant = Logical Product Boundary, not Deployment Decision

وجود `Tenant Context` في جميع Module Models يعني logical isolation/context داخل المنتج.

لا يحسم:
- هل SaaS يشغل عدة Tenants على deployment واحد.
- هل On-Premises يشغل Tenant واحدًا فقط.
- database-per-tenant vs schema/shared database.

هذه القرارات لمرحلة Phase 3/4.

### G-ASSUMP-04 — Branch / BU / Warehouse / Site hierarchy remains open

لا يوجد قرار حالي يثبت أن:
- Warehouse يتبع Branch واحدًا.
- Branch يملك المخزون.
- Branch كيان قانوني أو محاسبي.
- Business Unit يعادل Branch.
- Site يعادل Warehouse.

يجب أن يحسم Phase 3 المصطلحات والعلاقات قبل أن تعتمد Functional Blueprints عليها.

### G-ASSUMP-05 — Financial and Shared-Master scoping remains open

Phase 2 لا يحسم Scope التنظيمي النهائي لـ:
- Chart of Accounts.
- Fiscal Calendar / Accounting Periods.
- Currency configuration.
- Tax configuration.
- Customer/Supplier contexts.
- Product catalog / item release.
- Price lists.

وجود Foundation أو Context مطلوب لا يعني اختيار Scope نهائي.

### G-ASSUMP-06 — Cross-Company / Intercompany are explicit capabilities

لا يجوز افتراض أن Multi-Company يعني تلقائيًا:
- cross-company stock availability.
- centralized purchasing.
- centralized sales.
- intercompany billing.
- cross-company fulfillment.
- shared warehouse ownership.

أي قدرة من هذه يجب أن تُعتمد صراحةً في مرحلتها.

### G-ASSUMP-07 — Module ownership boundaries survive organizational design

قرارات الملكية التالية تبقى ثابتة مهما كان نموذج Phase 3، إلا إذا ظهر تعارض جوهري موثق:

- Finance → Financial Ledger Posting.
- Inventory → Quantity / Inventory Movements / Reservation Records.
- Procurement → Purchase Order / commercial procurement commitment.
- Sales → Sales Order / commercial sales commitment.
- Shared Platform → Party/Product identity foundations.

Phase 3 يحدد **أين وفي أي organizational context** تعيش هذه البيانات، وليس تغيير مالك الـDomain دون سبب جوهري.

---

## 5. عناصر يجب أن يجيب عنها Phase 3

هذه ليست Gaps في Phase 2؛ هي Hand-off requirements إلى Phase 3:

1. تعريف Tenant كـlogical business/product boundary.
2. Tenant → Company cardinality.
3. Company / Legal Entity terminology and relationship.
4. Multi-Branch model.
5. Branch vs Business Unit vs Site vs Warehouse boundaries.
6. Shared vs Company-specific Master Data policy.
7. Customer/Supplier/Product identity sharing scope.
8. Warehouse ownership / service scope / Owner Dimension.
9. User/Role access boundaries across Companies/Branches.
10. Organizational scoping for fiscal calendar/currency/tax/configuration.
11. Rules for centralized vs company-specific operations.
12. Intercompany capability boundaries.

---

## 6. Mandatory Backward Compatibility Check after Phase 3

بعد اعتماد Phase 3، يجب تنفيذ:

> **Phase 3 Backward Compatibility Check**

ويتم فيه مقارنة النموذج التنظيمي المعتمد مع Module Models الأربعة.

قاعدة المراجعة:
- إذا لم يظهر تعارض: تستمر القرارات دون إعادة فتح.
- إذا ظهر تعارض: يُفتح **القرار المتأثر فقط**.
- لا تُعاد Phase 2 كاملة بسبب تفصيل تنظيمي واحد.

---

## 7. قرار الإغلاق

**Phase 2 Assumption Safety Review = ✅ PASS / Completed.**

لا يوجد قرار معماري من Module Models الأربعة يمنع الانتقال إلى استكمال بقية Phase 2.

الخطوة التالية الرسمية:

1. تحديد **Dependency Taxonomy / Dependency Model** الرسمي في Teranoo ERP.
2. تحديد Required vs Optional / Conditional Integration semantics.
3. بناء **Module Dependency Matrix**.
4. توحيد قواعد Activation / Deactivation وتأثير Modules المستقبلية.
5. Final Phase 2 Review & Closure.

لا يبدأ Phase 3 قبل إغلاق هذه البنود.