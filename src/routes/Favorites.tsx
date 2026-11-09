import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { EntryRow } from '@/components/content/EntryRow';
import { typeLabel } from '@/content';
import { useLibrary } from '@/stores/library';
import type { ContentType } from '@/schema';

export default function Favorites() {
  const favorites = useLibrary((s) => s.favorites);
  const [f, setF] = useState<'all' | ContentType>('all');
  const types = [...new Set(favorites.map((x) => x.type))];
  const list = f === 'all' ? favorites : favorites.filter((x) => x.type === f);
  return (
    <>
      <TopBar title="我的收藏" back />
      <Page>
        {favorites.length ? (
          <>
            <Chips value={f} onChange={setF}
              options={[{ value: 'all' as const, label: '全部', count: favorites.length }, ...types.map((t) => ({ value: t, label: typeLabel[t], count: favorites.filter((x) => x.type === t).length }))]} />
            <div className="mt-4 flex flex-col gap-2">{list.map((x) => <EntryRow key={x.type + x.id} type={x.type} id={x.id} />)}</div>
          </>
        ) : (
          <Empty text="還沒有收藏。在工序、材料、術語或計算機頁面點右上角的 ☆ 就能收藏。">
            <Link to="/trades" className="tap mx-auto mt-4 flex max-w-xs items-center justify-center rounded-2xl bg-primary font-bold text-on-primary">去逛工種</Link>
          </Empty>
        )}
      </Page>
    </>
  );
}
