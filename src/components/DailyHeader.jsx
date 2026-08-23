import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DailyHeader = ({ day, title, mapSrc }) => {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="w-full mb-32 relative pt-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* 左側：大大的 Day Stamp 與標題 */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 flex-1">
          <motion.div 
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: -5, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
             <div className={`relative w-40 h-40 flex items-center justify-center stamp-effect text-fuji-blue-600`}>
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-none stroke-current stroke-[1.5] opacity-40">
                  <circle cx="50" cy="50" r="46" strokeDasharray="4 2" />
                  <circle cx="50" cy="50" r="38" />
                </svg>
                <div className="text-center z-10">
                  <span className="block text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Expedition</span>
                  <span className="block text-7xl font-black leading-none my-1 tracking-tighter">{day}</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase opacity-60">Tokyo/Japan</span>
                </div>
              </div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-stone-800 tracking-tight leading-tight max-w-md"
          >
            {title}
          </motion.h2>
        </div>

        {/* 右側：地圖預留版面 */}
        <motion.div 
          initial={{ x: 30, opacity: 0, rotate: 2 }}
          whileInView={{ x: 0, opacity: 1, rotate: -2 }}
          viewport={{ once: true }}
          className="relative w-full md:w-[450px] aspect-[4/3] bg-white shadow-2xl p-4 hand-border border border-stone-100 flex items-center justify-center overflow-hidden"
        >
          {mapSrc ? (
            <img src={mapSrc} className="w-full h-full object-cover" alt={`Map Day ${day}`} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-stone-300 bg-stone-50 w-full h-full justify-center">
              <MapPin size={48} strokeWidth={1} />
              <p className="text-xs font-black uppercase tracking-[0.2em] italic">Daily Map Placeholder</p>
            </div>
          )}
          
          {/* 裝飾性紙膠帶 */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 rotate-1 opacity-90 pointer-events-none">
             <img 
               src={`${baseUrl}decorations/tape_sakura.png`} 
               className="sticker-multiply w-full h-full object-contain scale-150" 
               alt="tape" 
             />
          </div>
        </motion.div>
      </div>
      
      {/* 背景裝飾線條 */}
      <div className="absolute top-1/2 left-0 w-full h-px border-b border-dashed border-stone-200 -z-10" />
    </div>
  );
};

export default DailyHeader;
