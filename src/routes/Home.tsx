import { Link } from 'react-router-dom';
import { Search, Package, BookA, MoreHorizontal } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, LinkRow, Placeholder } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { trades, procedures } from '@/data/placeholder';
import { useSettings } from '@/stores/settings';

export default function Home() {
  const mode = useSettings((s) => s.mode);
  return (
    <>
      <TopBar title="工程通" />
      <Page>
        {mode === 'beginner' && (
          <p className="mb-3 text-muted">從工種開始逛，或直接搜尋你想了解的施工方法、材料或工地用語。</p>
        )}
        <Link
          to="/search"
          className="tap flex items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-lg text-muted"
        >
          <Search className="size-6 text-primary" aria-hidden />
          搜尋工序、材料、術語
        </Link>

        <SectionTitle action={<Link to="/trades" className="font-bold text-primary-ink">全部 ›</Link>}>工種</SectionTitle>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {trades.slice(0, 7).map(({ id, name, icon: Icon }) => (
            <Link
              key={id}
              to={`/trades/${id}`}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface text-base font-bold active:bg-surface-2"
            >
              <Icon className="size-8 text-primary" aria-hidden />
              {name}
            </Link>
          ))}
          <Link
            to="/trades"
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface text-base font-bold active:bg-surface-2"
          >
            <MoreHorizontal className="size-8 text-muted" aria-hidden />
            更多
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/materials" className="flex min-h-24 items-center gap-3 rounded-2xl bg-charcoal p-4 text-on-charcoal active:opacity-90">
            <Package className="size-8 shrink-0 text-primary" aria-hidden />
            <span className="whitespace-nowrap text-lg font-bold">材料庫</span>
          </Link>
          <Link to="/glossary" className="flex min-h-24 items-center gap-3 rounded-2xl bg-charcoal p-4 text-on-charcoal active:opacity-90">
            <BookA className="size-8 shrink-0 text-primary" aria-hidden />
            <span className="whitespace-nowrap text-lg font-bold">術語辭典</span>
          </Link>
        </div>

        <SectionTitle action={<Link to="/me/history" className="font-bold text-primary-ink">全部 ›</Link>}>最近瀏覽</SectionTitle>
        <Placeholder text="還沒有瀏覽紀錄（P3 實作）" />

        <SectionTitle>精選工序</SectionTitle>
        <div className="flex flex-col gap-2">
          {procedures.map((p) => (
            <LinkRow key={p.id} to={`/procedures/${p.id}`} title={p.title} subtitle={p.summary} right={<DifficultyBadge level={p.difficulty} />} />
          ))}
        </div>
      </Page>
    </>
  );
}
