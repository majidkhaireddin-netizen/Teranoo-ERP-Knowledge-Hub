---
id: kh-fixture-unsafe-markdown
slug: unsafe-markdown-fixture
title:
  ar: "عينة اختبارية لمحتوى Markdown غير آمن"
  en: "Unsafe Markdown Sanitization Fixture"
description:
  ar: "اختبار تعقيم HTML والروابط الخطرة مثل javascript: و data:."
  en: "Security test fixture containing raw script tags, event handlers, and unsafe URL protocols."
language: en
type: educational-explanation
classification: educational
editorialStatus: published
publicationStatus: public
approvalStatus: not-applicable
implementationStatus: not-applicable
depth: L1
journeyStages:
  - engineering
phaseRefs: []
moduleRefs: []
domainRefs: []
topics:
  - security
tags:
  - security-fixture
traceability:
  decisionIds: []
relationships: []
source:
  kind: knowledge-hub-authored
  publisher: "Security Test Fixture"
  attribution: "Security Test Fixture"
publicationAuthorization:
  authorized: true
  completeness: complete
versioning:
  revision: 1
---

## Security Check

<script>alert('xss')</script>

<img src="x" onerror="alert('xss')" />

[Unsafe JS Link](javascript:alert(1))

![Unsafe Data Image](data:text/html;base64,PHNjcmlwdD4=)

[Safe HTTPS Link](https://example.com/safe-doc)
