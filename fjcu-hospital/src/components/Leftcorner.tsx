// 定義傳入的 Props 型別
interface LeftcornerProps {
  patients?: any[];
  selectedLevel: number | null;
  onSelectLevel: (level: number | null) => void;
}

export default function Leftcorner({ patients = [], selectedLevel, onSelectLevel }: LeftcornerProps) {
  // 動態計算 1~5 級各有多少人
  const counts = [1, 2, 3, 4, 5].map(level => {
    return {
      level,
      count: patients.filter((p: any) => Number(p.triage_level) === level).length
    };
  });

  // 依照設計圖設定各級別的代表顏色
  const levelColors: { [key: number]: string } = {
    1: '#EF4444', // 紅色
    2: '#F97316', // 橙色
    3: '#FBBF24', // 黃色/金黃
    4: '#10B981', // 綠色
    5: '#3B82F6'  // 藍色
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '20px' }}>
      {/* 標題與清除篩選按鈕區塊 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h3 style={{ fontSize: '16px', margin: 0 }}>檢傷分級統計</h3>
        
        {/* 只有在有選擇級別時才顯示「清除篩選」按鈕 */}
        {selectedLevel !== null && (
          <button 
            onClick={() => onSelectLevel(null)}
            style={{
              backgroundColor: '#EFF6FF',
              color: '#3B82F6',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            清除篩選
          </button>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>點擊長條可篩選病患清單</p>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
        {counts.map(({ level, count }) => {
          const isSelected = selectedLevel === level;
          const heightPx = Math.min(count * 20, 90); 

          return (
            <div 
              key={level}
              onClick={() => onSelectLevel(isSelected ? null : level)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1 }}
            >
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '6px', 
                color: isSelected ? '#3B82F6' : '#334155' 
              }}>
                {count}
              </span>
              <div style={{ 
                width: '28px', 
                height: `${Math.max(heightPx, 10)}px`, 
                backgroundColor: levelColors[level], 
                borderRadius: '4px 4px 0 0',
                opacity: selectedLevel === null || isSelected ? 1 : 0.4,
                boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #3B82F6' : 'none',
                transition: 'all 0.2s'
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
        {[1, 2, 3, 4, 5].map(level => {
          const isSelected = selectedLevel === level;
          return (
            <span 
              key={level} 
              style={{ 
                fontSize: '12px', 
                color: isSelected ? '#3B82F6' : '#64748B', 
                fontWeight: isSelected ? 'bold' : 'normal',
                flex: 1, 
                textAlign: 'center' 
              }}
            >
              {level} 級
            </span>
          );
        })}
      </div>
    </div>
  );
}