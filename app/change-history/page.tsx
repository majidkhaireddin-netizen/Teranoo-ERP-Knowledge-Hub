import type { Metadata } from 'next';
import { ChangeHistoryView } from '@/features/change-history/ChangeHistoryView';

export const metadata: Metadata = {
  title: 'Change History',
};

export default function ChangeHistoryPage() {
  return <ChangeHistoryView />;
}
