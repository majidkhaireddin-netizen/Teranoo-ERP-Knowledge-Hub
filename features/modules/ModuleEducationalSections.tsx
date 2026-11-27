'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  FileText,
  Layers,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { CoreModuleArchitecturalProfile } from '@/content/extractors/moduleModelsExtractor';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { cn } from '@/lib/utils';

interface ModuleEducationalSectionsProps {
  moduleProfile: CoreModuleArchitecturalProfile;
  locale: 'ar' | 'en';
}

export function ModulePurposeAndImpactSection({
  moduleProfile,
  locale,
}: ModuleEducationalSectionsProps) {
  const isAr = locale === 'ar';
  const { purposeAndImpact } = moduleProfile;

  return (
    <section
      id="module-purpose"
      aria-label={isAr ? 'الغرض المعماري والأثر المستقبلي' : 'Architectural Purpose & Future Impact'}
      className="space-y-5"
    >
      <SectionHeader
        title={
          isAr
            ? '1. لماذا يوجد هذا النظام وما المشكلات التي يعالجها؟'
            : '1. Why This Module Exists & Business Problems Addressed'
        }
        subtitle={
          isAr
            ? 'قراءة معمارية مستندة إلى النص الرسمي توضّح الغرض البنيوي للنظام والمشكلات العملية التي يحلها وحدود أثره على التصميم الوظيفي المستقبلي.'
            : 'Source-grounded architectural guide explaining why this module exists, which enterprise coupling problems it solves, and how it constrains future functional design.'
        }
        actions={
          <span className="text-[11px] font-medium text-text-muted">
            {isAr ? 'ملخص تعليمي مرتبط بالمصدر' : 'Source-Pinned Educational Guide'}
          </span>
        }
      />

      {/* Core Existence Narrative */}
      <article className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr ? 'سبب وجود النظام داخل معمارية Teranoo ERP' : 'Architectural Purpose Inside Teranoo ERP'}
            </span>
          </h3>
          <Link
            href={`/knowledge/${moduleProfile.documentSlug}#${purposeAndImpact.whyModuleExistsSourceRef.sectionAnchor}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {resolveLocalizedText(
                purposeAndImpact.whyModuleExistsSourceRef.sectionLabel,
                locale
              )}
            </span>
          </Link>
        </div>
        <p className="text-sm leading-7 text-text-primary max-w-[78ch]">
          {resolveLocalizedText(purposeAndImpact.whyModuleExists, locale)}
        </p>

        {/* Business Problems Addressed */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-text-secondary mb-2.5">
            {isAr
              ? 'المشكلات المعمارية والتجارية التي يعالجها هذا التصميم:'
              : 'Key Business & Architectural Problems Addressed:'}
          </p>
          <div className="divide-y divide-border rounded-md border border-border bg-surface-secondary/30">
            {purposeAndImpact.businessProblemsAddressed.map((problem, idx) => (
              <div key={problem.title.en} className="p-3.5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-text-primary">
                    <span className="font-mono text-primary me-1.5 tabular-nums">
                      0{idx + 1}.
                    </span>
                    {resolveLocalizedText(problem.title, locale)}
                  </h4>
                  <Link
                    href={`/knowledge/${moduleProfile.documentSlug}#${problem.sourceRef.sectionAnchor}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {resolveLocalizedText(problem.sourceRef.sectionLabel, locale)}
                    </span>
                  </Link>
                </div>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {resolveLocalizedText(problem.explanation, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Future Functional Design Implications (R01.9) */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="border-b border-border bg-surface-secondary px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? 'كيف تؤثر هذه المعمارية المعتمدة على التصميم الوظيفي المستقبلي (المراحل 3، 5، 6)'
                : 'How Approved Phase 2 Architecture Constrains Future Functional Design (Phases 3, 5, 6)'}
            </span>
          </h3>
          <span className="text-[11px] text-text-muted">
            {isAr ? 'استخلاص موثّق بالمرجع' : 'Source-Referenced Constraints'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 text-text-primary">
                <th className="px-4 py-2.5 text-start font-semibold">
                  {isAr ? 'مجال التصميم المستقبلي' : 'Future Design Area'}
                </th>
                <th className="px-4 py-2.5 text-start font-semibold">
                  {isAr ? 'القيد المعماري الملزم من المرحلة 2' : 'Approved Phase 2 Constraint'}
                </th>
                <th className="px-4 py-2.5 text-start font-semibold">
                  {isAr ? 'المرحلة المؤجل إليها التفصيل' : 'Target Phase for Details'}
                </th>
                <th className="px-4 py-2.5 text-start font-semibold">
                  {isAr ? 'المرجع الرسمي' : 'Source Section'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purposeAndImpact.futureDesignImplications.map((item) => (
                <tr key={item.area.en} className="bg-surface hover:bg-surface-hover/40">
                  <td className="px-4 py-3 font-semibold text-text-primary align-top">
                    {resolveLocalizedText(item.area, locale)}
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-text-secondary align-top">
                    {resolveLocalizedText(item.approvedConstraint, locale)}
                  </td>
                  <td className="px-4 py-3 text-text-primary align-top">
                    {resolveLocalizedText(item.deferredToPhase, locale)}
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    <Link
                      href={`/knowledge/${moduleProfile.documentSlug}#${item.sourceRef.sectionAnchor}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <FileText className="h-3 w-3" aria-hidden="true" />
                      <span>
                        {resolveLocalizedText(item.sourceRef.sectionLabel, locale)}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ModuleDesignReasoningSection({
  moduleProfile,
  locale,
}: ModuleEducationalSectionsProps) {
  const isAr = locale === 'ar';
  const entries = moduleProfile.designReasoning;
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (entries[0]) {
      initial[entries[0].id] = true;
    }
    return initial;
  });

  const allExpanded = entries.every((e) => Boolean(expandedIds[e.id]));

  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    for (const entry of entries) {
      updated[entry.id] = nextState;
    }
    setExpandedIds(updated);
  };

  const toggleOne = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="architecture-reasoning"
      aria-label={isAr ? 'التعليل المعماري للحدود' : 'Architecture Design Reasoning'}
      className="space-y-4"
    >
      <SectionHeader
        title={
          isAr
            ? '2. التعليل المعماري لتصميم الحدود (Architecture Design Reasoning)'
            : '2. Architecture Design Reasoning & Boundary Trade-Offs'
        }
        subtitle={
          isAr
            ? 'لماذا رُسمت حدود هذا النظام بهذه الطريقة؟ يُميّز العرض صراحةً بين التعليل الموثق في الوثيقة الرسمية وبين التفسير التعليمي المضاف للشرح.'
            : 'Why these boundaries were chosen — explicitly separating reasoning documented in the official Phase 2 source from clearly labeled educational interpretation.'
        }
        actions={
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 whitespace-nowrap shrink-0"
          >
            {allExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>
              {allExpanded
                ? isAr
                  ? 'طي جميع التعليلات'
                  : 'Collapse All Reasoning'
                : isAr
                  ? 'توسيع جميع التعليلات'
                  : 'Expand All Reasoning'}
            </span>
          </button>
        }
      />

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {entries.map((entry, idx) => {
          const isOpen = Boolean(expandedIds[entry.id]);
          return (
            <div key={entry.id} className="bg-surface">
              <button
                type="button"
                onClick={() => toggleOne(entry.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start transition-colors hover:bg-surface-hover/50"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-text-muted tabular-nums">
                    {isAr ? `المبدأ ${idx + 1}` : `Principle 0${idx + 1}`}
                    {' · '}
                    {resolveLocalizedText(entry.sourceRef.sectionLabel, locale)}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {resolveLocalizedText(entry.topic, locale)}
                  </h3>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                )}
              </button>

              {isOpen ? (
                <div className="border-t border-border bg-surface-secondary/20 px-4 py-4 space-y-3 text-xs leading-relaxed">
                  {/* Official Reasoning */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-success">
                        {isAr
                          ? 'الأساس الموثّق في المصدر الرسمي'
                          : 'Official Reasoning in Authoritative Source'}
                      </span>
                      <Link
                        href={`/knowledge/${moduleProfile.documentSlug}#${entry.sourceRef.sectionAnchor}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      >
                        <FileText className="h-3 w-3" aria-hidden="true" />
                        <span>
                          {resolveLocalizedText(entry.sourceRef.sectionLabel, locale)}
                        </span>
                      </Link>
                    </div>
                    <p className="text-text-primary">
                      {resolveLocalizedText(entry.officialReasoning, locale)}
                    </p>
                  </div>

                  {/* Educational Interpretation (explicitly distinguished per R02/R07) */}
                  {entry.educationalInterpretation ? (
                    <div className="rounded-md border border-info-border/70 bg-info-bg/40 p-3 space-y-1">
                      <p className="font-semibold text-info">
                        {isAr
                          ? 'تفسير تعليمي (غير منصوص كقرار منفصل)'
                          : 'Educational Interpretation (Explanatory Commentary)'}
                      </p>
                      <p className="text-text-primary">
                        {resolveLocalizedText(entry.educationalInterpretation, locale)}
                      </p>
                    </div>
                  ) : null}

                  {/* Architectural Implication */}
                  <div className="border-t border-border pt-2.5 text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      {isAr ? 'الأثر المعماري المباشر: ' : 'Architectural Implication: '}
                    </span>
                    {resolveLocalizedText(entry.architecturalImplication, locale)}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ModuleAbsentPeerImpactSection({
  moduleProfile,
  locale,
}: ModuleEducationalSectionsProps) {
  const isAr = locale === 'ar';

  return (
    <section
      id="absent-peer-impacts"
      aria-label={isAr ? 'أثر غياب الأنظمة الأخرى' : 'Impact When Other Modules Are Absent'}
      className="space-y-3"
    >
      <SectionHeader
        title={
          isAr
            ? '3. ما الذي يعمل وما الذي يتوقف عند غياب الأنظمة الأخرى؟'
            : '3. Standalone Operation vs. What Becomes Unavailable Without Peer Modules'
        }
        subtitle={
          isAr
            ? 'غياب أي نظام نظير لا يمنع تفعيل هذا النظام (0 HBMD)، بل يحصر الأثر في تعطيل السيناريو العابر للوحدات وعقود CIC/FLD المرتبطة به فقط.'
            : 'Absence of any peer module never blocks base activation (0 HBMD); it strictly scopes unavailability to the cross-module workflow governed by that CIC/FLD.'
        }
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-text-primary">
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {isAr ? 'النظام الغائب' : 'Absent Peer Module'}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {isAr ? 'ما يظل يعمل باستقلالية' : 'What Still Operates Standalone'}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {isAr ? 'ما يصبح غير متاح بدون النظام النظير' : 'What Becomes Unavailable'}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {isAr ? 'الجسر عند التفعيل اللاحق' : 'Bridge When Activated'}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {isAr ? 'المصدر' : 'Source'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {moduleProfile.absentPeerScenarios.map((row) => (
              <tr key={row.absentPeerCode} className="bg-surface hover:bg-surface-hover/40">
                <td className="px-3.5 py-3 align-top">
                  <div className="font-semibold text-text-primary">
                    {resolveLocalizedText(row.absentPeerName, locale)}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-text-muted bidi-ltr">
                    {row.absentPeerCode} · {isAr ? 'داخلي' : 'KH ID'}
                  </div>
                </td>
                <td className="px-3.5 py-3 leading-relaxed text-text-primary align-top">
                  {resolveLocalizedText(row.standaloneBehavior, locale)}
                </td>
                <td className="px-3.5 py-3 leading-relaxed text-text-secondary align-top">
                  {resolveLocalizedText(row.unavailableCapabilities, locale)}
                </td>
                <td className="px-3.5 py-3 font-mono text-[11px] text-primary bidi-ltr align-top">
                  {row.bridgeContractOrFld}
                </td>
                <td className="px-3.5 py-3 align-top whitespace-nowrap">
                  <Link
                    href={`/knowledge/${moduleProfile.documentSlug}#${row.sourceRef.sectionAnchor}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    <span>{resolveLocalizedText(row.sourceRef.sectionLabel, locale)}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ModuleOwnershipBoundaryMatrixSection({
  moduleProfile,
  locale,
}: ModuleEducationalSectionsProps) {
  const isAr = locale === 'ar';

  return (
    <section
      id="ownership-matrix"
      aria-label={isAr ? 'مصفوفة الملكية وعدم الملكية' : 'Ownership & Non-Ownership Boundary Matrix'}
      className="space-y-3"
    >
      <SectionHeader
        title={
          isAr
            ? '4. حدود الملكية وعدم الملكية (Ownership vs. Non-Ownership Matrix)'
            : '4. Ownership & Non-Ownership Boundary Comparison'
        }
        subtitle={
          isAr
            ? 'تفصل هذه المصفوفة بوضوح بين ما يملكه النظام، وما يستهلكه مرجعيًا، وما تملكه أنظمة أخرى، وما بقي غير محسوم عمدًا في المرحلة 2.'
            : 'Distinguishes what this module owns, what it consumes/references, what other modules own, and which ownership boundaries remain unresolved in Phase 2.'
        }
        actions={
          <Link
            href="/dependencies?tab=ownership"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {isAr ? 'جدول الملكية الشامل (15 كيانًا)' : 'Global Ownership Matrix (15 Objects)'}
            </span>
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-text-primary">
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'المفهوم / المجال' : 'Concept / Domain'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'يملكه هذا النظام' : 'Owned by This Module'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'يستهلكه أو يرجع إليه' : 'Consumes / References'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'تملكه وحدات أخرى / المنصة' : 'Owned by Peers / Platform'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'حدود غير محسومة / مؤجلة' : 'Unresolved / Deferred'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'المرجع' : 'Source'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {moduleProfile.ownershipBoundaryMatrix.map((row) => (
              <tr key={row.domainConcept.en} className="bg-surface hover:bg-surface-hover/40">
                <td className="px-3 py-3 font-semibold text-text-primary align-top">
                  {resolveLocalizedText(row.domainConcept, locale)}
                </td>
                <td className="px-3 py-3 leading-relaxed text-text-primary align-top">
                  {resolveLocalizedText(row.moduleOwns, locale)}
                </td>
                <td className="px-3 py-3 leading-relaxed text-text-secondary align-top">
                  {resolveLocalizedText(row.consumesOrReferences, locale)}
                </td>
                <td className="px-3 py-3 leading-relaxed text-text-secondary align-top">
                  {resolveLocalizedText(row.otherModulesOwn, locale)}
                </td>
                <td className="px-3 py-3 leading-relaxed text-warning align-top">
                  {resolveLocalizedText(row.unresolvedBoundary, locale)}
                </td>
                <td className="px-3 py-3 align-top whitespace-nowrap">
                  <Link
                    href={`/knowledge/${moduleProfile.documentSlug}#${row.sourceRef.sectionAnchor}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    <span>{resolveLocalizedText(row.sourceRef.sectionLabel, locale)}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explicit Non-Inference Disclaimer (R03) */}
      <div className="flex items-start gap-2 rounded-md border border-border bg-surface-secondary/50 px-3.5 py-2.5 text-xs text-text-secondary">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p className="leading-relaxed">
          {isAr
            ? 'تنبيه حدود المرحلة 2 (R03): تعبّر الملكية أعلاه عن مسؤولية مفاهيمية فقط (Conceptual Ownership)، ولا يُستنتج منها جداول قواعد بيانات أو حقول أو واجهات API أو سلوك وظيفي نهائي — فكل تلك التفاصيل مؤجلة إلى المراحل 5 و6 والهندسة التنفيذية.'
            : 'Phase 2 Scope Rule (R03): Ownership above expresses conceptual authority only. It does not specify or imply database tables, column schemas, runtime APIs, or final functional behavior, all of which remain deferred to Phases 5, 6, and engineering design.'}
        </p>
      </div>
    </section>
  );
}

export function ModuleDeferredRationaleSection({
  moduleProfile,
  locale,
}: ModuleEducationalSectionsProps) {
  const isAr = locale === 'ar';

  return (
    <section
      id="deferred-rationale"
      aria-label={isAr ? 'أسباب تأجيل التصميم التفصيلي' : 'Why Deferred Design Boundaries Remain Open'}
      className="space-y-3"
    >
      <SectionHeader
        title={
          isAr
            ? 'لماذا أُجّلت هذه القرارات والموضوعات عمدًا؟ (Deferred Design Boundaries)'
            : 'Why Unresolved Design Matters Remain Intentionally Deferred'
        }
        subtitle={
          isAr
            ? 'الفصل الصارم بين المعمارية المعتمدة (Phase 2) وبين التصميم الوظيفي المستقبلي (Phase 5/6) يمنع التحيز المبكر للأدوات أو الهياكل.'
            : 'Distinguishing approved Phase 2 architectural boundaries from future Phase 5/6 functional design prevents premature implementation lock-in.'
        }
      />

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {moduleProfile.deferredBoundaryRationales.map((item) => (
          <div key={item.topic.en} className="p-4 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-text-primary">
                  {resolveLocalizedText(item.topic, locale)}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="font-medium text-text-muted">
                  {resolveLocalizedText(item.targetPhase, locale)}
                </span>
                <Link
                  href={`/knowledge/${moduleProfile.documentSlug}#${item.sourceRef.sectionAnchor}`}
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  <span>{resolveLocalizedText(item.sourceRef.sectionLabel, locale)}</span>
                </Link>
              </div>
            </div>
            <p className="leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">
                {isAr ? 'سبب التأجيل الموثق في المصدر: ' : 'Why Deferred per Official Source: '}
              </span>
              {resolveLocalizedText(item.whyDeferredInSource, locale)}
            </p>
            <p className="leading-relaxed text-text-secondary">
              <span className="font-semibold text-success">
                {isAr ? 'الحد المعتمد حاليًا في المرحلة 2: ' : 'Approved Phase 2 Boundary: '}
              </span>
              {resolveLocalizedText(item.approvedPhase2Boundary, locale)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
