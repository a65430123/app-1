import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Card, SpecTable } from '@/components/ui/Card';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ModalTextView } from '@/components/content/ModalTextView';
import { EntryRow } from '@/components/content/EntryRow';
import { getTerm } from '@/content';
import { useTrackView } from '@/stores/library';
import NotFound from './NotFound';

export default function TermDetail() {
  const { id } = useParams();
  const t = getTerm(id);
  useTrackView('term', t?.id);
  if (!t) return <NotFound />;

  // 只顯示中文名稱；外語來源與讀音寫在「解釋」內文中
  const zhAliases = t.aliases?.filter((a) => /[\u3400-\u9fff]/.test(a) && a !== t.title && a !== t.formalName) ?? [];
  const rows = [
    t.formalName && { label: '正式名稱', value: t.formalName },
    zhAliases.length > 0 && { label: '其他說法', value: zhAliases.join('、') },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <TopBar title="術語" back />
      <Page>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">{t.title}</h2>
            <p className="mt-1 text-muted">{t.summary}</p>
          </div>
          <FavoriteButton type="term" id={t.id} />
        </div>
        <SectionTitle>解釋</SectionTitle>
        <Card><ModalTextView text={t.definition} className="text-lg" /></Card>
        {rows.length > 0 && (
          <>
            <SectionTitle>名稱</SectionTitle>
            <SpecTable rows={rows} />
          </>
        )}
        {t.examples && (
          <>
            <SectionTitle>例句</SectionTitle>
            <div className="flex flex-col gap-2">
              {t.examples.map((e) => <Card key={e} className="border-l-4 border-l-primary">「{e}」</Card>)}
            </div>
          </>
        )}
        {t.relatedProcedureIds && (
          <>
            <SectionTitle>相關工序</SectionTitle>
            <div className="flex flex-col gap-2">{t.relatedProcedureIds.map((p) => <EntryRow key={p} type="procedure" id={p} showType={false} />)}</div>
          </>
        )}
      </Page>
    </>
  );
}
