import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>{children}</div>;
}

/** 整列可點的清單卡片 */
export function LinkRow({ to, title, subtitle, right }: { to: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <Link
      to={to}
      className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:bg-surface-2"
    >
      <div className="min-w-0 flex-1">
        <div className="text-lg font-bold">{title}</div>
        {subtitle && <div className="truncate text-sm text-muted">{subtitle}</div>}
      </div>
      {right}
      <ChevronRight className="size-6 shrink-0 text-muted" aria-hidden />
    </Link>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between">
      <h2 className="text-xl font-bold">{children}</h2>
      {action}
    </div>
  );
}

export function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-muted">{text}</div>
  );
}
