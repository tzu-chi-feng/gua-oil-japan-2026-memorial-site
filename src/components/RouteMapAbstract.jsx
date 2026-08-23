// src/components/RouteMapAbstract.jsx
import React from 'react';

const PRIMARY_COLOR = '#0e8fe9'; // fuji-blue
const BG_COLOR = '#fdfbf7'; 
const TEXT_COLOR = '#292524'; // stone-800
const ACCENT_COLORS = ['#FE9A5F', '#38aaf7', '#e06d53', '#7cc7fb']; 
const FONT_FAMILY = '"Kiwi Maru", serif';

/**
 * RouteMapAbstract: 呈現具備 Figma Dynamic 手繪流線感與旅行手帳拼貼感的抽象路線圖
 * 
 * @param {Array} nodes - 景點節點清單 [{ id, name, day }]
 * @param {Array} stickers - 自由浮貼在空白處的手帳裝飾貼紙 [{ src, x, y, width, height, rotate, alt }]
 * @param {string} title - 地圖標題
 * @param {number} day - 當前天數
 */
export default function RouteMapAbstract({ 
  nodes = [], 
  stickers = [],
  title = '', 
  day = 1 
}) {
  const baseUrl = import.meta.env.BASE_URL;
  const COLS = 4; // 每行 4 個節點
  const VIEW_WIDTH = 920;
  const X_START = 110;
  const X_END = 810;
  const Y_START = 85;
  const Y_GAP = 125;
  const TURN_RADIUS = 55; // 轉彎處的圓弧外擴幅度 (Figma Dynamic 曲線感)

  const xSpacing = (X_END - X_START) / (COLS - 1);
  const totalRows = Math.ceil(nodes.length / COLS);
  const VIEW_HEIGHT = Math.max(540, Y_START + totalRows * Y_GAP + 50);

  // 計算每個節點在蛇形網格中的座標
  const positions = nodes.map((node, i) => {
    const row = Math.floor(i / COLS);
    const colIndexInRow = i % COLS;
    // 偶數行：由左至右 (col 0 -> 3)；奇數行：由右至左 (col 3 -> 0)
    const col = row % 2 === 0 ? colIndexInRow : (COLS - 1 - colIndexInRow);
    const x = X_START + col * xSpacing;
    const y = Y_START + row * Y_GAP;
    return { ...node, x, y, row, colIndexInRow, index: i };
  });

  // 產生流暢的 Figma Dynamic 蛇形貝茲曲線
  const generateSmoothSerpentinePath = () => {
    if (positions.length === 0) return '';
    let d = `M ${positions[0].x} ${positions[0].y}`;

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];

      if (prev.row === curr.row) {
        // 同一行：繪製平滑直連線（帶有微幅自然端點）
        d += ` L ${curr.x} ${curr.y}`;
      } else {
        // 跨行轉彎：使用 Figma Dynamic 風格的大半徑平滑 U-Turn 雙控制點貝茲曲線
        const isRightTurn = prev.row % 2 === 0; // 從左到右行結束，往右外側轉向下一行
        const arcX = isRightTurn ? X_END + TURN_RADIUS : X_START - TURN_RADIUS;
        const midY = (prev.y + curr.y) / 2;

        // 貝茲曲線控制點：先往外弧滑出，再流暢平滑切入下一行起始點
        d += ` C ${arcX} ${prev.y + 10}, ${arcX} ${curr.y - 10}, ${curr.x} ${curr.y}`;
      }
    }
    return d;
  };

  const pathData = generateSmoothSerpentinePath();
  const dayColor = ACCENT_COLORS[(day - 1) % ACCENT_COLORS.length] || PRIMARY_COLOR;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-2 md:p-4 select-none">
      {title && (
        <div className="mb-4 text-center">
          <span className="inline-block px-4 py-1 bg-stone-100/80 rounded-full font-black text-xs md:text-sm tracking-widest text-stone-700 uppercase shadow-sm border border-stone-200/50">
            {title}
          </span>
        </div>
      )}

      <div className="w-full relative overflow-hidden rounded-2xl bg-[#fdfbf7] shadow-sm border border-stone-200/60 p-2">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 節點光暈與陰影濾鏡 */}
            <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>
            <filter id="stickerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* 1. 底層手繪感軌道光暈 (Underlay Track) */}
          <path
            d={pathData}
            fill="none"
            stroke={dayColor}
            strokeWidth="7"
            strokeOpacity="0.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. 主路線：Figma 柔和動態虛線 (Dashed Travel Route) */}
          <path
            d={pathData}
            fill="none"
            stroke={dayColor}
            strokeWidth="3"
            strokeDasharray="7,6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. 自由浮貼於空白處的手帳裝飾貼紙 (Floating Stickers in Whitespace) */}
          {stickers.map((stk, idx) => {
            const rot = stk.rotate || 0;
            const w = stk.width || 60;
            const h = stk.height || 60;
            return (
              <g 
                key={stk.id || `sticker-${idx}`} 
                transform={`translate(${stk.x}, ${stk.y}) rotate(${rot})`}
                filter="url(#stickerShadow)"
                className="transition-transform duration-300 hover:scale-110"
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
                    y={h / 2 + 12}
                    textAnchor="middle"
                    fill="#78716c"
                    fontSize="10"
                    fontFamily={FONT_FAMILY}
                    className="italic font-bold"
                  >
                    {stk.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 4. 景點節點：全面保留清晰的數字編號圓點與名稱 */}
          {positions.map((node) => {
            return (
              <g key={node.id} className="cursor-pointer group">
                {/* 節點圓圈 (數字徽章) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={17}
                  fill={dayColor}
                  stroke="#ffffff"
                  strokeWidth="3"
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
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily={FONT_FAMILY}
                >
                  {node.index + 1}
                </text>

                {/* 景點名稱標籤 (置於節點下方，並適度優化換行) */}
                <text
                  x={node.x}
                  y={node.y + 32}
                  textAnchor="middle"
                  fill={TEXT_COLOR}
                  fontSize="12"
                  fontWeight="700"
                  fontFamily={FONT_FAMILY}
                  className="tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] group-hover:fill-fuji-blue-600 transition-colors"
                >
                  {node.name.length > 11 ? `${node.name.slice(0, 10)}...` : node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}