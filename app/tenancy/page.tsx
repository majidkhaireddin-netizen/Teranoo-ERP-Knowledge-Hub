import type { Metadata } from 'next';
import { PlatformTenancyView } from '@/features/architecture/PlannedArchitectureViews';

export const metadata: Metadata = {
  title: 'Platform & Tenancy',
};

export default function TenancyPage() {
  return <PlatformTenancyView />;
}
