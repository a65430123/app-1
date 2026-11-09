import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { EntryRow } from '@/components/content/EntryRow';
import { search } from '@/features/search';
import { typeLabel } from '@/content';
import type { ContentType } from '@/schema';

type Filter = 'all' | ContentType;
const suggestions = ['粉光', '防水', '空心', '鐵筋', 'ELCB', '水泥', '壓降', '紅毛土'];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const filter = (params.get('t') as Filter) || 'all';
  const hits = useMemo(() => search(q), [q]);
  const shown = filter === 'all' ? hits : hits.filter((h) => h.type === filter);
  const types: ContentType[] = ['procedure', 'material', 'term', 'calculator', 'trade'];

  const update = (next: { q?: string; t?: Filter }) => {
    const nq = next.q ?? q;
    const nt = next.t ?? filter;
    const p: Record<string, string> = {};
    if (nq) p.q = nq;
    if (nt !== 'all') p.t = nt;
    setParams(p, { replace: true });
  };

  return (
    <>
      <TopBar title="搜尋" />
      <Page>
        <label className="tap flex items-center gap-3 rounded-2xl border-2 border-primary bg-surface pl-4">
          <SearchIcon className="size-6 shrink-0 text-primary" aria-hidden />
          <input autoFocus type="search" enterKeyHint="search" value={q} onChange={(e) => update({ q: e.target.value })}
            placeholder="工序、材料、術語、台語、日語…" className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none [&::-webkit-search-cancel-button]:hidden" />
          {q && (
            <button type="button" onClick={() => update({ q: '' })} className="tap flex items-center justify-center" aria-label="清除">
              <X className="size-6 text-muted" />
            </button>
          )}
        </label>

        {q ? (
          <>
            <div className="mt-3">
              <Chips<Filter>
                value={filter}
                onChange={(t) => update({ t })}
                options={[{ value: 'all', label: '全部', count: hits.length }, ...types.filter((t) => hits.some((h) => h.type === t)).map((t) => ({ value: t, label: typeLabel[t], count: hits.filter((h) => h.type === t).length }))]}
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {shown.map((h) => <EntryRow key={h.type + h.id} type={h.type} id={h.id} />)}
            </div>
            {!shown.length && <div className="mt-4"><Empty text={`找不到「${q}」相關內容，換個說法試試看`} /></div>}
          </>
        ) : (
          <>
            <h2 className="mb-2 mt-6 text-lg font-bold text-muted">試試看</h2>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => update({ q: s })} className="min-h-12 rounded-full border-2 border-line bg-surface px-4 font-bold">{s}</button>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              可以用工地俗稱搜尋，例如「土水」「控固力」。也可以到 <Link to="/glossary" className="font-bold text-primary-ink underline">術語辭典</Link> 瀏覽所有工地用語。
            </p>
          </>
        )}
      </Page>
    </>
  );
}
