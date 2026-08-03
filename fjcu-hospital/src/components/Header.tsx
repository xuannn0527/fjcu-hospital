export default function Header() {
  return (
    <div style={{
      height: '80px',
      backgroundColor: 'white',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px'
    }}>
      {/* 左側：Logo 與系統名稱 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: '#10B981', borderRadius: '50%' }}></div> {/* 綠色假 Logo */}
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#1E293B', fontWeight: 'bold' }}>急診臨床決策輔助系統</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', letterSpacing: '1px' }}>EMERGENCY CLINICAL DECISION SUPPORT</p>
        </div>
      </div>

      {/* 右側：時間、狀態與登入者資訊 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ padding: '8px 16px', backgroundColor: '#F0F9FF', color: '#0369A1', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
          🕒 2026/8/3 20:54:36
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
          🟢 即時監測中
        </div>
        <div style={{ fontSize: '15px', color: '#334155' }}>
          值班：<strong style={{ color: '#0F172A' }}></strong> 資深醫師
        </div>
      </div>
    </div>
  );
}