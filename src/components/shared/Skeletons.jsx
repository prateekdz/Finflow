import React from 'react';

export function SummaryCardSkeleton() {
  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-3 w-20 bg-bg-sunken rounded skeleton" />
        <div className="w-8 h-8 bg-bg-sunken rounded-lg skeleton" />
      </div>
      <div className="h-8 w-28 bg-bg-sunken rounded skeleton" />
      <div className="h-3 w-24 bg-bg-sunken rounded skeleton" />
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SummaryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div
      className="w-full bg-bg-sunken rounded skeleton"
      style={{ height: `${height}px` }}
    />
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <div className="w-10 h-10 bg-bg-sunken rounded-lg skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-bg-sunken rounded skeleton w-3/4" />
            <div className="h-3 bg-bg-sunken rounded skeleton w-1/2" />
          </div>
          <div className="h-4 bg-bg-sunken rounded skeleton w-16" />
        </div>
      ))}
    </div>
  );
}

export function InsightSkeleton({ count = 6 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-bg-elevated border border-border-subtle rounded-card p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="h-4 w-32 bg-bg-sunken rounded skeleton" />
            <div className="w-6 h-6 bg-bg-sunken rounded skeleton" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-bg-sunken rounded skeleton w-full" />
            <div className="h-4 bg-bg-sunken rounded skeleton w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-4 space-y-3">
      <div className="h-4 w-32 bg-[var(--color-bg-elevated)] rounded skeleton" />
      <div className="h-3 w-full bg-[var(--color-bg-elevated)] rounded skeleton" />
      <div className="h-3 w-4/5 bg-[var(--color-bg-elevated)] rounded skeleton" />
    </div>
  );
}

export function InsightCardsSkeletons({ count = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <InsightCardSkeleton key={i} />
      ))}
    </div>
  );
}
