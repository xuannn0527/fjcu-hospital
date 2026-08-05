import { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import Leftcorner from './Leftcorner'; // 1. 引入左下角長條圖統計元件
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  // 2. 新增狀態：記錄目前點擊了哪一個檢傷級別 (1~5)，null 代表顯示全部
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

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

  // 3. 根據是否有選擇檢傷級別，來過濾中間要顯示的病患清單
  const filteredPatients = selectedLevel 
    ? patients.filter(p => Number(p.triage_level) === selectedLevel)
    : patients;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1.5fr',
      gap: '24px',
      padding: '24px',
      height: '100vh',
      backgroundColor: '#F8FAFC',
      boxSizing: 'border-box'
    }}>
      {/* 1. 左側：包含上方總人數概況與下方長條圖統計 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LeftPanel 
          totalCount={patients.length} 
          error={error} 
        />
        <Leftcorner 
          patients={patients} 
          selectedLevel={selectedLevel} 
          onSelectLevel={setSelectedLevel} 
        />
      </div>

      {/* 2. 中間：傳入被過濾後的清單 */}
      <MiddlePanel 
        patients={filteredPatients} 
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
