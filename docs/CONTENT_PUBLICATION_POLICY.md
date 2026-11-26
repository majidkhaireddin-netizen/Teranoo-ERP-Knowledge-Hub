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
- **Public Publication ≠ Official ERP Approval:** An educational guide, research summary, or `classification: 'future'` record (such as `FUTURE_ARCHITECTURE_CONSIDERATIONS.md`) can be `publicationStatus: 'public'` while its `approvalStatus` is strictly `'not-applicable'`.
- **Indexed Decisions vs. Owning Documents:** In `BATCH-001`, all `126` approved architectural `D-*` decisions (plus conditional `D-MKT-01`) are indexed from `DECISION_REGISTER.md` (`0/126` individual owning decision documents imported yet), alongside `24` FAC items, `13` unimported research packages, and `57` unimported independent review notes. Indexed counts are never conflated with imported owning documents.

## 4. Mandatory Publication Guardrails

- **KH-023 Public Repository Security Rule (Critical):** Never commit unauthorized or confidential source bodies to this public repository — even with `publicationStatus: "internal"` or `publicationAuthorization.authorized: false`. Non-public staging and review of unauthorized files must live **outside** this public repository. Application-level publication filtering is a defense-in-depth safeguard, not a confidentiality boundary for a public Git repository. Test fixtures under `content/fixtures/` must remain strictly synthetic and non-sensitive.
- **No Secrets or Sensitive Data:** API keys, tokens, credentials, customer data, and sensitive operational details are strictly prohibited in Markdown files, frontmatter, or public assets.
- **Source Attribution & Completeness:** Every record declares its `source.kind`, `source.attribution`, Git provenance (`commitSha`, `treeSha`, `gitBlobSha`, `rawSourceSha256`, `storedBodySha256`), and `publicationAuthorization.completeness` (`complete`, `excerpt`, or `reference-summary`).
- **No Fabricated Dates:** Unknown original source document dates must be recorded as `null` or omitted and rendered honestly as `"Not recorded in source"` / `"غير مسجّل في المصدر"`.
- **Safe Failure on Unauthorized Routes:** Direct requests to `/knowledge/<unpublished-slug>` or `/knowledge/<nonexistent-slug>` invoke Next.js `notFound()` in both `generateMetadata()` and the page component without leaking filesystem paths, draft existence, or private metadata.
- **Standalone Deployment Packaging Isolation:** `next.config.ts` traces `./content/collections/**/*` into standalone builds while explicitly excluding `./content/fixtures/**/*`.
- **Source Manifest Authorization Gating:** Official sources registered in `content/manifest/sourceManifest.ts` must keep `publishedContentId: null` until explicitly authorized (`publicationAuthorizationStatus: "authorized"`) and linked to a publicly published registry record.

