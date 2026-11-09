import { Link } from 'react-router-dom';
import { Search, Package, BookA, ListOrdered, MoreHorizontal } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Empty } from '@/components/ui/Card';
import { EntryRow } from '@/components/content/EntryRow';
import { iconFor } from '@/components/ui/icons';
import { trades, procedures, featuredProcedures } from '@/content';
import { useSettings } from '@/stores/settings';
import { useLibrary } from '@/stores/library';

export default function Home() {
  const mode = useSettings((s) => s.mode);
  const history = useLibrary((s) => s.history).slice(0, 3);
  return (
    <>
      <TopBar title="工程通" />
      <Page>
        {mode === 'beginner' && <p className="mb-3 text-muted">從工種開始逛，或直接搜尋你想了解的施工方法、材料或工地用語。</p>}
        <Link to="/search" className="tap flex items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-lg text-muted">
          <Search className="size-6 text-primary" aria-hidden />
          搜尋工序、材料、術語
        </Link>

        <SectionTitle action={<Link to="/trades" className="tap flex items-center font-bold text-primary-ink">全部 ›</Link>}>工種</SectionTitle>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {trades.slice(0, 7).map((t) => {
            const Icon = iconFor(t.icon);
            return (
              <Link key={t.id} to={`/trades/${t.id}`} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface text-base font-bold active:bg-surface-2">
                <Icon className="size-8 text-primary" aria-hidden />
                {t.title}
              </Link>
            );
          })}
          <Link to="/trades" className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface text-base font-bold active:bg-surface-2">
            <MoreHorizontal className="size-8 text-muted" aria-hidden />
            更多
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { to: '/procedures', label: '工序百科', Icon: ListOrdered },
            { to: '/materials', label: '材料庫', Icon: Package },
            { to: '/glossary', label: '術語辭典', Icon: BookA },
          ].map(({ to, label, Icon }) => (
            <Link key={to} to={to} className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl bg-charcoal p-3 text-on-charcoal active:opacity-90">
              <Icon className="size-8 shrink-0 text-primary" aria-hidden />
              <span className="whitespace-nowrap text-base font-bold">{label}</span>
            </Link>
          ))}
        </div>

        <SectionTitle action={history.length > 0 && <Link to="/me/history" className="tap flex items-center font-bold text-primary-ink">全部 ›</Link>}>最近瀏覽</SectionTitle>
        {history.length ? (
          <div className="flex flex-col gap-2">{history.map((h) => <EntryRow key={h.type + h.id} type={h.type} id={h.id} />)}</div>
        ) : (
          <Empty text="還沒有瀏覽紀錄，先點個工序看看吧" />
        )}

        <SectionTitle action={<Link to="/procedures" className="tap flex items-center font-bold text-primary-ink">全部 {procedures.length} 項 ›</Link>}>精選工序</SectionTitle>
        <div className="flex flex-col gap-2">
          {featuredProcedures.map((p) => <EntryRow key={p.id} type="procedure" id={p.id} showType={false} />)}
        </div>
      </Page>
    </>
  );
}
