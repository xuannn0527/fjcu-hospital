import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import LeftPanel from './LeftPanel';
import Leftmiddle, { type ObservationAlert } from './Leftmiddle';
import Leftcorner from './Leftcorner'; 
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>('未處理');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/patients')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          const normalizedData = data.map(p => ({
            ...p,
            status: p.status || '未處理' 
          }));
          setPatients(normalizedData);
          setError(null);
        } else {
          setError(data.error || "無法讀取資料");
        }
      })
      .catch(err => {
        setError("無法連線到後端 API");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setSelectedLevel(null); 
  };

  const observationAlerts: ObservationAlert[] = patients
    .filter(p => p.status === '觀察中' && p.alert_message)
    .map(p => ({
      id: p.patient_id,
      patientId: p.patient_id,
      medicalNumber: p.medical_number || '無病歷號',
      alertMessage: p.alert_message
    }));

  const filteredPatients = patients.filter(p => {
    const matchStatus = p.status === statusFilter;
    const matchLevel = selectedLevel ? Number(p.final_level) === selectedLevel : true;
    return matchStatus && matchLevel;
  });

  const patientsForStats = patients.filter(p => p.status === statusFilter);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* 儀表板主畫面 */}
      <div style={{
        display: 'grid',
        /* 動態版面切換：點擊時左欄隱藏，中間縮為 380px，右欄 1fr 自動展寬 */
        gridTemplateColumns: selectedPatient ? '380px 1fr' : '1fr 2fr 1.5fr',
        gap: '24px',
        padding: '24px',
        boxSizing: 'border-box',
        opacity: isLoading ? 0.5 : 1,
        filter: isLoading ? 'blur(3px)' : 'none',
        pointerEvents: isLoading ? 'none' : 'auto',
        transition: 'grid-template-columns 0.3s ease-in-out, opacity 0.4s ease-in-out' 
      }}>
        
        {/* 左側欄位組合 - 只有未點選病患時顯示 */}
        {!selectedPatient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <LeftPanel 
              patients={patients} 
              statusFilter={statusFilter} 
              setStatusFilter={handleStatusChange} 
              error={error} 
              alertCount={observationAlerts.length} 
            />
            
            <Leftmiddle 
              alerts={observationAlerts} 
              onSelectPatient={(patientId) => {
                const found = patients.find(p => p.patient_id === patientId);
                if (found) setSelectedPatient(found);
              }} 
            />

            <Leftcorner 
              patients={patientsForStats} 
              selectedLevel={selectedLevel} 
              onSelectLevel={setSelectedLevel} 
            />
          </div>
        )}

        {/* 中間病患清單 */}
        <MiddlePanel 
          patients={filteredPatients} 
          error={error} 
          selectedPatient={selectedPatient} 
          onSelectPatient={setSelectedPatient} 
        />

        {/* 右側 AI 決策輔助 */}
        <RightPanel patient={selectedPatient} />
      </div>

      {/* 載入中遮罩與動畫 */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(248, 250, 252, 0.4)', 
          zIndex: 50, 
          gap: '24px'
        }}>
          <div style={{
            position: 'relative', width: '80px', height: '80px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'white', borderRadius: '50%',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)',
          }}>
            <div style={{
              position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
              backgroundColor: '#3B82F6', animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite', opacity: 0.2
            }} />
            <Activity color="#3B82F6" size={36} style={{ animation: 'pulse-icon 2s ease-in-out infinite' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#1E293B', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              載入急診即時數據
            </p>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0, animation: 'fade-text 2s infinite' }}>
              正在連線至資料庫，請稍候...
            </p>
          </div>

          <style>
            {`
              @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 0.6; }
                100% { transform: scale(2.2); opacity: 0; }
              }
              @keyframes pulse-icon {
                0% { transform: scale(1); }
                50% { transform: scale(1.15); }
                100% { transform: scale(1); }
              }
              @keyframes fade-text {
                0% { opacity: 0.4; }
                50% { opacity: 1; }
                100% { opacity: 0.4; }
              }
            `}
          </style>
        </div>
      )}
      
    </div>
  );
}