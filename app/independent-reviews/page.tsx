import type { Metadata } from 'next';
import { IndependentReviewsView } from '@/features/independent-reviews/IndependentReviewsView';

export const metadata: Metadata = {
  title: 'Independent Reviews',
};

export default function IndependentReviewsPage() {
  return <IndependentReviewsView />;
}
