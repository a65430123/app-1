import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Chips } from '@/components/ui/Chips';
import { Empty } from '@/components/ui/Card';
import { terms, originLabel } from '@/content';
import type { TermOrigin } from '@/schema';

const originColor: Record<TermOrigin, string> = {
  zh: 'bg-surface-2 text-muted', tw: 'bg-success/15 text-success', ja: 'bg-danger/10 text-danger', en: 'bg-primary/15 text-primary-ink', mixed: 'bg-surface-2 text-muted',
};

export default function Glossary() {
  const [origin, setOrigin] = useState<'all' | TermOrigin>('all');
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const list = terms.filter(
    (t) =>
      (origin === 'all' || t.origin === origin) &&
      (!ql || [t.title, t.formalName, t.summary, ...(t.aliases ?? []), t.reading?.tailo, t.reading?.kana, t.reading?.romaji, t.reading?.zhuyin]
        .filter(Boolean).some((s) => s!.toLowerCase().includes(ql))),
  );
  const origins = (['zh', 'tw', 'ja', 'en'] as const).filter((o) => terms.some((t) => t.origin === o));

  return (
    <>
      <TopBar title="術語辭典" back />
      <Page>
        <label className="tap mb-3 flex items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 focus-within:border-primary">
          <Search className="size-6 text-primary" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="查詞：鐵筋、土水、ELCB…" className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none" />
        </label>
        <Chips
          value={origin}
          onChange={setOrigin}
          options={[{ value: 'all' as const, label: '全部', count: terms.length }, ...origins.map((o) => ({ value: o, label: originLabel[o], count: terms.filter((t) => t.origin === o).length }))]}
        />
        <ul className="mt-4 flex flex-col gap-2">
          {list.map((t) => (
            <li key={t.id}>
              <Link to={`/glossary/${t.id}`} className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:bg-surface-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-lg font-bold">{t.title}</span>
                    {(t.reading?.tailo || t.reading?.kana) && <span className="text-sm text-muted">{t.reading.tailo ?? t.reading.kana}</span>}
                  </div>
                  <div className="text-sm text-muted">{t.summary}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-bold ${originColor[t.origin]}`}>{originLabel[t.origin]}</span>
                <ChevronRight className="size-6 shrink-0 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        {!list.length && <Empty text="找不到符合的術語" />}
      </Page>
    </>
  );
}
