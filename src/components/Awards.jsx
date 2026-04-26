import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Utensils, ShoppingBag, Trophy } from 'lucide-react';

const AwardCard = ({ title, item, icon: Icon, color, delay }) => {
  if (!item) return null;
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      className={`bg-white p-5 rounded-lg shadow-lg border-2 border-dashed ${color} relative overflow-hidden flex flex-col items-center text-center`}
    >
      <div className={`p-3 rounded-full mb-3 ${color.replace('border-', 'bg-').replace('-400', '-100')}`}>
        <Icon className={color.replace('border-', 'text-')} size={24} />
      </div>
      <h3 className="text-sm font-bold text-gray-700 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">{item.name || `Day ${item.day}`}</p>
      
      <div className="mt-auto">
        <span className="text-lg font-bold text-gray-800">
          {item.amount ? `NT$ ${Math.round(item.amount)}` : `${item.count} 個行程`}
        </span>
        {item.day && <p className="text-[10px] text-gray-400">發生於 Day {item.day}</p>}
      </div>
      
      {/* 裝飾性印章 */}
      <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12">
        <Trophy size={60} />
      </div>
    </motion.div>
  );
};

const Awards = ({ awards }) => {
  return (
    <section className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-fuji-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-fuji-blue-800">旅程趣味頒獎台</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AwardCard 
          title="破財大魔王" 
          item={awards.biggestSpender} 
          icon={Zap} 
          color="border-red-400" 
          delay={0.1}
        />
        <AwardCard 
          title="鐵腿行程認證" 
          item={awards.mostTiringDay} 
          icon={Award} 
          color="border-fuji-blue-400" 
          delay={0.2}
        />
        <AwardCard 
          title="吃貨金賞" 
          item={awards.topFoodie} 
          icon={Utensils} 
          color="border-orange-400" 
          delay={0.3}
        />
        <AwardCard 
          title="血拼大王" 
          item={awards.shoppingKing} 
          icon={ShoppingBag} 
          color="border-purple-400" 
          delay={0.4}
        />
      </div>
    </section>
  );
};

export default Awards;
