import type { Metadata } from 'next';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { DashboardView } from '@/features/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const stats = getContentRegistry().getStats();
  return <DashboardView publishedRecordsCount={stats.totalPublished} />;
}
