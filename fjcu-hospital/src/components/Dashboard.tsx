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
           <p>總候診人數: {patients.length} 人</p>
        )}
      </div>

      {/* 中間欄：病患風險清單 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
        <h3>即時風險分流</h3>
        
        {/* 這裡加入防呆檢查：只有確定是陣列時才執行 .map */}
        {Array.isArray(patients) && patients.length > 0 ? (
          patients.map((patient: any) => (
            <div key={patient.id} style={{ 
              padding: '12px', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{patient.name}</span>
              <span style={{ 
                color: patient.risk_level === '高風險' ? 'red' : 'green',
                fontWeight: 'bold'
              }}>{patient.risk_level}</span>
            </div>
          ))
        ) : (
          <p>{error ? "請檢查資料庫設定" : "目前暫無病患資料"}</p>
        )}
      </div>

      {/* 右側欄：AI 決策輔助 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3>AI 決策輔助</h3>
        <p>AI 系統運作中...</p>
      </div>
    </div>
  );
}