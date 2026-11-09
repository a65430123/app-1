import { Star, History, Settings, UserCircle } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow, Card } from '@/components/ui/Card';

export default function Me() {
  return (
    <>
      <TopBar title="我的" />
      <Page>
        <Card className="mb-4 flex items-center gap-3">
          <UserCircle className="size-14 text-muted" aria-hidden />
          <div>
            <div className="text-lg font-bold">訪客</div>
            <div className="text-sm text-muted">會員登入與雲端同步即將推出</div>
          </div>
        </Card>
        <div className="flex flex-col gap-2">
          <LinkRow to="/me/favorites" title="收藏" right={<Star className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/me/history" title="瀏覽紀錄" right={<History className="size-6 text-primary" aria-hidden />} />
          <LinkRow to="/me/settings" title="設定" subtitle="顯示模式、深色模式、字級、內容版本" right={<Settings className="size-6 text-primary" aria-hidden />} />
        </div>
      </Page>
    </>
  );
}
