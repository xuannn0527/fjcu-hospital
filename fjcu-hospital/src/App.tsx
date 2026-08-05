import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login'; 
import Settings from './components/Settings'; 
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/triage" element={<Dashboard />} />
              <Route path="/records" element={
                <div style={{ padding: '24px', color: isDarkMode ? 'white' : 'black' }}>
                  <h2>病歷系統</h2>
                  <p>這裡是未來的病歷頁面，開發中...</p>
                </div>
              } />
              
              {/* 3. 將 isDarkMode 與 setIsDarkMode 傳遞給 Settings */}
              <Route 
                path="/settings" 
                element={<Settings isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />} 
              />

              <Route path="/personnel" element={<div style={{ padding: '24px', color: isDarkMode ? 'white' : 'black' }}><h2>人員系統</h2><p>開發中...</p></div>} />
              <Route path="/statistics" element={<div style={{ padding: '24px', color: isDarkMode ? 'white' : 'black' }}><h2>統計系統</h2><p>開發中...</p></div>} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;