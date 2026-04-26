import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, TrendingUp, Users, Wallet } from 'lucide-react';

const COLORS = ['#38aaf7', '#FE9A5F', '#9b59b6', '#2ecc71', '#f1c40f', '#e74c3c'];

const Stats = ({ stats, timeline }) => {
  // 準備圓餅圖資料
  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  
  // 準備每日花費長條圖資料
  const dailyData = timeline.map(d => ({
    name: `Day ${d.day}`,
    amount: Math.round(d.total)
  }));

  // 旅伴分帳結算 (簡單版)
  const diff = stats.byPayer['油'] - stats.byPayer['瓜'];
  const settlement = diff > 0 
    ? { message: '瓜 應給 油', amount: Math.abs(diff / 2) } 
    : { message: '油 應給 瓜', amount: Math.abs(diff / 2) };

  return (
    <section className="my-16 space-y-12">
      <div className="flex items-center gap-3 mb-4">
        <PieIcon className="text-fuji-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-fuji-blue-800">旅程帳務大解密</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. 消費類別分析 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-sm font-bold text-gray-600 mb-6 flex items-center gap-2">
            <PieIcon size={16} /> 食衣住行佔比
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 每日花費趨勢 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-sm font-bold text-gray-600 mb-6 flex items-center gap-2">
            <TrendingUp size={16} /> 每日燒錢程度
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="amount" fill="#38aaf7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. 旅伴分帳與代墊結算 */}
        <div className="bg-fuji-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center text-center">
          <Users className="mb-4" size={32} />
          <h3 className="text-lg font-bold mb-2">旅伴分帳結算</h3>
          <div className="flex gap-8 mb-6">
            <div>
              <p className="text-xs opacity-80">油 先墊了</p>
              <p className="text-xl font-bold">NT$ {Math.round(stats.byPayer['油'])}</p>
            </div>
            <div className="border-l border-white/20 h-10 self-center"></div>
            <div>
              <p className="text-xs opacity-80">瓜 先墊了</p>
              <p className="text-xl font-bold">NT$ {Math.round(stats.byPayer['瓜'])}</p>
            </div>
          </div>
          <div className="bg-white/10 p-3 rounded-full px-6">
            <p className="text-sm">最終結算：<span className="font-bold">{settlement.message}</span> NT$ {Math.round(settlement.amount)}</p>
          </div>
        </div>

        {/* 4. 支付方式與回饋 */}
        <div className="bg-travel-orange text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center text-center">
          <Wallet className="mb-4" size={32} />
          <h3 className="text-lg font-bold mb-2">支付方式與回饋</h3>
          <div className="space-y-2">
            <p className="text-sm">總消費金額: NT$ {Math.round(stats.totalTWD)}</p>
            <p className="text-2xl font-bold">回饋賺了 NT$ {Math.round(stats.totalRebate)}</p>
            <p className="text-xs opacity-80">系統回饋金已自動扣除</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
