import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { terms } from '@/content';

export default function Glossary() {
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  // 仍可用讀音、外文別名查到詞條（例：輸入「斗賴把」可找到「螺絲起子」），但畫面只顯示中文
  const list = terms.filter(
    (t) =>
      !ql ||
      [t.title, t.formalName, t.summary, ...(t.aliases ?? []), t.reading?.tailo, t.reading?.kana, t.reading?.romaji, t.reading?.zhuyin]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(ql)),
  );

  return (
    <>
      <TopBar title="術語辭典" back />
      <Page>
        <label className="tap mb-1 flex items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 focus-within:border-primary">
          <Search className="size-6 text-primary" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="查詞：鋼筋、模板…" className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none" />
        </label>
        <p className="mb-3 text-sm text-muted">共 {list.length} 個詞條</p>
        <ul className="flex flex-col gap-2">
          {list.map((t) => (
            <li key={t.id}>
              <Link to={`/glossary/${t.id}`} className="tap flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:bg-surface-2">
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold">{t.title}</div>
                  <div className="text-sm text-muted">{t.summary}</div>
                </div>
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
