import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { trades } from '@/data/placeholder';

export default function Trades() {
  return (
    <>
      <TopBar title="工種分類" />
      <Page>
        <ul className="grid gap-2 sm:grid-cols-2">
          {trades.map(({ id, name, icon: Icon, blurb }) => (
            <li key={id}>
              <Link to={`/trades/${id}`} className="tap flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 active:bg-surface-2">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="size-8 text-primary-ink" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">{name}</span>
                  <span className="block text-sm text-muted">{blurb}</span>
                </span>
                <ChevronRight className="size-6 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Page>
    </>
  );
}
