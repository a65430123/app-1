import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow, Empty } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { materials, materialCategories } from '@/content';
import type { Material } from '@/schema';

const matches = (m: Material, q: string) =>
  [m.title, m.summary, m.category, ...(m.aliases ?? []), ...m.uses, ...m.brandTypes].some((s) => s.toLowerCase().includes(q));

export default function Materials() {
  const cats = materialCategories;
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();

  const filtered = materials.filter((m) => (cat === 'all' || m.category === cat) && (!ql || matches(m, ql)));
  const groups = cats
    .map((c) => ({ c, items: filtered.filter((m) => m.category === c).sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant-TW')) }))
    .filter((g) => g.items.length);

  return (
    <>
      <TopBar title="材料庫" back />
      <Page>
        <label className="tap mb-3 flex items-center gap-3 rounded-2xl border-2 border-line bg-surface pl-4 focus-within:border-primary">
          <Search className="size-6 shrink-0 text-primary" aria-hidden />
          <input id="material-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="找材料：矽利康、夾板、PVC 管…"
            className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none [&::-webkit-search-cancel-button]:hidden" />
          {q && (
            <button type="button" onClick={() => setQ('')} className="tap flex items-center justify-center" aria-label="清除">
              <X className="size-6 text-muted" />
            </button>
          )}
        </label>
        <Chips
          value={cat}
          onChange={setCat}
          options={[{ value: 'all', label: '全部', count: materials.length }, ...cats.map((c) => ({ value: c, label: c, count: materials.filter((m) => m.category === c).length }))]}
        />
        <p className="mt-3 text-sm text-muted">共 {filtered.length} 項材料</p>

        {groups.map((g) => (
          <section key={g.c} className="mt-4">
            {cat === 'all' && <h2 className="mb-2 text-lg font-bold text-muted">{g.c}<span className="ml-2 text-sm font-normal">{g.items.length}</span></h2>}
            <div className="flex flex-col gap-2">
              {g.items.map((m) => (
                <LinkRow key={m.id} to={`/materials/${m.id}`} title={m.title} subtitle={m.summary}
                  right={<span className="hidden shrink-0 text-sm text-muted sm:block">{m.priceUnit}</span>} />
              ))}
            </div>
          </section>
        ))}
        {!filtered.length && <div className="mt-4"><Empty text="找不到符合的材料，換個關鍵字試試看" /></div>}
      </Page>
    </>
  );
}
