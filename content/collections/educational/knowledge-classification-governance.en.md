---
id: kh-edu-classification-governance-en
slug: knowledge-classification-governance-en
title:
  ar: "التمييز بين تصنيفات المعرفة وحالات الاعتماد والنشر (النسخة الإنجليزية)"
  en: "Distinguishing Knowledge Classifications, Approval, and Publication Statuses"
subtitle:
  ar: "النسخة الإنجليزية للدليل التعليمي حول تصنيف المعرفة وحوكمة النشر في المنصة"
  en: "An educational guide to reading official documentation, approved decisions, research evidence, independent reviews, and future considerations"
description:
  ar: "النسخة الإنجليزية من المقال التعليمي الصادر عن منصة Teranoo ERP Knowledge Hub حول التصنيفات الثمانية وحوكمة النشر."
  en: "Knowledge Hub-authored educational explanation detailing the eight authority classifications and why editorial, official approval, publication, and implementation statuses are tracked independently."
language: en
translationGroupId: tg-classification-governance
type: educational-explanation
classification: educational
editorialStatus: published
publicationStatus: public
approvalStatus: not-applicable
implementationStatus: not-applicable
depth: L2
journeyStages:
  - product-discovery
  - architecture
phaseRefs: []
moduleRefs: []
domainRefs: []
topics:
  - documentation
  - governance
tags:
  - content-classification
  - knowledge-governance
  - publication-boundary
  - educational-guide
traceability:
  decisionIds: []
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: references
    targetId: kh-doc-product-vision-ref-en
  - type: translation-of
    targetId: kh-edu-classification-governance-ar
source:
  kind: knowledge-hub-authored
  publisher: "Teranoo ERP Knowledge Hub"
  attribution: "Teranoo ERP Knowledge Hub"
  sourceLanguage: en
  sourceDocumentDate: "2026-11-25"
  reviewDate: "2026-11-25"
  publicationDate: "2026-11-25"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-002 Authorized Educational Content"
  completeness: complete
  scopeNote:
    ar: "محتوى تعليمي صادر عن منصة Teranoo ERP Knowledge Hub وليس قرارًا رسميًا لمنتج Teranoo ERP."
    en: "Educational explanation authored by Teranoo ERP Knowledge Hub; not an official Teranoo ERP architectural or functional decision."
versioning:
  revision: 1
  lastVerifiedDate: "2026-11-25"
collectionSequence:
  collectionId: kh-col-foundations
  order: 2
---

> **Authority Disclosure:** This article is classified as an **Educational Explanation** authored by **Teranoo ERP Knowledge Hub** to help readers navigate platform governance. It is **not an approved architectural or functional decision** of the `Teranoo ERP` product.

## Why Knowledge Separation Matters When Building an ERP System

Documenting the multi-year journey of building an enterprise ERP generates fundamentally different kinds of artifacts: binding decisions, comparative research studies, independent advisory critiques, future considerations, illustrative simulations, and real engineering journals. Blending them into a single undifferentiated stream causes readers to mistake an exploratory idea or advisory note for a binding architectural decision.

To prevent that ambiguity, `Teranoo ERP Knowledge Hub` enforces separation across two explicit axes: **Authority Classification** and **Independent Lifecycle Statuses**.

## The Eight Authority Classifications

| Classification | Purpose | Counts as an Approved ERP Decision? |
| --- | --- | --- |
| **Official Documentation** | Foundational and architectural specifications of `Teranoo ERP` | Yes — official product reference |
| **Approved Decision** | Formal architectural or functional decisions with official IDs such as `D-PLAT-01` | Yes — binding approved decision |
| **Research & Evidence** | Comparative analyses, benchmarks, and supporting evidence | No — supporting evidence only |
| **Independent Analysis** | Independent advisory reviews and review notes | No — separate advisory perspective |
| **Future Consideration** | Deferred or forward-looking architectural topics | No — not yet approved as a decision |
| **Educational Explanation** | Conceptual guides authored to help readers understand the domain | No — instructional material |
| **Illustrative Example** | Non-binding scenarios, walkthroughs, or simulations | No — illustrative demonstration |
| **Engineering Record** | Real implementation journals, technical issues, solutions, and lessons learned | No — documents engineering reality and links back to decisions |

## Four Independent Status Dimensions

Every knowledge record maintains four independent status fields that are never silently conflated:

1. **Editorial Status** (`draft`, `under-review`, `reference`, `published`, `superseded`, `deprecated`, `archived`): tracks readiness inside the Knowledge Hub.
2. **Official Approval Status** (`not-applicable`, `proposed`, `under-review`, `approved`, `reference`, `superseded`, `deprecated`): reflects formal Teranoo ERP governance authority.
3. **Publication Status** (`private`, `internal`, `public`): controls whether a record crosses the public publication boundary (and requires explicit `publicationAuthorization.authorized = true`).
4. **Implementation Status** (`not-applicable`, `not-started`, `in-progress`, `implemented`, `verified`, `deprecated`): tracks whether an ERP capability or decision has actually been built and verified in software.

### Practical Governance Example

An architectural decision can be formally **approved** (`approvalStatus: approved`) while simultaneously:

- Remaining **not started** (`implementationStatus: not-started`) because ERP engineering has not begun yet.
- Remaining **internal** (`publicationStatus: internal`) until it receives explicit authorization for public publication.

Conversely, this educational guide is **publicly published** (`publicationStatus: public`, `editorialStatus: published`), while its official ERP approval status is honestly marked **not applicable** (`approvalStatus: not-applicable`).

## Source-Declared Snapshot Totals vs. Locally Published Records

The dashboard reports aggregate counts declared in the reviewed reference snapshot (`120` approved architectural decisions, `13` architectural research packages, `24` future architecture considerations, and `57` independent review notes). By contrast, the **Knowledge Library (`/knowledge`)** displays only locally ingested, explicitly authorized records. Aggregate snapshot counts are never conflated with locally published record counts, and no missing records are ever fabricated.
