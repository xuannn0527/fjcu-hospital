export default function LeftPanel({ patients = [], statusFilter, setStatusFilter, error }: any) {
  // 動態計算資料庫中符合的數量
  const unhandledCount = patients.filter((p: any) => p.status === '未處理').length;
  const observingCount = patients.filter((p: any) => p.status === '觀察中').length;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px', fontWeight: 'normal' }}>當前候診人數</h3>
      
      {error ? (
        <p style={{ color: 'red' }}>連線問題: {error}</p>
      ) : (
        <>
          {/* 總人數顯示 */}
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E293B', marginBottom: '16px' }}>
            {patients.length} <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748B' }}>人</span>
          </div>

          {/* 未處理 / 觀察中 兩個卡片按鈕 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* 未處理卡片 */}
            <div 
              onClick={() => setStatusFilter('未處理')}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                backgroundColor: statusFilter === '未處理' ? '#FFF5F5' : '#FFFFFF', 
                border: statusFilter === '未處理' ? '2px solid #EF4444' : '1px solid #E2E8F0',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold', marginBottom: '4px' }}>未處理</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>{unhandledCount}</div>
            </div>

            {/* 觀察中卡片 */}
            <div 
              onClick={() => setStatusFilter('觀察中')}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                backgroundColor: statusFilter === '觀察中' ? '#EFF6FF' : '#FFFFFF', 
                border: statusFilter === '觀察中' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 'bold', marginBottom: '4px' }}>觀察中</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{observingCount}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}