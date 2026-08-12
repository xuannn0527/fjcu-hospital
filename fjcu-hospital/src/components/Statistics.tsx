import { useState } from 'react';

export default function Statistics({ isDarkMode }: { isDarkMode?: boolean }) {
  // 控制時間切換的狀態 (今日/本週/本月)
  const [timeRange, setTimeRange] = useState('今日');

  // 1. TTAS 檢傷級數假資料
  const ttasData = [
    { level: '第一級 復甦急救', count: 2, percent: '4.8%', color: '#EF4444', bg: '#FEE2E2' },
    { level: '第二級 危急', count: 6, percent: '14.2%', color: '#F97316', bg: '#FFEDD5' },
    { level: '第三級 緊急', count: 20, percent: '47.6%', color: '#EAB308', bg: '#FEF9C3' },
    { level: '第四級 次緊急', count: 10, percent: '23.8%', color: '#22C55E', bg: '#DCFCE7' },
    { level: '第五級 非緊急', count: 4, percent: '9.6%', color: '#3B82F6', bg: '#DBEAFE' },
  ];

  // 2. 各時段掛號分佈假資料 (用於繪製右側直條圖)
  const timeDistData = [
    { time: '08:00', value: 15 },
    { time: '10:00', value: 40 },
    { time: '12:00', value: 65 },
    { time: '14:00', value: 95 },
    { time: '16:00', value: 55 },
    { time: '18:00', value: 75 },
    { time: '20:00', value: 45 },
  ];
  const maxTimeValue = 100; // 用於計算長條圖高度比例

  // 輔助樣式變數
  const cardBg = isDarkMode ? '#1E293B' : 'white';
  const textColor = isDarkMode ? 'white' : '#333';
  const subTextColor = isDarkMode ? '#94A3B8' : '#6B7280';
  const borderColor = isDarkMode ? '#334155' : '#E5E7EB';

  return (
    <div style={{ padding: '24px', color: textColor, position: 'relative', height: '100%', boxSizing: 'border-box' }}>
      
      {/* 頂部標題與時間切換區塊 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0', fontSize: '20px' }}>
            <span style={{ color: '#2563EB' }}></span> 急診數據量化統計與負載看板
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>即時分析檢傷筆數、級數分佈、時段人流及年齡層結構</p>
        </div>
        
        {/* 時間切換按鈕群組 */}
        <div style={{ display: 'flex', backgroundColor: isDarkMode ? '#334155' : '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
          {['今日', '本週', '本月'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: timeRange === range ? 'bold' : 'normal',
                backgroundColor: timeRange === range ? cardBg : 'transparent',
                color: timeRange === range ? textColor : subTextColor,
                boxShadow: timeRange === range ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 四大 KPI 數據卡片區 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: 總檢傷人數 */}
        <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #BFDBFE' }}>
          <div>
            <div style={{ color: '#1D4ED8', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>總檢傷人數</div>
            <div style={{ color: '#1E3A8A', fontSize: '28px', fontWeight: 'bold' }}>42 <span style={{ fontSize: '16px' }}>人</span></div>
          </div>
          <div style={{ fontSize: '32px' }}>👥</div>
        </div>
        
        {/* Card 2: 急重症比例 */}
        <div style={{ backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FECACA' }}>
          <div>
            <div style={{ color: '#B91C1C', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>急重症比例 (1-2級)</div>
            <div style={{ color: '#7F1D1D', fontSize: '28px', fontWeight: 'bold' }}>19.0 <span style={{ fontSize: '16px' }}>%</span></div>
          </div>
          <div style={{ fontSize: '32px' }}>🚑</div>
        </div>

        {/* Card 3: 平均檢傷耗時 */}
        <div style={{ backgroundColor: '#ECFDF5', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #A7F3D0' }}>
          <div>
            <div style={{ color: '#047857', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>平均檢傷耗時</div>
            <div style={{ color: '#064E3B', fontSize: '28px', fontWeight: 'bold' }}>1.8 <span style={{ fontSize: '16px' }}>分鐘</span></div>
          </div>
          <div style={{ fontSize: '32px' }}>⏱️</div>
        </div>

        {/* Card 4: AI 建議採納率 */}
        <div style={{ backgroundColor: '#FAF5FF', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E9D5FF' }}>
          <div>
            <div style={{ color: '#7E22CE', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>AI 建議採納率</div>
            <div style={{ color: '#581C87', fontSize: '28px', fontWeight: 'bold' }}>95.2 <span style={{ fontSize: '16px' }}>%</span></div>
          </div>
          <div style={{ fontSize: '32px', color: '#A855F7', backgroundColor: '#F3E8FF', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
        </div>
      </div>

      {/* 底部圖表區：分為左右兩塊 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* 左側：TTAS 檢傷級數佔比 (橫向進度條) */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: textColor }}>TTAS 檢傷級數佔比</h3>
          <div>
            {ttasData.map((item) => (
              <div key={item.level} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: item.color, fontWeight: 'bold' }}>{item.level} ({item.count}人)</span>
                  <span style={{ color: subTextColor }}>{item.percent}</span>
                </div>
                {/* 軌道背景 */}
                <div style={{ width: '100%', backgroundColor: isDarkMode ? '#334155' : '#F3F4F6', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                  {/* 填滿進度 */}
                  <div style={{ width: item.percent, backgroundColor: item.color, height: '100%', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：今日各時段檢傷掛號分佈 (CSS 直條圖) */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: textColor }}>今日各時段檢傷掛號分佈 (人)</h3>
          
          {/* 圖表繪製區 (Flex 容器) */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${borderColor}`, position: 'relative' }}>
            
            {/* 背景橫線 (裝飾用) */}
            <div style={{ position: 'absolute', width: '100%', height: '50%', borderTop: `1px dashed ${borderColor}`, top: '25%', left: 0, zIndex: 0 }} />
            <div style={{ position: 'absolute', width: '100%', height: '25%', borderTop: `1px dashed ${borderColor}`, top: '75%', left: 0, zIndex: 0 }} />

            {/* 柱狀圖本體 */}
            {timeDistData.map((data, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '10%' }}>
                {/* 數據標籤 (滑鼠移上去或預設顯示) */}
                <div style={{ fontSize: '12px', color: '#3B82F6', marginBottom: '4px', opacity: 0.8 }}>{data.value}</div>
                {/* 長條圖 */}
                <div style={{ 
                  width: '32px', 
                  height: `${(data.value / maxTimeValue) * 200}px`, // 依照比例計算高度
                  backgroundColor: '#3B82F6', 
                  borderTopLeftRadius: '4px', 
                  borderTopRightRadius: '4px',
                  transition: 'height 0.3s'
                }} />
              </div>
            ))}
          </div>
          
          {/* X軸時間標籤 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
            {timeDistData.map((data, index) => (
              <div key={index} style={{ width: '10%', textAlign: 'center', fontSize: '12px', color: subTextColor }}>
                {data.time}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}