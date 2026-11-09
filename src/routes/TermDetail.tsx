import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Card, SpecTable } from '@/components/ui/Card';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ModalTextView } from '@/components/content/ModalTextView';
import { EntryRow } from '@/components/content/EntryRow';
import { getTerm, originLabel } from '@/content';
import { useTrackView } from '@/stores/library';
import NotFound from './NotFound';

export default function TermDetail() {
  const { id } = useParams();
  const t = getTerm(id);
  useTrackView('term', t?.id);
  if (!t) return <NotFound />;

  const rows = [
    { label: '語源', value: originLabel[t.origin] },
    t.formalName && { label: '正式名稱', value: t.formalName },
    t.reading?.zhuyin && { label: '注音', value: t.reading.zhuyin },
    t.reading?.tailo && { label: '台羅拼音', value: t.reading.tailo },
    t.reading?.kana && { label: '日文', value: t.reading.kana + (t.reading.romaji ? `（${t.reading.romaji}）` : '') },
    t.aliases?.length && { label: '其他說法', value: t.aliases.join('、') },
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
        <SectionTitle>讀音與語源</SectionTitle>
        <SpecTable rows={rows} />
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
