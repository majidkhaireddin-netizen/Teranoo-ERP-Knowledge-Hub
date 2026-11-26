---
id: kh-doc-product-vision-ref-ar
slug: teranoo-product-vision-reference
title:
  ar: "رؤية منتج Teranoo ERP — وثيقة مرجعية مشتقة من اللقطة المعتمدة"
  en: "Teranoo ERP Product Vision — Snapshot-Derived Reference"
subtitle:
  ar: "ملخص مرجعي لهوية المنتج، استراتيجية التوزيع، الأنظمة التجارية الأساسية، والمرحلة التخطيطية الحالية"
  en: "Reference summary of verified product identity, deployment profile, core modules, and current planning phase"
description:
  ar: "وثيقة مرجعية مشتقة من اللقطة التخطيطية المراجعة لمشروع Teranoo ERP، توثّق الهوية المؤسسية المعتمدة والأنظمة الأساسية الأربعة دون الادعاء بأنها نسخة كاملة من ملف رؤية المنتج الأصلي."
  en: "Snapshot-derived reference document capturing the verified Teranoo ERP identity, core modules, and deployment profile without claiming to reproduce the full original Product Vision source file."
language: ar
translationGroupId: tg-product-vision-ref
type: product-vision
classification: official
editorialStatus: reference
publicationStatus: public
approvalStatus: reference
implementationStatus: not-applicable
depth: L1
journeyStages:
  - product-discovery
  - architecture
phaseRefs:
  - phase-1
  - phase-5
moduleRefs:
  - finance
  - inventory-warehouse
  - procurement
  - sales-order-management
domainRefs:
  - identity-access
  - workflow-approvals
  - audit-trail
  - shared-master-data
  - localization
  - tax
  - currency
  - calendar
  - documents-attachments
topics:
  - architecture
  - deployment
  - governance
tags:
  - teranoo-erp
  - product-vision
  - reference-snapshot
  - saas-first
  - postgresql
traceability:
  officialDocumentId: DOC-TERANOO-VISION-REF
  decisionIds:
    - D-PLAT-01
    - D-PLAT-02
    - D-PLAT-03
    - D-PLAT-04
    - D-PLAT-05
    - D-PLAT-06
    - D-PLAT-07
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: translation-of
    targetId: kh-doc-product-vision-ref-en
  - type: related-to
    targetId: kh-edu-classification-governance-ar
  - type: derived-from
    deferredRef: teranoo-erp-planning/00-project-foundation/PRODUCT_VISION.md
    label:
      ar: "ملف رؤية المنتج الأصلي (مؤجَّل للاستيراد الكامل في مهمة لاحقة)"
      en: "Original Product Vision source file (deferred for full ingestion in a later task)"
source:
  kind: snapshot-derived
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePaths:
    - teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md
    - teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md
  sourceTitle: "Teranoo ERP Planning Reference Snapshot"
  treeSha: a922a69b54bc0cc611ae46d8e7434907cde0046a
  attribution: "Teranoo ERP Official Planning Sources (Snapshot-Derived Reference)"
  sourceLanguage: mixed
  sourceDocumentDate: null
  reviewDate: "2026-11-25"
  publicationDate: "2026-11-25"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-002 Authorized Initial Content"
  completeness: reference-summary
  scopeNote:
    ar: "وثيقة مرجعية مختصرة مشتقة من اللقطة التخطيطية المراجعة وليست استنساخًا كاملًا لوثيقة رؤية المنتج الأصلية."
    en: "Reference summary derived from the reviewed planning snapshot; not a full reproduction of the original Product Vision document."
versioning:
  revision: 1
  sourceVersion: "snapshot-a922a69b54bc"
  lastVerifiedDate: "2026-11-25"
collectionSequence:
  collectionId: kh-col-foundations
  order: 1
---

> **تنبيه نطاق الوثيقة:** هذه الوثيقة هي **ملخص مرجعي مشتق من اللقطة التخطيطية المراجعة** (`a922a69b54bc`) في مشروع `Teranoo ERP`، وليست نسخة كاملة من وثيقة رؤية المنتج الأصلية. جميع الحقائق المذكورة أدناه مقتصرة على العناصر المتحقق منها رسميًا في اللقطة المرجعية.

## الهوية المؤسسية لمنتج Teranoo ERP

يمثّل **Teranoo ERP** مبادرة لبناء منتج تجاري لنظام تخطيط موارد مؤسسات بمستوى مؤسسي (**Enterprise-Grade Modular ERP**) موجّه للمؤسسات المتوسطة والكبيرة، ومصمَّم بهيكلة معيارية قابلة للتهيئة (**Commercial, Modular, Configurable ERP Platform**).

| السمة المرجعية | القيمة المعتمدة في اللقطة المرجعية |
| --- | --- |
| اسم المنتج | `Teranoo ERP` |
| نوع المنتج | نظام تخطيط موارد مؤسسات معياري بمستوى مؤسسي (`Enterprise-Grade Modular ERP`) |
| الفئة المستهدفة | المؤسسات المتوسطة والكبيرة (`Medium & Large Enterprises`) |
| استراتيجية المنتج | منصة تجارية معيارية قابلة للتهيئة (`Commercial, Modular, Configurable ERP Platform`) |
| استراتيجية الاستضافة الأساسية | `SaaS-first` |
| ملف الاستضافة المستقبلي | `Connected On-Premises` |
| محرك قاعدة البيانات المعتمد | `PostgreSQL` |

## الأنظمة التجارية الأساسية الأربعة

تعمل الأنظمة التجارية الأساسية الأربعة فوق طبقة المنصة المشتركة (**Shared Platform Foundation**) مع فصل واضح بين القدرات التشغيلية المشتركة والمنطق التجاري لكل نظام فرعي:

1. **المالية (`Finance`)** — النواة المحاسبية والمالية للمنتج.
2. **المخزون وإدارة المستودعات (`Inventory & Warehouse Management`)** — ضبط المخزون وحركة المستودعات.
3. **المشتريات (`Procurement`)** — دورة المشتريات والتوريد.
4. **المبيعات وإدارة الطلبات (`Sales & Order Management`)** — دورة المبيعات وتنفيذ الطلبات.

## استراتيجية الاستضافة والبيانات

تعتمد الاستراتيجية المعتمدة نموذج **SaaS-first** كنموذج التشغيل الأساسي، مع التخطيط المعماري المسبق لدعم ملف **Connected On-Premises** في مرحلة مستقبلية، بالاعتماد على محرك قاعدة البيانات **PostgreSQL**.

## حالة مراحل التخطيط والاعتماد المعماري

تعكس الأرقام الواردة في اللقطة المرجعية تقدم **التخطيط والتوثيق والاعتماد المعماري** فقط، ولا تعكس نسبة إنجاز البرمجة الفعلية لنظام ERP:

- **المراحل 1 إلى 4:** مكتملة تخطيطيًا ومعماريًا.
- **المرحلة 5 (قدرات المنصة المشتركة):** قيد التنفيذ — تم اعتماد **7 من أصل 13** بندًا تخطيطيًا (12 قدرة تشغيلية للمنصة + البند رقم 13 كبوابة مراجعة واعتماد لأسس المنصة).
- **إجمالي القرارات المعتمدة المعلَن في سجل القرارات المصدر:** `120` قرارًا معماريًا معتمدًا في اللقطة المرجعية.

### القرارات المعتمدة الموثّقة معرفاتها في هذه اللقطة (المرحلة الخامسة)

| المعرف الرسمي | القدرة التشغيلية المعتمدة |
| --- | --- |
| `D-PLAT-01` | الهوية والصلاحيات (`Identity & Access`) |
| `D-PLAT-02` | سير العمل والموافقات (`Workflow & Approvals`) |
| `D-PLAT-03` | سجل التدقيق (`Audit Trail`) |
| `D-PLAT-04` | البيانات الرئيسية المشتركة (`Shared Master Data`) |
| `D-PLAT-05` | التوطين واللغات (`Localization`) |
| `D-PLAT-06` | الضرائب والعملات والتقويم (`Tax, Currency & Calendar`) |
| `D-PLAT-07` | المستندات والمرفقات (`Documents & Attachments`) |

## التمييز عن المحتوى الكامل المستقبلي

لا تحتوي هذه الوثيقة على النص الكامل لملف رؤية المنتج الأصلي أو تفاصيل القرارات الـ 120؛ بل تؤسس مرجعًا موثوقًا ومنظّمًا قابلًا للتوسعة والربط المعرفي عند استيراد الوثائق الرسمية الكاملة في المهام المصرح بها لاحقًا.
