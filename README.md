# 工程通

工程知識平台（網頁版 → PWA → Capacitor Android / iOS）。規劃文件見 [docs/PLANNING.md](docs/PLANNING.md)。

## 開發

```bash
npm install
npm run dev      # 開發預覽（http://localhost:5173）
npm run build    # 型別檢查 + 正式建置
```

> 本平台工程數據、規範僅供參考，實際依現場狀況、相關法規與專業技師判斷。

## 離線與安裝（PWA）

- 第一次開啟後，程式與內建內容會全部快取，之後沒有網路也能使用。
- 「我的 → 設定 → 加到主畫面」：Android／桌機 Chrome 可一鍵安裝；iOS 請用 Safari「分享 → 加入主畫面」。
- 程式有新版時，畫面下方會出現「工程通有新版本 → 重新整理」。

## 發佈內容更新（不需重新上架 App）

1. 修改或新增 `content/` 內的 JSON。
2. 把 `content/manifest.json` 的 `contentVersion` 往上調，例如 `2026.11.09-1` → `2026.11.20-1`。
3. `npm run build`：會先驗證內容，並輸出 `dist/content-api/manifest.json` 與 `bundle-<版本>.json`。
4. 把 `dist/content-api/` 上傳到內容主機（預設與網站同網域的 `/content-api/`）。
   App（含 iOS／Android 版）啟動時就會下載並驗證新內容。

- 遠端網址可用環境變數 `VITE_CONTENT_BASE_URL` 指定（結尾要有 `/`），APP 版會用到。
- 只有資料結構（schema）有破壞性變更時才調 `schemaVersion`；舊版 App 會拒絕套用並提示更新 App。
- `minAppVersion`：新內容需要較新 App 才能顯示時調高。
