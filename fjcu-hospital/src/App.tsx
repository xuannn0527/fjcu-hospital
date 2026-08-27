import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Personnel from './components/Personnel';
import Login from './components/Login'; 
import Settings from './components/Settings'; 
import Records from './components/Records';
import Statistics from './components/Statistics';
import WaitingList from './components/WaitingList'; // ★ 1. 新增匯入 WaitingList
import './App.css'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 1. 初始化深色模式（優先讀取 localStorage）
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // 2. 當 isDarkMode 改變時，更新 localStorage 與 body 樣式
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // 根據深色模式動態切換背景色
  const bgColor = isDarkMode ? '#0F172A' : '#F8FAFC';

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', margin: 0, padding: 0, backgroundColor: bgColor, transition: 'background-color 0.3s' }}>
        
        <Header />
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          <Sidebar onLogout={() => setIsLoggedIn(false)} />
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', backgroundColor: bgColor, transition: 'background-color 0.3s' }}>
            <Routes>
              {/* ★ 2. 將主頁路徑 (/) 指向 WaitingList */}
              <Route path="/" element={<WaitingList />} />
              
              {/* 首頁 (急診看板) 則保留在 /triage */}
              <Route path="/triage" element={<Dashboard />} />
              
              <Route path="/records" element={<Records isDarkMode={isDarkMode} />} />
              <Route path="/statistics" element={<Statistics isDarkMode={isDarkMode} />} />
              
              {/* 3. 將 isDarkMode 與 setIsDarkMode 傳遞給 Settings */}
              <Route 
                path="/settings" 
                element={<Settings isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />} 
              />

              <Route path="/personnel" element={<Personnel />} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;