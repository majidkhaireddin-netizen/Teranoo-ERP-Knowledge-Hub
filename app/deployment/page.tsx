import type { Metadata } from 'next';
import { DeploymentDatabaseView } from '@/features/architecture/DeploymentDatabaseView';

export const metadata: Metadata = {
  title: 'Deployment & Database',
};

export default function DeploymentPage() {
  return <DeploymentDatabaseView />;
}
