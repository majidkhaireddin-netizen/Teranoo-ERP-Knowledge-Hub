'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface QueryParamReaderProps {
  paramName: string;
  onValue: (value: string | null) => void;
}

function QueryParamReader({ paramName, onValue }: QueryParamReaderProps) {
  const searchParams = useSearchParams();
  const value = searchParams.get(paramName);

  useEffect(() => {
    onValue(value);
  }, [value, onValue]);

  return null;
}

/**
 * Suspense-wrapped query-parameter observer so static App Router pages can
 * respond to deep links (?decision=, ?fac=, ?phase=, ?guardrail=) without
 * opting out of static generation.
 */
export function QueryParamSync(props: QueryParamReaderProps) {
  return (
    <Suspense fallback={null}>
      <QueryParamReader {...props} />
    </Suspense>
  );
}
