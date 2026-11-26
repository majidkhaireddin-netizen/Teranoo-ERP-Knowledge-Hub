# Teranoo ERP — Future Module Extension & Core Impact Rules

> **الحالة:** ✅ Approved / Phase 2
> **المرحلة:** Phase 2 — Module Architecture & Dependency Rules
> **تاريخ الاعتماد:** 2026-09-09
> **المراجع الحاكمة:** `DEPENDENCY_MODEL.md`, `MODULE_DEPENDENCY_MATRIX.md`, `MODULE_LIFECYCLE_RULES.md`
> **الغرض:** منع إضافة Enterprise Modules أو Industry Extensions مستقبلًا بطريقة تكسر استقلالية Business Core أو تنشئ Dependencies ضمنية أو تعيد توزيع Data Ownership دون قرار معماري صريح.

---

## 1. القاعدة العليا

> **إضافة Module جديد توسّع المنتج، لكنها لا تعيد تعريف Business Core أو تجعله معتمدًا على الـModule الجديد ضمنيًا.**

أي تغيير في Dependency أو Ownership قائم يجب أن يكون قرارًا صريحًا ومبررًا، لا نتيجة جانبية للتنفيذ.

---

## 2. متطلبات أي Business Module جديد

قبل اعتماد Module جديد يجب أن يملك Module Model يحدد على الأقل:

1. Purpose / Boundary على مستوى Architecture.
2. Standalone capability أو سبب عدم الاستقلال.
3. `PCD` المطلوبة والمشروطة.
4. أي `HBMD` مقترحة مع Decision ID وتبريرها.
5. `CIC` مع Modules الأخرى حسب السيناريوهات المشتركة.
6. `FLD` على مستوى Features.
7. Data Ownership / Source of Truth / Reference Consumers.
8. Activation / Deactivation behavior وفق `MODULE_LIFECYCLE_RULES.md`.
9. أثره على Module Dependency Matrix.
10. Deferred Architecture Commitments إن وجدت.

لا يجوز الانتقال إلى التنفيذ بينما علاقة الـModule بالـCore غير مصنفة.

---

## 3. Core Ownership Guardrails

الملكيات التالية لا تُنقل إلى Module جديد دون Architecture Decision صريح يعيد فتح القرار المتأثر فقط:

- **Finance:** Financial Ledger Posting والأثر المالي النهائي.
- **Inventory:** On-hand, Inventory Movements, Reservation Record.
- **Procurement:** Purchase Order والقرار التجاري بالشراء.
- **Sales:** Sales Order والالتزام التجاري البيعي وSales Order lifecycle/coordination intent.
- **Shared Platform:** Product/Item Identity وParty Identity وفق النماذج المعتمدة.

Module جديد يمكن أن يستهلك References أو يطلق Requests/Events، لكنه لا يكتسب Mutation Authority على Domain مملوك لغيره تلقائيًا.

---

## 4. No Core Back-Dependency by Accident

إضافة CRM أو Manufacturing أو Projects أو HCM أو EAM أو أي Module آخر لا يجوز أن تجعل Finance/Inventory/Procurement/Sales تعتمد عليه في Base Activation إلا إذا تم اعتماد `HBMD` صريح لاحقًا.

أمثلة:
- إضافة CRM لا تجعل Sales Order Management يحتاج CRM لتفعيله.
- إضافة Manufacturing لا تجعل Inventory Core يحتاج Manufacturing.
- إضافة Projects لا تجعل Procurement الأساسي يحتاج Projects.
- إضافة HCM/Payroll لا تجعل Finance الأساسي يعتمد عليهما.

التكامل التجاري القوي لا يساوي HBMD.

---

## 5. Dependency Classification Requirement

كل علاقة جديدة يجب تصنيفها رسميًا باستخدام الأنواع الأربعة فقط:

- `PCD`
- `HBMD`
- `CIC`
- `FLD`

لا يُسمح بإدخال أنواع موازية مثل Soft Dependency أو Data Dependency لتجاوز قواعد الحوكمة.

### HBMD

أي HBMD جديد:
- يجب أن يكون صريحًا ومعتمدًا.
- يجب إثبات أن PCD/CIC/FLD غير كافية.
- يجب أن يحافظ على HBMD graph acyclic.
- يجب تحليل أثر activation/deactivation.

---

## 6. Shared Capability Extraction Rule

إذا ظهر أن عدة Modules تحتاج Capability مشتركة، فلا يجوز تكرارها داخل كل Module ثم ربطها بعلاقات دائرية.

يجب تقييم أحد الاتجاهات:

1. Shared Platform Capability.
2. Shared Business Foundation capability.
3. Dedicated shared service/component إذا كان ذلك مناسبًا لاحقًا.
4. CIC منضبط إذا كانت الملكية تبقى في Domain محدد.

القرار التفصيلي لمكان القدرة يُتخذ في مرحلته المناسبة، لكن **التكرار الذي يخلق Ownership ambiguity ممنوع معماريًا**.

---

## 7. Integration Contract Evolution

عند إضافة Module جديد أو توسيع Scenario قائم:

- لا يجوز الكتابة المباشرة إلى بيانات Module آخر بدل CIC/approved boundary.
- يجب تحديث/إضافة CIC عند وجود Cross-Module Scenario.
- CIC له Version وStatus وفق `DEPENDENCY_MODEL.md`.
- لا يجوز كسر Contract قائم بصورة صامتة.
- أي تغيير غير متوافق يجب أن يملك Migration/Compatibility decision في مرحلة Integration design.

تفاصيل API/versioning التقنية تؤجل إلى Phase 5 وما بعدها.

---

## 8. Feature Extension Rule

Feature جديدة داخل Module قائم أو جديد:

- إذا احتاجت Module/Capability أخرى، تسجل `FLD`.
- إذا نفذت Scenario مشتركًا، تسجل CIC مناسبًا أيضًا.
- أهمية الـFeature تجاريًا لا تبرر تحويلها إلى HBMD على مستوى الـModule.
- Feature غير الجاهزة لا تسقط Base Module ما لم يوجد قرار HBMD مستقل وصريح.

---

## 9. Data Ownership Evolution

أي Business Object جديد يجب أن يحدد:

- Owner / System of Record.
- Mutation Authority.
- Lifecycle Authority.
- Reference Consumers.
- Shared Identity relationship.
- Cross-Module Contract requirements.

إذا تعارض Object جديد مع Ownership قائم، لا يُحل التعارض بالنسخ أو dual-write غير المنضبط؛ يجب رفع Architecture Decision صريح.

---

## 10. Matrix Update Requirement

إضافة Module جديد أو علاقة جديدة مع Core تتطلب تحديث:

1. HBMD Register.
2. CIC Relationship Register.
3. FLD Register.
4. PCD Register الخاص بالـModule.
5. Data Ownership Cross-Reference.
6. HBMD cycle check.
7. Lifecycle impact check.

`MODULE_DEPENDENCY_MATRIX.md` الحالية هي Core Baseline؛ يمكن توسيعها أو إنشاء Matrix أوسع لاحقًا، لكن Core baseline لا يُعدل ضمنيًا.

---

## 11. Industry Extensions

Industry Extension يجب أن:

- يبني فوق Core/Enterprise capabilities ولا يكررها.
- لا يغير Ownership الأساسي لمجرد حاجة قطاعية.
- يستخدم Configuration/Feature extension حيث يكفي ذلك.
- يسجل FLD/CIC عندما يعتمد على Modules متعددة.
- لا يجعل Core مرتبطًا بقطاع واحد.

هذا يحافظ على Teranoo كمنتج ERP عام قابل للتوسع بدل تحويل Core إلى Implementation خاص بعميل أو قطاع.

---

## 12. Compatibility Review

قبل اعتماد Module/Extension جديد يجب إجراء **Core Compatibility Review** يسأل:

1. هل أنشأ HBMD جديدًا؟ وهل هو ضروري وصريح؟
2. هل أنشأ cycle؟
3. هل غيّر Data Ownership؟
4. هل كرر Shared Capability؟
5. هل جعل Module Core يعتمد عليه ضمنيًا؟
6. هل كسر CIC قائمًا؟
7. هل غيّر Activation/Deactivation semantics؟
8. هل يتطلب فتح قرار سابق؟

إذا كانت الإجابة نعم، يُفتح القرار المتأثر فقط وبسبب موثق.

---

## 13. أمثلة اتجاهية للمستقبل

هذه أمثلة Classification فقط وليست اعتمادًا لنطاق تلك Modules:

- CRM ↔ Sales: Opportunity-to-Order قد يكون CIC/FLD، لا HBMD تلقائيًا.
- Manufacturing ↔ Sales: Make-to-Order قد يكون FLD + CIC.
- Manufacturing ↔ Inventory: Material Issue/Receipt يحتاج CIC حسب Blueprint المستقبلي.
- Projects ↔ Procurement: Project Purchase قد يكون FLD/CIC.
- Projects ↔ Sales/Finance: Project-to-Cash يحتاج Contracts لاحقًا.
- HCM/Payroll ↔ Finance: Payroll posting قد يكون CIC، دون جعل Finance dependent على Payroll.

---

## 14. قرار Phase 2

تم اعتماد هذه القواعد كـ **Future Module Extension Governance**.

الهدف ليس منع التطور، بل ضمان أن كل توسع:
- يضيف قدرة دون كسر Core.
- يحافظ على Explicit Dependencies.
- يحافظ على Data Ownership.
- يمنع circular coupling.
- يبقى قابلًا للمراجعة والتعطيل والتطوير.

**الحالة النهائية:** ✅ Approved / Phase 2
