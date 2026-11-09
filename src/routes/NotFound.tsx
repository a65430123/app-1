import { Link } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';

export default function NotFound() {
  return (
    <>
      <TopBar title="找不到頁面" back />
      <Page>
        <p className="mb-4 text-muted">這個頁面不存在，或內容已移除。</p>
        <Link to="/" className="tap inline-flex items-center rounded-2xl bg-primary px-6 text-lg font-bold text-on-primary">回首頁</Link>
      </Page>
    </>
  );
}
