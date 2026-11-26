# Content Relationships & Knowledge Graph Model

Authoritative source: `content/taxonomy/registry.ts` (`RELATIONSHIP_TYPES`) and `content/registry/contentRegistry.ts` (`getRelationships`).

## 1. Fifteen Typed Relationship Categories

Every relationship has an explicit outgoing label and an automatically derived incoming backlink label (localized in Arabic and English):

| Relationship Type | Outgoing Label (EN) | Incoming Backlink Label (EN) |
| --- | --- | --- |
| `references` | References | Referenced by |
| `supported-by-evidence` | Supported by evidence | Provides evidence for |
| `derived-from` | Derived from | Source for derivative |
| `justifies` | Justifies | Justified by |
| `implements` | Implements | Implemented by |
| `constrains` | Constrains | Constrained by |
| `depends-on` | Depends on | Depended on by |
| `related-to` | Related to | Related from |
| `part-of` | Part of | Includes |
| `supersedes` | Supersedes | Superseded by |
| `tests` | Tests | Tested by |
| `validates` | Validates | Validated by |
| `resolves` | Resolves | Resolved by |
| `illustrates` | Illustrates | Illustrated by |
| `translation-of` | Translation of | Translated as |

## 2. Three Target Modes

Each entry in `relationships[]` must specify **exactly one** of:

1. `targetId`: Internal Knowledge Hub content ID (`kh-...`). Validated for existence and publication boundary compliance. Automatically creates an incoming backlink on the target record.
2. `externalUrl`: Strictly validated `http://` or `https://` URL. Rendered with `target="_blank" rel="noopener noreferrer"`.
3. `deferredRef`: Explicit identifier or path for a real source artifact not yet imported into the local Knowledge Hub. Produces a non-blocking `DEFERRED_REFERENCE` warning during validation and renders honestly as a non-clickable deferred reference.

## 3. Integrity Rules Enforced by Validator

- **No self-relationships** (`SELF_RELATIONSHIP` error).
- **No dangling internal IDs** (`BROKEN_INTERNAL_REFERENCE` error).
- **No public-to-unpublished leaks** (`PUBLIC_TO_UNPUBLISHED_REFERENCE` error): a publicly published record cannot link to a `private`, `internal`, `draft`, or unauthorized internal target.
- **No unsafe URL protocols**: `javascript:`, `data:`, `vbscript:`, and `file:` URLs are rejected by schema validation.
