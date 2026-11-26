# Content Schema Reference

Authoritative source: `content/schemas/frontmatterSchema.ts` and `content/models/knowledge.ts`.

## 1. Core Identity & Bilingual Metadata

| Field | Type | Required | Rules / Notes |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Lowercase kebab-case internal ID (`kh-...`). Must NOT start with official ERP prefixes (`D-`, `R-`, `IR-`, `FAC-`). |
| `slug` | `string` | Yes | Unique canonical URL slug (`/knowledge/[slug]`), lowercase kebab-case. |
| `title` | `{ ar: string; en: string }` | Yes | Localized display titles. |
| `subtitle` | `{ ar: string; en: string }` | No | Optional localized subtitle. |
| `description` | `{ ar: string; en: string }` | Yes | Concise summary for catalog rows, metadata, and search. |
| `language` | `'ar' \| 'en' \| 'mixed'` | Yes | Original language of the Markdown body (independent of UI language). |
| `translationGroupId` | `string` | No | Shared internal group ID linking translations; each language may appear at most once per group. |

## 2. Classification & Four Independent Status Dimensions

| Field | Allowed Values | Purpose |
| --- | --- | --- |
| `type` | 35 values in `CONTENT_TYPE_VALUES` | Granular artifact type. |
| `classification` | `official`, `approved-decision`, `research`, `independent`, `future`, `educational`, `illustrative`, `engineering` | Authority classification rendered visually. |
| `editorialStatus` | `draft`, `under-review`, `reference`, `published`, `superseded`, `deprecated`, `archived` | Editorial readiness inside Knowledge Hub. |
| `publicationStatus` | `private`, `internal`, `public` | Visibility tier. |
| `approvalStatus` | `not-applicable`, `proposed`, `under-review`, `approved`, `reference`, `superseded`, `deprecated` | Formal Teranoo ERP governance status. |
| `implementationStatus` | `not-applicable`, `not-started`, `in-progress`, `implemented`, `verified`, `deprecated` | ERP software engineering implementation reality. |
| `depth` | `L1`, `L2`, `L3`, `L4`, `L5` | Knowledge depth (Overview -> Implementation). |

## 3. Discovery & Official Traceability

- `journeyStages`: `JourneyStageId[]`
- `phaseRefs`: `string[]` matching `^phase-\d+(?:\.\d+)?$` (supports `phase-5`, `phase-6.5`, etc.)
- `moduleRefs`: validated against `BUSINESS_MODULES_TAXONOMY`
- `domainRefs`: `PlatformDomainId[]`
- `topics`: `ControlledTopicId[]`
- `tags`: `string[]`
- `traceability`: `{ officialDocumentId?, decisionIds[], requirementIds[], researchIds[], futureConsiderationIds[], independentReviewIds[] }`

## 4. Source Provenance (`source`)

Discriminated union on `source.kind`:

- `official-source`: `repository`, `sourcePath`, `sourceTitle?`, `commitSha?`, `treeSha?`
- `snapshot-derived`: `repository`, `sourcePaths[]`, `sourceTitle?`, `treeSha`
- `knowledge-hub-authored`: `publisher`
- `external-reference`: `publisher`, `sourceUrl`, `sourceTitle`
- `illustrative`: `disclaimer?`

All variants include: `attribution`, `sourceLanguage?`, `sourceDocumentDate?` (`YYYY-MM-DD | null`), `reviewDate?`, `publicationDate?`, `copyrightNotice?`. Unknown source dates MUST be `null` or omitted — never fabricated.

## 5. Publication Authorization, Versioning & Collection Sequence

- `publicationAuthorization`: `{ authorized: boolean; authorizedBy?: string; scopeNote?: LocalizedText; completeness: 'complete' | 'excerpt' | 'reference-summary' }`
- `versioning`: `{ revision: number; sourceVersion?: string; previousRevisionId?: string; supersedesId?: string; lastVerifiedDate?: string | null; correctionNote?: LocalizedText }`
- `collectionSequence?`: `{ collectionId: string; order: number }` — explicit sequential navigation scoped per language track.
