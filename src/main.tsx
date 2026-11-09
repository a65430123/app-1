import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initContent, checkForUpdate } from '@/features/content-update';
import { setupPwa } from '@/features/pwa';
import './styles/index.css';

async function start() {
  // 先套用本機已下載的較新內容（最多等 1.5 秒，避免卡住開啟）
  await Promise.race([initContent(), new Promise((r) => setTimeout(r, 1500))]);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  setupPwa();
  // 啟動後背景檢查內容更新
  setTimeout(() => checkForUpdate(), 2000);
}

start();
