import { Star, History, Settings, UserCircle, Package, BookA } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow, Card } from '@/components/ui/Card';
import { useLibrary } from '@/stores/library';

export default function Me() {
  const fav = useLibrary((s) => s.favorites.length);
  const his = useLibrary((s) => s.history.length);
  return (
    <>
      <TopBar title="我的" />
      <Page>
        <Card className="mb-4 flex items-center gap-3">
          <UserCircle className="size-14 text-muted" aria-hidden />
          <div>
            <div className="text-lg font-bold">訪客</div>
            <div className="text-sm text-muted">資料目前存在這台裝置；會員登入與雲端同步即將推出</div>
          </div>
        </Card>
        <div className="flex flex-col gap-2">
          <LinkRow to="/me/favorites" title="我的收藏" subtitle={`${fav} 筆`} left={<Star className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/me/history" title="瀏覽紀錄" subtitle={`${his} 筆`} left={<History className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/materials" title="材料庫" left={<Package className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/glossary" title="術語辭典" left={<BookA className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/me/settings" title="設定" subtitle="顯示模式、深色模式、字級、內容版本" left={<Settings className="size-6 text-primary" aria-hidden />} />
        </div>
      </Page>
    </>
  );
}
