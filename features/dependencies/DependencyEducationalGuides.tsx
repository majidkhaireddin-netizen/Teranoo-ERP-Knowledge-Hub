'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  BookOpen,
  Compass,
  Database,
  FileText,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type {
  ConceptualEducationalExample,
  DataOwnershipDesignGuide,
  DependencyClassificationGuide,
  DependencyEducationalProvenance,
  EducationalSourceAnchorRef,
} from '@/content/extractors/dependencyEducationalContent';
import { useAppLocale } from '@/providers/LocaleProvider';
import { cn } from '@/lib/utils';

export function SourceAnchorLinksStrip({
  refs,
  label,
}: {
  refs: readonly EducationalSourceAnchorRef[];
  label?: string;
}) {
  const { locale } = useAppLocale();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
      {label ? (
        <span className="font-medium text-text-muted">{label}</span>
      ) : null}
      {refs.map((ref) => (
        <Link
          key={`${ref.documentSlug}#${ref.sectionAnchor}`}
          href={`/knowledge/${ref.documentSlug}#${ref.sectionAnchor}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{resolveLocalizedText(ref.sectionLabel, locale)}</span>
        </Link>
      ))}
    </div>
  );
}

export function DependencyProvenanceStrip({
  provenance,
  pinnedDocumentSlugs,
}: {
  provenance: DependencyEducationalProvenance;
  pinnedDocumentSlugs?: readonly string[];
}) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  const relevantSources = pinnedDocumentSlugs
    ? provenance.sources.filter((s) =>
        pinnedDocumentSlugs.includes(s.documentSlug)
      )
    : provenance.sources;

  const isStale =
    provenance.mappingFreshnessStatus === 'review-required-source-changed' ||
    relevantSources.some((s) => s.status === 'review-required-source-changed');

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-xs space-y-2.5',
        isStale
          ? 'border-danger-border bg-danger-bg/60 text-text-primary'
          : 'border-border bg-surface-secondary/50 text-text-secondary'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-text-primary font-medium">
          {isStale ? (
            <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
          )}
          <span>
            {isAr
              ? 'إسقاط تعليمي مُراجع (منفصل عن النص الرسمي وخط الأساس التاريخي)'
              : 'Curated Educational Projection (Distinct from Verbatim Source & Historical Baseline)'}
          </span>
          <span aria-hidden="true" className="text-text-muted">·</span>
          <span
            className={cn(
              'rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold',
              isStale
                ? 'border-danger-border bg-danger-bg text-danger'
                : 'border-success-border bg-success-bg text-success'
            )}
          >
            {isStale
              ? isAr
                ? 'يتطلب مراجعة — لا يُعتمد كمعرفة حالية'
                : 'Review Required — Do Not Treat as Current Verified Knowledge'
              : isAr
                ? 'مُراجَع ومطابق للمصدر المثبت'
                : 'Reviewed Against Pinned Source'}
          </span>
        </div>

        <span className="text-[11px] text-text-muted">
          {isAr ? 'آخر مراجعة: ' : 'Last reviewed: '}
          <span className="font-mono tabular-nums bidi-ltr">
            {provenance.lastCuratedReviewDate}
          </span>
        </span>
      </div>

      <p className="leading-relaxed">
        {resolveLocalizedText(provenance.disclosure, locale)}
      </p>

      {isStale && provenance.reviewWarning ? (
        <div className="rounded-md border border-danger-border bg-surface px-3 py-2 text-danger space-y-1">
          <p className="font-semibold leading-relaxed">
            {resolveLocalizedText(provenance.reviewWarning, locale)}
          </p>
          <p className="text-[11px] text-text-primary">
            {isAr
              ? 'تعليمات الحوكمة (KH-037): لا تعامل الشروحات المنظمة هنا كمعرفة موثقة حالية حتى تجري مراجعتها؛ افتح الوثائق الرسمية الكاملة أدناه كمرجع أعلى.'
              : 'Governance guard (KH-037): do NOT treat curated summaries here as current verified knowledge until reviewed; read the verbatim official sources linked below directly.'}
          </p>
        </div>
      ) : null}

      {/* Four Explicit Knowledge States Distinction (KH-037) */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-surface px-2.5 py-1.5 text-[11px] text-text-secondary">
        <span className="font-semibold text-text-primary">
          {isAr ? 'حالات المعرفة الأربع:' : '4 Knowledge States:'}
        </span>
        <span>
          {isAr ? '1. مصدر رسمي حرفي' : '1. Verbatim Official Source'}
        </span>
        <span aria-hidden="true">·</span>
        <span className={!isStale ? 'font-semibold text-success' : 'text-text-muted line-through'}>
          {isAr ? '2. إسقاط تعليمي مُراجع' : '2. Reviewed Educational Projection'}
        </span>
        <span aria-hidden="true">·</span>
        <span className={isStale ? 'font-semibold text-danger' : 'text-text-muted'}>
          {isAr ? '3. إسقاط يتطلب مراجعة' : '3. Projection Requiring Review'}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {isAr ? '4. خط أساس تاريخي (397a94e0d82f)' : '4. Historical Baseline (397a94e0d82f)'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 border-t border-border/70 text-[11px] text-text-muted">
        {relevantSources.map((src) => {
          const srcStale = src.status === 'review-required-source-changed';
          return (
            <Link
              key={src.key}
              href={`/knowledge/${src.documentSlug}`}
              dir="ltr"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 hover:underline',
                srcStale
                  ? 'border border-danger-border bg-danger-bg text-danger font-semibold'
                  : 'hover:text-primary'
              )}
            >
              <span className="font-mono">{src.documentSlug}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                rev {(src.actualSourceRevision ?? 'missing').slice(0, 8)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                sha {src.actualSourceBodySha256.slice(0, 8)}
              </span>
              {srcStale ? <span>(DRIFT)</span> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ConceptualExampleCard({
  example,
}: {
  example: ConceptualEducationalExample;
}) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  return (
    <article className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="font-semibold text-primary">
              {isAr
                ? 'مثال تعليمي مفاهيمي (لا يُنشئ متطلبات جديدة)'
                : 'Conceptual Educational Example (No New Functional Requirements)'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono bidi-ltr">
              {example.relatedIdentifiers.join(' · ')}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-text-primary">
            {resolveLocalizedText(example.title, locale)}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            {isAr ? 'السيناريو المفاهيمي' : 'Conceptual Scenario'}
          </p>
          <p className="leading-relaxed text-text-secondary">
            {resolveLocalizedText(example.scenarioSummary, locale)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            {isAr ? 'القاعدة المعمارية المعتمدة' : 'Approved Boundary Rule'}
          </p>
          <p className="leading-relaxed text-text-primary">
            {resolveLocalizedText(example.boundaryRule, locale)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            {isAr ? 'الأثر لو تم خرق الحدود' : 'Why Violating This Boundary Breaks ERP'}
          </p>
          <p className="leading-relaxed text-text-secondary">
            {resolveLocalizedText(
              example.architecturalConsequenceIfViolated,
              locale
            )}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/70">
        <SourceAnchorLinksStrip
          label={isAr ? 'مراجع المصدر:' : 'Source Anchors:'}
          refs={example.sourceRefs}
        />
      </div>
    </article>
  );
}

export function DependencyClassificationDesignGuide({
  guide,
  fldExample,
}: {
  guide: DependencyClassificationGuide;
  fldExample?: ConceptualEducationalExample;
}) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const [selectedCode, setSelectedCode] = useState<'ALL' | 'PCD' | 'HBMD' | 'CIC' | 'FLD'>('ALL');

  const visibleRows =
    selectedCode === 'ALL'
      ? guide.classificationComparisonRows
      : guide.classificationComparisonRows.filter((r) => r.code === selectedCode);

  return (
    <section
      id="classification-design-guide"
      className="space-y-5 rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <Compass className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="font-semibold text-primary">
              {isAr
                ? 'إرشاد تصميمي تعليمي (R02) — ليس نص قرار رسميًا'
                : 'Educational Design Guide (R02) — Not Official Decision Text'}
            </span>
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            {isAr
              ? 'كيف يختار مهندس المعمارية بين PCD و HBMD و CIC و FLD؟'
              : 'How Does an ERP Architect Classify a Relationship: PCD vs HBMD vs CIC vs FLD?'}
          </h3>
          <p className="text-xs leading-relaxed text-text-secondary">
            {resolveLocalizedText(guide.separationNotice, locale)}
          </p>
        </div>
      </div>

      {/* 4-Step Architect Decision Flow */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-text-primary">
          {isAr
            ? 'مسار القرار المعماري المكون من 4 أسئلة متسلسلة'
            : 'Four-Step Architect Decision Flow'}
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {guide.decisionFlowSteps.map((step) => (
            <article
              key={step.stepNumber}
              className="rounded-md border border-border bg-surface-secondary/40 p-3.5 flex flex-col justify-between gap-2.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono font-bold text-primary tabular-nums bidi-ltr">
                    0{step.stepNumber}
                  </span>
                  <span className="font-mono font-semibold text-text-primary bidi-ltr">
                    {step.ifYesClassification}
                  </span>
                </div>
                <p className="text-xs font-semibold text-text-primary leading-relaxed">
                  {resolveLocalizedText(step.question, locale)}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {resolveLocalizedText(step.rationale, locale)}
                </p>
              </div>
              <Link
                href={`/knowledge/${step.sourceRef.documentSlug}#${step.sourceRef.sectionAnchor}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline pt-1 border-t border-border/60"
              >
                <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{resolveLocalizedText(step.sourceRef.sectionLabel, locale)}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Filter + Comparison Matrix */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-semibold text-text-primary">
            {isAr
              ? 'مصفوفة القرار ونطاق الإنفاذ وأخطاء التصنيف الشائعة'
              : 'Decision Questions, Enforcement Boundaries, Common Mistakes & Implications'}
          </h4>
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-md border border-border bg-surface-secondary/50">
            {(['ALL', 'PCD', 'HBMD', 'CIC', 'FLD'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedCode(code)}
                aria-pressed={selectedCode === code}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                  selectedCode === code
                    ? 'bg-surface text-primary border border-primary/40 font-semibold'
                    : 'text-text-secondary hover:text-text-primary border border-transparent'
                )}
              >
                {code === 'ALL' ? (isAr ? 'الكل (4)' : 'All (4)') : code}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[780px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3 py-2.5 text-start font-semibold whitespace-nowrap">
                  {isAr ? 'التصنيف' : 'Type'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  {isAr ? 'سؤال القرار المعماري' : 'Architect Decision Question'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  {isAr ? 'نطاق الإنفاذ' : 'Enforcement Boundary'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  {isAr ? 'أخطاء التصنيف الشائعة' : 'Common Classification Mistakes'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">
                  {isAr ? 'الأثر المعماري' : 'Architectural Implication'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold whitespace-nowrap">
                  {isAr ? 'المرجع' : 'Source'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {visibleRows.map((row) => (
                <tr key={row.code} className="align-top">
                  <td className="px-3 py-3 font-mono font-bold text-primary bidi-ltr whitespace-nowrap">
                    {row.code}
                  </td>
                  <td className="px-3 py-3 leading-relaxed text-text-primary">
                    {resolveLocalizedText(row.decisionQuestion, locale)}
                  </td>
                  <td className="px-3 py-3 leading-relaxed text-text-secondary">
                    {resolveLocalizedText(row.enforcementBoundary, locale)}
                  </td>
                  <td className="px-3 py-3 leading-relaxed text-text-secondary">
                    {resolveLocalizedText(row.commonMistakes, locale)}
                  </td>
                  <td className="px-3 py-3 leading-relaxed text-text-primary">
                    {resolveLocalizedText(row.architecturalImplication, locale)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <Link
                      href={`/knowledge/${row.sourceRef.documentSlug}#${row.sourceRef.sectionAnchor}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>{resolveLocalizedText(row.sourceRef.sectionLabel, locale)}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KH-038 / KH-039 / KH-040 Semantic Note */}
      <div className="rounded-md border border-border bg-surface-secondary/50 px-4 py-3 text-xs leading-relaxed text-text-secondary">
        {resolveLocalizedText(guide.creditCheckAndFldClarification, locale)}
      </div>

      {/* R05 Example #4: Why FLD must never become HBMD */}
      {fldExample ? <ConceptualExampleCard example={fldExample} /> : null}
    </section>
  );
}

export function DataOwnershipDesignGuideSection({
  guide,
  examples,
}: {
  guide: DataOwnershipDesignGuide;
  examples: readonly ConceptualEducationalExample[];
}) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const [selectedExampleId, setSelectedExampleId] = useState<string>(
    examples[0]?.id ?? ''
  );

  const activeExample =
    examples.find((ex) => ex.id === selectedExampleId) ?? examples[0] ?? null;

  return (
    <section
      id="data-ownership-design-guide"
      className="space-y-5 rounded-lg border border-border bg-surface p-5"
    >
      <div className="space-y-1.5 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-primary font-semibold">
          <Database className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {isAr
              ? 'دليل تصميم ملكية البيانات (R04) — مفاهيمي بدون مخططات قاعدة بيانات'
              : 'Conceptual Data Ownership Design Guide (R04) — No Database Schema Inference'}
          </span>
        </div>
        <h3 className="text-base font-semibold text-text-primary">
          {isAr
            ? 'كيف تقرّر ملكية السجلات ومصادر الحقيقة دون إحداث تبعية صلبة؟'
            : 'How Architects Decide Record Ownership Without Coupling Modules'}
        </h3>
        <p className="text-xs leading-relaxed text-text-secondary">
          {resolveLocalizedText(guide.schemaBoundaryNotice, locale)}
        </p>
      </div>

      {/* 5 Core Ownership Distinctions */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {guide.distinctions.map((topic, index) => (
          <article
            key={topic.id}
            className={cn(
              'rounded-md border border-border bg-surface-secondary/35 p-4 space-y-2.5',
              index === guide.distinctions.length - 1 && 'lg:col-span-2'
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-text-primary">
                {resolveLocalizedText(topic.title, locale)}
              </h4>
              <span className="font-mono text-[10px] text-text-muted bidi-ltr">
                {topic.relatedOwnIds.join(' · ')}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-text-primary">
              {resolveLocalizedText(topic.ruleSummary, locale)}
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs pt-1">
              <div className="space-y-0.5">
                <p className="font-semibold text-text-muted">
                  {isAr ? 'التعليل المعماري' : 'Architectural Rationale'}
                </p>
                <p className="leading-relaxed text-text-secondary">
                  {resolveLocalizedText(topic.architecturalRationale, locale)}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-warning">
                  {isAr ? 'خطأ تصميمي يجب تجنبه' : 'Design Anti-Pattern to Avoid'}
                </p>
                <p className="leading-relaxed text-text-secondary">
                  {resolveLocalizedText(topic.antiPatternToAvoid, locale)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <SourceAnchorLinksStrip refs={topic.sourceRefs} />
            </div>
          </article>
        ))}
      </div>

      {/* Architect's 4-Step Ownership Decision Checklist */}
      <div className="space-y-2.5">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>
            {isAr
              ? 'قائمة التحقق المعمارية لتحديد المالك السلطوي لأي سجل'
              : 'Architect’s 4-Question Record Ownership Decision Checklist'}
          </span>
        </h4>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
          {guide.architectChecklist.map((step) => (
            <div
              key={step.stepNumber}
              className="rounded-md border border-border bg-surface-secondary/40 p-3 space-y-1 text-xs"
            >
              <span className="font-mono font-bold text-primary tabular-nums bidi-ltr">
                0{step.stepNumber}
              </span>
              <p className="font-semibold text-text-primary leading-relaxed">
                {resolveLocalizedText(step.question, locale)}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {resolveLocalizedText(step.guidance, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* R05 Conceptual Examples #1-#3 */}
      {examples.length > 0 ? (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'أمثلة تعليمية مفاهيمية من الوثائق المعتمدة (R05)'
                  : 'Source-Backed Conceptual Educational Examples (R05)'}
              </span>
            </h4>
            <div
              role="tablist"
              aria-label={isAr ? 'أمثلة ملكية البيانات' : 'Ownership Examples'}
              className="flex flex-wrap items-center gap-1 p-1 rounded-md border border-border bg-surface-secondary/50"
            >
              {examples.map((ex, idx) => (
                <button
                  key={ex.id}
                  type="button"
                  role="tab"
                  aria-selected={activeExample?.id === ex.id}
                  onClick={() => setSelectedExampleId(ex.id)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0',
                    activeExample?.id === ex.id
                      ? 'bg-surface text-primary border border-primary/40 font-semibold'
                      : 'text-text-secondary hover:text-text-primary border border-transparent'
                  )}
                >
                  {isAr ? `مثال 0${idx + 1}` : `Example 0${idx + 1}`}
                </button>
              ))}
            </div>
          </div>

          {activeExample ? (
            <ConceptualExampleCard example={activeExample} />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
