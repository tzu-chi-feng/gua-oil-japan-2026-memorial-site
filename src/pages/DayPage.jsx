import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Map, ArrowRight } from 'lucide-react';

import DailyHeader from '../components/DailyHeader';
import EventCard from '../components/EventCard';

export default function DayPage({ data }) { // 接收 data prop
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const currentDay = parseInt(dayNumber);
  const totalDays = data?.timeline.length || 0;
  const dayData = data?.timeline.find(d => d.day === currentDay);
  const baseUrl = import.meta.env.BASE_URL;

  // 進入頁面或切換天數時，滾動到頁首
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dayNumber]);

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <p className="text-stone-400 font-bold">找不到該日的行程紀錄。</p>
      </div>
    );
  }

  const itineraryEvents = dayData.events.filter(e => e.name !== '這裡紀錄今天的綜合心情');
  const summaryEvent = dayData.events.find(e => e.name === '這裡紀錄今天的綜合心情');

  const goToPrevDay = () => {
    if (currentDay > 1) {
      navigate(`/day/${currentDay - 1}`);
    }
  };

  const goToNextDay = () => {
    if (currentDay < totalDays) {
      navigate(`/day/${currentDay + 1}`);
    }
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-fuji-blue-100 relative">
      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* --- 頂部導覽按鈕 --- */}
        <div className="flex justify-between items-center my-8">
          <button 
            onClick={goToPrevDay} 
            disabled={currentDay === 1}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> 切換前一天
          </button>
          <Link 
            to="/" 
            onClick={() => sessionStorage.setItem('lastVisitedDay', currentDay)} // 回地圖時儲存當前 Day，讓首頁滾動
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors"
          >
            <Map size={16} /> 回地圖
          </Link>
          <button 
            onClick={goToNextDay} 
            disabled={currentDay === totalDays}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            切換後一天 <ArrowRight size={16} />
          </button>
        </div>

        {/* --- 每日扉頁 --- */}
        <DailyHeader day={dayData.day} title={dayData.title} />
        
        {/* --- 3 欄 RWD 網格 (拍立得卡片們) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 px-2 md:px-0">
          {itineraryEvents.map((event, eIdx) => (
            <EventCard 
              key={event.eventId || eIdx} 
              event={event} 
              index={eIdx} 
            />
          ))}
        </div>

        {/* --- 今日心得、晚餐與雜支 --- */}
        {(summaryEvent || dayData.miscExpenses?.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 w-full"
          >
            <div className="relative bg-stone-100/50 p-8 md:p-12 rounded-3xl border-2 border-dashed border-stone-300">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* 1. 左側：今日心得 */}
                  <div className={summaryEvent ? "order-2 lg:order-1" : "hidden"}>
                     {summaryEvent && (
                       <>
                         <h4 className="font-black text-stone-800 text-xl mb-6 flex items-center gap-2">
                            <Trophy size={24} className="text-travel-orange" />
                            今日心得紀錄
                         </h4>
                         <p className="handwriting text-stone-600 text-lg leading-relaxed italic">
                            {summaryEvent.note}
                         </p>
                       </>
                     )}
                  </div>

                  {/* 2. 中間：今日晚餐 (RWD: 手機版排在最上方) */}
                  <div className="order-1 lg:order-2 flex flex-col items-center">
                     <div className="w-full max-w-[240px]">
                        <h4 className="font-black text-stone-800 text-sm tracking-widest uppercase mb-4 text-center border-b border-stone-200 pb-2">
                           Today's Dinner
                        </h4>
                        <div className="aspect-[3/4] bg-white p-3 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
                           <img 
                              src={`${baseUrl}photos/dinner_day${dayData.day}.jpg`} // 假設地圖檔名為 map_day1.jpg, map_day2.jpg...
                              alt={`Day ${dayData.day} Dinner`}
                              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                              onError={(e) => {
                                // 如果找不到照片，隱藏整個晚餐容器
                                e.target.closest('.order-1').style.display = 'none';
                              }}
                           />
                           <div className="mt-2 text-center">
                              <span className="handwriting text-[10px] text-stone-400 italic">- Dinner Snap -</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* 3. 右側：雜支清單 */}
                  <div className={dayData.miscExpenses?.length > 0 ? "order-3 lg:order-3" : "hidden"}>
                     <div className="bg-white/50 p-6 rounded-2xl border border-stone-200 shadow-inner">
                        <h4 className="font-black text-stone-400 text-xs uppercase tracking-[0.2em] mb-4 border-b border-stone-200 pb-2 text-center">
                           Miscellaneous 雜支
                        </h4>
                        <ul className="space-y-3">
                           {dayData.miscExpenses.map(misc => (
                             <li key={misc.id} className="flex justify-between items-center text-xs font-mono text-stone-500">
                               <span className="truncate pr-4">{misc.name}</span>
                               <span className="font-bold text-stone-700 whitespace-nowrap">NT$ {Math.round(misc.amountTWD)}</span>
                             </li>
                           ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-dashed border-stone-300 flex justify-between items-center">
                           <span className="text-[10px] font-bold text-stone-400">TOTAL MISC</span>
                           <span className="font-bold text-stone-900">
                             NT$ {Math.round(dayData.miscExpenses.reduce((sum, m) => sum + m.amountTWD, 0))}
                           </span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
          </motion.div>
        )}

        {/* --- 底部導覽按鈕 (同頂部) --- */}
        <div className="flex justify-between items-center mt-16 mb-8">
          <button 
            onClick={goToPrevDay} 
            disabled={currentDay === 1}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> 切換前一天
          </button>
          <Link 
            to="/" 
            onClick={() => sessionStorage.setItem('lastVisitedDay', currentDay)} // 回地圖時儲存當前 Day，讓首頁滾動
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors"
          >
            <Map size={16} /> 回地圖
          </Link>
          <button 
            onClick={goToNextDay} 
            disabled={currentDay === totalDays}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            切換後一天 <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}