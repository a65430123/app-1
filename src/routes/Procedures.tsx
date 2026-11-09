import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { EntryRow } from '@/components/content/EntryRow';
import { procedures, trades } from '@/content';
import type { Difficulty, Procedure } from '@/schema';

const levels: { value: 'all' | Difficulty; label: string }[] = [
  { value: 'all', label: '全部難度' },
  { value: 'beginner', label: '新手' },
  { value: 'intermediate', label: '進階' },
  { value: 'master', label: '師傅' },
];

const matches = (p: Procedure, q: string) =>
  [p.title, p.summary, ...(p.aliases ?? []), ...p.tags, ...p.steps.map((s) => s.title)].some((s) => s.toLowerCase().includes(q));

export default function Procedures() {
  const [q, setQ] = useState('');
  const [trade, setTrade] = useState('all');
  const [level, setLevel] = useState<'all' | Difficulty>('all');
  const ql = q.trim().toLowerCase();

  const filtered = procedures.filter(
    (p) => (trade === 'all' || p.tradeIds.includes(trade)) && (level === 'all' || p.difficulty === level) && (!ql || matches(p, ql)),
  );
  // 依「主要工種」（tradeIds 第一個）分組，工種順序依內容設定
  const groups = trades
    .map((t) => ({ t, items: filtered.filter((p) => (trade === 'all' ? p.tradeIds[0] === t.id : p.tradeIds.includes(t.id) && t.id === trade)) }))
    .filter((g) => g.items.length);

  return (
    <>
      <TopBar title="工序百科" back />
      <Page>
        <label className="tap mb-3 flex items-center gap-3 rounded-2xl border-2 border-line bg-surface pl-4 focus-within:border-primary">
          <Search className="size-6 shrink-0 text-primary" aria-hidden />
          <input id="procedure-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="找工序：防水、貼磚、冷氣…"
            className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none [&::-webkit-search-cancel-button]:hidden" />
          {q && (
            <button type="button" onClick={() => setQ('')} className="tap flex items-center justify-center" aria-label="清除">
              <X className="size-6 text-muted" />
            </button>
          )}
        </label>
        <Chips value={level} onChange={setLevel} options={levels.map((l) => ({ ...l, count: l.value === 'all' ? undefined : procedures.filter((p) => p.difficulty === l.value).length }))} />
        <div className="mt-2">
          <Chips
            value={trade}
            onChange={setTrade}
            options={[{ value: 'all', label: '全部工種' }, ...trades.filter((t) => procedures.some((p) => p.tradeIds.includes(t.id))).map((t) => ({ value: t.id, label: t.title, count: procedures.filter((p) => p.tradeIds.includes(t.id)).length }))]}
          />
        </div>
        <p className="mt-3 text-sm text-muted">共 {filtered.length} 項工序</p>

        {groups.map((g) => (
          <section key={g.t.id} className="mt-4">
            <h2 className="mb-2 text-lg font-bold text-muted">{g.t.title}<span className="ml-2 text-sm font-normal">{g.items.length}</span></h2>
            <div className="flex flex-col gap-2">{g.items.map((p) => <EntryRow key={p.id} type="procedure" id={p.id} showType={false} />)}</div>
          </section>
        ))}
        {!filtered.length && <div className="mt-4"><Empty text="找不到符合的工序，換個條件試試看" /></div>}
      </Page>
    </>
  );
}
