import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { iconFor } from '@/components/ui/icons';
import { trades, procedures } from '@/content';

export default function Trades() {
  return (
    <>
      <TopBar title="工種分類" />
      <Page>
        <ul className="grid gap-2 sm:grid-cols-2">
          {trades.map((t) => {
            const Icon = iconFor(t.icon);
            const n = procedures.filter((p) => p.tradeIds.includes(t.id)).length;
            return (
              <li key={t.id}>
                <Link to={`/trades/${t.id}`} className="tap flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 active:bg-surface-2">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="size-8 text-primary-ink" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold">{t.title}</span>
                    <span className="block text-sm text-muted">{t.summary}</span>
                  </span>
                  <span className="text-sm text-muted">{n ? `${n} 項工序` : '建置中'}</span>
                  <ChevronRight className="size-6 text-muted" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </Page>
    </>
  );
}
