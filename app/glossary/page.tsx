import type { Metadata } from 'next';
import { GlossaryView } from '@/features/glossary/GlossaryView';

export const metadata: Metadata = {
  title: 'Glossary',
};

export default function GlossaryPage() {
  return <GlossaryView />;
}
