// 定義傳入的 Props 型別，提升程式碼嚴謹度
interface LeftPanelProps {
  patients?: any[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  error: string | null;
  alertCount?: number; // 新增：觀察區突發警示數量（用於鈴鐺徽章）
}

export default function LeftPanel({ patients = [], statusFilter, setStatusFilter, error, alertCount = 0 }: LeftPanelProps) {
  // 動態計算資料庫中符合的數量
  const unhandledCount = patients.filter(p => p.status === '未處理').length;
  const observingCount = patients.filter(p => p.status === '觀察中').length;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px', fontWeight: 'normal' }}>當前候診與觀察</h3>
      
      {error ? (
        <p style={{ color: 'red', fontSize: '12px' }}>連線問題: {error}</p>
      ) : (
        <>
          {/* 總人數顯示 */}
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E293B', marginBottom: '10px' }}>
            {patients.length} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#64748B' }}>人</span>
          </div>

          {/* 未處理 / 觀察中 兩個卡片按鈕 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* 未處理卡片 */}
            <div 
              onClick={() => setStatusFilter('未處理')}
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '10px', 
                backgroundColor: statusFilter === '未處理' ? '#FFF5F5' : '#FFFFFF', 
                border: statusFilter === '未處理' ? '2px solid #EF4444' : '1px solid #E2E8F0',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 'bold', marginBottom: '2px' }}>未處理</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444' }}>{unhandledCount}</div>
            </div>

            {/* 觀察中卡片 (帶有右上角鈴鐺警示紅點) */}
            <div 
              onClick={() => setStatusFilter('觀察中')}
              style={{ 
                position: 'relative', 
                flex: 1, 
                padding: '10px', 
                borderRadius: '10px', 
                backgroundColor: statusFilter === '觀察中' ? '#EFF6FF' : '#FFFFFF', 
                border: statusFilter === '觀察中' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              {/* 觀察中右上角警示鈴鐺徽章 */}
              {alertCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#FF4D4F',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  border: '2px solid #FFFFFF'
                }}>
                  {alertCount}
                </div>
              )}

              <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 'bold', marginBottom: '2px' }}>觀察中</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3B82F6' }}>{observingCount}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}