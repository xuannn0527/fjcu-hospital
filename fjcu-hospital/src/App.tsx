import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login'; 
import './App.css'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 測試階段可先設為 true

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      {/* 最外層改為垂直排列 (Column)，讓 Header 在最上方 */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        
        {/* 1. 上方：Header (現在會延伸到最左邊) */}
        <Header />
        
        {/* 2. 下方：包含側邊欄與主要內容的水平容器 */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* 左側：側邊欄 */}
          <Sidebar onLogout={() => setIsLoggedIn(false)} />
          
          {/* 右側：會根據網址切換的動態內容區塊 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', backgroundColor: '#F8FAFC' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/triage" element={<Dashboard />} />
              <Route path="/records" element={
                <div style={{ padding: '24px' }}>
                  <h2>病歷系統</h2>
                  <p>這裡是未來的病歷頁面，開發中...</p>
                </div>
              } />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;