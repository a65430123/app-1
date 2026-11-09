/** P1 暫用的簡單頁面殼（P2 起逐一換成正式頁面） */
import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Placeholder } from '@/components/ui/Card';

export function ShellPage({ title, back = true, note }: { title: string; back?: boolean; note: string }) {
  return (
    <>
      <TopBar title={title} back={back} />
      <Page>
        <Placeholder text={note} />
      </Page>
    </>
  );
}

export const Materials = () => <ShellPage title="材料庫" note="材料列表與篩選（P2 實作）" />;
export const MaterialDetail = () => {
  const { id } = useParams();
  return <ShellPage title="材料" note={`材料「${id}」詳細頁（P2 實作）`} />;
};
export const Glossary = () => <ShellPage title="術語辭典" note="術語列表、語源篩選：國語／台語／日語外來語／英語（P2 實作）" />;
export const TermDetail = () => {
  const { id } = useParams();
  return <ShellPage title="術語" note={`術語「${id}」詳細頁（P2 實作）`} />;
};
export const Favorites = () => <ShellPage title="收藏" note="收藏清單（P3 實作）" />;
export const History = () => <ShellPage title="瀏覽紀錄" note="瀏覽紀錄（P3 實作）" />;
