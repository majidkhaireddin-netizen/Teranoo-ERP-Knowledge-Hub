# Content Authoring Guide

This guide explains how to author, organize, link, localize, revise, and validate records inside `Teranoo ERP Knowledge Hub`.

## 1. Where Approved Content Lives

Place authorized Markdown files strictly inside the six approved directories under `content/collections/`:

- `content/collections/official/` — Official documentation & approved decisions
- `content/collections/research/` — Research reports, comparative benchmarks & evidence
- `content/collections/analysis/` — Independent reviews & review notes
- `content/collections/future/` — Future architecture considerations
- `content/collections/educational/` — Educational explanations & illustrative guides
- `content/collections/engineering/` — Build-in-public engineering journals, issues, solutions & lessons

Never put production records inside `content/fixtures/` (reserved exclusively for automated tests).

## 2. Creating a New Document

Every file uses YAML frontmatter (`--- ... ---`) validated by `frontmatterSchema` plus standard GFM Markdown body. JavaScript frontmatter (`---js`) and raw HTML tags are forbidden.

```markdown
---
id: kh-doc-example-ar
slug: example-topic
title:
  ar: "عنوان الوثيقة"
  en: "Document Title"
description:
  ar: "ملخص واضح للوثيقة."
  en: "Concise document summary."
language: ar
type: architecture-document
classification: official
editorialStatus: published
publicationStatus: public
approvalStatus: approved
implementationStatus: not-started
depth: L3
journeyStages: [architecture]
phaseRefs: [phase-5]
moduleRefs: [finance]
domainRefs: [audit-trail]
topics: [architecture]
tags: [example]
traceability:
  decisionIds: [D-PLAT-03]
relationships: []
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/example.md
  attribution: "Teranoo ERP Official Planning Sources"
  sourceDocumentDate: null
  reviewDate: "2026-11-25"
  publicationDate: "2026-11-25"
publicationAuthorization:
  authorized: true
  completeness: complete
versioning:
  revision: 1
---

## القسم الأول

محتوى الوثيقة هنا.
```

## 3. Adding an Official Document or Approved Decision

- Place under `content/collections/official/`.
- Use `classification: official` (for foundation/architecture docs) or `classification: approved-decision` (for formal decision records).
- For `approved-decision`, `approvalStatus` MUST be `approved` or `superseded`.
- Store official ERP identifiers (`D-PLAT-01`, `R-*`, etc.) in `traceability.*`, NEVER as the internal `id`.
- `source.kind` must be `official-source` or `snapshot-derived` (never `illustrative`).

## 4. Adding a Research Report or Comparative Study

- Place under `content/collections/research/`.
- Set `type: research-report` | `comparative-research` | `research-evidence` and `classification: research`.
- Set `approvalStatus: not-applicable`.
- The reader automatically displays a non-binding authority disclaimer banner.

## 5. Adding an Independent Review or Review Note

- Place under `content/collections/analysis/`.
- Set `type: independent-review` | `independent-review-note`, `classification: independent`, and `approvalStatus: not-applicable`.
- Record official review IDs (`IR-*`) in `traceability.independentReviewIds`.

## 6. Adding a Future Consideration

- Place under `content/collections/future/`.
- Set `type: future-consideration`, `classification: future`, and `approvalStatus: proposed` or `not-applicable`.
- Record official IDs (`FAC-*`) in `traceability.futureConsiderationIds`.

## 7. Adding an Educational Explanation or Illustrative Example

- Place under `content/collections/educational/`.
- Set `classification: educational` (or `illustrative`), `approvalStatus: not-applicable`, and `source.kind: knowledge-hub-authored` (or `illustrative`).
- Explicitly disclose in the document that it is educational/illustrative material and not an approved ERP decision.

## 8. Adding a Screen Specification, Data Model, or Test Record

- Register using `type: screen-specification`, `data-model`, `entity-specification`, `test-specification`, or `test-result`.
- Use standard Markdown headings and GFM tables for fields, constraints, permissions, or test steps; the renderer registry automatically resolves the specialized viewer descriptor and renders via the unified reader.

## 9. Adding an Engineering Journal Entry (Once ERP Engineering Starts)

- Place under `content/collections/engineering/` ONLY for real **Teranoo ERP** product implementation work (never for Knowledge Hub platform tasks).
- Set `classification: engineering`, `type: engineering-journal-entry` | `development-task` | `technical-issue` | `solution-record` | `lesson-learned`.
- Document actual dates, linked Decision/Requirement IDs, verified commits, real test results, and lessons learned — never fabricate entries.

## 10. Linking Translations Across Arabic and English

- Assign the exact same `translationGroupId` (e.g., `tg-product-vision-ref`) to both files.
- Use distinct `id`, distinct `slug`, and distinct `language` (`ar` vs `en`).
- Add reciprocal `{ type: translation-of, targetId: ... }` entries in `relationships`.

## 11. Linking Related Knowledge & Deferred Targets

- **Internal published document:** `{ type: references, targetId: kh-doc-... }` (automatically generates an incoming backlink on the target!).
- **Not-yet-imported document:** `{ type: derived-from, deferredRef: "path/or/identifier", label: { ar: "...", en: "..." } }` (produces a non-blocking validation warning and renders cleanly as a non-clickable deferred reference).
- **External URL:** `{ type: references, externalUrl: "https://...", label: { ar: "...", en: "..." } }` (strictly `http://` or `https://`).

## 12. Adding Explicit Collection Ordering (Previous / Next)

- Add `collectionSequence: { collectionId: "kh-col-...", order: 1 }` only when a genuine reading sequence exists.
- Sequence order is unique per `(collectionId, language)` track.

## 13. Recording Revisions & Superseding Documents

- Increment `versioning.revision` for updates, or create a new record pointing `versioning.previousRevisionId` / `versioning.supersedesId` to the prior record ID and set the old record's `editorialStatus: superseded`.

## 14. Validating Before Publication

Run:
```bash
npm run content:validate
npm run test
```
Every error reported by `content:validate` must be resolved before a record is merged or published.
