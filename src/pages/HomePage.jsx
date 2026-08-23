import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Awards from '../components/Awards';
import Stats from '../components/Stats';
import RouteMapAbstract from '../components/RouteMapAbstract'; // 引入 RouteMapAbstract

// --- 小組件: 裝飾性紙膠帶 (用於 Header 等處) ---
const WashiTape = ({ className = '', rotate = 'rotate-2' }) => {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <div className={`absolute z-30 pointer-events-none ${className} ${rotate} overflow-hidden w-48 h-10 flex items-center`}>
      <img 
        src={`${baseUrl}decorations/tape_sakura.png`} 
        className="sticker-multiply w-full h-auto object-contain scale-[1.8]"
        alt="Washi Tape"
      />
    </div>
  );
};

export default function HomePage({ data }) {
  const awardsRef = useRef(null);
  const statsRef = useRef(null);
  const mapRefs = useRef({}); // 新增一個 ref 來儲存每個地圖的 DOM 元素
  const baseUrl = import.meta.env.BASE_URL;

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 頁面載入時，檢查是否有需要滾動到特定地圖的指令
  useEffect(() => {
    const lastVisitedDay = sessionStorage.getItem('lastVisitedDay');
    if (lastVisitedDay) {
      // 確保 DOM 元素已經渲染
      const targetMap = mapRefs.current[lastVisitedDay];
      if (targetMap) {
        targetMap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sessionStorage.removeItem('lastVisitedDay'); // 滾動後清除紀錄
      } else {
        // 如果目標地圖還未渲染，等待一下再嘗試 (簡單的防呆)
        const timer = setTimeout(() => {
          const retryTargetMap = mapRefs.current[lastVisitedDay];
          if (retryTargetMap) {
            retryTargetMap.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sessionStorage.removeItem('lastVisitedDay');
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [data]); // data 載入後執行

  if (!data) return null; // 等待數據加載

  return (
    <div className="min-h-screen pb-32 selection:bg-fuji-blue-100 relative">
      {/* --- Header: 標題、富士山與對稱櫻花 --- */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-white/30">
        <motion.div 
          initial={{ opacity: 0, x: 50, y: -30 }}
          animate={{ opacity: 0.8, x: 0, y: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[250px] md:h-[400px] overflow-hidden z-20 pointer-events-none"
        >
          <img 
            src={`${baseUrl}cherry-blossoms.png`}
            className="w-full h-auto object-cover object-top"
            alt="Cherry Blossoms Right"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50, y: -30, scaleX: -1 }}
          animate={{ opacity: 0.8, x: 0, y: 0, scaleX: -1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[250px] md:h-[400px] overflow-hidden z-20 pointer-events-none"
        >
          <img 
            src={`${baseUrl}cherry-blossoms.png`}
            className="w-full h-auto object-cover object-top"
            alt="Cherry Blossoms Left"
          />
        </motion.div>
        <div className="z-10 text-center px-6 flex flex-col items-center justify-center h-full">
          <motion.div 
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -60, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative z-50 mt-20"
          >
            <h1 className="text-6xl md:text-8xl font-black text-stone-800 tracking-tighter drop-shadow-[0_5px_15px_rgba(255,255,255,1)]">
              瓜油日本行 <span className="text-fuji-blue-600">.</span>
            </h1>
            <WashiTape className="-top-10 -right-12 w-40 h-8 rotate-12 opacity-50" />
          </motion.div>
          <motion.img 
            initial={{ scale: 0.8, opacity: 0, y: 150 }}
            animate={{ scale: 1.1, opacity: 1, y: 80 }}
            transition={{ duration: 1.2 }}
            src={`${baseUrl}fuji-main.png`} 
            className="w-[450px] md:w-[700px] drop-shadow-xl z-10"
          />
        </div>
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7]/50 to-transparent z-30"></div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* --- 每日行程地圖區 --- */}
        <section className="my-20">
          <h2 className="text-center text-3xl font-black text-stone-800 tracking-tighter mb-12">每日路線概覽</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
            {data.timeline.map(dayData => (
              <Link 
                to={`/day/${dayData.day}`} 
                key={dayData.day} 
                onClick={() => sessionStorage.setItem('lastVisitedDay', dayData.day)} // 儲存點擊的地圖
                ref={el => mapRefs.current[dayData.day] = el} // 設置 ref
              >
                {dayData.day === 1 ? (
                  <RouteMapAbstract 
                    nodes={[
                      { id: "ev00020", name: "成田國際機場", day: 1 },
                      { id: "ev00036", name: "Ueno Station", day: 1 },
                      { id: "ev00040", name: "上野阿美橫商店街", day: 1 },
                      { id: "ev00043", name: "UNIQLO 御徒町店", day: 1 },
                      { id: "ev00098", name: "唐吉訶德 御徒町店", day: 1 },
                      { id: "ev00041", name: "二木菓子 第一營業所", day: 1 },
                      { id: "ev00039", name: "OS Drug 上野店藥妝店", day: 1 },
                      { id: "ev00037", name: "東京觀光資訊中心 京城上野", day: 1 },
                      { id: "ev00045", name: "Ueno Station", day: 1 },
                      { id: "ev00094", name: "餃子的王將 平井站南口店", day: 1 },
                      { id: "ev00022", name: "平井家民宿", day: 1 },
                      { id: "ev00097", name: "DAISO", day: 1 },
                      { id: "ev00095", name: "SEIYU Hirai", day: 1 },
                      { id: "ev00096", name: "ワイズマート平井店", day: 1 },
                      { id: "ev00099", name: "7-Eleven - Edogawa Hirai 4", day: 1 },
                      { id: "ev00100", name: "平井家民宿", day: 1 }
                    ]}
                    stickers={[
                      { id: "peach", src: "decorations/airplane_peach.png", x: 230, y: 35, width: 140, height: 75, rotate: -6 },
                      { id: "skyliner", src: "decorations/train_skyliner.png", x: 885, y: 155, width: 150, height: 90, rotate: 12 },
                      { id: "gorilla", src: "decorations/gorilla.png", x: 720, y: 160, width: 95, height: 95, rotate: -12 },
                      { id: "gyoza", src: "decorations/餃子與杏仁豆腐.png", x: 240, y: 295, width: 115, height: 95, rotate: 6 },
                      { id: "daruma", src: "decorations/daruma.png", x: 55, y: 505, width: 90, height: 90, rotate: -8 }
                    ]}
                    title={`Day ${dayData.day} 路線圖`} 
                    day={dayData.day}
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-[16/9] bg-stone-100 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
                  >
                    {/* Placeholder for Map Image */}
                    <img 
                      src={`${baseUrl}photos/map_day${dayData.day}.jpg`} // 假設地圖檔名為 map_day1.jpg, map_day2.jpg...
                      alt={`Day ${dayData.day} Map`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = `${baseUrl}decorations/placeholder-map.png`; // Fallback placeholder
                        e.target.classList.add('object-contain', 'p-8');
                        e.target.classList.remove('object-cover');
                      }}
                    />
                    <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-4xl font-black drop-shadow-lg">Day {dayData.day}</span>
                    </div>
                  </motion.div>
                )}
                <h3 className="text-center mt-4 text-xl font-bold text-stone-700">{dayData.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 獎項區 (移至地圖下方，資料統計上方) --- */}
        <div ref={awardsRef} className="my-40">
          <Awards awards={data.awards} />
        </div>

        {/* --- 統計區 (保持在最下方) --- */}
        <div ref={statsRef} className="pt-32 border-t-4 border-double border-stone-200">
          <Stats stats={data.stats} timeline={data.timeline} />
        </div>

        <footer className="text-center py-60">
          <Trophy className="text-fuji-blue-600 w-24 h-24 opacity-[0.05] mx-auto mb-12" />
          <h2 className="text-5xl font-black text-stone-800 tracking-tighter mb-6 uppercase">Mission Accomplished</h2>
          <p className="text-stone-400 text-sm tracking-[0.5em] uppercase font-black">Memory Archived • 2026</p>
        </footer>
      </main>
    </div>
  );
}