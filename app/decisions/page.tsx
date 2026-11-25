import type { Metadata } from 'next';
import { DecisionRegisterView } from '@/features/decisions/DecisionRegisterView';

export const metadata: Metadata = {
  title: 'Decision Register',
};

export default function DecisionsPage() {
  return <DecisionRegisterView />;
}
