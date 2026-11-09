import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Card, Bullets, SpecTable } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { EntryRow } from '@/components/content/EntryRow';
import { getMaterial, procedures } from '@/content';
import { useTrackView } from '@/stores/library';
import NotFound from './NotFound';

export default function MaterialDetail() {
  const { id } = useParams();
  const m = getMaterial(id);
  useTrackView('material', m?.id);
  if (!m) return <NotFound />;
  const usedIn = procedures.filter((p) => p.materials.some((x) => x.materialId === m.id));

  return (
    <>
      <TopBar title={m.title} back />
      <Page>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-sm font-bold text-muted">{m.category}</span>
            <h2 className="mt-2 text-2xl font-bold leading-tight">{m.title}</h2>
            {m.aliases && <p className="text-sm text-muted">又稱：{m.aliases.join('、')}</p>}
            <p className="mt-2">{m.summary}</p>
          </div>
          <FavoriteButton type="material" id={m.id} />
        </div>

        <SectionTitle>規格</SectionTitle>
        <SpecTable rows={[...m.specs, { label: '計價單位', value: m.priceUnit }]} />

        <SectionTitle>用途</SectionTitle>
        <Card><Bullets items={m.uses} /></Card>

        <SectionTitle>優缺點</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          <Card>
            <h3 className="mb-1 flex items-center gap-2 font-bold text-success"><ThumbsUp className="size-5" aria-hidden />優點</h3>
            <Bullets items={m.pros} />
          </Card>
          <Card>
            <h3 className="mb-1 flex items-center gap-2 font-bold text-danger"><ThumbsDown className="size-5" aria-hidden />缺點</h3>
            <Bullets items={m.cons} />
          </Card>
        </div>

        <SectionTitle>常見產品類型</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {m.brandTypes.map((b) => <span key={b} className="rounded-xl bg-surface-2 px-3 py-2">{b}</span>)}
        </div>

        <SectionTitle>保存方式</SectionTitle>
        <Card><Bullets items={m.storage} /></Card>
        <SectionTitle>施工注意</SectionTitle>
        <Card className="border-warning bg-warning-bg"><Bullets items={m.cautions} /></Card>

        {usedIn.length > 0 && (
          <>
            <SectionTitle>使用此材料的工序</SectionTitle>
            <div className="flex flex-col gap-2">{usedIn.map((p) => <EntryRow key={p.id} type="procedure" id={p.id} showType={false} />)}</div>
          </>
        )}
        <p className="mt-6 text-sm text-muted">v{m.version}・{m.updatedAt} 更新</p>
        <Disclaimer className="mt-3" />
      </Page>
    </>
  );
}
