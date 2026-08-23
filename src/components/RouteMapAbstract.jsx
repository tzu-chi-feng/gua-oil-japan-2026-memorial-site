// src/components/RouteMapAbstract.jsx
import React from 'react';

const PRIMARY_COLOR = '#FE9A5F'; // travel-orange
const BG_COLOR = '#fdfbf7'; 
const TEXT_COLOR = '#292524'; // stone-800
const ACCENT_COLORS = ['#FE9A5F', '#38aaf7', '#e06d53', '#7cc7fb']; 
const FONT_FAMILY = '"Kiwi Maru", serif';

/**
 * 景點名稱智慧排版（長字串自動折行為 2 行）
 */
function formatNodeName(name) {
  if (!name) return [''];
  if (name.length <= 6) return [name];
  
  // 常見詞彙切割點
  if (name.includes(' Station')) {
    const parts = name.split(' Station');
    return [`${parts[0]} Station`, parts[1] || ''];
  }
  if (name.includes(' ')) {
    const parts = name.split(' ');
    return [parts[0], parts.slice(1).join(' ')];
  }
  if (name.length > 8) {
    const mid = Math.ceil(name.length / 2);
    return [name.slice(0, mid), name.slice(mid)];
  }
  return [name];
}

/**
 * RouteMapAbstract: 呈現具備 Figma Dynamic 手繪流線感與旅行手帳拼貼感的抽象路線圖
 */
export default function RouteMapAbstract({ 
  nodes = [], 
  stickers = [],
  title = '', 
  day = 1 
}) {
  const baseUrl = import.meta.env.BASE_URL;
  const COLS = 4; // 每行 4 個節點
  const VIEW_WIDTH = 960;
  const X_START = 120;
  const X_END = 840;
  const Y_START = 90;
  const Y_GAP = 135;

  const xSpacing = (X_END - X_START) / (COLS - 1);
  const totalRows = Math.ceil(nodes.length / COLS);
  const VIEW_HEIGHT = Math.max(580, Y_START + totalRows * Y_GAP + 60);

  // 固定的自然波動幅度（讓排版有手繪錯落感，且每次 render 保持穩定一致）
  const getOrganicOffset = (index) => {
    // 預設一組自然微幅起伏的波浪 offset
    const yOffsets = [-6, 8, -8, 4, 8, -6, 7, -5, -7, 6, -8, 5, 6, -7, 8, -4];
    const xOffsets = [0, 4, -4, 0, 0, -5, 5, 0, 0, 6, -5, 0, 0, -4, 5, 0];
    return {
      ox: xOffsets[index % xOffsets.length] || 0,
      oy: yOffsets[index % yOffsets.length] || 0
    };
  };

  // 計算每個節點在手帳蛇形動線中的座標（加上自然微幅波動）
  const positions = nodes.map((node, i) => {
    const row = Math.floor(i / COLS);
    const colIndexInRow = i % COLS;
    const col = row % 2 === 0 ? colIndexInRow : (COLS - 1 - colIndexInRow);
    const { ox, oy } = getOrganicOffset(i);
    
    const x = X_START + col * xSpacing + ox;
    const y = Y_START + row * Y_GAP + oy;
    return { ...node, x, y, row, colIndexInRow, index: i };
  });

  // 產生帶有自然手繪微弧與 Figma Dynamic 圓角轉彎的平滑軌道路徑
  const generateOrganicPath = () => {
    if (positions.length === 0) return '';
    let d = `M ${positions[0].x} ${positions[0].y}`;

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];

      if (prev.row === curr.row) {
        // 同一行內的相鄰節點：採用帶有微弧的貝茲曲線，告別僵硬死板的直線
        const midX = (prev.x + curr.x) / 2;
        // 依據位置產生自然的微幅上下弧度 (Sag / Arch)
        const waveOffset = (i % 2 === 0 ? 9 : -9) * (prev.row % 2 === 0 ? 1 : -1);
        const cpY = (prev.y + curr.y) / 2 + waveOffset;

        d += ` Q ${midX} ${cpY}, ${curr.x} ${curr.y}`;
      } else {
        // 跨行轉彎：使用 Figma Dynamic 風格的大半徑平滑 U-Turn 雙控制點貝茲曲線
        const isRightTurn = prev.row % 2 === 0;
        const turnSpread = 65; // 圓弧外擴半徑
        const arcX = isRightTurn ? Math.max(prev.x, curr.x) + turnSpread : Math.min(prev.x, curr.x) - turnSpread;
        
        // 雙控制點貝茲曲線創造優雅的迴轉流線
        d += ` C ${arcX} ${prev.y + 15}, ${arcX} ${curr.y - 15}, ${curr.x} ${curr.y}`;
      }
    }
    return d;
  };

  const pathData = generateOrganicPath();
  const dayColor = ACCENT_COLORS[(day - 1) % ACCENT_COLORS.length] || PRIMARY_COLOR;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-2 md:p-4 select-none">
      {title && (
        <div className="mb-4 text-center">
          <span className="inline-block px-5 py-1.5 bg-stone-100/90 rounded-full font-black text-xs md:text-sm tracking-widest text-stone-700 uppercase shadow-sm border border-stone-200/60">
            {title}
          </span>
        </div>
      )}

      <div className="w-full relative overflow-hidden rounded-3xl bg-[#fdfbf7] shadow-md border border-stone-200/80 p-3">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 柔和手帳陰影濾鏡 */}
            <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.18" />
            </filter>
            <filter id="stickerShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="4" stdDeviation="4" floodColor="#44403c" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* 1. 底層手繪感軌道光暈 (Underlay Glow Track) */}
          <path
            d={pathData}
            fill="none"
            stroke={dayColor}
            strokeWidth="8"
            strokeOpacity="0.16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. 主路線：Figma 手繪自然旅行虛線 (Organic Dashed Route) */}
          <path
            d={pathData}
            fill="none"
            stroke={dayColor}
            strokeWidth="3.2"
            strokeDasharray="8,6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. 自由浮貼於空白處的大型手帳裝飾貼紙 (Large Floating Stickers) */}
          {stickers.map((stk, idx) => {
            const rot = stk.rotate || 0;
            const w = stk.width || 80;
            const h = stk.height || 80;
            return (
              <g 
                key={stk.id || `sticker-${idx}`} 
                transform={`translate(${stk.x}, ${stk.y}) rotate(${rot})`}
                filter="url(#stickerShadow)"
                className="transition-transform duration-300 hover:scale-105"
              >
                <image
                  href={`${baseUrl}${stk.src}`}
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  style={{ mixBlendMode: 'multiply' }}
                  alt={stk.alt || 'decoration'}
                />
                {stk.label && (
                  <text
                    x="0"
                    y={h / 2 + 14}
                    textAnchor="middle"
                    fill="#78716c"
                    fontSize="11"
                    fontFamily={FONT_FAMILY}
                    className="italic font-bold"
                  >
                    {stk.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 4. 景點節點：清晰數字徽章＋智慧雙行排版文字 */}
          {positions.map((node) => {
            const lines = formatNodeName(node.name);
            return (
              <g key={node.id} className="cursor-pointer group">
                {/* 節點圓圈 (數字徽章) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill={dayColor}
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  filter="url(#nodeShadow)"
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* 數字序號 (1, 2, 3...) */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="12.5"
                  fontWeight="bold"
                  fontFamily={FONT_FAMILY}
                >
                  {node.index + 1}
                </text>

                {/* 景點名稱標籤（支援雙行完整呈現） */}
                <text
                  x={node.x}
                  y={node.y + 33}
                  textAnchor="middle"
                  fill={TEXT_COLOR}
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily={FONT_FAMILY}
                  className="tracking-tight group-hover:fill-fuji-blue-600 transition-colors"
                >
                  {lines.map((line, lIdx) => (
                    <tspan key={lIdx} x={node.x} dy={lIdx === 0 ? 0 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}