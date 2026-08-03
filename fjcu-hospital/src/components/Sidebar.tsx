import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Stethoscope, History, PieChart, User, Settings, TestTube, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 定義上半部的主要選單，這樣程式碼更乾淨好管理
  const menuItems = [
    { path: '/triage', icon: <Stethoscope size={24} />, label: '檢傷' },
    { path: '/records', icon: <History size={24} />, label: '病歷' },
    { path: '/statistics', icon: <PieChart size={24} />, label: '統計' },
    { path: '/personnel', icon: <User size={24} />, label: '人員' },
    { path: '/settings', icon: <Settings size={24} />, label: '設定' },
  ];

  return (
    <div style={{
      width: '80px', // 配合設計圖調整為較細的寬度
      backgroundColor: '#1E293B',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
      boxSizing: 'border-box'
    }}>
      
      {/* 頂部 Logo 區塊 (對應圖片左上角的人頭 icon) */}
      <div style={{ marginBottom: '32px', cursor: 'pointer' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#3B82F6', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Users size={24} color="white" />
        </div>
      </div>

      {/* 上半部選單區塊 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {menuItems.map((item) => {
          // 判斷是否為當前頁面 (首頁 / 也視為檢傷)
          const isActive = location.pathname === item.path || (item.path === '/triage' && location.pathname === '/');
          
          return (
            <div 
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.5, // 未選中時變暗
                transition: 'all 0.2s' // 加上微動畫讓切換更順暢
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: isActive ? '#3B82F6' : 'transparent',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '12px', color: 'white', fontWeight: isActive ? 'bold' : 'normal' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 下半部選單區塊 (利用 marginTop: 'auto' 自動推到畫面最下方) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', marginTop: 'auto', paddingBottom: '16px' }}>
        
        {/* 模擬檢傷 */}
        <div 
          onClick={() => navigate('/mock')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            opacity: location.pathname === '/mock' ? 1 : 0.5
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: location.pathname === '/mock' ? '#3B82F6' : 'transparent',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}>
            <TestTube size={24} />
          </div>
          <span style={{ fontSize: '12px', color: 'white', fontWeight: location.pathname === '/mock' ? 'bold' : 'normal' }}>
            模擬檢傷
          </span>
        </div>

        {/* 登出按鈕 (圖片最下方) */}
        <div 
          onClick={() => alert('登出系統')} // 之後可以接真正的登出邏輯
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: 0.5
          }}
        >
          <LogOut size={24} color="white" />
        </div>

      </div>
    </div>
  );
}