import type { Metadata } from 'next';
import { BusinessModulesView } from '@/features/modules/BusinessModulesView';

export const metadata: Metadata = {
  title: 'Business Modules',
};

export default function ModulesPage() {
  return <BusinessModulesView />;
}
