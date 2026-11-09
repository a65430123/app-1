import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { EntryRow } from '@/components/content/EntryRow';
import { ModalTextView } from '@/components/content/ModalTextView';
import { getTrade, procedures, materials, terms } from '@/content';
import NotFound from './NotFound';

type Tab = 'procedure' | 'material' | 'term';

export default function TradeDetail() {
  const { tradeId } = useParams();
  const trade = getTrade(tradeId);
  const [tab, setTab] = useState<Tab>('procedure');
  if (!trade) return <NotFound />;

  const lists = {
    procedure: procedures.filter((p) => p.tradeIds.includes(trade.id)),
    material: materials.filter((m) => m.tradeIds.includes(trade.id)),
    term: terms.filter((t) => t.tradeIds?.includes(trade.id)),
  };
  const list = lists[tab];

  return (
    <>
      <TopBar title={trade.title} back />
      <Page>
        <ModalTextView text={trade.description} className="mb-4 text-muted" />
        <div role="tablist" className="mb-4 grid grid-cols-3 rounded-2xl bg-surface-2 p-1">
          {(
            [
              ['procedure', '工序'],
              ['material', '材料'],
              ['term', '術語'],
            ] as const
          ).map(([v, l]) => (
            <button key={v} role="tab" aria-selected={tab === v} onClick={() => setTab(v)}
              className={`tap rounded-xl text-lg font-bold ${tab === v ? 'bg-surface text-primary-ink shadow-sm' : 'text-muted'}`}>
              {l} <span className="text-sm">{lists[v].length}</span>
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="flex flex-col gap-2">{list.map((e) => <EntryRow key={e.id} type={tab} id={e.id} showType={false} />)}</div>
        ) : (
          <Empty text="此分類內容建置中" />
        )}
      </Page>
    </>
  );
}

