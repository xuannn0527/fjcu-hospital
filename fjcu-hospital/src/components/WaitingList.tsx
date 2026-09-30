import { useEffect, useState, useMemo } from 'react';
import { VitalBar } from '../components/VitalBar';
import { useNavigate } from 'react-router-dom'; // ★ 1. 引入 useNavigate 路由跳轉 Hook

// --- 介面與資料型別定義 ---
interface PredictionPatient {
  prediction_id: number;
  excel_row_id: number;
  patient_name: string;
  triage_degree: number;
  serious_risk_pct: number;
  admit_distribution?: Record<string, string>;
  arrivalTime?: string;
  medicalRecordNo?: string;
  gender?: string; // 新增
  age?: number;    // 新增
  complaint?: string;
 // ★ 新增：後端 API 直接回傳的生命徵象欄位
  t?: number | string;
  hr?: number | string;
  rr?: number | string;
  sbp?: number | string;
  dbp?: number | string;
  spo2?: number | string;
  vitals?: {
    t: number; hr: number; rr: number; sbp: number; dbp: number; spo2: number;
  };
}

// 檢傷級別對應顏色設定
const triageColors: Record<number, string> = {
  1: '#EF4444', // 紅
  2: '#EA580C', // 橘
  3: '#EAB308', // 黃
  4: '#22C55E', // 綠
  5: '#3B82F6', // 藍
};

export default function WaitingList() {
  const [patients, setPatients] = useState<PredictionPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // ★ 2. 宣告 navigate 函式

  // 篩選狀態：null 代表顯示全部
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // ★ 修復 1：預設一開始就帶有排序 key ('time')，讓箭頭在一開始即完整顯示
  const [sortConfig, setSortConfig] = useState<{ key: 'time' | 'risk'; direction: 'asc' | 'desc' }>({
    key: 'time',
    direction: 'asc',
  });

  // 取得資料與狀態統計
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/predictions')
      .then((res) => res.json())
      .then((data: PredictionPatient[]) => {
        const enrichedData = data.map((item, index) => {
          // ★ 優先讀取後端資料，並轉為數字型別
          const t = Number(item.vitals?.t ?? item.t ?? 36.5);
          const hr = Number(item.vitals?.hr ?? item.hr ?? 75);
          const rr = Number(item.vitals?.rr ?? item.rr ?? 18);
          const sbp = Number(item.vitals?.sbp ?? item.sbp ?? 120);
          const dbp = Number(item.vitals?.dbp ?? item.dbp ?? 80);
          const spo2 = Number(item.vitals?.spo2 ?? item.spo2 ?? 98);

          return {
            ...item,
            arrivalTime: item.arrivalTime || `10:${(10 + index * 3).toString().padStart(2, '0')}`,
            medicalRecordNo: item.medicalRecordNo || `00${8877665 + index}J`,
            gender: item.gender || (index % 2 === 0 ? '女' : '男'),
            age: item.age ?? (index % 2 === 0 ? 80 : 40),
            complaint: item.complaint || '無特殊主訴紀錄',
            // ★ 將正確的生命徵象數據賦予 vitals
            vitals: { t, hr, rr, sbp, dbp, spo2 }
          };
        });
        setPatients(enrichedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('讀取候診名單失敗:', err);
        setLoading(false);
      });
  }, []);

  // 計算各級檢傷人數
  const counts = { total: patients.length, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  patients.forEach(p => {
    if (p.triage_degree >= 1 && p.triage_degree <= 5) {
      counts[p.triage_degree as keyof typeof counts]++;
    }
  });

  // 切換排序
  const handleSort = (key: 'time' | 'risk') => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: key === 'risk' ? 'desc' : 'asc' };
    });
  };

  // 篩選與排序後的資料
  const displayedPatients = useMemo(() => {
    let result = [...patients];

    // 1. 級別過濾
    if (selectedLevel !== null) {
      result = result.filter(p => p.triage_degree === selectedLevel);
    }

    // 2. 欄位排序
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'time') {
          const timeA = a.arrivalTime || '';
          const timeB = b.arrivalTime || '';
          return sortConfig.direction === 'asc'
            ? timeA.localeCompare(timeB)
            : timeB.localeCompare(timeA);
        } else if (sortConfig.key === 'risk') {
          const riskA = a.serious_risk_pct || 0;
          const riskB = b.serious_risk_pct || 0;
          return sortConfig.direction === 'asc'
            ? riskA - riskB
            : riskB - riskA;
        }
        return 0;
      });
    }

    return result;
  }, [patients, selectedLevel, sortConfig]);

  // ★ 修復 2：定義統一的 Grid 欄位寬度與間距，保證標頭與內容 100% 對齊
  const gridLayout = '80px 110px 140px 90px minmax(220px, 1fr) 340px 200px';

  // --- UI 元件: 頂部狀態列 ---
  const renderTopBar = () => {
    const filterBtnStyle = (level: number | null, color?: string) => {
      const isSelected = selectedLevel === level;
      return {
        backgroundColor: isSelected && level === null ? '#3B82F6' : '#fff',
        color: isSelected && level === null ? '#fff' : '#1F2937',
        border: isSelected && level !== null ? `2px solid ${color}` : '1px solid #E5E7EB',
        padding: '6px 14px',
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        fontWeight: isSelected ? 'bold' : 'normal'
      };
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', color: '#1F2937', fontWeight: 'bold' }}>
          <span style={{ color: '#3B82F6' }}>👥</span> 當前候診名單
        </h2>
        <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
          <button type="button" onClick={() => setSelectedLevel(null)} style={filterBtnStyle(null)}>
            全部 {counts.total} 人
          </button>
          {[1, 2, 3, 4, 5].map((level) => (
            <button 
              key={level} 
              type="button" 
              onClick={() => setSelectedLevel(level === selectedLevel ? null : level)} 
              style={filterBtnStyle(level, triageColors[level])}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: triageColors[level] }} />
              {['一', '二', '三', '四', '五'][level - 1]}級 {counts[level as keyof typeof counts]} 人
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {renderTopBar()}
      
      <div style={{ padding: '0 24px', flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>資料載入中...</div>
        ) : (
          <div style={{ backgroundColor: '#fff', marginTop: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '1100px' }}>
            
            {/* ★ 表格標題列 (採用嚴格的 Grid 排版，與資料列完全對齊) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: gridLayout, 
              gap: '16px', 
              padding: '16px 24px', 
              borderBottom: '2px solid #E5E7EB', 
              color: '#6B7280', 
              fontSize: '14px', 
              fontWeight: 'bold',
              alignItems: 'center'
            }}>
              
              {/* 到診 (帶排序箭頭) */}
              <div 
                style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => handleSort('time')}
                title="點擊依到診時間排序"
              >
                <span>到診</span>
                <span>🕒</span>
                <span style={{ 
                  color: sortConfig.key === 'time' ? '#2563EB' : '#94A3B8', 
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}>
                  {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑'}
                </span>
              </div>

              <div>病歷號</div>
              <div>姓名</div>
              <div>檢傷</div>
              <div>護理主訴</div>

              {/* 生命徵象即時分析 */}
              <div style={{ textAlign: 'center' }}>
                生命徵象即時分析
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 'normal', marginTop: '2px' }}>
                  T | HR | RR | SBP | DBP | SpO2
                </div>
              </div>

              {/* AI 預測與看診 (帶排序箭頭) */}
              <div 
                style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                onClick={() => handleSort('risk')}
                title="點擊依 AI 惡化風險排序"
              >
                <span>AI 預測與看診</span>
                <span style={{ 
                  color: sortConfig.key === 'risk' ? '#2563EB' : '#94A3B8', 
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}>
                  {sortConfig.key === 'risk' ? (sortConfig.direction === 'desc' ? '↓' : '↑') : '↓'}
                </span>
              </div>

            </div>

            {/* 病患列表 */}
            {displayedPatients.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                無符合此條件的病患資料
              </div>
            ) : (
              displayedPatients.map((patient) => {
                const admitPrediction = patient.serious_risk_pct > 50 ? 'ICU病房' : '未住院';
                const riskColor = patient.serious_risk_pct > 50 ? '#EF4444' : '#10B981';

                return (
                  <div 
                    key={patient.prediction_id} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: gridLayout, 
                      gap: '16px', 
                      padding: '20px 24px', 
                      borderBottom: '1px solid #F3F4F6', 
                      alignItems: 'center' 
                    }}
                  >
                    <div style={{ color: '#4B5563', fontWeight: '500' }}>{patient.arrivalTime}</div>
                    <div style={{ color: '#3B82F6', fontFamily: 'monospace' }}>{patient.medicalRecordNo}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111827' }}>{patient.patient_name}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                        {patient.gender}, {patient.age}Y
                      </div>
                    </div>
                    <div>
                      <span style={{ backgroundColor: triageColors[patient.triage_degree] || '#9CA3AF', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 'bold' }}>
                        級數 {patient.triage_degree}
                      </span>
                    </div>
                    <div style={{ color: '#4B5563', fontSize: '14px', paddingRight: '12px', lineHeight: '1.5' }}>
                      {patient.complaint}
                    </div>
                    
                    {/* 生命徵象區塊 */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <VitalBar label="T" displayValue={patient.vitals?.t.toFixed(1) || '-'} numericValue={patient.vitals?.t} age={patient.age} />
                        <VitalBar label="HR" displayValue={patient.vitals?.hr || '-'} numericValue={patient.vitals?.hr} age={patient.age} />
                        <VitalBar label="RR" displayValue={patient.vitals?.rr || '-'} numericValue={patient.vitals?.rr} age={patient.age} />
                        <VitalBar label="SBP" displayValue={patient.vitals?.sbp || '-'} numericValue={patient.vitals?.sbp} age={patient.age} />
                        <VitalBar label="DBP" displayValue={patient.vitals?.dbp || '-'} numericValue={patient.vitals?.dbp} age={patient.age} />
                        <VitalBar label="SpO2" displayValue={patient.vitals?.spo2 || '-'} numericValue={patient.vitals?.spo2} age={patient.age} />
                    </div>

                    {/* AI 預測區塊 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, border: `1px solid ${riskColor}33`, backgroundColor: `${riskColor}11`, borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: riskColor }}>3hr 惡化預測</div>
                          <div style={{ fontSize: '15px', fontWeight: 'bold', color: riskColor }}>{patient.serious_risk_pct}%</div>
                        </div>
                        <div style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#6B7280' }}>轉歸預測</div>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginTop: '2px' }}>{admitPrediction}</div>
                        </div>
                      </div>
                      
                      {/* ★ 3. 修改按鈕：加上 onClick 觸發跳轉，網址帶上該病患的病歷號 */}
                      <button 
                        type="button"
                        // ★ 這裡改成傳遞真實的資料庫主鍵 prediction_id
                        onClick={() => navigate(`/into-consult/${patient.prediction_id}`)}
                        style={{ width: '100%', padding: '6px', border: '1px solid #3B82F6', backgroundColor: '#fff', color: '#3B82F6', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
                      >
                        進入看診
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}