import React from 'react';
import { cn } from '@/lib/utils';

export interface ComparisonTableProps {
  headers: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
  caption?: string;
  className?: string;
}

export function ComparisonTable({
  headers,
  rows,
  caption,
  className,
}: ComparisonTableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg border border-border bg-surface',
        className
      )}
    >
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border bg-surface-secondary/70">
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-4 py-2.5 text-start text-xs font-semibold text-text-secondary whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-surface-hover/60 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'px-4 py-2.5 align-top',
                    cellIndex === 0
                      ? 'font-medium text-text-primary'
                      : 'text-text-secondary'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
