import type { Metadata } from 'next';
import { BusinessScenariosView } from '@/features/business-scenarios/BusinessScenariosView';

export const metadata: Metadata = {
  title: 'Business Scenarios',
};

export default function BusinessScenariosPage() {
  return <BusinessScenariosView />;
}
