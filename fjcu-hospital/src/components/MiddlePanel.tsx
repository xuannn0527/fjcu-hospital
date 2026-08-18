import { useState } from 'react';

export default function MiddlePanel({ patients, error, selectedPatient, onSelectPatient }: any) {
  const [sortField, setSortField] = useState<string>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 判斷是否為窄版模式 (是否有選中病患)
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

  // 🌟 動態切換 Grid 比例
  // 窄版(已選中)：隱藏就診序號，剩下 3 個資料欄位(等寬 1fr) + 24px 箭頭按鈕空間
  // 寬版(未選中)：顯示就診序號，總共 4 個資料欄位(等寬 1fr) + 30px 箭頭按鈕空間
  const gridLayout = isNarrow
    ? '1fr 1fr 1fr 24px'
    : '1fr 1fr 1fr 1fr 30px';

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
      
      {/* 標題與圖例區塊 */}
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
            <span>病患風險排序清單</span> 
          </h3>
        </div>
        
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
        
        {/* 只有在未點擊 (寬版) 時，才顯示就診序號表頭 */}
        {!isNarrow && (
          <div onClick={() => handleSort('triage_id')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
            就診序號(PK) {sortField === 'triage_id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
          </div>
        )}

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
                // 🌟 核心功能：如果已經是被選取的狀態 (isSelected)，再次點擊就傳送 null，藉此回到初始寬版畫面！
                onClick={() => onSelectPatient(isSelected ? null : patient)}
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

                {/* 只有在未點擊 (寬版) 時，才顯示就診序號資料 */}
                {!isNarrow && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ 
                      display: 'inline-block',
                      backgroundColor: '#F1F5F9', 
                      color: '#475569', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      width: 'fit-content', 
                      boxSizing: 'border-box',
                      border: '1px solid #E2E8F0'
                    }}>
                      {patient.triage_id || '未編號'}
                    </span>
                  </div>
                )}

                {/* 檢傷級數 (寬版時為第3欄，窄版時為第2欄) */}
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

                {/* 惡化風險與進度條 (寬版時為第4欄，窄版時為第3欄) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', minWidth: 0 }}>
                  <strong style={{ color: riskColor, minWidth: '32px', fontSize: isNarrow ? '12px' : '14px' }}>
                    {patient.risk_score || 0}%
                  </strong>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${patient.risk_score || 0}%`, height: '100%', backgroundColor: riskColor, borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>
                </div>

                {/* 取消/選取按鈕 (最後一欄空間，現在永遠只顯示箭頭) */}
                <div style={{ textAlign: 'right', color: '#94A3B8', fontSize: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  <span>&gt;</span>
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