import type { Metadata } from 'next';
import { EngineeringJournalView } from '@/features/engineering-journal/EngineeringJournalView';

export const metadata: Metadata = {
  title: 'Engineering Journal',
};

export default function EngineeringJournalPage() {
  return <EngineeringJournalView />;
}
