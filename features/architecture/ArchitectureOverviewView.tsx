'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { SourceManifestEntry } from '@/content/models/knowledge';
import type { ExtractedGuardrailsDocument } from '@/content/extractors/guardrailsExtractor';
import { getSnapshotProvenance } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { DiagramContainer } from '@/components/visualization/DiagramContainer';
import { QueryParamSync } from '@/components/navigation/QueryParamSync';
import { ArchitectureOverviewDiagram } from '@/features/architecture/ArchitectureOverviewDiagram';
import { cn } from '@/lib/utils';

export interface ArchitectureOverviewViewProps {
  guardrailsSourceEntry?: SourceManifestEntry;
  extractedGuardrails: ExtractedGuardrailsDocument;
}

export function ArchitectureOverviewView({
  guardrailsSourceEntry,
  extractedGuardrails,
}: ArchitectureOverviewViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const isRtl = isAr;
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const [expandedNumbers, setExpandedNumbers] = useState<ReadonlySet<number>>(
    () => new Set([1])
  );
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  const handleGuardrailQueryParam = useCallback(
    (paramValue: string | null) => {
      if (!paramValue) return;
      const num = Number.parseInt(paramValue.trim(), 10);
      if (
        Number.isInteger(num) &&
        extractedGuardrails.guardrails.some((g) => g.sequenceNumber === num)
      ) {
        setExpandedNumbers((prev) => {
          const next = new Set(prev);
          next.add(num);
          return next;
        });
        setHighlightedNumber(num);
        if (typeof document !== 'undefined') {
          window.requestAnimationFrame(() => {
            const el = document.getElementById(`guardrail-${num}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    },
    [extractedGuardrails.guardrails]
  );

  const toggleGuardrail = (seq: number) => {
    setExpandedNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(seq)) {
        next.delete(seq);
      } else {
        next.add(seq);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedNumbers(
      new Set(extractedGuardrails.guardrails.map((g) => g.sequenceNumber))
    );
  };

  const collapseAll = () => {
    setExpandedNumbers(new Set());
  };

  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <PageContainer>
      <QueryParamSync
        paramName="guardrail"
        onValue={handleGuardrailQueryParam}
      />

      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification="official"
              label={t('classification.official.label')}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <span className="font-mono text-xs text-text-muted bidi-ltr">
              CROSS_PHASE_PRODUCT_GUARDRAILS.md
            </span>
          </>
        }
        title={
          isAr
            ? 'المعمارية العامة وضوابط المنتج العابرة للمراحل'
            : 'Architecture Overview & Cross-Phase Product Guardrails'
        }
        subtitle={
          isAr
            ? 'المنظور الطبقي المعتمد لمنتج Teranoo ERP (4 وحدات تجارية أساسية فوق 12 قدرة منصة تشغيلية)، مقرونًا بالضوابط المعمارية الثمانية العابرة للمراحل والنماذج التوضيحية المفهومية.'
            : 'Approved layered architecture of Teranoo ERP (4 Core Business Modules over 12 runtime platform capability frameworks), paired with all 8 official Cross-Phase Product Guardrails and conceptual diagrams.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/knowledge/cross-phase-product-guardrails"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'قراءة وثيقة الضوابط الكاملة'
                  : 'Read Full Guardrails Source'}
              </span>
            </Link>
            <Link
              href="/decisions"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr ? 'سجل القرارات (126)' : 'Decision Register (126)'}
              </span>
            </Link>
          </div>
        }
        meta={
          guardrailsSourceEntry ? (
            <>
              <code className="font-mono text-xs bidi-ltr text-text-secondary">
                {guardrailsSourceEntry.sourcePath}
              </code>
              <span aria-hidden="true">·</span>
              <span>
                {t(
                  `foundations.sourceManifest.importStatuses.${guardrailsSourceEntry.importStatus}`
                )}
              </span>
            </>
          ) : undefined
        }
      />

      {/* Verified Layered Architecture Diagram (Official) */}
      <section
        aria-label={isAr ? 'المخطط المعماري الطبقي المعتمد' : 'Approved Layered Architecture'}
        className="space-y-3"
      >
        <SectionHeader
          title={
            isAr
              ? 'الهيكل الطبقي المعتمد لمنصة Teranoo ERP'
              : 'Approved Teranoo ERP Layered Architecture'
          }
          subtitle={
            isAr
              ? 'أربع وحدات تجارية أساسية تستند إلى 12 إطار قدرة تشغيلية معتمدة في المرحلة 5 (البند 13 D-PLAT-13 بوابة اعتماد تجميعي وليس قدرة تشغيلية رقم 13).'
              : 'Four Core Business Modules built over 12 approved runtime platform capability frameworks from Phase 5 (item 13 D-PLAT-13 is a consolidated adoption gate, not a 13th runtime capability).'
          }
        />
        <ArchitectureOverviewDiagram />
      </section>

      {/* Eight Official Cross-Phase Product Guardrails */}
      <section
        aria-label={
          isAr
            ? 'ضوابط المنتج العابرة للمراحل (1–8)'
            : 'Cross-Phase Product Guardrails (1–8)'
        }
        className="space-y-4 pt-2"
      >
        <SectionHeader
          title={
            isAr
              ? 'ضوابط المنتج العابرة للمراحل (1 — 8)'
              : 'Official Cross-Phase Product Guardrails (1 — 8)'
          }
          subtitle={
            isAr
              ? 'مستخرجة مباشرة من CROSS_PHASE_PRODUCT_GUARDRAILS.md مع الحفاظ الدقيق على الترقيم والعناوين الرسمية (1–8) دون اختراع معرفات بديلة.'
              : 'Deterministically extracted from CROSS_PHASE_PRODUCT_GUARDRAILS.md preserving exact official numbering (1–8) and titles with zero invented IDs.'
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                {isAr ? 'توسيع الكل' : 'Expand all'}
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                {isAr ? 'طي الكل' : 'Collapse all'}
              </button>
            </div>
          }
        />

        {/* Quick-Jump Numbered Index */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {extractedGuardrails.guardrails.map((g) => (
            <button
              key={g.sequenceNumber}
              type="button"
              onClick={() => {
                setExpandedNumbers((prev) => {
                  const next = new Set(prev);
                  next.add(g.sequenceNumber);
                  return next;
                });
                setHighlightedNumber(g.sequenceNumber);
                const el = document.getElementById(`guardrail-${g.sequenceNumber}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-start gap-2.5 rounded-md border border-border bg-surface p-3 text-start transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary-subtle font-mono text-xs font-bold text-primary">
                {g.sequenceNumber}
              </span>
              <span className="line-clamp-2 text-xs font-medium leading-snug text-text-primary">
                {isAr ? g.arabicTitle : g.originalTitle}
              </span>
            </button>
          ))}
        </div>

        {/* Guardrails Accordion Cards */}
        <div className="space-y-3">
          {extractedGuardrails.guardrails.map((guardrail) => {
            const isExpanded = expandedNumbers.has(guardrail.sequenceNumber);
            const isHighlighted = highlightedNumber === guardrail.sequenceNumber;
            return (
              <article
                key={guardrail.sequenceNumber}
                id={`guardrail-${guardrail.sequenceNumber}`}
                className={cn(
                  'scroll-mt-24 rounded-lg border bg-surface transition-colors',
                  isHighlighted
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border'
                )}
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleGuardrail(guardrail.sequenceNumber)}
                  className="flex w-full items-start justify-between gap-4 p-4 sm:p-5 text-start"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-class-official-border bg-class-official-bg px-1.5 font-mono text-xs font-bold text-class-official">
                        {guardrail.sequenceNumber}.
                      </span>
                      <span className="font-mono text-xs font-semibold text-text-primary bidi-ltr">
                        {guardrail.sequenceNumber}. Guardrail — {guardrail.originalTitle}
                      </span>
                    </div>
                    {isAr ? (
                      <h3 className="text-base font-semibold text-text-primary">
                        {guardrail.arabicTitle}
                      </h3>
                    ) : null}
                    <p
                      dir={/^[A-Za-z]/.test(guardrail.governingPrinciple) ? 'ltr' : undefined}
                      className="text-xs leading-relaxed text-text-secondary text-start"
                    >
                      {guardrail.governingPrinciple}
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 text-text-muted" aria-hidden="true">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {isExpanded ? (
                  <div className="border-t border-border px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                    {/* Approved Rules & Prohibited Approaches */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-md border border-success-border/60 bg-success-bg/30 p-3.5 space-y-2">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isAr ? 'القواعد والضوابط المعتمدة' : 'Approved Guardrail Rules'}
                          </span>
                        </h4>
                        <ul className="space-y-1.5">
                          {guardrail.approvedRules.map((rule) => (
                            <li
                              key={rule}
                              className="text-xs leading-relaxed text-text-primary"
                            >
                              • {rule}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        {guardrail.prohibitedApproaches.length > 0 ? (
                          <div className="rounded-md border border-danger-border/60 bg-danger-bg/30 p-3.5 space-y-2">
                            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                              <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {isAr ? 'الممارسات الممنوعة' : 'Prohibited Approaches'}
                              </span>
                            </h4>
                            <ul className="space-y-1.5">
                              {guardrail.prohibitedApproaches.map((proh) => (
                                <li
                                  key={proh}
                                  className="text-xs leading-relaxed text-text-primary"
                                >
                                  • {proh}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {guardrail.deferredDetails.length > 0 ? (
                          <div className="rounded-md border border-border bg-surface-secondary/50 p-3.5 space-y-2">
                            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {isAr
                                  ? 'التفاصيل المؤجلة (لم تُغلق مبكرًا)'
                                  : 'Deferred Details (Not Locked Early)'}
                              </span>
                            </h4>
                            <ul className="space-y-1.5">
                              {guardrail.deferredDetails.map((def) => (
                                <li
                                  key={def}
                                  className="text-xs leading-relaxed text-text-secondary"
                                >
                                  • {def}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Educational Context — Explicitly Separated from Official Text */}
                    <div className="rounded-md border border-class-educational-border bg-class-educational-bg/40 p-3.5 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <GraduationCap
                          className="h-3.5 w-3.5 text-class-educational"
                          aria-hidden="true"
                        />
                        <ContentClassification
                          classification="educational"
                          label={t('classification.educational.shortLabel')}
                        />
                        <span className="text-xs font-semibold text-text-primary">
                          {isAr ? 'لماذا يهم هذا الضابط معماريًا؟' : 'Why This Guardrail Matters Architecturally'}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-text-secondary">
                        {resolveLocalizedText(guardrail.whyItMatters, locale)}
                      </p>
                      <p className="text-xs leading-relaxed text-text-primary">
                        {resolveLocalizedText(guardrail.educationalTakeaway, locale)}
                      </p>
                    </div>

                    {/* Footer: Owner Phases + Direct Anchor to Full Official Source */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-text-muted">
                          {isAr ? 'المراحل المالكة:' : 'Owner Phases:'}
                        </span>
                        {guardrail.ownerPhases.map((phaseId) => (
                          <Link
                            key={phaseId}
                            href={`/roadmap?phase=${encodeURIComponent(phaseId)}`}
                            className="rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[11px] text-text-secondary hover:border-primary/40 hover:text-primary bidi-ltr"
                          >
                            {phaseId}
                          </Link>
                        ))}
                      </div>

                      <Link
                        href={`/knowledge/${guardrail.sourceDocumentSlug}#${guardrail.sourceSectionAnchor}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {isAr ? 'النص الحرفي في المصدر الرسمي' : 'Verbatim Section in Official Source'}
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* Official Governance Rule */}
        {extractedGuardrails.governanceRule ? (
          <InformationCallout
            title={
              isAr
                ? 'قاعدة الحوكمة الرسمية للضوابط (Governance Rule)'
                : 'Official Guardrails Governance Rule'
            }
          >
            {extractedGuardrails.governanceRule}
          </InformationCallout>
        ) : null}
      </section>

      {/* Conceptual Illustrative Diagrams (Strictly Labeled Illustrative — NOT Implemented Runtime) */}
      <section
        aria-label={
          isAr
            ? 'نماذج معمارية مفهومية توضيحية'
            : 'Conceptual Illustrative Architecture Diagrams'
        }
        className="space-y-4 pt-2"
      >
        <SectionHeader
          title={
            isAr
              ? 'مخططات مفهومية توضيحية للضوابط المعمارية'
              : 'Conceptual Illustrative Diagrams of Core Guardrails'
          }
          subtitle={
            isAr
              ? 'تمثيلات بصرية تعليمية مستندة إلى الضوابط 1 و2 و3 و6 و8 لتسهيل الفهم المعماري — لا تمثل مكونات برمجية منفذة أو بنية تشغيلية نهائية.'
              : 'Educational visual models grounded in Guardrails 1, 2, 3, 6, and 8 — conceptual illustrations only, NOT implemented runtime components or final infrastructure topology.'
          }
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Diagram 1: Single Product Core & Customization Hierarchy */}
          <DiagramContainer
            title={
              isAr
                ? '1. هرمية التخصيص فوق النواة الموحدة'
                : '1. Single-Core Customization Hierarchy'
            }
            caption={
              isAr
                ? 'تمثيل مفهومي للضابطين 1 و3 — التكييف يتدرج دون تشعيب النواة أو الوصول المباشر لقاعدة البيانات.'
                : 'Conceptual illustration of Guardrails 1 & 3 — customization layers without core forks or direct DB coupling.'
            }
            classificationSlot={
              <ContentClassification
                classification="illustrative"
                label={t('classification.illustrative.shortLabel')}
              />
            }
          >
            <div className="space-y-2 text-xs">
              <div className="rounded-md border border-primary/40 bg-primary-subtle/50 p-2.5">
                <p className="font-semibold text-primary">
                  {isAr ? 'الطبقة 1: النواة الموحدة (Single Canonical Core)' : 'Layer 1: Single Canonical ERP Core'}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {isAr ? 'شيفرة واحدة مشتركة قابلة للترقية لكل العملاء' : 'One shared upgradeable core across all customers'}
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/60 p-2.5">
                <p className="font-semibold text-text-primary">
                  {isAr ? 'الطبقة 2: التهيئة والبيانات الوصفية (Typed Config)' : 'Layer 2: Typed Configuration & Metadata'}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {isAr ? 'المسار الأول المفضل لتكييف سلوك الوحدات' : 'First-choice adaptation path without custom code'}
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/60 p-2.5">
                <p className="font-semibold text-text-primary">
                  {isAr ? 'الطبقة 3: امتدادات رسمية معزولة' : 'Layer 3: Supported Upgrade-Safe Extensions'}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {isAr ? 'نقاط توسعة معتمدة بعقود توافق واضحة' : 'Explicit compatibility contracts isolating extensions'}
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/60 p-2.5">
                <p className="font-semibold text-text-primary">
                  {isAr ? 'الطبقة 4: واجهات برمجية وأحداث مرقّمة' : 'Layer 4: Versioned Public APIs & Events'}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {isAr ? 'تكامل خارجي منضبط مع سياسة إيقاف تدريجي' : 'Stable external contracts with deprecation lifecycle'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-danger-border/60 bg-danger-bg/30 px-2.5 py-2 text-[11px] font-medium text-danger">
                <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {isAr
                    ? 'ممنوع: تشعيب النواة لكل عميل أو الربط المباشر بقاعدة البيانات'
                    : 'Blocked: Per-customer core forks & direct DB coupling'}
                </span>
              </div>
            </div>
          </DiagramContainer>

          {/* Diagram 2: Environment Configuration Promotion Pipeline */}
          <DiagramContainer
            title={
              isAr
                ? '2. خط ترقية التهيئة عبر البيئات'
                : '2. Configuration Promotion Pipeline'
            }
            caption={
              isAr
                ? 'تمثيل مفهومي للضابطين 2 و8 — نقل الإعدادات كحزم مهيكلة قابلة للمقارنة والتدقيق بدل الإدخال اليدوي.'
                : 'Conceptual illustration of Guardrails 2 & 8 — structured, diffable, auditable config packages across environments.'
            }
            classificationSlot={
              <ContentClassification
                classification="illustrative"
                label={t('classification.illustrative.shortLabel')}
              />
            }
          >
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {(['Dev', 'Test', 'UAT', 'Prod'] as const).map((env, idx) => (
                  <div
                    key={env}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-secondary/60 px-3 py-2.5"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-text-muted">
                        0{idx + 1}
                      </span>
                      <p className="font-mono text-xs font-semibold text-text-primary bidi-ltr">
                        {env}
                      </p>
                    </div>
                    <DirectionArrow
                      className="h-3.5 w-3.5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-info-border bg-info-bg/40 p-3 space-y-1.5">
                <p className="font-semibold text-info">
                  {isAr
                    ? 'حزمة تهيئة مهيكلة (Versioned Config Package)'
                    : 'Versioned Configuration Package'}
                </p>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {isAr
                    ? 'تصدير · فحص توافق · مقارنة الفروقات (Diff) · اعتماد · سجل تدقيق — منفصلة عن صلاحيات RBAC والترخيص.'
                    : 'Export · Validate · Diff · Approve · Audit Trail — strictly separated from RBAC permissions and entitlements.'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-danger-border/60 bg-danger-bg/30 px-2.5 py-2 text-[11px] font-medium text-danger">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {isAr
                    ? 'ممنوع: إعادة إدخال الإعدادات يدويًا أو خلط Feature Flags مع الصلاحيات'
                    : 'Blocked: Manual re-entry drift or using Feature Flags as RBAC'}
                </span>
              </div>
            </div>
          </DiagramContainer>

          {/* Diagram 3: AI Safety & ERP Control Boundary */}
          <DiagramContainer
            title={
              isAr
                ? '3. حدود أمان الذكاء الاصطناعي وضوابط ERP'
                : '3. AI Safety & ERP Control Boundary'
            }
            caption={
              isAr
                ? 'تمثيل مفهومي للضابط 6 — الذكاء الاصطناعي طبقة مساعدة مقيدة بالكامل بضوابط النظام والاعتماد البشري.'
                : 'Conceptual illustration of Guardrail 6 — AI operates strictly inside tenant, RBAC, approval, and audit boundaries.'
            }
            classificationSlot={
              <ContentClassification
                classification="illustrative"
                label={t('classification.illustrative.shortLabel')}
              />
            }
          >
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 rounded-md border border-class-illustrative-border bg-class-illustrative-bg/40 px-3 py-2">
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 text-class-illustrative"
                  aria-hidden="true"
                />
                <span className="font-semibold text-text-primary">
                  {isAr ? 'طبقة الذكاء الاصطناعي المساعدة (AI Layer)' : 'Assistive AI Layer (Draft / Suggest Only)'}
                </span>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/50 p-3 space-y-1.5">
                <p className="flex items-center gap-1.5 font-semibold text-text-primary">
                  <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>
                    {isAr ? 'بوابات الحماية الإلزامية الأربعة' : 'Four Mandatory Enforcement Gates'}
                  </span>
                </p>
                <ul className="space-y-1 text-[11px] text-text-secondary">
                  <li>1. {isAr ? 'عزل المستأجرين (Strict Tenant Isolation)' : 'Strict Tenant Isolation'}</li>
                  <li>2. {isAr ? 'نفس صلاحيات المستخدم (User RBAC Scope)' : 'Caller RBAC Permission Scope'}</li>
                  <li>3. {isAr ? 'اعتماد بشري للمعاملات الحساسة (Human Approval)' : 'Human Approval on Sensitive Postings'}</li>
                  <li>4. {isAr ? 'سجل تدقيق غير قابل للتعديل (Immutable Audit Trail)' : 'Immutable Audit Trail Logging'}</li>
                </ul>
              </div>
              <div className="rounded-md border border-success-border/60 bg-success-bg/30 px-3 py-2 text-[11px] font-medium text-success">
                {isAr
                  ? 'نواة الترحيل المالي والمخزني الرسمية (Authoritative ERP Core)'
                  : 'Authoritative Financial & Inventory Posting Core'}
              </div>
            </div>
          </DiagramContainer>
        </div>
      </section>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md (${provenance.reviewedCommitSha ? provenance.reviewedCommitSha.slice(0, 12) : provenance.reviewedTreeSha.slice(0, 12)})`}
        identifier="src-pf-04-cross-phase-guardrails"
      />
    </PageContainer>
  );
}
