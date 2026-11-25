import type { Metadata } from 'next';
import { PlatformFoundationView } from '@/features/platform/PlatformFoundationView';

export const metadata: Metadata = {
  title: 'Platform Foundation',
};

export default function PlatformPage() {
  return <PlatformFoundationView />;
}
