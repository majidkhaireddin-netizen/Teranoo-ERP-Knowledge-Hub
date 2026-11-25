import type { Metadata } from 'next';
import { ProductVisionView } from '@/features/product-vision/ProductVisionView';

export const metadata: Metadata = {
  title: 'Product Vision',
};

export default function ProductVisionPage() {
  return <ProductVisionView />;
}
