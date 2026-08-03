export default function Sidebar() {
  return (
    <div style={{
      width: '100px', // 配合設計圖，設定較窄的側邊欄
      backgroundColor: '#1E293B', // 深藍色背景
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '24px',
      gap: '32px'
    }}>
      {/* 系統圖示 */}
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>

      </div>

      {/* 選單區塊 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        
        {/* 啟用狀態的按鈕 (檢傷) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#3B82F6', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            🏥 {/* 這裡之後可以換成真正的 Icon */}
          </div>
          <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>檢傷</span>
        </div>

        {/* 未啟用狀態的按鈕 (病歷) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: 0.6 }}>
          <div style={{ width: '56px', height: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            📋
          </div>
          <span style={{ fontSize: '14px', color: 'white' }}>病歷</span>
        </div>

      </div>
    </div>
  );
}