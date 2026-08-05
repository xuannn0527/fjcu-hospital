import { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import Leftcorner from './Leftcorner'; 
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>('未處理');
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

  // ★ 關鍵修改：當切換狀態（未處理 / 觀察中）時，順便把左下角的檢傷級別選取清空 (null)
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setSelectedLevel(null); // 自動清除左下角的級別選取
  };

  // 雙重過濾邏輯
  const filteredPatients = patients.filter(p => {
    const matchStatus = p.status === statusFilter;
    const matchLevel = selectedLevel ? Number(p.triage_level) === selectedLevel : true;
    return matchStatus && matchLevel;
  });

  const patientsForStats = patients.filter(p => p.status === statusFilter);

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
      {/* 1. 左側 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LeftPanel 
          patients={patients} 
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange} // 帶入會自動清空級別的包裝函式
          error={error} 
        />
        <Leftcorner 
          patients={patientsForStats} 
          selectedLevel={selectedLevel} 
          onSelectLevel={setSelectedLevel} 
        />
      </div>

      {/* 2. 中間 */}
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