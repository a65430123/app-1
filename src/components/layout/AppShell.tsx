import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from './BottomNav';

/** 全站外框：內容區 + 底部導覽列。換頁時捲回頂端。 */
export function AppShell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-full pb-[calc(68px+env(safe-area-inset-bottom))]">
      <Outlet />
      <BottomNav />
    </div>
  );
}

/** 每頁共用：TopBar 下方的內容容器（手機優先，平板/桌機置中限寬） */
export function Page({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-3xl px-4 pb-8 pt-4">{children}</main>;
}
