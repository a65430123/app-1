# 工程通 — 第一階段規劃草案（v0.1）

> 狀態：**待確認**。本文件確認後才開始寫程式。
> 所有工程數據、規範僅供參考，實際依現場狀況、相關法規與專業技師判斷。

---

## 1. 網站地圖

```
/                          首頁（搜尋框、工種捷徑、最近瀏覽、精選工序）
├─ /trades                 工種分類列表
│  └─ /trades/:tradeId     單一工種（該工種的工序、相關材料、術語）
│     └─ /procedures/:id   工序詳細頁
├─ /materials              材料庫列表（篩選：工種、分類、計價單位）
│  └─ /materials/:id       材料詳細頁
├─ /glossary               工地術語辭典（注音/字首索引、語源篩選：國/台/日/英）
│  └─ /glossary/:id        術語詳細頁（也可用彈出卡片呈現）
├─ /tools                  工程計算機列表
│  └─ /tools/:calcId       單一計算機（輸入 → 結果 → 公式展開）
├─ /search?q=              全站搜尋結果（分頁籤：全部/工序/材料/術語/計算機）
├─ /me                     我的
│  ├─ /me/favorites        收藏
│  ├─ /me/history          瀏覽紀錄
│  └─ /me/settings         設定（新手/師傅模式、深色模式、字級、內容版本與更新、免責聲明、關於）
└─ (預留，不實作)
   ├─ /login、/account     會員
   ├─ /community           社群問答
   └─ /subscribe           訂閱方案
```

**底部導覽列（5 格）**：首頁｜工種｜搜尋｜計算機｜我的
（材料庫、術語辭典從首頁大按鈕與工種頁進入；若您希望材料/術語也上底部列，見決策 D7）

---

## 2. 主要頁面線框說明

共通：頂部列（返回、標題、模式切換小膠囊「新手/師傅」）、底部導覽列、最小觸控尺寸 56×56px、內文 18px 起。

### 2.1 首頁
```
┌──────────────────────────┐
│ 工程通            [新手▾] │
│ ┌──────────────────────┐ │
│ │ 🔍 搜尋工序、材料、術語 │ │  ← 大搜尋框（點了進 /search）
│ └──────────────────────┘ │
│ 工種                      │
│ [泥作][水電][防水][油漆]   │  ← 2×4 大方塊，含圖示
│ [木作][空調][鋼構][更多]   │
│ ┌────────┐┌────────┐     │
│ │ 材料庫  ││ 術語辭典 │     │  ← 兩張大卡
│ └────────┘└────────┘     │
│ 最近瀏覽  ───────── 全部 › │
│ ▸ 磁磚鋪貼（濕式軟底）     │
│ 精選工序                   │
│ ▸ 粉光  新手 ●○○          │
├──────────────────────────┤
│ 🏠  🧱  🔍  🧮  👤        │
└──────────────────────────┘
```

### 2.2 工種頁
- 頂部：工種名稱、簡介（新手模式顯示、師傅模式收合）
- 分頁籤：工序｜材料｜術語
- 工序清單卡片：名稱、難度標籤、預估工期、標籤
- 篩選：難度（新手/進階/師傅）

### 2.3 工序詳細頁（最核心）
```
標題：防水塗佈（PU 防水）   [☆收藏]
難度：進階 ●●○   版本 1.2 · 2026-11-01 更新
──────────────────
[概要] [步驟] [材料工具] [品管] [安全]   ← 黏性錨點分頁籤，點了捲動
① 概要：用途、適用場合、工期、（新手模式）白話說明
② 施工步驟：編號卡片，每步含 圖片/示意圖、說明、要點、
             「新手補充」區塊（僅新手模式顯示）、等待/養護時間
③ 材料與工具：清單，材料可點進材料庫；附「用量試算」按鈕→計算機
④ 常見錯誤 & 品管檢查：錯誤→後果→預防；可勾選的檢查清單（本機暫存）
⑤ 安全注意事項：醒目警示色框
──────────────────
相關術語（晶片，點了彈出解釋）｜相關工序
⚠ 僅供參考，實際依現場與相關法規、專業技師判斷
```
- **新手模式**：顯示白話解說、新手補充、術語自動加底線可點。
- **師傅模式**：隱藏解說段落，步驟壓成精簡條列，突出規格數據（配比、厚度、養護時間）。

### 2.4 材料詳細頁
名稱／別名 → 規格表 → 用途 → 優缺點（左右兩欄）→ 常見品牌類型（不列特定品牌，列類型，例「單液型 PU」「雙液型 PU」）→ 計價單位 → 保存與施工注意 → 使用此材料的工序

### 2.5 術語辭典
- 頂部搜尋＋語源篩選晶片：國語｜台語｜日語外來語｜英語
- 清單：詞條、注音/拼音、語源標記、一句話解釋
- 詳細：正式名稱、讀音（含台羅/假名）、語源、解釋、例句、相關工序

### 2.6 計算機
- 列表：大卡片（水泥砂漿、磁磚片數、油漆用量、線徑/壓降、混凝土方數）
- 單頁：輸入欄（大數字鍵盤、單位標示）→ 結果（大字）→「顯示公式」展開：公式、代入值、假設係數（損耗率等可調）→ 免責聲明

### 2.7 搜尋
- 即時搜尋（打字即出結果），支援注音/台語拼寫的別名欄位
- 結果依類型分組，顯示類型標籤與命中片段

### 2.8 我的 / 設定
收藏、瀏覽紀錄、顯示模式、深色模式（跟隨系統/淺/深）、字級（標準/大/特大）、內容版本與「檢查更新」、清除本機資料、免責聲明

---

## 3. 資料結構（Schema 草案，TypeScript）

```ts
// ---- 共通 ----
type Difficulty = 'beginner' | 'intermediate' | 'master';   // 新手/進階/師傅
type ISODate = string;  // '2026-11-09'

interface BaseEntry {
  id: string;            // 全站唯一，kebab-case，例 'plastering-finish'
  type: 'procedure' | 'material' | 'term' | 'trade' | 'calculator';
  version: string;       // 單筆內容版本，semver，例 '1.0.0'
  updatedAt: ISODate;
  tags: string[];
  difficulty: Difficulty;
  title: string;
  aliases?: string[];    // 搜尋用別名（台語、日語、俗稱）
  summary: string;       // 一句話（列表用）
  status?: 'draft' | 'published';
  sources?: Reference[]; // 參考依據（規範、公會資料等）
}

interface Reference { title: string; url?: string; note?: string }

// 可依模式顯示的文字
interface ModalText {
  beginner?: string;     // 新手模式額外白話說明
  master?: string;       // 師傅模式精簡版（無則用 default）
  default: string;
}

interface MediaRef {
  src: string;           // 相對路徑 'media/xxx.webp' 或遠端 URL
  alt: string;
  caption?: string;
  kind: 'photo' | 'diagram' | 'video';
}

// ---- 工種 ----
interface Trade extends BaseEntry {
  type: 'trade';
  icon: string;          // 圖示名稱
  order: number;         // 排序
  description: ModalText;
}

// ---- 工序 ----
interface Procedure extends BaseEntry {
  type: 'procedure';
  tradeIds: string[];
  overview: ModalText;
  duration?: string;               // '約 2–3 天（含養護）'
  steps: ProcedureStep[];
  materials: { materialId?: string; name: string; spec?: string; qtyNote?: string }[];
  tools: { name: string; note?: string }[];
  commonMistakes: { mistake: string; consequence: string; prevention: string }[];
  qcChecklist: { item: string; criteria?: string; method?: string }[];
  safety: { level: 'info' | 'warning' | 'danger'; text: string }[];
  relatedTermIds?: string[];
  relatedProcedureIds?: string[];
  calculatorIds?: string[];
}

interface ProcedureStep {
  order: number;
  title: string;
  body: ModalText;
  keyPoints?: string[];            // 要點（師傅模式主要顯示）
  specs?: { label: string; value: string }[];   // 例 { label: '配比', value: '1:3' }
  waitTime?: string;
  media?: MediaRef[];
}

// ---- 材料 ----
interface Material extends BaseEntry {
  type: 'material';
  category: string;                // '水泥類'、'防水材' ...
  tradeIds: string[];
  specs: { label: string; value: string }[];
  uses: string[];
  pros: string[];
  cons: string[];
  brandTypes: string[];            // 品牌「類型」而非特定品牌
  priceUnit: string;               // '包（50kg）'、'加侖'、'坪'
  storage: string[];
  cautions: string[];
  media?: MediaRef[];
}

// ---- 術語 ----
interface Term extends BaseEntry {
  type: 'term';
  origin: 'zh' | 'tw' | 'ja' | 'en' | 'mixed';  // 國/台/日/英
  reading?: { zhuyin?: string; tailo?: string; kana?: string; romaji?: string };
  formalName?: string;             // 正式名稱
  definition: ModalText;
  examples?: string[];
  tradeIds?: string[];
  relatedProcedureIds?: string[];
}

// ---- 計算機（公式邏輯在程式，參數與說明在內容）----
interface CalculatorMeta extends BaseEntry {
  type: 'calculator';
  engine: string;                  // 對應程式內的計算函式 key
  inputs: { key: string; label: string; unit: string; default?: number; min?: number; step?: number; help?: string }[];
  params: { key: string; label: string; value: number; unit?: string; note?: string }[];  // 可調係數（損耗率等）
  formulaDisplay: string;          // 顯示用公式（可含 LaTeX 或純文字）
  notes: string[];
}

// ---- 內容清單（遠端更新用）----
interface ContentManifest {
  schemaVersion: number;           // schema 破壞性變更時 +1，App 不相容則不套用
  contentVersion: string;          // 整包內容版本 '2026.11.09-1'
  minAppVersion: string;
  publishedAt: ISODate;
  files: { path: string; hash: string; size: number }[];   // 例 'procedures.json'
}
```

**驗證**：使用 Zod 定義上述 schema，`npm run validate:content` 在建置前檢查所有 JSON，缺欄位或 id 重複、關聯 id 不存在就建置失敗。

---

## 4. 資料夾結構

```
app-1/
├─ content/                    # ★ 內容（與程式完全分離）
│  ├─ manifest.json
│  ├─ trades/                  # 一工種一檔
│  │  ├─ masonry.json
│  │  └─ plumbing-electrical.json
│  ├─ procedures/              # 一工序一檔
│  │  ├─ plastering-finish.json
│  │  ├─ tile-laying.json
│  │  ├─ waterproof-coating.json
│  │  └─ outlet-wiring.json
│  ├─ materials/
│  ├─ terms/
│  ├─ calculators/
│  └─ media/                   # 圖片、示意圖（webp/svg）
├─ scripts/
│  ├─ validate-content.ts      # schema 驗證
│  └─ build-content.ts         # 合併成 bundle、產生 manifest 與 hash、搜尋索引
├─ public/
│  ├─ icons/                   # PWA 圖示
│  └─ manifest.webmanifest
├─ src/
│  ├─ main.tsx / App.tsx
│  ├─ routes/                  # 頁面（Home, Trades, Procedure, Materials, Glossary, Tools, Search, Me）
│  ├─ components/
│  │  ├─ layout/               # AppShell, TopBar, BottomNav
│  │  ├─ ui/                   # Button, Card, Tag, Tabs, DifficultyBadge, Disclaimer
│  │  └─ content/              # StepCard, Checklist, SafetyBox, TermChip, ModalTextView
│  ├─ features/
│  │  ├─ calculators/          # engines/*.ts（純函式，可單元測試）+ UI
│  │  ├─ search/               # 索引建立與查詢
│  │  └─ content-update/       # 遠端版本檢查、下載、套用
│  ├─ schema/                  # Zod schema + 推導出的 TS 型別
│  ├─ stores/                  # Zustand：settings, favorites, history, content
│  ├─ services/
│  │  ├─ storage/              # 儲存抽象層（Web: IndexedDB/localStorage；APP: Capacitor Preferences/Filesystem）
│  │  ├─ platform.ts           # 平台偵測與 API 降級
│  │  └─ (auth/ sync/ ads/)    # ★ 預留介面檔，空實作
│  ├─ styles/                  # Tailwind 設定、主題 token（CSS 變數）
│  └─ lib/                     # 工具函式
├─ tests/
├─ capacitor.config.ts         # 第 5 階段才加入
├─ vite.config.ts / tailwind.config.ts / tsconfig.json
└─ docs/PLANNING.md
```

**架構要點**
- **儲存抽象層**：所有本機存取經 `services/storage`，網頁用 IndexedDB，APP 換成 Capacitor 外掛，頁面程式不用改。
- **路由**：使用 `HashRouter` 或 `BrowserRouter`（見決策 D4）。
- **預留擴充**：`services/auth`、`services/sync`、`services/monetization` 先只定義 interface 與 no-op 實作；Zustand store 的收藏/紀錄資料帶 `updatedAt` 與 `deviceId`，日後雲端同步可直接合併。

---

## 5. 遠端內容更新機制（預留設計）

1. 建置時把 `/content` 打包成 `content-bundle.json`（或分檔）＋ `manifest.json`，**內建一份在 App 內**（離線首次開啟也能用）。
2. App 啟動（且有網路）→ 抓遠端 `manifest.json` → 比對 `contentVersion` 與 `schemaVersion`、`minAppVersion`。
3. 有新版且相容 → 背景下載有變動 hash 的檔案 → 驗證 hash 與 schema → 寫入本機儲存 → 提示「內容已更新」，下次切頁生效。
4. 失敗則保留舊版，不影響使用。
5. 設定頁可手動「檢查更新」並顯示目前內容版本。
> 此機制只更新「內容資料」，不更新程式碼，符合 App Store / Google Play 規範。

---

## 6. 開發階段規劃

| 階段 | 內容 | 可預覽成果 |
|---|---|---|
| **P0 規劃** | 本文件 | 確認網站地圖、schema、配色 |
| **P1 骨架** | Vite+React+TS+Tailwind、路由、AppShell、底部導覽、主題（配色/深色）、設定 store、所有頁面空殼 | 可點擊切換所有頁面、切換深色/模式 |
| **P2 內容與瀏覽** | Zod schema、內容建置腳本、4 筆示範工序（粉光、磁磚鋪貼、防水塗佈、插座配線）＋相關材料 3–5 筆、術語 5–10 筆、工種頁、工序/材料/術語詳細頁、新手/師傅模式差異呈現 | 完整瀏覽示範內容 |
| **P3 搜尋/收藏/紀錄** | 全站搜尋（含別名）、收藏、瀏覽紀錄、品管清單勾選暫存 | 可搜尋、可收藏 |
| **P4 計算機** | 5 種計算機（純函式＋單元測試）、公式展開、可調係數 | 可實際計算 |
| **P5 PWA** | Service Worker（vite-plugin-pwa）、離線快取、加到主畫面、遠端內容更新流程 | 斷網可用 |
| **P6 Capacitor** | 加入 Android/iOS 專案、儲存層換外掛、狀態列/安全區域、返回鍵處理、圖示與啟動畫面 | 模擬器/實機測試 |
| **P7 上架準備** | 隱私權政策、免責聲明、商店素材、內容擴充 | 送審 |
| 後續 | 會員、雲端同步、社群問答、廣告/訂閱 | — |

每階段完成都會：推送到分支、列出改動檔案、提供預覽方式，等您確認再進下一階段。

---

## 7. 需要您決定的事項

### D1 配色（三選一）
| 方案 | 主色 | 輔色 / 背景 | 特色 |
|---|---|---|---|
| **A 安全橘 × 碳灰**（建議） | `#F2700D` 安全橘 | `#2B2F33` 碳灰、`#F5F5F2` 淺底 | 最貼近工地意象、辨識度高；橘色在白底上小字對比略不足，文字改用深橘 `#B84F00` |
| **B 工程黃 × 石墨黑** | `#F5B800` 警示黃 | `#1E1E1E` 石墨黑、`#FAFAF7` | 類似重機具配色、極醒目；黃色不能當白底文字，只能當底色或強調 |
| **C 鋼藍 × 安全橘點綴** | `#1F5E8C` 鋼藍 | `#F2700D` 橘（僅警示/重點）、`#F4F6F8` | 最穩重專業、長時間閱讀不累、對比易達標；工地感較弱 |

深色模式三案皆支援（背景 `#121416` 系，主色提高亮度）。

### D2 內容格式
| 選項 | 優點 | 缺點 |
|---|---|---|
| **JSON**（建議） | 結構嚴謹、易驗證、遠端更新最單純、App 端不需解析器 | 長篇文字編輯較不直覺 |
| Markdown + frontmatter | 寫長文舒服、非工程師也好編 | 結構化欄位（步驟、檢查表）要靠約定，需建置轉換，驗證較難 |
| 混合（結構用 JSON，長說明欄位允許 Markdown 字串） | 兼顧兩者 | 稍增渲染複雜度 |

### D3 搜尋引擎
| 選項 | 優點 | 缺點 |
|---|---|---|
| **MiniSearch**（建議） | 小（~7KB）、離線、支援模糊搜尋與欄位權重 | 中文需自行斷字（用 2-gram，可接受） |
| Fuse.js | 模糊比對好、零設定 | 資料量大時較慢 |
| 自寫 includes 比對 | 最簡單 | 無排序與容錯 |

### D4 路由模式
| 選項 | 優點 | 缺點 |
|---|---|---|
| **BrowserRouter**（建議） | 網址乾淨、利於分享與 SEO | 網頁主機需設定 fallback 到 index.html（Capacitor 內沒問題） |
| HashRouter | 任何靜態主機都能跑 | 網址有 `#`，分享較醜 |

### D5 遠端內容存放位置（P5 才需要，可先決定方向）
| 選項 | 優點 | 缺點 |
|---|---|---|
| **GitHub Pages / 靜態主機**（建議起步） | 免費、內容就在 repo、改完推送即發佈 | 無後台編輯介面 |
| Firebase Hosting / Storage | 有 CDN、日後接會員/同步方便 | 綁定 Google 生態 |
| Headless CMS（Strapi、Sanity 等） | 有後台，非工程人員可編 | 成本、維運較高，現階段過度 |

### D6 圖示庫
| 選項 | 優點 | 缺點 |
|---|---|---|
| **Lucide**（建議） | 風格一致、線條清楚、樹搖小 | 工程專用圖示少，部分需自繪 SVG |
| Material Symbols | 數量多、有填色版本 | 較「Google 風」 |
| 全部自繪 | 最有特色 | 耗時 |

### D7 底部導覽列配置
| 選項 | 內容 |
|---|---|
| **A（建議）** | 首頁｜工種｜搜尋｜計算機｜我的 |
| B | 首頁｜工種｜材料｜術語｜我的（搜尋放頂部、計算機從首頁進） |
| C | 首頁｜搜尋｜計算機｜收藏｜我的 |

### D8 示範內容確認
預計：粉光（泥作）、磁磚鋪貼（泥作）、防水塗佈（防水）、插座配線（水電）共 4 筆工序，是否要再加第 5 筆（例：批土油漆）？

---

> 請回覆 D1–D8 的選擇（或直接說「都用建議」），以及網站地圖/schema 有無要增刪，確認後我從 **P1 骨架** 開始做。
