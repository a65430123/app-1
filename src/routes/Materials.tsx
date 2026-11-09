import { useMemo, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { materials } from '@/content';

export default function Materials() {
  const cats = useMemo(() => [...new Set(materials.map((m) => m.category))], []);
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? materials : materials.filter((m) => m.category === cat);
  return (
    <>
      <TopBar title="材料庫" back />
      <Page>
        <Chips
          value={cat}
          onChange={setCat}
          options={[{ value: 'all', label: '全部', count: materials.length }, ...cats.map((c) => ({ value: c, label: c, count: materials.filter((m) => m.category === c).length }))]}
        />
        <div className="mt-4 flex flex-col gap-2">
          {list.map((m) => (
            <LinkRow key={m.id} to={`/materials/${m.id}`} title={m.title} subtitle={`${m.category}・${m.summary}`}
              right={<span className="hidden shrink-0 text-sm text-muted sm:block">{m.priceUnit}</span>} />
          ))}
        </div>
      </Page>
    </>
  );
}
