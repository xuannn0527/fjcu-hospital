import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [patients, setPatients] = useState([]); // 預設空陣列
  const [error, setError] = useState(null);     // 錯誤訊息狀態

  useEffect(() => {
    fetch('http://localhost:8000/api/patients')
      .then(response => response.json())
      .then(data => {
        // 檢查後端回傳的是不是陣列
        if (Array.isArray(data)) {
          setPatients(data);
          setError(null);
        } else {
          // 如果不是陣列，代表後端報錯，把錯誤訊息存起來
          setError(data.error || "無法讀取資料");
        }
      })
      .catch(err => {
        setError("無法連線到後端 API");
        console.error(err);
      });
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1.5fr',
      gap: '24px',
      padding: '24px',
      height: '100vh',
      backgroundColor: '#F8FAFC'
    }}>
      {/* 左側欄：統計 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3>候診概況</h3>
        {error ? (
           <p style={{color: 'red'}}>連線問題: {error}</p>
        ) : (
           <p>總候診人數: <strong style={{ fontSize: '24px', color: '#EF4444' }}>{patients.length}</strong> 人</p>
        )}
      </div>

      {/* 中間欄：病患風險清單 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
        <h3>即時風險分流</h3>
        
        <div style={{ marginTop: '16px' }}>
          {Array.isArray(patients) && patients.length > 0 ? (
            patients.map((patient: any) => (
              <div key={patient.patient_id} style={{ 
                padding: '16px', 
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer' // 滑鼠移上去變手指
              }}>
                {/* 資訊左半邊：病患ID與主訴 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong style={{ fontSize: '16px', color: '#1E293B' }}>{patient.patient_id}</strong>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>{patient.chief_complaint}</span>
                </div>

                {/* 資訊右半邊：到院時間、檢傷級數、惡化風險 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{patient.arrival_time}</span>
                  
                  {/* 檢傷標籤：1-2級顯示紅色，3級以上顯示黃色 */}
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '6px', 
                    backgroundColor: patient.triage_level <= 2 ? '#FEE2E2' : '#FEF9C3',
                    color: patient.triage_level <= 2 ? '#EF4444' : '#EAB308',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    border: `1px solid ${patient.triage_level <= 2 ? '#FCA5A5' : '#FDE047'}`
                  }}>
                    {patient.triage_level} 級
                  </span>

                  {/* 惡化風險百分比 */}
                  <strong style={{ 
                    color: patient.risk_score >= 80 ? '#EF4444' : '#F59E0B',
                    width: '40px',
                    textAlign: 'right'
                  }}>
                    {patient.risk_score}%
                  </strong>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#94A3B8' }}>{error ? "請檢查資料庫設定" : "目前暫無病患資料"}</p>
          )}
        </div>
      </div>

      {/* 右側欄：AI 決策輔助 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3>AI 決策輔助</h3>
        <p style={{ color: '#64748B' }}>請點擊左側病患清單以分析風險成因...</p>
      </div>
    </div>
  );
}