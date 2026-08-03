import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        {/* 左邊：側邊欄 (固定不動) */}
        <Sidebar />
        
        {/* 右邊：包含 Header 和動態內容的區塊 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 上方：Header (固定不動) */}
          <Header />
          
          {/* 中間：會根據網址切換的區塊 */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/triage" element={<Dashboard />} />
            <Route path="/records" element={
              <div style={{ padding: '24px', flex: 1, backgroundColor: '#F8FAFC' }}>
                <h2>病歷系統</h2>
                <p>這裡是未來的病歷頁面，開發中...</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;