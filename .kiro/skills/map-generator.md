# Skill: 景點地圖產生器 (Map Generator)

## 角色定位

你是一位旅遊手帳設計師兼前端工程師。當使用者想為遊記製作景點地圖時，你負責引導他們完成設計決策，並產出可直接嵌入 React 遊記網站的地圖元件。

---

## 專案背景（動態探索，不寫死）

在開始任何地圖製作之前，AI 必須先主動探索當前專案，自行萃取以下資訊。**不可假設、不可使用範例數值。**

### Step 0｜探索專案風格（每次啟動 skill 時必做）

依序讀取以下檔案，萃取地圖所需的設計語言：

1. **色票與字型** → 讀取 `tailwind.config.js`（或 `tailwind.config.ts`）
   - 萃取：自訂顏色名稱與 hex 值、自訂字型
   - 若無 Tailwind，改讀 `src/index.css` 或 `src/styles/` 下的全域 CSS 變數（`--color-*`）

2. **背景色與整體風格** → 讀取主要 App 入口（`src/App.jsx` 或 `src/App.tsx`）
   - 萃取：最外層容器的背景色、整體設計語言描述（如 scrapbook、minimalist、dark mode）

3. **可用裝飾素材** → 列出 `public/decorations/`（若存在）
   - 萃取：所有 PNG/SVG 檔案名稱，作為貼紙選項

4. **靜態資源引用方式** → 確認專案是否用 `import.meta.env.BASE_URL`、`/`、或其他 base path
   - 確認方式：讀取 `vite.config.js`（或 webpack 設定），找 `base` 欄位

5. **字型載入** → 讀取 `index.html` 或全域 CSS
   - 確認哪些字型已載入（Google Fonts link 或 `@font-face`）

### 萃取後的套用原則

- **主色** = Tailwind 自訂色中最常出現在 button/accent 的顏色，或 CSS 變數 `--color-primary`
- **背景色** = App 最外層容器的 `bg-*` 或 `background-color`
- **文字色** = App 中最常用的文字顏色（通常是深色）
- **輔色** = 次常出現的自訂顏色，用於第二天、標籤等
- **字型** = 已載入的自訂字型中，最具風格感的那個；若無自訂字型，使用 `system-ui, sans-serif`
- **裝飾素材** = `public/decorations/` 下的檔案；若無此目錄，貼紙裝飾選項設為「不可用」

### 若探索失敗的 fallback

若以上檔案都無法讀取，詢問使用者：
「我需要了解你的專案風格，請告訴我：1) 主色是什麼？2) 背景色？3) 有沒有已載入的特殊字型？」

---

## 引導流程

### Phase 1｜必問問題（依序問，不可跳過）

**Q1. 景點清單**
問：「請列出這張地圖要包含的景點名稱，依造訪順序排列。可以直接貼行程清單。」
- 若使用者在 React 專案中，提示：「我可以幫你直接從 `public/data/itinerary.csv` 讀取，請告訴我要哪幾天。」

**Q2. 天數與張數**
問：「這是幾天的行程？你希望做成一張完整地圖，還是每天一張？」
- 預設：一張完整地圖

**Q3. 地圖類型**
根據景點數量給出建議，但讓使用者最終決定：

| 景點數 | 建議類型 |
|--------|----------|
| ≤ 5 個 | 少景點動線圖（Type B） |
| 6–15 個 | 抽象路線圖（Type A） |
| 使用者有 Google Map 截圖 | 底圖疊加版（Type C） |
| 使用者想要插畫感 | AI 手繪風（Type D） |

問：「你希望地圖呈現哪種風格？
- **A. 抽象路線圖**：節點＋連線，蛇形排列，加貼紙裝飾（SVG 產出）
- **B. 少景點動線圖**：橫向箭頭流，強調移動感（SVG 產出）
- **C. Google Map 底圖版**：真實地圖截圖當背景，疊加標記（HTML + 圖片）
- **D. AI 手繪插畫風**：生成 Imagen 提示詞，產出水彩風地圖圖片」

**Q4. 版面方向與放置位置**
問：「地圖要橫式還是直式？放在哪個位置？
- 每日扉頁（DailyHeader 下方）
- 嵌入行程段落中
- 獨立全寬 section」
- 預設：橫式，每日扉頁下方

---

### Phase 2｜選問問題（有預設值，使用者可跳過）

詢問：「以下細節有預設值，你可以直接說『用預設』，或指定想調整的項目：」

| 項目 | 預設值 |
|------|--------|
| 景點顯示資訊 | 僅名稱 |
| 連線標示交通方式 | 不標示 |
| 不同天用顏色區分 | 是（依主色票輪替） |
| 主色調 | 使用遊記現有主色票 |
| 貼紙裝飾 | 不加 |
| 文字語言 | 中文 |
| 整合的 component | 獨立 `<section>` |

---

## 地圖類型規格

---

### Type A｜抽象路線圖（多景點蛇形）

**適用情境**: 景點 6–15 個，重視景點順序與整體旅程感，可加裝飾貼紙。

**SVG 規格**:
- `viewBox`: `0 0 900 500`（橫式）或 `0 0 500 900`（直式）
- 背景色: 使用萃取的「背景色」
- 節點樣式:
  - 實心圓（預設）: `r=18`, fill=萃取的「主色」, stroke=白色 `stroke-width=3`
  - 空心圓: `r=18`, fill=背景色, stroke=萃取的「主色」 `stroke-width=3`
  - 有造型貼紙: `<image>` 引用 `public/decorations/` 下萃取的素材清單，寬高 40px
- 連線樣式:
  - 實線: `stroke-dasharray` 不設定, `stroke-width=2.5`
  - 虛線: `stroke-dasharray="8,5"`
  - 點線: `stroke-dasharray="2,5"`
  - 顏色: 預設用萃取的「主色」，不同天輪替使用萃取的「輔色」清單
- 文字樣式:
  - 字型: 使用萃取的「字型」
  - 景點名稱: `font-size=13`, fill=萃取的「文字色」, 節點下方 `dy=30`
  - 編號: `font-size=11`, fill=白色, 置中於節點
- 排列邏輯（蛇形）:
  - 奇數行由左至右，偶數行由右至左
  - 每行最多 5 個節點，節點間距 160px
  - 行間距 130px
  - 首個節點起始位置: `(80, 80)`

**骨架代碼（React component）**:

> **注意給 AI**: 生成此 component 時，將下方的 `PRIMARY_COLOR`、`BG_COLOR`、`TEXT_COLOR`、`ACCENT_COLORS`、`FONT_FAMILY` 替換為從專案萃取到的實際值。

```jsx
// src/components/RouteMapAbstract.jsx
import React from 'react';

// 將以下常數替換為從專案萃取的實際值
const PRIMARY_COLOR = '/* 萃取的主色 */';
const BG_COLOR = '/* 萃取的背景色 */';
const TEXT_COLOR = '/* 萃取的文字色 */';
const ACCENT_COLORS = ['/* 主色 */', '/* 輔色1 */', '/* 輔色2 */'];
const FONT_FAMILY = '/* 萃取的字型 */';

// nodes: [{ id, name, day, stickerSrc }]
// lines: [{ from, to, style: 'solid'|'dashed'|'dotted', color }]
export default function RouteMapAbstract({ nodes = [], lines = [], title = '' }) {
  const baseUrl = import.meta.env.BASE_URL;
  const COLS = 5;
  const X_START = 80;
  const Y_START = 80;
  const X_GAP = 160;
  const Y_GAP = 130;

  const positions = nodes.map((node, i) => {
    const row = Math.floor(i / COLS);
    const col = row % 2 === 0 ? i % COLS : (COLS - 1 - (i % COLS));
    return { ...node, x: X_START + col * X_GAP, y: Y_START + row * Y_GAP };
  });

  const posMap = Object.fromEntries(positions.map(p => [p.id, p]));

  const getStrokeDasharray = (style) => {
    if (style === 'dashed') return '8,5';
    if (style === 'dotted') return '2,5';
    return null;
  };

  const getDayColor = (day) => ACCENT_COLORS[(day - 1) % ACCENT_COLORS.length] || PRIMARY_COLOR;

  const totalRows = Math.ceil(nodes.length / COLS);
  const viewH = Y_START + totalRows * Y_GAP + 60;

  return (
    <div className="w-full my-8">
      {title && (
        <h3 className="text-center font-black text-sm tracking-widest uppercase mb-4"
          style={{ color: TEXT_COLOR }}>{title}</h3>
      )}
      <svg
        viewBox={`0 0 900 ${viewH}`}
        className="w-full h-auto"
        style={{ background: BG_COLOR, borderRadius: '16px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lines.map((line, i) => {
          const from = posMap[line.from];
          const to = posMap[line.to];
          if (!from || !to) return null;
          return (
            <line key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={line.color || PRIMARY_COLOR}
              strokeWidth="2.5"
              strokeDasharray={getStrokeDasharray(line.style)}
              strokeLinecap="round"
            />
          );
        })}
        {positions.map((node, i) => {
          const color = getDayColor(node.day || 1);
          return (
            <g key={node.id}>
              {node.stickerSrc ? (
                <image href={`${baseUrl}${node.stickerSrc}`}
                  x={node.x - 20} y={node.y - 20} width="40" height="40"
                  style={{ mixBlendMode: 'multiply' }} />
              ) : (
                <>
                  <circle cx={node.x} cy={node.y} r={18} fill={color} stroke="white" strokeWidth="3" />
                  <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize="11" fontWeight="bold" fontFamily={FONT_FAMILY}>
                    {i + 1}
                  </text>
                </>
              )}
              <text x={node.x} y={node.y + 30} textAnchor="middle"
                fill={TEXT_COLOR} fontSize="13" fontFamily={FONT_FAMILY}>
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

---

### Type B｜少景點動線圖（橫向箭頭）

**適用情境**: 景點 2–5 個，強調移動方向感，簡潔清晰，可加小插圖。

**SVG 規格**:
- `viewBox`: `0 0 800 220`
- 節點: 空心圓 `r=24`, stroke=萃取的「主色」, `stroke-width=3`, fill=背景色
- 節點間連線: 實線帶箭頭（`<marker>` 定義箭頭），`stroke-width=2`，顏色=萃取的「主色」
- 箭頭 marker: `markerEnd="url(#arrowhead)"`, 顏色同連線
- 文字: 景點名稱在節點下方 `dy=40`, `font-size=14`, font=萃取的「字型」
- 備註文字: 節點上方 `dy=-35`, `font-size=11`, fill=中性灰（CSS `#6b7280` 或相近）
- 節點間距: 等分 viewBox 寬度
- 裝飾: 可在節點右上角加小插圖 `<image>` 30x30px（從萃取素材清單選用）

**骨架代碼**:

> **注意給 AI**: 生成此 component 時，將 `PRIMARY_COLOR`、`BG_COLOR`、`TEXT_COLOR`、`FONT_FAMILY` 替換為從專案萃取的實際值。

```jsx
// src/components/RouteMapLinear.jsx
import React from 'react';

// 替換為從專案萃取的實際值
const BG_COLOR = '/* 萃取的背景色 */';
const TEXT_COLOR = '/* 萃取的文字色 */';
const FONT_FAMILY = '/* 萃取的字型 */';

// nodes: [{ id, name, note, stickerSrc }]
// color: 主色，預設使用萃取的主色
export default function RouteMapLinear({ nodes = [], color = '/* 萃取的主色 */', title = '' }) {
  const baseUrl = import.meta.env.BASE_URL;
  const PADDING = 80;
  const WIDTH = 800;
  const CENTER_Y = 110;
  const count = nodes.length;
  const spacing = count > 1 ? (WIDTH - PADDING * 2) / (count - 1) : 0;

  const positions = nodes.map((node, i) => ({
    ...node,
    x: PADDING + i * spacing,
    y: CENTER_Y,
  }));

  return (
    <div className="w-full my-8">
      {title && (
        <h3 className="text-center font-black text-sm tracking-widest uppercase mb-4"
          style={{ color: TEXT_COLOR }}>{title}</h3>
      )}
      <svg
        viewBox="0 0 800 220"
        className="w-full h-auto"
        style={{ background: BG_COLOR, borderRadius: '16px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {positions.slice(0, -1).map((pos, i) => {
          const next = positions[i + 1];
          return (
            <line key={i}
              x1={pos.x + 26} y1={pos.y} x2={next.x - 26} y2={next.y}
              stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
          );
        })}
        {positions.map((node, i) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={24}
              fill={BG_COLOR} stroke={color} strokeWidth="3" />
            <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central"
              fill={color} fontSize="13" fontWeight="bold" fontFamily={FONT_FAMILY}>
              {i + 1}
            </text>
            {node.note && (
              <text x={node.x} y={node.y - 35} textAnchor="middle"
                fill="#6b7280" fontSize="11" fontFamily={FONT_FAMILY}>
                {node.note}
              </text>
            )}
            <text x={node.x} y={node.y + 40} textAnchor="middle"
              fill={TEXT_COLOR} fontSize="14" fontFamily={FONT_FAMILY}>
              {node.name}
            </text>
            {node.stickerSrc && (
              <image href={`${baseUrl}${node.stickerSrc}`}
                x={node.x + 14} y={node.y - 44} width="30" height="30"
                style={{ mixBlendMode: 'multiply' }} />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
```

---

### Type C｜Google Map 底圖版

**適用情境**: 使用者需要地理精準度，或想直接標記真實路線。

**流程**:
1. 請使用者截取 Google Map 並放到 `public/photos/map_dayX.jpg`
2. AI 詢問：「截圖上的景點大概在哪個位置？請描述（如：鰻魚飯在截圖左上方、Skyliner 站在右側中間）」
3. AI 根據描述，計算相對百分比座標，以 `position: absolute` 疊加標記

**HTML 規格**:
- 外層容器: `position: relative; aspect-ratio: 16/9`（或依截圖比例調整）
- 底圖: `<img>` 填滿容器, `object-fit: cover`
- 標記點: `position: absolute`, `transform: translate(-50%, -50%)`, 圓點直徑 20px
- 標記文字: 標記點旁, `white-space: nowrap`, 白色文字配深色陰影
- 連線: 使用 SVG overlay 疊在底圖上方，`position: absolute; inset: 0`

**骨架代碼**:

```jsx
// src/components/RouteMapOverlay.jsx
import React from 'react';

// markers: [{ id, name, xPct, yPct, color }]  xPct/yPct 為百分比 (0-100)
// mapSrc: 'photos/map_day1.jpg'
export default function RouteMapOverlay({ markers = [], mapSrc, title = '' }) {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="w-full my-8">
      {title && (
        <h3 className="text-center font-black text-stone-600 text-sm tracking-widest uppercase mb-4">{title}</h3>
      )}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
        {/* 底圖 */}
        <img
          src={`${baseUrl}${mapSrc}`}
          className="w-full h-full object-cover"
          alt="地圖底圖"
        />

        {/* SVG 連線層 */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {markers.slice(0, -1).map((m, i) => {
            const next = markers[i + 1];
            return (
              <line key={i}
                x1={`${m.xPct}%`} y1={`${m.yPct}%`}
                x2={`${next.xPct}%`} y2={`${next.yPct}%`}
                stroke="white" strokeWidth="2.5"
                strokeDasharray="6,4"
                opacity="0.85"
              />
            );
          })}
        </svg>

        {/* 標記點層 */}
        {markers.map((m, i) => (
          <div key={m.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${m.xPct}%`, top: `${m.yPct}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: m.color || '#0e8fe9' }}
            >
              {i + 1}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white px-1 rounded"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Type D｜AI 手繪插畫風地圖（Imagen 提示詞生成）

**適用情境**: 使用者想要類似旅遊手冊的插畫風地圖，不在乎地理精準度，重視視覺美感。

**引導流程**:
AI 收集以下資訊後，自動生成 Imagen 提示詞：
1. 主要景點（最多 8 個）
2. 地區名稱（如「東京淺草」「富士山周邊」）
3. 色調偏好（暖色/冷色/粉彩）
4. 是否加入代表性建築或地標插圖

**Imagen 提示詞模板**:

> **注意給 AI**: 生成提示詞前，先從萃取結果整理出色調描述，例如「warm blue and orange pastels」，代入 `[色調描述]`。

```
A hand-drawn watercolor travel map illustration of [地區名稱], Japan.
The map shows the following locations with cute illustrated landmarks: [景點列表].
Style: Japanese travel guidebook illustration, soft watercolor with ink outlines.
Color palette: [從專案萃取的主色與輔色，轉為英文色調描述，例如 "soft blue, warm orange, and cream white"].
Include decorative elements: small illustrated icons for each location, dotted route lines connecting them, handwritten-style location labels in Japanese/Chinese.
Background: pure white.
Overall mood: cozy, nostalgic, hand-crafted scrapbook aesthetic.
No text watermarks, no borders.
```

**提示詞生成後的步驟**:
1. 告知使用者：「以下是你的 Imagen 提示詞，可以用 `scripts/generate-image.js` 執行，或貼入 Google AI Studio。」
2. 生成的圖片存放至 `public/photos/map_illustrated_dayX.jpg`
3. 嵌入方式：用標準 `<img>` 標籤，加上 `className="w-full rounded-2xl shadow-lg rotate-1"`

---

## 嵌入位置指南

### 嵌入 DailyHeader 下方（推薦）
在 `src/components/DailyHeader.jsx` 的 return 最後加入：
```jsx
import RouteMapAbstract from './RouteMapAbstract'; // 依類型替換
// ...在 DailyHeader 的 JSX 最後:
<RouteMapAbstract nodes={nodes} lines={lines} title={`Day ${day} 路線圖`} />
```

### 嵌入獨立 section
在 `src/App.jsx` 的 `<main>` 中，在每個 `dayData` 的 `<div>` 開頭加入 component。

---

## 輸出檢查清單

生成地圖後，AI 必須確認以下項目：
- [ ] SVG `viewBox` 已設定，確保不同螢幕寬度下等比縮放
- [ ] 所有圖片路徑都有加 `import.meta.env.BASE_URL`
- [ ] 字型使用 `'Kiwi Maru', serif`（專案已載入）
- [ ] 色彩符合專案主色票（fuji-blue / travel-orange / travel-pink）
- [ ] component 已加入 `src/components/` 且在目標位置正確引入
- [ ] Type C/D 的圖片檔已放入正確的 `public/` 子目錄

---

## 快速啟動指令（給 AI 參考）

使用者說「幫我做地圖」時，立刻開始 Phase 1 必問流程，從 Q1 開始，一次問一題。
不要一次列出所有問題，保持對話節奏輕鬆。
