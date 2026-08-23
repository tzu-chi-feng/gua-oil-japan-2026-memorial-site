import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plane, Train } from 'lucide-react';

const WashiTape = ({ type, className = "", rotate = "rotate-2" }) => {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <div className={`absolute z-30 pointer-events-none overflow-hidden ${className} ${rotate}`}>
      <img 
        src={`${baseUrl}decorations/${type}.png`} 
        className="sticker-multiply w-full h-full object-contain scale-125" 
        alt="tape" 
      />
    </div>
  );
};

const EventCluster = ({ event, isReversed }) => {
  const [aspectRatio, setAspect] = useState(1.33);
  const [hasImage, setHasImage] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;
  const imageSrc = `${baseUrl}photos/${event.eventId}.jpg`;

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setAspect(img.width / img.height);
      setHasImage(true);
    };
    img.onerror = () => {
      setHasImage(false);
    };
  }, [imageSrc]);

  const isPortrait = aspectRatio < 0.9;
  const frameType = isPortrait ? 'frame_torn' : 'frame_polaroid';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 mb-48 w-full`}
    >
      {/* 視覺主體：相片區 (Photo Block) */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center">
        <div className={`relative p-3 bg-white shadow-xl ${isReversed ? 'rotate-2' : '-rotate-2'} transition-transform hover:rotate-0 duration-300`}>
          <WashiTape type="tape_grid" className="-top-4 -left-8 w-24 h-8" rotate="-rotate-12" />
          
          <div className="relative overflow-hidden border border-stone-100 bg-stone-50 flex items-center justify-center">
            {hasImage ? (
              <img 
                src={imageSrc} 
                className={`w-full relative z-10 ${isPortrait ? 'max-h-[450px] object-contain' : 'aspect-[4/3] object-cover'}`}
                alt={event.name} 
              />
            ) : (
              <div className="aspect-[4/3] w-full min-w-[280px] flex flex-col items-center justify-center text-stone-200 relative z-10">
                <Camera size={48} strokeWidth={1} />
              </div>
            )}
          </div>
          
          {/* 照片手寫標籤 */}
          <div className="mt-3 text-center border-t border-dashed border-stone-200 pt-2">
             <span className="text-[11px] font-black text-stone-400 tracking-widest uppercase italic handwriting">
               # {event.name}
             </span>
          </div>
        </div>

        {/* 附屬裝飾：收據 (依附在照片旁) */}
        {event.expenses?.length > 0 && (
          <motion.div 
            initial={{ rotate: 15, x: 20, opacity: 0 }}
            whileInView={{ rotate: -5, x: 0, opacity: 1 }}
            className="absolute -bottom-12 -right-4 md:-right-8 z-20 w-32 md:w-40"
          >
            <div className="receipt-paper p-4 font-mono text-[9px] text-stone-500 shadow-lg rotate-3 bg-white relative">
              <div className="absolute left-0 right-0 receipt-edge-top h-1" />
              <p className="font-bold text-stone-800 border-b border-dashed border-stone-200 mb-1 pb-1">OFFICIAL RECEIPT</p>
              <div className="space-y-1 py-1">
                <p className="flex justify-between"><span>{event.expenses[0].name.substring(0, 10)}...</span></p>
                <p className="flex justify-between font-bold text-stone-800">
                   <span>TOTAL</span>
                   <span>NT$ {Math.round(event.expenses[0].amountTWD)}</span>
                </p>
              </div>
              <p className="text-[7px] text-center mt-2 opacity-50 italic">THANKS FOR VISITING</p>
              <div className="absolute left-0 right-0 receipt-edge-bottom h-1" />
            </div>
            <WashiTape type="tape_sakura" className="-top-3 left-1/2 -translate-x-1/2 w-16 h-6" rotate="rotate-2" />
          </motion.div>
        )}
      </div>

      {/* 文字主體：筆記區 (Note Block) */}
      <div className="relative w-full md:w-1/2">
        <div className="relative p-8 bg-white/30 hand-border border border-stone-200/50 backdrop-blur-[2px] min-h-[180px]">
          <WashiTape type="tape_short_dots" className="-top-4 -right-4 w-20 h-8" rotate="rotate-12" />
          
          <div className="mb-5">
             <h3 className="text-2xl font-black text-stone-800 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-travel-orange animate-pulse"></span>
                {event.name}
             </h3>
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] border-b border-stone-200 pb-1">Travel Log</span>
          </div>

          <p className="handwriting text-stone-600 text-lg leading-loose italic whitespace-pre-wrap relative z-10">
            {event.note || "在這個景點留下了一段美好的回憶..."}
          </p>
          
          {/* 交通工具裝飾背景 */}
          {(event.name.includes('機票') || event.name.includes('Skyliner')) && (
            <div className="absolute -bottom-8 -right-4 opacity-5 rotate-12 pointer-events-none">
               {event.name.includes('機票') ? <Plane size={150} /> : <Train size={150} />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCluster;
