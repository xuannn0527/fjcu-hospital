import { useState, useEffect } from 'react';
// ★ 這裡的匯入名稱全部改成左中右
import LeftPanel from './LeftPanel';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

export default function Dashboard() {
  const [patients, setPatients] = useState([]); 
  const [error, setError] = useState(null);
  
  const [selectedPatient, setSelectedPatient] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:8000/api/patients')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPatients(data);
          setError(null);
        } else {
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
      {/* 1. 左側 */}
      <LeftPanel 
        totalCount={patients.length} 
        error={error} 
      />

      {/* 2. 中間 */}
      <MiddlePanel 
        patients={patients} 
        error={error} 
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
      />

      {/* 3. 右側 */}
      <RightPanel 
        patient={selectedPatient} 
      />
    </div>
  );
}