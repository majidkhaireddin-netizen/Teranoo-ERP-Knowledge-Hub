---
id: kh-doc-working-rules-ar
slug: working-rules
title:
  ar: "قواعد العمل والتخطيط (WORKING_RULES.md)"
  en: "Working Rules (WORKING_RULES.md)"
subtitle:
  ar: "قواعد العمل، القاعدة العليا، بوابة الحاجة للقرار الآن، وتصنيف الأولويات A/B/C/D"
  en: "Working rules, Supreme Rule, Need-to-Decide-Now gate, A/B/C/D triage, and anti-inflation discipline"
description:
  ar: "النص الرسمي الكامل لقواعد العمل ومنهجية التخطيط في مشروع Teranoo ERP (WORKING_RULES.md) بما يشمل دورة البحث والقرار والتوثيق والمراجعة وانضباط منع تضخم التخطيط."
  en: "Complete verbatim Working Rules (WORKING_RULES.md) establishing the Research -> Decision -> Documentation -> Review cycle, Supreme Rule, Need-to-Decide-Now gate, and planning inflation warnings."
language: ar
type: architecture-document
classification: official
editorialStatus: published
publicationStatus: public
approvalStatus: reference
implementationStatus: not-applicable
depth: L2
journeyStages:
  - product-discovery
  - research
  - architecture
phaseRefs:
  - phase-1
moduleRefs: []
domainRefs: []
topics:
  - governance
  - documentation
  - architecture
tags:
  - teranoo-erp
  - project-foundations
  - working-rules
  - planning-methodology
  - batch-001
traceability:
  decisionIds: []
  requirementIds: []
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships:
  - type: constrains
    targetId: kh-doc-project-work-plan-ar
    label:
      ar: "تحكم قواعد العمل مسار تنفيذ خطة عمل المشروع"
      en: "Governs execution discipline across the Project Work Plan"
  - type: related-to
    targetId: kh-doc-cross-phase-guardrails-ar
    label:
      ar: "ضوابط المنتج العابرة للمراحل"
      en: "Cross-Phase Product Guardrails"
source:
  kind: official-source
  repository: https://github.com/Alabasi1980/TeranooErp
  sourcePath: teranoo-erp-planning/00-project-foundation/WORKING_RULES.md
  sourceTitle: "Working Rules (WORKING_RULES.md)"
  commitSha: 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f
  treeSha: db531de6b2ab452578a550e07c5fd80e4bfe6b64
  gitBlobSha: e943101df8f21092d685fdda2af2e5bdad0166e5
  rawSourceSha256: 3c29def6bb336784e2969df0ae9359de9560311174a4e6f3d55e648fbb31a21f
  storedBodySha256: e3919a78039d5f4135b5549c91133eb94a6bdc7612b2d4f810938262eebbd752
  verificationStatus: git-blob-verified-lf-normalized
  lineEndingNormalization: crlf-to-lf
  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: mixed
  sourceDocumentDate: null
  reviewDate: "2026-11-26"
  publicationDate: "2026-11-26"
publicationAuthorization:
  authorized: true
  authorizedBy: "Project Owner — TASK-004 BATCH-001 Authorized Release"
  scopeNote:
    ar: "وثيقة منهجية وحوكمة تخطيطية رسمية نشطة (Active Reference) مستوردة بالكامل ضمن BATCH-001."
    en: "Active official planning methodology and governance reference ingested verbatim in BATCH-001."
  completeness: complete
versioning:
  revision: 1
  sourceVersion: "397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f"
  lastVerifiedDate: "2026-11-26"
collectionSequence:
  collectionId: kh-col-project-foundations
  order: 3
---

# Working Rules

## قواعد المشروع

- لا توجد كتابة أكواد في مرحلة التخطيط الحالية.
- لا يوجد استعجال في العمل أو القفز بين المراحل.
- لا توجد تخمينات أو استنتاجات غير مدعومة بمصادر حقيقية عندما تكون المصادر مطلوبة.
- تجنب تضخم المعلومات والتوثيق غير الضروري.
- استخدام مصادر رسمية وموثوقة لأنظمة ERP العالمية عند الحاجة إلى البحث.
- كل مرحلة تُبحث وتُراجع وتُغلق قبل الانتقال إلى المرحلة التالية.
- عدم خلط عدة موضوعات أو Modules في دراسة واحدة دون حاجة واضحة.
- العمل كمشروع احترافي: `Research → Decision → Documentation → Review → Next Stage`.
- لا يُسلّم أي قرار إلى Teranoo قبل نضجه واعتماده ضمن ملفات المشروع.

---

## Planning & Architecture Discipline

### القاعدة العليا

> **Enough architecture to prevent expensive mistakes — but not so much architecture that it delays the product itself.**

Teranoo ERP هو أولًا **Business ERP Product**. التخطيط والمعمارية والحوكمة تخدم المنتج ولا تصبح هدفًا مستقلًا يؤخر الوصول إلى Functional ERP behavior.

### Need-to-Decide-Now

قبل فتح Research جديد أو Framework أو Artifact أو Decision جديد، يجب التحقق بالترتيب:

1. هل الموضوع جزء صريح من المرحلة الحالية؟
2. إن لم يكن، هل عدم حسمه يمنع قرار المرحلة الحالية؟
3. هل تأجيله سيؤدي بدرجة عالية إلى إعادة تصميم جوهرية لاحقًا؟
4. هل يكفي Guardrail أو Future Consideration أو Handoff بدل بحث أو تصميم كامل؟

إذا كانت الإجابة لا تبرر العمل الآن، يؤجل الموضوع إلى Owner Phase المناسب.

### تصنيف أي فكرة جديدة

أي موضوع جديد يصنف أولًا ضمن واحدة فقط من:

- **A — Must Decide Now:** لا يمكن إغلاق المرحلة الحالية بدونه.
- **B — Guardrail Now / Detail Later:** نثبت المبدأ فقط، والتفصيل في Owner Phase.
- **C — Future Consideration:** مهم لكنه لا يؤثر على القرار الحالي.
- **D — Not Needed:** صحيح نظريًا لكنه لا يقدم قيمة كافية للمشروع حاليًا.

### Research Discipline

Deep Research ليس الإجراء الافتراضي.

يستخدم فقط عندما يوجد قرار معماري حقيقي، أو غموض جوهري، أو خطر كبير دون Evidence، أو اختلاف فعلي بين الممارسات المرجعية، أو تأثير واسع على المنتج.

أي Research Prompt يجب أن يكون:

- مركزًا على المرحلة الحالية.
- قابلًا للتنفيذ من Research Agent واحد.
- محدود الأسئلة.
- هدفه حسم Decisions محددة.
- خاليًا من تفاصيل Owner Phases اللاحقة إلا بقدر ما يلزم لحماية القرار الحالي.

إذا بدأ البحث يجمع Architecture + Security + Infrastructure + Operations + Backup + Performance + UX + Governance + Testing + Deployment دفعة واحدة، فذلك مؤشر تضخم ويجب تقليص Scope أو تأجيل أجزاء منه.

### Decision Discipline

الهدف ليس زيادة عدد `D-*`.

> **نستخدم أقل عدد من القرارات الواضحة التي تمنع الغموض وتحمي Architecture.**

لا تتحول Findings أو Recommendations أو Research Hints أو Exceptions تلقائيًا إلى Decisions.

### Documentation Discipline

قبل إنشاء ملف جديد:

1. تحقق هل يوجد Artifact رسمي قائم يستوعب المعلومة.
2. صنف المعلومة: Decision / Guardrail / Consideration / Handoff.
3. أنشئ ملفًا جديدًا فقط إذا كانت له قيمة مستقلة حقيقية.

يفضل تحديث Artifact قائم على إنشاء ملفات جديدة عندما يكون ذلك منطقيًا.

### Owner Phase Discipline

كل موضوع ينتظر Owner Phase الطبيعي له قدر الإمكان:

- Database topology / Deployment architecture → **Phase 4**.
- Detailed Product Configuration / Workflow / APIs / Shared Platform contracts → **Phase 5**.
- Functional ERP behavior and Core Functional Blueprints → **Phase 6 وما بعدها**.
- Enterprise-wide performance / security / operations validation → **Phase 10**.

لا تسحب تفاصيل مرحلة لاحقة إلى الحالية لمجرد وجود علاقة مفاهيمية بينها.

### Product Priority

بعد إغلاق Phase 3 وPhase 4 وPhase 5، تكون الأولوية للوصول إلى **Phase 6 — Core Functional Blueprints**.

لا تضاف مرحلة جديدة بين Phase 5 وPhase 6 إلا لسبب جوهري موثق؛ ولا يؤخر Functional ERP work بسبب السعي إلى Platform أو Infrastructure perfection.

### Planning Inflation Warning

يجب إصدار تنبيه صريح باسم:

> **Planning Inflation Warning**

إذا ظهر واحد أو أكثر من الأنماط التالية:

- إضافة Frameworks أسرع من Business Capabilities.
- فتح Research Topics أكثر مما يتم إغلاقه.
- زيادة الملفات دون Decisions فعلية تبررها.
- تأجيل Functional Blueprints بسبب Platform perfection.
- تصميم احتمالات Enterprise متقدمة دون حاجة مثبتة.
- دراسة تفاصيل تنفيذية قبل تثبيت Architecture الأساسي.

عند التعارض بين Planning إضافي والتقدم نحو المنتج، يفضل التقدم ما لم يوجد Risk جوهري مثبت.

---

## الحالة الحالية

Planning / Research / Discovery فقط.
