import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>{children}</div>;
}

/** 整列可點的清單卡片 */
export function LinkRow({ to, title, subtitle, left, right, badge }: { to: string; title: string; subtitle?: string; left?: ReactNode; right?: ReactNode; badge?: ReactNode }) {
  return (
    <Link to={to} className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:bg-surface-2">
      {left}
      <div className="min-w-0 flex-1">
        <div className="text-lg font-bold leading-snug">{title}</div>
        {subtitle && <div className="line-clamp-2 text-sm text-muted">{subtitle}</div>}
        {badge && <div className="mt-1">{badge}</div>}
      </div>
      {right}
      <ChevronRight className="size-6 shrink-0 text-muted" aria-hidden />
    </Link>
  );
}

export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div id={id} className="mb-2 mt-6 flex scroll-mt-32 items-center justify-between">
      <h2 className="text-xl font-bold">{children}</h2>
      {action}
    </div>
  );
}

export function Empty({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-muted">
      {text}
      {children}
    </div>
  );
}

export function Bullets({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex list-disc flex-col gap-1 pl-6 ${className}`}>
      {items.map((x) => <li key={x}>{x}</li>)}
    </ul>
  );
}

export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(6rem,38%)_1fr] gap-3 px-4 py-3">
          <dt className="text-muted">{r.label}</dt>
          <dd className="font-bold">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
