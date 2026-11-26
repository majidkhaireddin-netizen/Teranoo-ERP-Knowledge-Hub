import type { ContentTypeId } from '@/content/taxonomy/registry';
import { getContentTypeDefinition } from '@/content/taxonomy/registry';
import type { LocalizedText } from '@/content/models/types';

export type DocumentRendererKey =
  | 'generic'
  | 'research'
  | 'screen-specification'
  | 'data-model'
  | 'engineering-journal'
  | 'test-record';

export interface DocumentRendererDescriptor {
  readonly key: DocumentRendererKey;
  readonly label: LocalizedText;
  readonly implementedInTask002: boolean;
  readonly usesGenericMarkdownBody: boolean;
  readonly showResearchDisclaimerBanner: boolean;
  readonly futureStructuredSections: readonly string[];
}

const RENDERER_DESCRIPTORS: Record<
  DocumentRendererKey,
  DocumentRendererDescriptor
> = {
  generic: {
    key: 'generic',
    label: { ar: 'قارئ الوثائق الموحد', en: 'Unified Document Reader' },
    implementedInTask002: true,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: false,
    futureStructuredSections: [],
  },
  research: {
    key: 'research',
    label: { ar: 'عارض التقارير البحثية والأدلة', en: 'Research & Evidence Reader' },
    implementedInTask002: true,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: true,
    futureStructuredSections: ['citations', 'comparative-matrix'],
  },
  'screen-specification': {
    key: 'screen-specification',
    label: { ar: 'عارض مواصفات الشاشات', en: 'Screen Specification Viewer' },
    implementedInTask002: false,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: false,
    futureStructuredSections: [
      'screen-overview',
      'design-screenshots',
      'field-definitions',
      'validation-rules',
      'permissions',
      'state-transitions',
      'acceptance-criteria',
    ],
  },
  'data-model': {
    key: 'data-model',
    label: { ar: 'عارض نماذج البيانات والكيانات', en: 'Data Model & Entity Viewer' },
    implementedInTask002: false,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: false,
    futureStructuredSections: [
      'entities',
      'fields-and-types',
      'keys-and-constraints',
      'indexes',
      'migration-notes',
    ],
  },
  'engineering-journal': {
    key: 'engineering-journal',
    label: { ar: 'عارض السجل الهندسي', en: 'Engineering Journal Viewer' },
    implementedInTask002: false,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: false,
    futureStructuredSections: [
      'objective',
      'erp-work-item',
      'problem-and-root-cause',
      'alternatives-and-solution',
      'verified-commits',
      'testing-evidence',
      'lessons-learned',
    ],
  },
  'test-record': {
    key: 'test-record',
    label: { ar: 'عارض مواصفات ونتائج الاختبار', en: 'Test Specification & Result Viewer' },
    implementedInTask002: false,
    usesGenericMarkdownBody: true,
    showResearchDisclaimerBanner: false,
    futureStructuredSections: [
      'test-objective',
      'preconditions',
      'steps-and-data',
      'expected-vs-actual',
      'execution-status',
    ],
  },
};

/**
 * Resolves the appropriate renderer descriptor for any registered content type.
 * Falls back cleanly to the unified generic document reader.
 */
export function resolveRendererForContentType(
  contentType: ContentTypeId
): DocumentRendererDescriptor {
  const typeDef = getContentTypeDefinition(contentType);
  if (!typeDef) {
    return RENDERER_DESCRIPTORS.generic;
  }
  return RENDERER_DESCRIPTORS[typeDef.rendererKey] ?? RENDERER_DESCRIPTORS.generic;
}

export function getRegisteredRenderers(): readonly DocumentRendererDescriptor[] {
  return Object.values(RENDERER_DESCRIPTORS);
}
