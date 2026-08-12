import { useState } from 'react';

export default function MiddlePanel({ patients, error, selectedPatient, onSelectPatient }: any) {
  const [sortField, setSortField] = useState<string>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      
      {/* 標題與圖例區塊 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', color: '#1E293B', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#EF4444' }}>🚨</span> 病患風險排序清單
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>即時分析生命徵象與3小時內惡化預測風險</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
          <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>● 高風險 &gt;80%</span>
          <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>● 中風險 50-79%</span>
          <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>● 低風險 &lt;50%</span>
        </div>
      </div>

      {/* 表格標頭：調整各欄位寬度比例以保持安全距離 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 2.6fr 1fr 2fr 30px', padding: '0 16px 8px 16px', fontSize: '12px', color: '#64748B', fontWeight: 'bold', borderBottom: '1px solid #E2E8F0', alignItems: 'center' }}>
        <div onClick={() => handleSort('patient_id')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          病患 ID {sortField === 'patient_id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>
        
        <div onClick={() => handleSort('triage_id')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          就診序號 (PK) {sortField === 'triage_id' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div onClick={() => handleSort('final_level')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          檢傷 {sortField === 'final_level' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div onClick={() => handleSort('risk_score')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          惡化風險 {sortField === 'risk_score' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
        </div>

        <div></div>
      </div>

      {/* 病患清單列表 */}
      <div style={{ flex: 1, overflowY: 'auto', marginTop: '8px' }}>
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
                  padding: '14px 16px', 
                  borderBottom: '1px solid #F1F5F9',
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 2.6fr 1fr 2fr 30px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  marginBottom: '4px'
                }}
              >
                {/* 1. 病患 ID 與主述 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px', color: '#1E293B' }}>
                      {patient.patient_id}
                    </strong>
                    {isObserving && (
                      <span style={{ 
                        backgroundColor: '#FFEDD5', 
                        color: '#C2410C', 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold' 
                      }}>
                        觀察中
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    {patient.sentiment || patient.past_medical_history_y || '無主述紀錄'}
                  </span>
                </div>

                {/* 2. 就診序號 (PK) */}
                <div>
                  <span style={{ 
                    display: 'inline-block',
                    backgroundColor: '#F1F5F9', 
                    color: '#475569', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    maxWidth: '180px',
                    lineHeight: '1.3',
                    border: '1px solid #E2E8F0'
                  }}>
                    {patient.triage_id || '未編號'}
                  </span>
                </div>

                {/* 3. 檢傷級數 */}
                <div>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    backgroundColor: Number(patient.final_level) <= 2 ? '#FEE2E2' : '#FEF9C3',
                    color: Number(patient.final_level) <= 2 ? '#EF4444' : '#EAB308',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: `1px solid ${Number(patient.final_level) <= 2 ? '#FCA5A5' : '#FDE047'}`
                  }}>
                    {patient.final_level ? `${patient.final_level} 級` : '未分級'}
                  </span>
                </div>

                {/* 4. 惡化風險與進度條 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ color: riskColor, width: '36px', fontSize: '14px' }}>
                    {patient.risk_score || 0}%
                  </strong>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${patient.risk_score || 0}%`, 
                      height: '100%', 
                      backgroundColor: riskColor,
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                {/* 5. 箭頭按鈕 */}
                <div style={{ textAlign: 'right', color: '#94A3B8', fontSize: '16px' }}>
                  &gt;
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