// src/components/RouteMapAbstract.jsx
import React from 'react';

// 低彩度溫潤日系手帳咖啡色 (Low-saturation warm coffee brown)
const COFFEE_COLOR = '#8c7355'; 
const BG_COLOR = '#fdfbf7'; 
const TEXT_COLOR = '#3a312a'; // 深焙咖啡黑
const FONT_FAMILY = '"Kiwi Maru", serif';

/**
 * 景點名稱智慧排版（長字串自動折行為 2 行）
 */
function formatNodeName(name) {
  if (!name) return [''];
  if (name.length <= 6) return [name];
  
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
 * RouteMapAbstract: 具備日系咖啡手繪流線、置頂大貼紙與手帳故事便籤的質感路線圖
 */
export default function RouteMapAbstract({ 
  nodes = [], 
  stickers = [],
  bubbles = [],
  title = '', 
  day = 1 
}) {
  const baseUrl = import.meta.env.BASE_URL;
  const COLS = 4; // 每行 4 個節點
  const VIEW_WIDTH = 1000;
  const X_START = 145;
  const X_END = 855;
  const Y_START = 65;
  const Y_GAP = 118; // 緊湊無縫行距

  const xSpacing = (X_END - X_START) / (COLS - 1);
  const totalRows = Math.ceil(nodes.length / COLS);
  // 緊貼最後一行底部文字，徹底移除底部預留空白
  const VIEW_HEIGHT = 475;

  // 決定節點是否為「放大重點節點」（例如 2, 5, 8, 10, 16 號節點）
  const isEnlargedNode = (index) => {
    const enlargedIndices = [1, 4, 7, 9, 15];
    return enlargedIndices.includes(index);
  };

  // 固定的自然微幅波動幅度
  const getOrganicOffset = (index) => {
    const yOffsets = [-3, 4, -4, 3, 4, -3, 3, -3, -3, 3, -4, 3, 3, -3, 4, -3];
    const xOffsets = [0, 3, -3, 0, 0, -3, 3, 0, 0, 3, -3, 0, 0, -3, 3, 0];
    return {
      ox: xOffsets[index % xOffsets.length] || 0,
      oy: yOffsets[index % yOffsets.length] || 0
    };
  };

  // 計算每個節點座標（放大時溫和往上偏移 18px）
  const positions = nodes.map((node, i) => {
    const row = Math.floor(i / COLS);
    const colIndexInRow = i % COLS;
    const col = row % 2 === 0 ? colIndexInRow : (COLS - 1 - colIndexInRow);
    const { ox, oy } = getOrganicOffset(i);
    const isBig = isEnlargedNode(i);
    
    const elevationOffset = isBig ? -18 : 0;

    const x = X_START + col * xSpacing + ox;
    const y = Y_START + row * Y_GAP + oy + elevationOffset;
    const radius = isBig ? 19 : 15;
    const fontSize = isBig ? 13 : 11.5;

    return { 
      ...node, 
      x, 
      y, 
      row, 
      colIndexInRow, 
      index: i, 
      isBig, 
      radius, 
      fontSize 
    };
  });

  // 產生帶有自然微弧的平滑咖啡色軌道路徑
  const generateOrganicPath = () => {
    if (positions.length === 0) return '';
    let d = `M ${positions[0].x} ${positions[0].y}`;

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];

      if (prev.row === curr.row) {
        const midX = (prev.x + curr.x) / 2;
        const waveOffset = (i % 2 === 0 ? 5 : -5) * (prev.row % 2 === 0 ? 1 : -1);
        const cpY = (prev.y + curr.y) / 2 + waveOffset;
        d += ` Q ${midX} ${cpY}, ${curr.x} ${curr.y}`;
      } else {
        const isRightTurn = prev.row % 2 === 0;
        const turnSpread = 65;
        const arcX = isRightTurn ? Math.max(prev.x, curr.x) + turnSpread : Math.min(prev.x, curr.x) - turnSpread;
        d += ` C ${arcX} ${prev.y + 15}, ${arcX} ${curr.y - 15}, ${curr.x} ${curr.y}`;
      }
    }
    return d;
  };

  const pathData = generateOrganicPath();

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-2 md:p-3 select-none">
      {title && (
        <div className="mb-3 text-center">
          <span className="inline-block px-5 py-1.5 bg-[#f5efe6] rounded-full font-black text-xs md:text-sm tracking-widest text-[#5c4a3b] uppercase shadow-sm border border-[#e6dcce]">
            {title}
          </span>
        </div>
      )}

      <div className="w-full relative overflow-hidden rounded-3xl bg-[#fdfbf7] shadow-md border border-[#e8dfd3] p-2.5">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3a312a" floodOpacity="0.15" />
            </filter>
            <filter id="stickerShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="4" stdDeviation="4" floodColor="#3a312a" floodOpacity="0.12" />
            </filter>
            <filter id="bubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#57483b" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* ================= 圖層 1: 低彩度咖啡色軌道線條 ================= */}
          <g className="pointer-events-none">
            <path
              d={pathData}
              fill="none"
              stroke={COFFEE_COLOR}
              strokeWidth="7"
              strokeOpacity="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathData}
              fill="none"
              stroke={COFFEE_COLOR}
              strokeWidth="3"
              strokeDasharray="8,6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ================= 圖層 2: 景點節點 (放大字級標籤與名稱) ================= */}
          <g>
            {positions.map((node) => {
              const lines = formatNodeName(node.name);
              return (
                <g key={node.id} className="cursor-pointer group">
                  {/* 數字徽章圓圈 */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={COFFEE_COLOR}
                    stroke="#ffffff"
                    strokeWidth={node.isBig ? 3.5 : 3}
                    filter="url(#nodeShadow)"
                    className="transition-colors duration-200 group-hover:fill-[#6e5840]"
                  />

                  {/* 數字序號 */}
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={node.fontSize}
                    fontWeight="bold"
                    fontFamily={FONT_FAMILY}
                    className="pointer-events-none"
                  >
                    {node.index + 1}
                  </text>

                  {/* 景點名稱標籤（字級調大為 13.5px） */}
                  <text
                    x={node.x}
                    y={node.y + (node.isBig ? 34 : 29)}
                    textAnchor="middle"
                    fill={TEXT_COLOR}
                    fontSize="13.5"
                    fontWeight="800"
                    fontFamily={FONT_FAMILY}
                    className="tracking-tight group-hover:fill-[#8c7355] transition-colors pointer-events-none"
                  >
                    {lines.map((line, lIdx) => (
                      <tspan key={lIdx} x={node.x} dy={lIdx === 0 ? 0 : 16}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ================= 圖層 3: 精簡統一的手帳奶油便籤 (非彩虹色) ================= */}
          <g className="pointer-events-none">
            {bubbles.map((b, idx) => {
              const rot = b.rotate || 0;
              const bgColor = b.bgColor || '#fefcf8'; // 統一溫潤米白手作便籤
              const strokeColor = b.strokeColor || '#ded5c7';
              const textColor = b.textColor || '#57483b'; // 深咖啡文字
              const textWidth = b.text.length * 11 + 24;
              
              return (
                <g 
                  key={b.id || `bubble-${idx}`} 
                  transform={`translate(${b.x}, ${b.y}) rotate(${rot})`}
                  filter="url(#bubbleShadow)"
                >
                  <rect
                    x={-textWidth / 2}
                    y={-14}
                    width={textWidth}
                    height={28}
                    rx={14}
                    fill={bgColor}
                    stroke={strokeColor}
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize="10.5"
                    fontWeight="700"
                    fontFamily={FONT_FAMILY}
                    className="tracking-tight"
                  >
                    {b.text}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ================= 圖層 4: 【置頂最上層】大貼紙 ================= */}
          <g className="pointer-events-none">
            {stickers.map((stk, idx) => {
              const rot = stk.rotate || 0;
              const w = stk.width || 80;
              const h = stk.height || 80;
              return (
                <g 
                  key={stk.id || `sticker-${idx}`} 
                  transform={`translate(${stk.x}, ${stk.y}) rotate(${rot})`}
                  filter="url(#stickerShadow)"
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
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}