# Teranoo ERP — Decision Register

> **الحالة:** ✅ Active Governance Index
> **الغرض:** فهرس مركزي خفيف للقرارات المعمارية المعتمدة، دون إعادة كتابة نصوص القرارات أو إنشاء مصدر حقيقة بديل.
> **المصدر النهائي للحقيقة:** الملف الرسمي المشار إليه في عمود **Official Source** لكل قرار.

## قواعد السجل

1. هذا الملف **Index فقط**؛ لا يعيد صياغة القرار ولا يتغلب على مصدره الرسمي.
2. أي قرار جديد معتمد يجب أن يضاف هنا عند توثيقه رسميًا.
3. أي `Reopen` يبدأ من المصدر الرسمي مع Impact Review للقرارات والـModules المتأثرة، ثم تحديث هذا السجل.
4. القرارات المؤجلة وResearch Hints لا تسجل كـApproved Decisions قبل اعتمادها.
5. `Owner Phase` تعني المرحلة التي تملك القرار معماريًا؛ لا تمنع المراحل اللاحقة من استهلاكه أو تفصيله ضمن حدوده.
6. جميع القرارات أدناه حالتها `✅ Approved`، و`Reopen = Explicit impact review only` ما لم يذكر خلاف ذلك في المصدر الرسمي.

## Phase 3 — Platform & Tenancy Decisions

| Decision ID | Short Decision | Official Source | Owner Phase | Primary Impact |
|---|---|---|---|---|
| `D-TEN-01` | Tenant Definition | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Platform / all modules |
| `D-TEN-02` | Tenant vs Company Boundary | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Company model / transactions |
| `D-TEN-03` | Tenant vs Deployment Boundary | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Phase 4 deployment |
| `D-TEN-04` | Tenant Isolation Principle | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Security / data isolation |
| `D-TEN-05` | Cross-Tenant Boundary | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Integration / migration |
| `D-TEN-06` | Tenant Lifecycle Safety | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Lifecycle / history |
| `D-TEN-07` | Stable Tenant Identity | `05-platform-requirements/TENANT_MODEL.md` | Phase 3 | Identity / migration |
| `D-COMP-01` | Company Definition | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Legal/accounting ownership |
| `D-COMP-02` | Multi-Company Tenant | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Tenant/company structure |
| `D-COMP-03` | Transaction Company Ownership | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | All business transactions |
| `D-COMP-04` | Company Boundary Separation | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Branch/BU/Warehouse/Finance |
| `D-COMP-05` | Company Hierarchy Independence | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Organizational hierarchy |
| `D-COMP-06` | Centralized Operations Principle | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Procurement/Sales/shared services |
| `D-COMP-07` | Intercompany Ownership Principle | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Cross-company processes |
| `D-COMP-08` | Company Financial & Regulatory Context | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Finance/localization/tax |
| `D-COMP-09` | Stable Company Identity & Lifecycle Safety | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | History/lifecycle |
| `D-COMP-10` | Company Transfer Between Tenants = Explicit Migration | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Migration/tenant boundary |
| `D-COMP-11` | Cross-Company Reporting vs Consolidation | `05-platform-requirements/MULTI_COMPANY_MODEL.md` | Phase 3 | Reporting/Finance |
| `D-BR-01` | Branch Definition | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Platform/operations |
| `D-BR-02` | Company Membership & Optionality | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Company/branch structure |
| `D-BR-03` | Branch Boundary Separation | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Site/Location/Warehouse/BU |
| `D-BR-04` | Branch Identity vs Physical Location | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Location/lifecycle |
| `D-BR-05` | Transaction Branch Context | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Business transactions |
| `D-BR-06` | Operational Role Separation | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Sales/Procurement/Inventory |
| `D-BR-07` | Cross-Branch vs Intercompany | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Cross-branch processes |
| `D-BR-08` | Regulatory Branch Capability | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Localization/tax |
| `D-BR-09` | Branch Accounting Boundary | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Finance/reporting |
| `D-BR-10` | Stable Branch Identity & Lifecycle Safety | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | History/lifecycle |
| `D-BR-11` | Branch Hierarchy Independence | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Organizational hierarchy |
| `D-BR-12` | Temporary Project Site Boundary | `05-platform-requirements/MULTI_BRANCH_MODEL.md` | Phase 3 | Projects/construction |
| `D-ORG-01` | Multiple Purpose-Specific Hierarchies | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Enterprise structure |
| `D-ORG-02` | Identity vs Hierarchy Membership | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Identity/reorganization |
| `D-ORG-03` | Reference Membership, Not Entity Duplication | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Hierarchy/master identity |
| `D-ORG-04` | Tree / Single-Parent / Acyclic Invariants | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Hierarchy validation |
| `D-ORG-05` | Effective-Dated & Versioned Hierarchies | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Reorganization/reporting |
| `D-ORG-06` | Reorganization Does Not Rewrite History | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Audit/historical reporting |
| `D-ORG-07` | Hierarchy Membership Does Not Redefine Ownership | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Business ownership |
| `D-ORG-08` | Company & Branch Remain First-Class Entities | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Company/Branch models |
| `D-ORG-09` | No Universal Generic Organizational Unit | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Enterprise structure |
| `D-ORG-10` | Reporting Nodes Are Not Business Entities by Default | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Reporting/data model |
| `D-ORG-11` | Cross-Company Organizational Grouping Within Tenant | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Shared services/reporting |
| `D-ORG-12` | Shared Service Center Boundary | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Centralized operations |
| `D-ORG-13` | Tenant-Scoped Native Hierarchies | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Tenant isolation |
| `D-ORG-14` | Purpose Constrains Eligible Member Types | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Hierarchy validation |
| `D-ORG-15` | Hierarchies Are Structural Inputs, Not Replacement Engines | `05-platform-requirements/ORGANIZATIONAL_HIERARCHY_MODEL.md` | Phase 3 | Reporting/Authorization/Workflow |
| `D-MD-01` | Shared Identity + Scoped Context Baseline | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Shared Master Data |
| `D-MD-02` | Seven-Way Separation | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Data scope/security |
| `D-MD-03` | Tenant Boundary for Business Master Identity | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Tenant/integration |
| `D-MD-04` | Product / Item Identity | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Sales/Procurement/Inventory |
| `D-MD-05` | Product Company Context | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Product/company operations |
| `D-MD-06` | Party Identity & Customer / Supplier Roles | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Finance/Sales/Procurement |
| `D-MD-07` | Company Context Is Not a Master Copy | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Master data model |
| `D-MD-08` | Explicit Company Applicability | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Company use/transactions |
| `D-MD-09` | Type-Specific Default Scope | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Master scope governance |
| `D-MD-10` | Semantic Scope Before Configurable Scope | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Configuration/upgradeability |
| `D-MD-11` | Stable Technical Identity & Alternate Business Codes | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Identifiers/migration |
| `D-MD-12` | Hierarchy & Branch Do Not Determine Sharing | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Hierarchy/Branch/security |
| `D-MD-13` | Shared Master Lifecycle & Scope Change Safety | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Lifecycle/migration |
| `D-MD-14` | Explicit Applicability Baseline; Sharing Sets Optional | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Shared data/configuration |
| `D-MD-15` | Platform Ownership & Module Independence | `05-platform-requirements/SHARED_MASTER_DATA_MODEL.md` | Phase 3 | Core module architecture |
| `D-AUTH-01` | Identity, Membership & Person Separation | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Identity/tenant membership |
| `D-AUTH-02` | Human Principal vs Machine Principal | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Integrations/background jobs |
| `D-AUTH-03` | Role / Permission / Scope / Context / Entitlement Separation | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Security model/all modules |
| `D-AUTH-04` | Reusable Role Definition & Scoped Assignment | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Role governance/multi-company |
| `D-AUTH-05` | Atomic Grant Invariant | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Privilege escalation prevention |
| `D-AUTH-06` | Default Deny, Least Privilege & Fail-Safe | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Security baseline |
| `D-AUTH-07` | Company Scope First-Class; Branch Scope Contextual | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Company/branch data access |
| `D-AUTH-08` | Current Company / Branch Are Working Context Only | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Context switching/security |
| `D-AUTH-09` | Organizational Hierarchy as Bounded Authorization Input | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Hierarchy/access impact |
| `D-AUTH-10` | Administrative Separation; No Permanent Business Superuser | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Tenant/Security/Platform administration |
| `D-AUTH-11` | Segregation of Duties & Self-Escalation Safety | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | SoD/privileged security |
| `D-AUTH-12` | Shared Master Authorization Boundaries | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Shared Master security |
| `D-AUTH-13` | Authorization vs Entitlement / Workflow / Applicability / Business Rules | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Cross-platform gate semantics |
| `D-AUTH-14` | View / Export / Reporting / Search Channel Separation | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Reporting/search/data exfiltration |
| `D-AUTH-15` | Stable Permission Contract & Upgrade-Safe Roles | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Upgradeability/extensions |
| `D-AUTH-16` | Authorization Lifecycle, Auditability & Explainability | `05-platform-requirements/USER_ROLE_PERMISSION_MODEL.md` | Phase 3 | Audit/lifecycle/security operations |
| `D-ISO-01` | Tenant Isolation Boundary | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Tenant security/all data surfaces |
| `D-ISO-02` | Authorization Is Not Tenant Isolation | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Defense-in-depth/data store enforcement |
| `D-ISO-03` | One-Tenant Execution Context | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Requests/jobs/events/imports |
| `D-ISO-04` | Trusted Server-Side Tenant Context | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Context spoofing/security |
| `D-ISO-05` | Tenant-Bound Active Context | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Multi-membership/session switching |
| `D-ISO-06` | No Native Cross-Tenant Business Relationships | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Data relationships/integration |
| `D-ISO-07` | Stable Tenant Ownership of Business History | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | History/migration |
| `D-ISO-08` | Isolation Extends Beyond the Database | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Jobs/cache/search/files/reports |
| `D-ISO-09` | Physical Topology Does Not Define Tenant Identity | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Phase 4 deployment/data topology |
| `D-ISO-10` | Hybrid-Capable Isolation Architecture | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Pooled/dedicated future capability |
| `D-ISO-11` | Controlled Isolation-Tier Migration & Single Product Core | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Migration/upgradeability |
| `D-ISO-12` | Recovery / Residency / Dedicated Placement Future Compatibility | `05-platform-requirements/MULTI_TENANT_DATA_ISOLATION_MODEL.md` | Phase 3 | Recovery/residency/enterprise deployment |
| `D-CP-01` | Control Plane Definition & Boundary | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Platform administration / all modules |
| `D-CP-02` | Authoritative Tenant Control Registry | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Tenant metadata / routing references |
| `D-CP-03` | Reference & Coordination, Not Physical Execution | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Phase 4 deployment / migration |
| `D-CP-04` | Entitlement & Activation Administrative Boundary | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Activation / dependency / authorization |
| `D-CP-05` | Product Configuration Central-Management Boundary | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Configuration / release governance |
| `D-CP-06` | Administrative Separation & Privileged Support | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Administration / support security |
| `D-CP-07` | Operational Governance, Audit Separation & Failure Containment | `05-platform-requirements/CONTROL_PLANE_RESPONSIBILITIES.md` | Phase 3 | Audit / operations / resilience |
| `D-LC-01` | Minimum Lifecycle Model & Naming Unification | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Lifecycle / all modules |
| `D-LC-02` | Transition & Reversibility Matrix | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Lifecycle / identity continuity |
| `D-LC-03` | Suspension Semantics (Mutation Freeze) | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Integrity / operations |
| `D-LC-04` | Archive Semantics (Guardrail — Teranoo-specific) | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Preservation / ownership |
| `D-LC-05` | Offboarding as Controlled Process | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Exit / history protection |
| `D-LC-06` | Data Preservation & Final Deletion Boundary | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Data safety / compliance |
| `D-LC-07` | Entitlement ≠ Lifecycle ≠ Authorization | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Security / platform administration |
| `D-LC-08` | Lifecycle Authority (Control Plane Single Truth) | `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` | Phase 3 | Control Plane / all modules |

## Phase 4 — Deployment & Database Strategy Decisions

| Decision ID | Short Decision | Official Source | Owner Phase | Primary Impact |
|---|---|---|---|---|
| `D-DEP-01` | One Product Core, Deployment Profiles | `05-platform-requirements/CLOUD_SAAS_DEPLOYMENT_REQUIREMENTS.md` | Phase 4 | Deployment model / all profiles |
| `D-DEP-02` | Deployment Requirements Baseline (Binding) | `05-platform-requirements/CLOUD_SAAS_DEPLOYMENT_REQUIREMENTS.md` | Phase 4 | Phase 4 items 2–9 / Phase 5 interface |
| `D-DEP-03` | Connected On-Prem Data Plane (Adopted Operating Model) | `05-platform-requirements/ON_PREMISES_DEPLOYMENT_REQUIREMENTS.md` | Phase 4 | On-Prem delivery / Control Plane / customer data plane |
| `D-DEP-04` | Deployment Profile Equivalence Boundary | `05-platform-requirements/DEPLOYMENT_PROFILE_UNIFICATION_BOUNDARIES.md` | Phase 4 | Profile equivalence / all modules |
| `D-DEP-05` | PostgreSQL as Primary Database Engine | `05-platform-requirements/DATABASE_ENGINE_EVALUATION.md` | Phase 4 | Data layer / all profiles |
| `D-DEP-06` | PostgreSQL as the Sole Supported Database Engine | `05-platform-requirements/DATABASE_ENGINE_EVALUATION.md` | Phase 4 | Engine policy / production support |
| `D-DEP-07` | Backup/Restore/DR Principles Baseline | `05-platform-requirements/BACKUP_RESTORE_DR_PRINCIPLES.md` | Phase 4 | Backup / restore / DR / both profiles |
| `D-DEP-08` | Scalability & Performance Expectations Baseline | `05-platform-requirements/SCALABILITY_PERFORMANCE_EXPECTATIONS.md` | Phase 4 | Performance / scaling / FAC-020 promotion |
| `D-DEP-09` | Upgrade Delivery & Migration Architecture (Principles) | `05-platform-requirements/UPGRADE_DELIVERY_MIGRATION_ARCHITECTURE.md` | Phase 4 | Upgrade / release / migration / both profiles |
| `D-DEP-10` | Deployment & Database Strategy Adopted | `05-platform-requirements/DEPLOYMENT_DATABASE_STRATEGY_ADOPTION.md` | Phase 4 | Phase 4 bundle adoption / Phase 5+ reference |

## Phase 5 — Shared Platform Capabilities Decisions

| Decision ID | Short Decision | Official Source | Owner Phase | Primary Impact |
|---|---|---|---|---|
| `D-PLAT-01` | Identity & Access Framework Baseline | `05-platform-requirements/IDENTITY_ACCESS_FRAMEWORK.md` | Phase 5 | Identity / roles / permissions framework |
| `D-PLAT-02` | Workflow & Approvals Framework Baseline | `05-platform-requirements/WORKFLOW_APPROVALS_FRAMEWORK.md` | Phase 5 | Workflow / approvals / state separation |
| `D-PLAT-03` | Audit Trail Framework Baseline | `05-platform-requirements/AUDIT_TRAIL_FRAMEWORK.md` | Phase 5 | Audit evidence / domain separation |
| `D-PLAT-04` | Shared Master Data Framework Baseline | `05-platform-requirements/SHARED_MASTER_DATA_FRAMEWORK.md` | Phase 5 | Master data governance / separation / lifecycle |
| `D-PLAT-05` | Localization Framework Baseline | `05-platform-requirements/LOCALIZATION_FRAMEWORK.md` | Phase 5 | Languages / direction / keys / formats governance |
| `D-PLAT-06` | Tax / Currency / Calendar Foundations Baseline | `05-platform-requirements/TAX_CURRENCY_CALENDAR_FOUNDATIONS.md` | Phase 5 | Currency / tax / calendar concepts & governance |
| `D-PLAT-07` | Document & Attachment Framework Baseline | `05-platform-requirements/DOCUMENT_ATTACHMENT_FRAMEWORK.md` | Phase 5 | Attachments binding / isolation / governance / lifecycle |
| `D-PLAT-08` | Notification Framework Baseline | `05-platform-requirements/NOTIFICATION_FRAMEWORK.md` | Phase 5 | Notification categories / routing / dispatch separation |
| `D-PLAT-09` | Integration / API Framework Baseline | `05-platform-requirements/INTEGRATION_API_FRAMEWORK.md` | Phase 5 | Contracts / machine identity / events / governance |
| `D-PLAT-10` | Reporting & Analytics Framework Baseline | `05-platform-requirements/REPORTING_ANALYTICS_FRAMEWORK.md` | Phase 5 | Report categories / governance / isolation / U13 |
| `D-PLAT-11` | Configuration & Feature Management Baseline | `05-platform-requirements/CONFIGURATION_FEATURE_MANAGEMENT.md` | Phase 5 | Config categories / feature gates / transport / drift |
| `D-PLAT-12` | Extension Framework / Compatibility Contracts Baseline | `05-platform-requirements/EXTENSION_FRAMEWORK.md` | Phase 5 | Extensions / compatibility / isolation / governance |
| `D-PLAT-13` | Platform Foundation Detailed Adoption | `05-platform-requirements/PLATFORM_FOUNDATION_ADOPTION.md` | Phase 5 | Phase 5 bundle adoption / Phase 6+ reference |

## Governing Artifacts Without D-* IDs

هذه الملفات معتمدة أو حاكمة لكنها لا تُعاد تسميتها أو إعطاؤها Decision IDs اصطناعية داخل هذا السجل:

| Governing Artifact | Role |
|---|---|
| `00-project-foundation/00_PROJECT_VISION.md` | Approved product vision and high-level product boundaries |
| `00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md` | Approved cross-phase architecture guardrails |
| `03-modules/DEPENDENCY_MODEL.md` | Official module dependency semantics (`PCD / HBMD / CIC / FLD`) |
| `03-modules/MODULE_DEPENDENCY_MATRIX.md` | Approved Core relationship/dependency register |
| `03-modules/MODULE_LIFECYCLE_RULES.md` | Approved module lifecycle governance |
| `03-modules/FUTURE_MODULE_EXTENSION_RULES.md` | Approved future-module / Core impact governance |

## Decision Gate A — Market Decision (Independent — خارج عدّاد D-*)

> **قاعدة (Majed — 2026-10-02):** القرارات السوقية تُسجَّل هنا **مستقلة**، ولا تدخل عدّاد `D-*` (يبقى **126**) ولا تكسر سلسلة `D-PLAT`. مصدرها الرسمي هو وثيقة البوابة المشار إليها.

- **`D-MKT-01` — Primary Launch Market & First Industry Priority** — ✅ Approved (Conditional) 2026-10-02 · Official Source: `02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md` · المضمون: **الأردن أولاً + Trading & Wholesale Distribution كأولوية إطلاق وحيدة + ICP المعتمد + V1 غير متزامن** · **شرط نفاذ:** O-2 (تحقق ميداني للدفع — 5–10 مقابلات) **إلزامي قبل التسعير وقبل Product Baseline**.

## Current Decision State

- Approved D-* decisions indexed here: **126** (95 سابقة + `D-LC-01..08` + `D-DEP-01..10` + `D-PLAT-01..13` — كلها بتاريخ 2026-10-02).
- **Supersession (2026-10-02 — قرار الدمج المعتمد):** قرارات سبتمبر `D-LC-01..07` (102) أُعيد اشتقاقها وتدقيقها وترقيمها في 2026-10-02 إلى `D-LC-01..08` (103) — **لا تعارض مادي، والترقيم الأحدث هو المرجع** (المصدر الرسمي: `05-platform-requirements/TENANT_LIFECYCLE_MODEL.md` بـ4 حالات مستقرة؛ نسخة سبتمبر `TENANT_LIFECYCLE.md` بـ3 حالات حُذفت لانحرافها عن توصية البحث §4.3).
- Current architecture work: **Decision Gate A — معتمد مشروطاً** (`D-MKT-01`: الأردن + Trading & Wholesale أولاً؛ شرط O-2 قبل التسعير/Product Baseline)؛ **الخطوة التالية: Phase 6 — Core Functional Blueprints — لا تبدأ إلا بتكليف Majed صريح**.
- `C-AUTH-01..03` و`C-ISO-01..03` داخل مصادرها الرسمية Guardrails تفسيرية وليست Decision IDs مستقلة.

## Maintenance Rule

عند اعتماد قرار جديد أو Reopen قرار قائم، يجب تنفيذ التسلسل:

`Research / Evidence → Decision → Official Source Update → Impact Review → DECISION_REGISTER.md Update → Work Plan / README Sync when materially required`