import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow, Placeholder } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { trades, procedures } from '@/data/placeholder';
import NotFound from './NotFound';

const tabs = ['工序', '材料', '術語'] as const;

export default function TradeDetail() {
  const { tradeId } = useParams();
  const trade = trades.find((t) => t.id === tradeId);
  const [tab, setTab] = useState<(typeof tabs)[number]>('工序');
  if (!trade) return <NotFound />;
  const list = procedures.filter((p) => p.tradeId === trade.id);

  return (
    <>
      <TopBar title={trade.name} back />
      <Page>
        <p className="mb-4 text-muted">{trade.blurb}</p>
        <div role="tablist" className="mb-4 grid grid-cols-3 rounded-2xl bg-surface-2 p-1">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`tap rounded-xl text-lg font-bold ${tab === t ? 'bg-surface text-primary-ink shadow-sm' : 'text-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === '工序' &&
          (list.length ? (
            <div className="flex flex-col gap-2">
              {list.map((p) => (
                <LinkRow key={p.id} to={`/procedures/${p.id}`} title={p.title} subtitle={p.summary} right={<DifficultyBadge level={p.difficulty} />} />
              ))}
            </div>
          ) : (
            <Placeholder text="此工種的工序內容建置中" />
          ))}
        {tab === '材料' && <Placeholder text="相關材料（P2 實作）" />}
        {tab === '術語' && <Placeholder text="相關術語（P2 實作）" />}
      </Page>
    </>
  );
}
