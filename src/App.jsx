import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; // 引入 motion
import { fetchAndProcessData } from './utils/dataProcessor';
import HomePage from './pages/HomePage'; // 引入 HomePage
import DayPage from './pages/DayPage';     // 引入 DayPage

import './App.css'; // 確保 Tailwind CSS 正常工作

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndProcessData()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data loading error:", err);
        setError("讀取手帳資料失敗，請檢查資料檔路徑或 CSV 格式。");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <div className="w-16 h-16 border-4 border-fuji-blue-100 border-t-fuji-blue-600 rounded-full" />
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-10 text-center">
      <div className="text-red-400 mb-4 font-black text-6xl">Oops!</div>
      <p className="text-stone-600 font-bold mb-8">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-stone-800 text-white rounded-full font-bold">重新整理</button>
    </div>
  );

  if (!data || !data.timeline || data.timeline.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <p className="text-stone-400 font-bold">手帳裡還沒有任何紀錄喔...</p>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage data={data} />} />
      <Route path="/day/:dayNumber" element={<DayPage data={data} />} />
    </Routes>
  );
}