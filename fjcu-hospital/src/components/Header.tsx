import { useState, useEffect } from 'react';
// 1. 修改圖片的引入路徑，指向上層的 assets 資料夾
import fjuLogo from '../assets/輔大醫院logo.png';

export default function Header() {
  // 建立一個狀態來儲存當前時間
  const [time, setTime] = useState(new Date());

  // 使用 useEffect 設定一個每秒更新的計時器
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 清除計時器，避免記憶體流失
    return () => clearInterval(timerId);
  }, []);

  // 將時間格式化為 YYYY/M/D HH:mm:ss 的字串
  const formattedTime = time.toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div style={{
      height: '80px',
      backgroundColor: 'white',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      width: '100%',          
      boxSizing: 'border-box' 
    }}>
      {/* 左側：Logo 與系統名稱 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* 2. 將 src 替換為剛引入的變數 fjuLogo */}
        <img 
          src={fjuLogo} 
          alt="輔大醫院" 
          style={{ height: '48px', objectFit: 'contain' }} 
        />
        
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#1E293B', fontWeight: 'bold' }}>急診臨床決策輔助系統</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', letterSpacing: '1px' }}>EMERGENCY CLINICAL DECISION SUPPORT</p>
        </div>
      </div>

      {/* 右側：時間、狀態與登入者資訊 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* 在這裡放入動態時間變數 */}
        <div style={{ padding: '8px 16px', backgroundColor: '#F0F9FF', color: '#0369A1', borderRadius: '8px', fontSize: '14px', fontWeight: '500', minWidth: '160px', textAlign: 'center' }}>
          🕒 {formattedTime}
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
          🟢 即時監測中
        </div>
        <div style={{ fontSize: '15px', color: '#334155' }}>
          值班：<strong style={{ color: '#0F172A' }}>資深醫師</strong>
        </div>
      </div>
    </div>
  );
}