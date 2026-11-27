'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { Phase2SourceLocalDecision } from '@/content/extractors/moduleModelsExtractor';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface ModuleDecisionEducationListProps {
  decisions: readonly Phase2SourceLocalDecision[];
  locale: 'ar' | 'en';
}

function renderFormattedVerbatimBody(verbatimBody: string) {
  return verbatimBody.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded-xs bg-surface-secondary px-1 py-0.5 font-mono text-[11px] text-text-primary bidi-ltr"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function ModuleDecisionEducationList({
  decisions,
  locale,
}: ModuleDecisionEducationListProps) {
  const isAr = locale === 'ar';
  const [expandedDecisionIds, setExpandedDecisionIds] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    if (decisions[0]) {
      initial[decisions[0].decisionId] = true;
    }
    return initial;
  });

  const allExpanded = decisions.every((d) =>
    Boolean(expandedDecisionIds[d.decisionId])
  );

  const toggleAll = () => {
    const nextState = !allExpanded;
    const nextMap: Record<string, boolean> = {};
    for (const dec of decisions) {
      nextMap[dec.decisionId] = nextState;
    }
    setExpandedDecisionIds(nextMap);
  };

  const toggleOne = (decisionId: string) => {
    setExpandedDecisionIds((prev) => ({
      ...prev,
      [decisionId]: !prev[decisionId],
    }));
  };

  return (
    <section id="approved-decisions" className="space-y-4">
      <SectionHeader
        title={
          isAr
            ? `قرارات المرحلة 2 المعتمدة لهذا النظام (${decisions.length})`
            : `Approved Phase 2 Source-Local Decisions (${decisions.length})`
        }
        subtitle={
          isAr
            ? 'النص الرسمي مستخلص حرفيًا من الوثيقة المالكة (معزول عن عدّاد السجل المركزي الـ 126)، ومزود بشرح تعليمي مُعلَّم صراحةً وأثر معماري وقيود وروابط للمقاطع المرجعية.'
            : 'Original decision text deterministically extracted verbatim from the owning Phase 2 document (isolated from the 126 centralized register), paired with clearly labeled educational commentary, architectural implications, limitations, and verified source anchors.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
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
                    ? 'طي التفاصيل التعليمية'
                    : 'Collapse Educational Details'
                  : isAr
                    ? 'توسيع جميع التفاصيل التعليمية'
                    : 'Expand All Educational Details'}
              </span>
            </button>
            <Link
              href="/decisions"
              className="text-xs font-medium text-primary hover:underline whitespace-nowrap shrink-0"
            >
              {isAr ? 'فتح سجل القرارات الكامل' : 'Open Full Decision Register'}
            </Link>
          </div>
        }
      />

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {decisions.map((dec) => {
          const isOpen = Boolean(expandedDecisionIds[dec.decisionId]);
          const { educationalDetail } = dec;
          return (
            <article
              key={dec.decisionId}
              id={dec.decisionId}
              className="p-4 sm:p-5 space-y-3"
            >
              {/* Decision Header + Official Source Anchor */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-class-decision bidi-ltr">
                    {dec.decisionId}
                  </span>
                  <span aria-hidden="true" className="text-text-muted">·</span>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {dec.title}
                  </h3>
                  <span aria-hidden="true" className="text-text-muted">·</span>
                  <span className="text-[11px] font-medium text-success">
                    {isAr ? 'معتمد / نص رسمي حرفي' : 'Approved · Verbatim Source'}
                  </span>
                </div>
                <Link
                  href={`/knowledge/${dec.owningDocumentSlug}#${dec.sectionAnchor}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline whitespace-nowrap shrink-0"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isAr ? 'نص القرار في المصدر' : 'Decision in Source'}
                  </span>
                </Link>
              </div>

              {/* Verbatim Official Decision Body */}
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-text-muted">
                  {isAr ? 'النص الرسمي الحرفي للقرار:' : 'Original Verbatim Decision Text:'}
                </p>
                <p className="whitespace-pre-line text-xs leading-relaxed text-text-primary">
                  {renderFormattedVerbatimBody(dec.verbatimBody)}
                </p>
              </div>

              {/* Progressive Disclosure Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleOne(dec.decisionId)}
                  aria-expanded={isOpen}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {isOpen
                      ? isAr
                        ? 'إخفاء الشرح التعليمي والأثر والقيود'
                        : 'Hide Educational Breakdown & Implications'
                      : isAr
                        ? 'عرض الشرح التعليمي والأثر المعماري والقيود والمراجع'
                        : 'Show Educational Explanation, Implications, Limits & Source Sections'}
                  </span>
                </button>
              </div>

              {/* Expanded Educational Analysis (R04 + R07 provenance split) */}
              {isOpen ? (
                <div className="rounded-md border border-border bg-surface-secondary/30 p-3.5 space-y-2.5 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold text-info mb-0.5">
                      {isAr
                        ? 'الشرح التعليمي (تفسير تعليمي — لا يُضيف متطلبًا رسميًا جديدًا):'
                        : 'Educational Explanation (Educational Interpretation — not a new official rule):'}
                    </p>
                    <p className="text-text-primary">
                      {resolveLocalizedText(
                        educationalDetail.educationalExplanation,
                        locale
                      )}
                    </p>
                  </div>

                  <div className="border-t border-border pt-2">
                    <p className="font-semibold text-text-primary mb-0.5">
                      {isAr ? 'الأثر المعماري:' : 'Architectural Implication:'}
                    </p>
                    <p className="text-text-secondary">
                      {resolveLocalizedText(
                        educationalDetail.architecturalImplication,
                        locale
                      )}
                    </p>
                  </div>

                  <div className="border-t border-border pt-2">
                    <p className="font-semibold text-warning mb-0.5">
                      {isAr ? 'الحدود والقيود ذات الصلة:' : 'Relevant Limitations:'}
                    </p>
                    <p className="text-text-secondary">
                      {resolveLocalizedText(
                        educationalDetail.relevantLimitations,
                        locale
                      )}
                    </p>
                  </div>

                  <div className="border-t border-border pt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-text-muted">
                      {isAr ? 'المقاطع الداعمة في المصدر:' : 'Authoritative Source Sections:'}
                    </span>
                    {educationalDetail.relatedSourceSections.map((sec) => (
                      <Link
                        key={sec.sectionAnchor}
                        href={`/knowledge/${dec.owningDocumentSlug}#${sec.sectionAnchor}`}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <FileText className="h-3 w-3" aria-hidden="true" />
                        <span>{resolveLocalizedText(sec.sectionLabel, locale)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
