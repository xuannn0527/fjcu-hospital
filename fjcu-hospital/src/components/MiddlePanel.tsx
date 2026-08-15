import { useState } from 'react';

export default function MiddlePanel({ patients, error, selectedPatient, onSelectPatient }: any) {
  const [sortField, setSortField] = useState<string>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isNarrow = Boolean(selectedPatient);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'risk_score' || field === 'final_level' ? 'desc' : 'asc'); 
    }
  };

  const sortedPatients = Array.isArray(patients) ? [...patients].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'final_level') {
      valA = Number(valA);
      valB = Number(valB);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    if (sortField === 'risk_score') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#EF4444'; 
    if (score >= 50) return '#F59E0B'; 
    return '#10B981'; 
  };

  // 核心修正 1：精準定義 Grid 欄位寬度
  // 使用 minmax(0, 1fr) 允許欄位縮小，觸發文字的 "..." 省略號，防止超長 MRN 撐爆畫面
  // 固定檢傷(45px) 與 風險(75px) 的寬度，保護它們不被擠壓
  const gridLayout = isNarrow
    ? 'minmax(0, 1.2fr) minmax(0, 1.5fr) 45px 75px 24px'
    : 'minmax(0, 1.5fr) minmax(0, 2fr) 60px 120px 30px';

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      padding: isNarrow ? '16px 12px' : '20px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      minHeight: 0, 
      boxSizing: 'border-box' 
    }}>
      
      {/* 標題與圖例區塊：修正過度擠壓的問題 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        marginBottom: '12px', 
        borderBottom: '1px solid #F1F5F9', 
        paddingBottom: '12px' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ fontSize: isNarrow ? '15px' : '16px', color: '#1E293B', margin: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#EF4444' }}>🚨</span> 病患風險排序清單
          </h3>
          {!isNarrow && (
            <span style={{ fontSize: '12px', color: '#64748B' }}>即時分析生命徵象與3小時內惡化預測風險</span>
          )}
        </div>

        {/* 核心修正 2：為圖例標籤加上 whiteSpace: 'nowrap'，防止文字斷行 */}
        <div style={{ display: 'flex', gap: '6px', fontSize: '11px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>● 高風險 &gt;80%</span>
          <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>● 中風險 50-79%</span>
          <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>● 低風險 &lt;50%</span>
        </div>
      </div>

      {/* 表格標頭 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: gridLayout, 
        padding: isNarrow ? '0 6px 8px 6px' : '0 16px 8px 16px', 
        fontSize: isNarrow ? '11px' : '12px', 
        color: '#64748B', 
        fontWeight: 'bold', 
        borderBottom: '1px solid #E2E8F0', 
        alignItems: 'center',
        gap: '8px'
      }}>
        <div onClick={() => handleSort('patient_id')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          病患 ID {sortField === 'patient_id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>
        
        <div onClick={() => handleSort('triage_id')} style={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          就診序號(PK) {sortField === 'triage_id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div onClick={() => handleSort('final_level')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          檢傷 {sortField === 'final_level' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div onClick={() => handleSort('risk_score')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          風險 {sortField === 'risk_score' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div></div>
      </div>

      {/* 病患清單列表 */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: '8px' }}>
        {sortedPatients.length > 0 ? (
          sortedPatients.map((patient: any) => {
            const isSelected = selectedPatient?.patient_id === patient.patient_id;
            const riskColor = getRiskColor(patient.risk_score || 0);
            const isObserving = patient.status === '观察中' || patient.status === '觀察中';

            return (
              <div 
                key={patient.patient_id} 
                onClick={() => onSelectPatient(patient)}
                style={{ 
                  padding: isNarrow ? '10px 6px' : '14px 16px', 
                  borderBottom: '1px solid #F1F5F9',
                  display: 'grid',
                  gridTemplateColumns: gridLayout,
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  marginBottom: '4px'
                }}
              >
                {/* 1. 病患 ID 與主述 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ fontSize: isNarrow ? '13px' : '15px', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {patient.patient_id}
                    </strong>
                    {isObserving && (
                      <span style={{ backgroundColor: '#FFEDD5', color: '#C2410C', fontSize: '9px', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        觀察中
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {patient.sentiment || patient.past_medical_history_y || '無主述紀錄'}
                  </span>
                </div>

                {/* 2. 就診序號 (PK) - 確保超長文字可以變成 "..." */}
                <div style={{ overflow: 'hidden', minWidth: 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    display: 'inline-block',
                    backgroundColor: '#F1F5F9', 
                    color: '#475569', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: isNarrow ? '10px' : '11px', 
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #E2E8F0'
                  }}>
                    {patient.triage_id || '未編號'}
                  </span>
                </div>

                {/* 3. 檢傷級數 - 強制不換行 (nowrap) 並且居中對齊 */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: Number(patient.final_level) <= 2 ? '#FEE2E2' : '#FEF9C3',
                    color: Number(patient.final_level) <= 2 ? '#EF4444' : '#EAB308',
                    fontWeight: 'bold',
                    fontSize: isNarrow ? '11px' : '12px',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${Number(patient.final_level) <= 2 ? '#FCA5A5' : '#FDE047'}`
                  }}>
                    {patient.final_level ? `${patient.final_level}級` : '-'}
                  </span>
                </div>

                {/* 4. 惡化風險與進度條 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', minWidth: 0 }}>
                  <strong style={{ color: riskColor, minWidth: '32px', fontSize: isNarrow ? '12px' : '14px' }}>
                    {patient.risk_score || 0}%
                  </strong>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${patient.risk_score || 0}%`, height: '100%', backgroundColor: riskColor, borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>
                </div>

                {/* 5. 取消/選取按鈕 */}
                <div style={{ textAlign: 'right', color: '#94A3B8', fontSize: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  {isSelected ? (
                    <span 
                      onClick={(e) => { e.stopPropagation(); onSelectPatient(null); }}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E2E8F0', color: '#475569', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                      title="取消選取"
                    >✕</span>
                  ) : <span>&gt;</span>}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: '#94A3B8', textAlign: 'center', marginTop: '40px' }}>{error ? "請檢查資料庫設定" : "目前暫無符合條件的病患資料"}</p>
        )}
      </div>
    </div>
  );
}