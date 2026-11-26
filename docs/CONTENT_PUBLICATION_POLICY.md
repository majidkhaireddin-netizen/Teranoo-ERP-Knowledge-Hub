# Content Publication Policy & Boundary Governance

## 1. Public Read-Only Platform Model

Teranoo ERP Knowledge Hub is an approved public read-only knowledge platform for authorized documentation of the Teranoo ERP journey. Public read access does not require authentication, which makes the **Publication Boundary** a critical security and intellectual property control.

## 2. Explicit Publication Boundary Rule

Implemented centrally in `content/validators/contentValidator.ts` (`isPubliclyPublishableRecord`) and enforced across `content/registry/contentRegistry.ts`, `content/search/knowledgeSearch.ts`, and all public routes:

A record is exposed publicly **if and only if ALL four conditions hold**:

1. `isFixture === false` (files under `content/fixtures/` can never appear in production).
2. `publicationStatus === 'public'`.
3. `editorialStatus !== 'draft'`.
4. `publicationAuthorization.authorized === true`.

## 3. Separation of Governance Dimensions

- **Official ERP Approval ≠ Public Publication:** A record with `approvalStatus: 'approved'` remains hidden if `publicationStatus` is `'internal'` or `'private'`, or if `publicationAuthorization.authorized` is `false`.
- **Public Publication ≠ Official ERP Approval:** An educational guide or research summary can be `publicationStatus: 'public'` while its `approvalStatus` is `'not-applicable'`.
- **Snapshot Aggregate Counts ≠ Locally Published Counts:** Aggregate counts declared in the planning snapshot (`120` decisions, `13` research packages, `24` future considerations, `57` independent review notes) are displayed with explicit provenance notes and never conflated with locally published records in `/knowledge`.

## 4. Mandatory Publication Guardrails

- **No Secrets or Sensitive Data:** API keys, tokens, credentials, customer data, and sensitive operational details are strictly prohibited in Markdown files, frontmatter, or public assets.
- **Source Attribution & Completeness:** Every record declares its `source.kind`, `source.attribution`, and `publicationAuthorization.completeness` (`complete`, `excerpt`, or `reference-summary`).
- **No Fabricated Dates:** Unknown original source document dates must be recorded as `null` or omitted and rendered honestly as `"Not recorded in source"` / `"غير مسجّل في المصدر"`.
- **Safe Failure on Unauthorized Routes:** Direct requests to `/knowledge/<unpublished-slug>` or `/knowledge/<nonexistent-slug>` return a clean HTTP 404 via `notFound()` without leaking filesystem paths, draft existence, or private metadata.
