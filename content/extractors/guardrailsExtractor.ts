import type { LocalizedText } from '@/content/models/types';
import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { BATCH_001_SOURCE_REVISION } from '@/content/manifest/sourceManifest';

export interface GuardrailSubsection {
  readonly heading: string;
  readonly body: string;
  readonly bullets: readonly string[];
}

export interface ExtractedGuardrail {
  /** Sequence number 1..8 as numbered in the official source (NO invented IDs like G-01). */
  readonly sequenceNumber: number;
  readonly originalTitle: string;
  readonly arabicTitle: string;
  readonly governingPrinciple: string;
  readonly whyItMatters: LocalizedText;
  readonly approvedRules: readonly string[];
  readonly prohibitedApproaches: readonly string[];
  readonly ownerPhases: readonly string[];
  readonly deferredDetails: readonly string[];
  readonly subsections: readonly GuardrailSubsection[];
  readonly educationalTakeaway: LocalizedText;
  readonly sourceDocumentSlug: string;
  readonly sourceSectionAnchor: string;
  readonly sourceRevision: string;
}

export interface ExtractedGuardrailsDocument {
  readonly sourceDocumentId: string;
  readonly sourceDocumentSlug: string;
  readonly sourceRevision: string;
  readonly guardrails: readonly ExtractedGuardrail[];
  readonly governanceRule: string;
}

const GUARDRAIL_EDUCATIONAL_CONTEXT: Readonly<
  Record<
    number,
    {
      arabicTitle: string;
      whyItMatters: LocalizedText;
      ownerPhases: readonly string[];
      educationalTakeaway: LocalizedText;
    }
  >
> = {
  1: {
    arabicTitle: 'خط المنتج الموحد والتوسعات الآمنة للترقية',
    whyItMatters: {
      ar: 'يمنع تشعّب الشيفرة الأساسية (Forking) لكل عميل، وهو السبب الأول لفشل ترقية أنظمة ERP المؤسسية وتحولها إلى مشاريع مخصصة مكلفة.',
      en: 'Prevents per-customer core code forks — the single biggest cause of ERP upgrade paralysis and unsustainable bespoke maintenance.',
    },
    ownerPhases: ['phase-2', 'phase-3', 'phase-5', 'phase-6', 'phase-8', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: يعتمد أي ERP تجاري ناجح على نواة واحدة مشتركة مع تدرّج واضح للتكييف: التهيئة أولاً، ثم الامتدادات الرسمية المعزولة، ثم التكامل الخارجي عبر عقود مرقّمة.',
      en: 'Educational interpretation: Sustainable commercial ERPs rely on one canonical core with a strict customization hierarchy: configuration first, supported metadata/extensions second, and versioned external integration third.',
    },
  },
  2: {
    arabicTitle: 'نقل التهيئة والترقية المنضبطة بين البيئات',
    whyItMatters: {
      ar: 'إعادة إدخال الإعدادات يدويًا بين بيئات التطوير والاختبار والإنتاج تؤدي إلى أخطاء مالية وتشغيلية صعبة التتبع وانحراف في سلوك النظام (Configuration Drift).',
      en: 'Manual reconfiguration across Dev/Test/UAT/Production introduces financial errors, breaks auditability, and causes unmanageable configuration drift.',
    },
    ownerPhases: ['phase-3', 'phase-4', 'phase-5', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: معاملة التهيئة المؤسسية كـحزم بيانات مهيكلة قابلة للتصدير والمقارنة (Diff) والتدقيق والمراجعة تُسهم في جعل النشر المؤسسي متكررًا وموثوقًا.',
      en: 'Educational interpretation: Treating enterprise configuration as versioned, exportable, diffable, auditable packages makes multi-environment ERP rollouts repeatable and safe.',
    },
  },
  3: {
    arabicTitle: 'عقود التكامل والتوسعة العامة المرقّمة',
    whyItMatters: {
      ar: 'حماية تكاملات العملاء والامتدادات عند تطوير النواة الداخلية للنظام، ومنع الوصول المباشر لقاعدة البيانات الذي يكسر الأمان والترقية.',
      en: 'Protects customer integrations and extensions during internal core refactoring while blocking direct database coupling that breaks security and upgrades.',
    },
    ownerPhases: ['phase-4', 'phase-5', 'phase-6', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: الفصل الواضح بين الواجهات الداخلية والواجهات العامة المرقّمة مع دورة إيقاف تدريجي (Deprecation) يحفظ استقرار المنظومة دون تجميد تطور النواة.',
      en: 'Educational interpretation: Separating internal implementation from versioned public APIs/events with deprecation rules lets the ERP core evolve without breaking customer ecosystems.',
    },
  },
  4: {
    arabicTitle: 'ترحيل بيانات العملاء المنضبط وحق خروج البيانات',
    whyItMatters: {
      ar: 'نجاح التحول إلى ERP جديد يعتمد على ترحيل نظيف ومُدقّق للبيانات الرئيسية والأرصدة الافتتاحية، كما أن ثقة المؤسسات تتطلب ضمان حقها في استخراج بياناتها بطريقة منظمة.',
      en: 'ERP onboarding succeeds or fails on validated master data and opening-balance migration, and enterprise trust requires structured, auditable data exit rights.',
    },
    ownerPhases: ['phase-3', 'phase-5', 'phase-6', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: يجب أن تمر عمليات الترحيل عبر مسارات تحقق وقواعد عمل وتدقيق (وليس عبر إدخال SQL خام)، مع توفير بوابات تصدير واضحة تحترم حدود الصلاحيات وعزل العملاء.',
      en: 'Educational interpretation: Data migration must flow through validated business rules and audit controls (not raw SQL bypasses), paired with authorized, tenant-isolated export capabilities.',
    },
  },
  5: {
    arabicTitle: 'المعالجة الخلفية المشتركة وقابلية دعم المنتج',
    whyItMatters: {
      ar: 'العمليات الثقيلة مثل الترحيل الجماعي وإغلاق الفترات وإنتاج التقارير الضخمة يجب ألا تجمّد واجهة المستخدم أو تؤثر على عملاء آخرين في بيئة متعددة العملاء.',
      en: 'Heavy ERP workloads (batch posting, period close, bulk imports, large reports) must never block interactive users or degrade neighboring tenants.',
    },
    ownerPhases: ['phase-4', 'phase-5', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: فصل التنفيذ غير المتزامن (Background Jobs) مع ربطه بهوية العميل وقابلية التتبع وإعادة المحاولة الآمنة (Idempotency) هو ركيزة استقرار وتشخيص أنظمة ERP.',
      en: 'Educational interpretation: Tenant-aware asynchronous execution with correlation IDs, safe retries/idempotency, and diagnostics is foundational to ERP operational reliability.',
    },
  },
  6: {
    arabicTitle: 'أمان وحوكمة الذكاء الاصطناعي وحماية ضوابط ERP',
    whyItMatters: {
      ar: 'الذكاء الاصطناعي في ERP يلامس قيودًا مالية وبيانات سرية؛ السماح له بتجاوز الصلاحيات أو ترحيل قيود محاسبية دون اعتماد بشري يُدمّر الرقابة الداخلية والامتثال.',
      en: 'AI inside an ERP touches financial postings and confidential records; letting AI bypass RBAC, tenant isolation, or human approval destroys internal controls and compliance.',
    },
    ownerPhases: ['phase-3', 'phase-5', 'phase-6', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: يُعامل الذكاء الاصطناعي كطبقة مساعدة خاضعة لنفس الصلاحيات ونطاق العزل وسير الموافقات وسجل التدقيق، مع إبقاء المعاملات الحساسة تحت اعتماد بشري صريح.',
      en: 'Educational interpretation: AI must operate strictly inside existing RBAC, tenant isolation, approval workflows, and audit trails, keeping high-impact ERP postings human-approved.',
    },
  },
  7: {
    arabicTitle: 'معالجة المعاملات المتصلة فقط وحفظ المسودات الآمن',
    whyItMatters: {
      ar: 'تجنب تعقيد المزامنة الكاملة دون اتصال (Offline Sync) ومشاكل تضارب القيود المالية والمخزنية، مع حماية عمل المستخدم من الضياع عند انقطاع الشبكة اللحظي.',
      en: 'Avoids fragile offline financial/inventory conflict resolution while protecting operators from losing unsaved form work during brief network drops.',
    },
    ownerPhases: ['phase-4', 'phase-5', 'phase-6', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: التمييز بين «المسودة المؤقتة القابلة للاستعادة» و«المعاملة الرسمية المعتمدة والمُرحّلة» يحمي سلامة البيانات المالية والمخزنية مع تجربة استخدام آمنة.',
      en: 'Educational interpretation: Separating recoverable local drafts from authoritative online server-side posting preserves financial and inventory integrity without sacrificing user resilience.',
    },
  },
  8: {
    arabicTitle: 'تهيئة المنتج والتحكم بالميزات (Configuration & Feature Control)',
    whyItMatters: {
      ar: 'يمنع تحوّل المنتج إلى متاهة غير منضبطة من الخيارات العشوائية أو الاعتماد على تبديل الميزات (Feature Toggles) كبديل عن الصلاحيات أو ضوابط سير العمل.',
      en: 'Prevents unmanaged key/value sprawl and stops feature flags from being misused as a shadow permission system or workflow bypass.',
    },
    ownerPhases: ['phase-3', 'phase-5', 'phase-6', 'phase-10'],
    educationalTakeaway: {
      ar: 'تفسير تعليمي: فصل الإعدادات إلى فئات مهيكلة بعقود واضحة (Typed Contracts) وفصل تفعيل الميزة عن الصلاحية والترخيص يحفظان قابلية التنبؤ والتدقيق في التهيئة.',
      en: 'Educational interpretation: Organizing configuration into typed contracts and separating feature activation from entitlements and RBAC keeps ERP behavior predictable and auditable.',
    },
  },
};

function cleanMarkdownInline(text: string): string {
  return text
    .replace(/^>+\s*/g, '')
    .replace(/^#{1,6}\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function splitSectionLines(lines: readonly string[]): {
  body: string;
  blockquote: string;
  bullets: string[];
} {
  const prose: string[] = [];
  const blockquotes: string[] = [];
  const bullets: string[] = [];
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '---') continue;
    if (trimmed.startsWith('>')) {
      const cleaned = cleanMarkdownInline(trimmed);
      if (cleaned) blockquotes.push(cleaned);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bullets.push(cleanMarkdownInline(trimmed.slice(2)));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      bullets.push(cleanMarkdownInline(trimmed.replace(/^\d+\.\s+/, '')));
    } else {
      const cleaned = cleanMarkdownInline(trimmed);
      if (cleaned) prose.push(cleaned);
    }
  }
  const combinedProse =
    blockquotes.length > 0 && prose.length > 0
      ? [...blockquotes, ...prose].join(' ')
      : blockquotes.length > 0
        ? blockquotes.join(' ')
        : prose.join(' ');
  return {
    body: combinedProse,
    blockquote: blockquotes.join(' '),
    bullets,
  };
}

/**
 * Pure, deterministic extractor for CROSS_PHASE_PRODUCT_GUARDRAILS.md.
 * Preserves the exact original numbered titles (1..8) without inventing artificial IDs.
 */
export function parseGuardrailsMarkdown(
  markdown: string,
  options?: {
    readonly sourceDocumentId?: string;
    readonly sourceDocumentSlug?: string;
    readonly sourceRevision?: string;
  }
): ExtractedGuardrailsDocument {
  const sourceDocumentId =
    options?.sourceDocumentId ?? 'kh-doc-cross-phase-guardrails-ar';
  const sourceDocumentSlug =
    options?.sourceDocumentSlug ?? 'cross-phase-product-guardrails';
  const sourceRevision =
    options?.sourceRevision ?? BATCH_001_SOURCE_REVISION.commitSha;

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const guardrails: ExtractedGuardrail[] = [];
  let governanceRuleLines: string[] = [];
  let inGovernanceRule = false;

  let i = 0;
  while (i < lines.length) {
    const line = (lines[i] ?? '').trim();

    if (/^#\s+Governance Rule/i.test(line)) {
      inGovernanceRule = true;
      governanceRuleLines = [];
      i += 1;
      continue;
    }

    if (inGovernanceRule) {
      if (/^#\s+/.test(line)) {
        inGovernanceRule = false;
        i += 1;
        continue;
      }
      if (line && line !== '---') {
        governanceRuleLines.push(cleanMarkdownInline(line));
      }
      i += 1;
      continue;
    }

    const guardrailMatch = line.match(/^##\s+(\d+)\.\s+Guardrail\s+—\s+(.+)$/);
    if (guardrailMatch && guardrailMatch[1] && guardrailMatch[2]) {
      const sequenceNumber = Number.parseInt(guardrailMatch[1], 10);
      const originalTitle = guardrailMatch[2].trim();
      const fullHeading = `${sequenceNumber}. Guardrail — ${originalTitle}`;
      const sourceSectionAnchor = `${HEADING_ID_PREFIX}${createHeadingSlug(fullHeading)}`;

      const sectionLines: string[] = [];
      i += 1;
      while (i < lines.length) {
        const peek = (lines[i] ?? '').trim();
        if (/^#{1,2}\s+/.test(peek)) {
          break;
        }
        sectionLines.push(lines[i] ?? '');
        i += 1;
      }

      const subsections: GuardrailSubsection[] = [];
      let principleBlockquote = '';
      let currentSubHeading: string | null = null;
      let currentSubLines: string[] = [];

      const flushSub = () => {
        if (currentSubHeading) {
          const { body, blockquote, bullets } = splitSectionLines(currentSubLines);
          if (currentSubHeading === 'المبدأ' && blockquote) {
            principleBlockquote = blockquote;
          }
          if (body || bullets.length > 0) {
            subsections.push({
              heading: currentSubHeading,
              body,
              bullets,
            });
          }
        }
        currentSubHeading = null;
        currentSubLines = [];
      };

      for (const sRaw of sectionLines) {
        const sLine = sRaw.trim();
        const subMatch = sLine.match(/^###\s+(.+)$/);
        if (subMatch && subMatch[1]) {
          flushSub();
          currentSubHeading = subMatch[1].trim();
          continue;
        }
        if (currentSubHeading) {
          currentSubLines.push(sRaw);
        }
      }
      flushSub();

      const principleSub = subsections.find((s) => s.heading === 'المبدأ');
      const governingPrinciple =
        principleBlockquote ||
        principleSub?.body ||
        principleSub?.bullets[0] ||
        originalTitle;

      const deferredSub = subsections.find(
        (s) => s.heading === 'التفاصيل المؤجلة' || s.heading === 'ما لم يُعتمد الآن'
      );
      const deferredDetails = deferredSub
        ? deferredSub.bullets.length > 0
          ? deferredSub.bullets
          : deferredSub.body
            ? [deferredSub.body]
            : []
        : [];

      const ruleSubs = subsections.filter(
        (s) =>
          s.heading !== 'المبدأ' &&
          s.heading !== 'التفاصيل المؤجلة' &&
          s.heading !== 'ما لم يُعتمد الآن' &&
          !s.heading.includes('أمثلة')
      );

      const allRuleBullets = ruleSubs.flatMap((s) =>
        s.bullets.length > 0 ? s.bullets : s.body ? [s.body] : []
      );

      const prohibitedApproaches = allRuleBullets.filter((b) =>
        /(^لا\s|^يُمنع|^ممنوع|لا يُسمح|لا يجوز|لا يتم|ليس بديلاً|لا تكسر)/u.test(b)
      );
      const approvedRules = allRuleBullets.filter(
        (b) => !prohibitedApproaches.includes(b)
      );

      const ctx = GUARDRAIL_EDUCATIONAL_CONTEXT[sequenceNumber] ?? {
        arabicTitle: originalTitle,
        whyItMatters: {
          ar: governingPrinciple,
          en: originalTitle,
        },
        ownerPhases: ['phase-5', 'phase-6', 'phase-10'],
        educationalTakeaway: {
          ar: governingPrinciple,
          en: originalTitle,
        },
      };

      guardrails.push({
        sequenceNumber,
        originalTitle,
        arabicTitle: ctx.arabicTitle,
        governingPrinciple,
        whyItMatters: ctx.whyItMatters,
        approvedRules,
        prohibitedApproaches,
        ownerPhases: ctx.ownerPhases,
        deferredDetails,
        subsections,
        educationalTakeaway: ctx.educationalTakeaway,
        sourceDocumentSlug,
        sourceSectionAnchor,
        sourceRevision,
      });

      continue;
    }

    i += 1;
  }

  if (guardrails.length === 0) {
    throw new Error(
      'Guardrails extraction failed: zero guardrails found in CROSS_PHASE_PRODUCT_GUARDRAILS.md.'
    );
  }

  return {
    sourceDocumentId,
    sourceDocumentSlug,
    sourceRevision,
    guardrails,
    governanceRule: governanceRuleLines.join(' '),
  };
}

let cachedGuardrails: ExtractedGuardrailsDocument | null = null;

export function getExtractedGuardrails(): ExtractedGuardrailsDocument {
  if (cachedGuardrails) {
    return cachedGuardrails;
  }

  const registry = getContentRegistry();
  const doc = registry.getBySlug('cross-phase-product-guardrails');
  if (!doc) {
    throw new Error(
      'Published official CROSS_PHASE_PRODUCT_GUARDRAILS.md document ("cross-phase-product-guardrails") is missing from the Content Registry.'
    );
  }

  cachedGuardrails = parseGuardrailsMarkdown(doc.bodyMarkdown, {
    sourceDocumentId: doc.metadata.id,
    sourceDocumentSlug: doc.metadata.slug,
    sourceRevision:
      doc.metadata.source.kind === 'official-source'
        ? doc.metadata.source.commitSha ?? BATCH_001_SOURCE_REVISION.commitSha
        : BATCH_001_SOURCE_REVISION.commitSha,
  });

  return cachedGuardrails;
}

export function resetExtractedGuardrailsCache(): void {
  cachedGuardrails = null;
}
