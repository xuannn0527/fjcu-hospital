import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 新增 ChevronLeft, ChevronRight 作為收合按鈕的圖示
import { Stethoscope, History, PieChart, User, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // 控制側邊欄是否收合的狀態
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/triage', icon: <Stethoscope size={24} />, label: '首頁' },
    { path: '/records', icon: <History size={24} />, label: '病歷' },
    { path: '/personnel', icon: <User size={24} />, label: '人員' },
    { path: '/statistics', icon: <PieChart size={24} />, label: '統計' },
    { path: '/settings', icon: <Settings size={24} />, label: '設定' },
  ];

  return (
    <div style={{
      position: 'relative',
      width: isCollapsed ? '0px' : '80px',
      height: '100%',
      transition: 'width 0.3s ease',
      zIndex: 50 // 確保按鈕與側邊欄在最上層
    }}>
      
      {/* 側邊欄背景與隱藏裁切區 */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1E293B',
        overflow: 'hidden' // 當寬度縮減時，隱藏超出範圍的內容
      }}>
        
        {/* 固定 80px 的內容區，確保動畫過程中選單不會變形 */}
        <div style={{
          width: '80px', 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          boxSizing: 'border-box'
        }}>
          
          {/* 上半部選單區塊 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {menuItems.map((item) => {
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
                    opacity: isActive ? 1 : 0.5, 
                    transition: 'all 0.2s' 
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

          {/* 下半部：登出按鈕 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', marginTop: 'auto', paddingBottom: '16px' }}>
            <div 
              onClick={onLogout} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
              title="登出系統"
            >
              <LogOut size={24} color="white" />
            </div>
          </div>

        </div>
      </div>

      {/* 展開/收合 開關按鈕 (懸浮於側邊欄邊緣) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          top: '260px',
          right: '-16px', // 讓按鈕一半凸出於側邊欄外
          width: '32px',
          height: '32px',
          backgroundColor: '#3B82F6',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          outline: 'none',
          zIndex: 51
        }}
        title={isCollapsed ? "展開選單" : "收合選單"}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

    </div>
  );
}