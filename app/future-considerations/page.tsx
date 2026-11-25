import type { Metadata } from 'next';
import { FutureConsiderationsView } from '@/features/future-considerations/FutureConsiderationsView';

export const metadata: Metadata = {
  title: 'Future Considerations',
};

export default function FutureConsiderationsPage() {
  return <FutureConsiderationsView />;
}
