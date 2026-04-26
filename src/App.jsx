import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Utensils, MapPin, ShoppingBag, Train, CreditCard, Award, Heart, PieChart, Calendar, Zap, Trophy, Users, Wallet, TrendingUp } from 'lucide-react'
import { fetchAndProcessData } from './utils/dataProcessor'
import Awards from './components/Awards'
import Stats from './components/Stats'

// --- 小組件: 紙膠帶 ---
const WashiTape = ({ color = 'bg-fuji-blue-300', className = '' }) => (
  <div className={`h-8 w-24 opacity-60 absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 ${color} ${className}`} 
       style={{ clipPath: 'polygon(0% 0%, 5% 20%, 0% 40%, 10% 60%, 0% 80%, 5% 100%, 95% 100%, 100% 80%, 90% 60%, 100% 40%, 95% 20%, 100% 0%)' }} />
)

// --- 小組件: 拍立得照片預留區 ---
const Polaroid = ({ title, type = 'meal', className = '' }) => {
  const icons = {
    meal: <Utensils className="w-8 h-8 text-fuji-blue-200" />,
    scenery: <Camera className="w-8 h-8 text-fuji-blue-200" />,
    default: <Heart className="w-8 h-8 text-fuji-blue-200" />
  }
  
  return (
    <div className={`bg-white p-2 pb-8 shadow-md border border-gray-100 rotate-1 hover:rotate-0 transition-transform cursor-pointer ${className}`}>
      <div className="aspect-square bg-fuji-blue-50 flex items-center justify-center overflow-hidden mb-2">
        {icons[type] || icons.default}
      </div>
      <p className="text-[10px] text-center text-gray-400 font-handwriting">{title}</p>
    </div>
  )
}

// --- 小組件: 行程卡片 ---
const ExpenseItem = ({ item }) => {
  const getIcon = (cat) => {
    if (cat?.includes('飲食')) return <Utensils size={14} />
    if (cat?.includes('交通')) return <Train size={14} />
    if (cat?.includes('購物')) return <ShoppingBag size={14} />
    return <MapPin size={14} />
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 py-2 border-b border-dashed border-fuji-blue-100 last:border-0"
    >
      <div className={`p-1.5 rounded-full ${item.payer === '油' ? 'bg-fuji-blue-100 text-fuji-blue-600' : 'bg-travel-pink text-travel-orange'}`}>
        {getIcon(item.category)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-700">{item.name}</h4>
          <span className="text-xs text-gray-400">NT$ {Math.round(item.amountTWD)}</span>
        </div>
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <MapPin size={10} /> {item.location || '未知地點'}
        </p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const statsRef = useRef(null);
  const awardsRef = useRef(null);

  useEffect(() => {
    fetchAndProcessData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-fuji-blue-50">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <MapPin className="text-fuji-blue-500 w-12 h-12" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-fuji-blue-50 pb-32 font-handwriting selection:bg-fuji-blue-100">
      {/* --- Header --- */}
      <header className="relative h-screen bg-gradient-to-b from-fuji-blue-600 via-fuji-blue-400 to-fuji-blue-50 overflow-hidden flex flex-col items-center justify-center text-white">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="z-10 text-center"
        >
          <div className="bg-white/10 backdrop-blur-md p-10 md:p-16 rounded-full border border-white/20 mb-8 inline-block shadow-2xl">
            <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] drop-shadow-2xl mb-4">瓜油日本行</h1>
            <p className="text-xl md:text-2xl opacity-90 italic tracking-widest font-light">A Fuji Adventure • 2026 Spring</p>
          </div>
          <div className="mt-8">
            <button 
              onClick={() => scrollTo(awardsRef)}
              className="animate-bounce p-3 bg-white/20 rounded-full border border-white/30 hover:bg-white/40 transition-colors"
            >
              <TrendingUp className="rotate-180" />
            </button>
          </div>
        </motion.div>
        
        {/* 富士山剪影背景 */}
        <div className="absolute bottom-0 w-full h-[60vh] bg-white/10" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute bottom-0 w-full h-[40vh] bg-white/20" style={{ clipPath: 'polygon(50% 20%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute bottom-0 w-full h-[20vh] bg-white/30" style={{ clipPath: 'polygon(50% 50%, 0% 100%, 100% 100%)' }}></div>
      </header>

      {/* --- 快速導覽 --- */}
      <nav className="sticky top-6 z-50 flex justify-center gap-2 md:gap-4 my-8">
        <button onClick={() => scrollTo(awardsRef)} className="bg-white/90 backdrop-blur-md border border-fuji-blue-200 px-6 py-2.5 rounded-full shadow-lg text-fuji-blue-700 text-sm font-bold flex items-center gap-2 hover:bg-fuji-blue-600 hover:text-white transition-all transform hover:scale-105">
          <Award size={18} /> 趣味獎項
        </button>
        <button onClick={() => scrollTo(timelineRef)} className="bg-white/90 backdrop-blur-md border border-fuji-blue-200 px-6 py-2.5 rounded-full shadow-lg text-fuji-blue-700 text-sm font-bold flex items-center gap-2 hover:bg-fuji-blue-600 hover:text-white transition-all transform hover:scale-105">
          <Calendar size={18} /> 旅程回憶
        </button>
        <button onClick={() => scrollTo(statsRef)} className="bg-white/90 backdrop-blur-md border border-fuji-blue-200 px-6 py-2.5 rounded-full shadow-lg text-fuji-blue-700 text-sm font-bold flex items-center gap-2 hover:bg-fuji-blue-600 hover:text-white transition-all transform hover:scale-105">
          <PieChart size={18} /> 數據分析
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 relative z-20">
        
        {/* --- 趣味頒獎台 --- */}
        <div ref={awardsRef} className="pt-20">
          <Awards awards={data.awards} />
        </div>

        {/* --- 時間軸 --- */}
        <div ref={timelineRef} className="pt-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-fuji-blue-600 rounded-2xl shadow-lg">
              <Calendar className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-fuji-blue-900">我們的足跡</h2>
              <p className="text-fuji-blue-400 text-sm italic">Step by step through Japan</p>
            </div>
          </div>
          
          <AnimatePresence>
            {data.timeline.map((dayData, idx) => (
              <motion.section 
                key={dayData.day}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-24 relative"
              >
                {/* 天數標籤 */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="bg-fuji-blue-600 text-white w-20 h-20 rounded-3xl flex flex-col items-center justify-center shadow-xl transform -rotate-12 border-4 border-white">
                    <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">Day</span>
                    <span className="text-3xl font-black">{dayData.day}</span>
                  </div>
                  <div className="flex-1 border-b-2 border-dashed border-fuji-blue-200 pb-2">
                    <h2 className="text-2xl text-fuji-blue-800 font-bold">
                      {idx === 0 ? "出發！夢想的起點" : idx === 2 ? "富士山下，與大自然對話" : "城市脈動與巷弄探索"}
                    </h2>
                    <p className="text-fuji-blue-300 text-xs italic mt-1 tracking-widest uppercase">Tokyo & Beyond Adventure</p>
                  </div>
                </div>

                {/* 手帳主體 */}
                <div className="bg-white rounded-xl shadow-2xl p-8 relative border border-gray-100 overflow-hidden">
                  <WashiTape color={idx % 2 === 0 ? 'bg-fuji-blue-300' : 'bg-travel-orange'} className="w-32 opacity-80" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 左側: 消費與足跡 */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center justify-between border-b border-fuji-blue-50 pb-2">
                        <h3 className="text-sm font-bold text-fuji-blue-600 flex items-center gap-2">
                          <CreditCard size={18} /> 今日筆記與花費
                        </h3>
                        <span className="text-[10px] text-fuji-blue-300 font-bold">TOTAL: NT$ {Math.round(dayData.total)}</span>
                      </div>
                      <div className="bg-fuji-blue-50/20 rounded-xl p-5 border border-fuji-blue-50/50 backdrop-blur-sm">
                        {dayData.items.map(item => (
                          <ExpenseItem key={item.id} item={item} />
                        ))}
                      </div>
                    </div>

                    {/* 右側: 照片與心得 */}
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                        <Polaroid title="今日最美味 😋" type="meal" className="rotate-2" />
                        <Polaroid title="絕美風景 📸" type="scenery" className="-rotate-2" />
                      </div>

                      <div className="space-y-4">
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-yellow-50/80 p-4 shadow-lg border-l-4 border-yellow-300 rotate-1 relative">
                          <Zap size={14} className="absolute -top-2 -right-2 text-yellow-400" />
                          <span className="text-[10px] font-bold text-yellow-700 block mb-2 tracking-tighter uppercase underline decoration-dotted">Oil's Reflection</span>
                          <p className="text-xs text-gray-600 leading-relaxed italic">
                            {idx === 0 ? "第一次在上野迷路，但那邊的藥妝真的好便宜！" : "富士山真的好雄偉，肉眼看的震撼感完全不同。"}
                          </p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-fuji-blue-50/80 p-4 shadow-lg border-l-4 border-fuji-blue-300 -rotate-1 relative">
                          <Heart size={14} className="absolute -top-2 -right-2 text-fuji-blue-400" />
                          <span className="text-[10px] font-bold text-fuji-blue-700 block mb-2 tracking-tighter uppercase underline decoration-dotted">Gua's Reflection</span>
                          <p className="text-xs text-gray-600 leading-relaxed italic">超商的炸雞球是這輩子的救贖，雖然有點鹹但好幸福。</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        {/* --- 數據分析 --- */}
        <div ref={statsRef} className="pt-24">
          <Stats stats={data.stats} timeline={data.timeline} />
        </div>

        {/* --- Footer --- */}
        <footer className="text-center py-32 border-t border-fuji-blue-100 mt-20">
          <div className="inline-block p-4 rounded-full bg-fuji-blue-100 mb-6">
            <Trophy className="text-fuji-blue-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-fuji-blue-800 mb-2 tracking-[0.3em]">Adventure Completed</h2>
          <p className="text-fuji-blue-400 text-sm mb-8">2026 瓜油日本行 • 滿載而歸</p>
          <div className="flex justify-center gap-6 text-fuji-blue-200">
            <Heart size={20} className="fill-current" />
            <Camera size={20} />
            <MapPin size={20} />
          </div>
          <p className="text-fuji-blue-200 text-[10px] mt-12 tracking-widest uppercase italic">Created for Memory • Crafted with Love</p>
        </footer>
      </main>
    </div>
  )
}
