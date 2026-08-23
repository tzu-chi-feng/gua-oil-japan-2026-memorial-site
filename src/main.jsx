import React from 'react';
import ReactDOM from 'react-dom/client'; // 引入 ReactDOM
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // 你的 App.jsx 現在將作為根組件
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
