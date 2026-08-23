import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReceiptText, X } from 'lucide-react';

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

const ReceiptModal = ({ isOpen, onClose, expenses }) => {
  if (!isOpen) return null;

  // 按人頭重新組織分攤清單 (排除金額為 0 的項目)
  const guaPortions = [];
  const yuPortions = [];

  expenses.forEach(exp => {
    exp.splits.forEach(split => {
      const amount = Number(split.amountTWD) || 0;
      if (Math.round(amount) > 0) {
        const entry = { name: exp.name, amount: amount };
        if (split.person === '瓜') guaPortions.push(entry);
        if (split.person === '油') yuPortions.push(entry);
      }
    });
  });

  const guaTotal = guaPortions.reduce((sum, item) => sum + item.amount, 0);
  const yuTotal = yuPortions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, rotate: -2, scale: 0.9 }}
          animate={{ y: 0, rotate: 0, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className={`receipt-paper p-8 font-mono text-xs text-stone-600 shadow-2xl relative ${yuPortions.length > 0 && guaPortions.length > 0 ? 'max-w-2xl' : 'max-w-sm'} w-full bg-white flex flex-col md:flex-row gap-12`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute left-0 right-0 receipt-edge-top h-2" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-300 hover:text-stone-800 transition-colors"
          >
            <X size={20} />
          </button>

          {/* 油的區塊 */}
          {yuPortions.length > 0 && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6 border-b-2 border-stone-800 pb-2">
                 <div className="w-8 h-8 bg-fuji-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">油</div>
                 <h4 className="font-black text-stone-800 text-sm tracking-widest uppercase">油 的支出</h4>
              </div>
              <ul className="space-y-3 flex-1">
                {yuPortions.map((item, i) => (
                  <li key={i} className="flex justify-between items-end gap-4">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="font-bold text-stone-800 whitespace-nowrap">NT$ {Math.round(item.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-4 border-t border-dashed border-stone-200 flex justify-between items-center font-bold text-base text-stone-900">
                <span>SUBTOTAL</span>
                <span>NT$ {Math.round(yuTotal)}</span>
              </div>
            </div>
          )}

          {/* 視覺分隔線 */}
          {yuPortions.length > 0 && guaPortions.length > 0 && (
            <div className="hidden md:block w-px border-l-2 border-dashed border-stone-200" />
          )}

          {/* 瓜的區塊 */}
          {guaPortions.length > 0 && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6 border-b-2 border-stone-800 pb-2">
                 <div className="w-8 h-8 bg-travel-orange rounded-full flex items-center justify-center text-white font-bold text-[10px]">瓜</div>
                 <h4 className="font-black text-stone-800 text-sm tracking-widest uppercase">瓜 的支出</h4>
              </div>
              <ul className="space-y-3 flex-1">
                {guaPortions.map((item, i) => (
                  <li key={i} className="flex justify-between items-end gap-4">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="font-bold text-stone-800 whitespace-nowrap">NT$ {Math.round(item.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-4 border-t border-dashed border-stone-200 flex justify-between items-center font-bold text-base text-stone-900">
                <span>SUBTOTAL</span>
                <span>NT$ {Math.round(guaTotal)}</span>
              </div>
            </div>
          )}
          
          <div className="absolute left-0 right-0 receipt-edge-bottom h-2" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EventCard = ({ event, index }) => {
  const [hasImage, setHasImage] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;
  const imageSrc = `${baseUrl}photos/${event.eventId}.jpg`;

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setHasImage(true);
    img.onerror = () => setHasImage(false);
  }, [imageSrc]);

  const tapes = ['tape_sakura', 'tape_fuji', 'tape_grid', 'tape_short_dots'];
  const randomTape = tapes[index % tapes.length];
  const randomRotate = index % 2 === 0 ? 'rotate-1' : '-rotate-1';

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className={`relative bg-white p-3 pb-6 shadow-md transition-shadow hover:shadow-xl w-full h-full flex flex-col ${randomRotate}`}
      >
        <WashiTape type={randomTape} className="-top-3 left-1/2 -translate-x-1/2 w-24 h-8" rotate={index % 2 === 0 ? '-rotate-2' : 'rotate-3'} />

        <div className="absolute -top-3 -left-3 w-8 h-8 bg-stone-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white z-20">
          {index + 1}
        </div>

        {/* 照片區 (僅在有照片時顯示) */}
        {hasImage && (
          <div className="aspect-[1/1.33] bg-stone-100 mb-4 overflow-hidden relative flex items-center justify-center shadow-inner">
            <img src={imageSrc} className="w-full h-full object-cover filter contrast-[0.95] sepia-[0.05]" alt={event.name} />
          </div>
        )}

        {/* 資訊區 */}
        <div className={`px-2 flex-1 flex flex-col ${!hasImage ? 'pt-6' : ''}`}>
          <h3 className="font-black text-stone-800 text-lg mb-2 leading-tight">
            {event.name}
          </h3>
          
          {event.note && (
            <p className="handwriting text-stone-600 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none cursor-pointer transition-all flex-1">
              {event.note}
            </p>
          )}

          {/* 收據按鈕 */}
          {event.expenses?.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setIsReceiptOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-md text-xs font-bold transition-colors"
              >
                <ReceiptText size={14} />
                <span>收據明細</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        expenses={event.expenses} 
      />
    </>
  );
};

export default EventCard;
