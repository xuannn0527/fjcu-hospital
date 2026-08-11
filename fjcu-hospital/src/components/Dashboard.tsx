import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
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

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/patients')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          // 暫時為測試資料補上 status，直到後端 API 實作真實的狀態邏輯
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

  const filteredPatients = patients.filter(p => {
    const matchStatus = p.status === statusFilter;
    // ★ 核心修改：配合新資料表，將 triage_level 改為 final_level
    const matchLevel = selectedLevel ? Number(p.final_level) === selectedLevel : true;
    return matchStatus && matchLevel;
  });

  const patientsForStats = patients.filter(p => p.status === statusFilter);

  return (
    // 外層容器加上 position: 'relative'，作為遮罩的定位基準
    <div style={{ position: 'relative', height: '100vh', backgroundColor: '#F8FAFC', overflow: 'hidden' }}>
      
      {/* 原本的儀表板主畫面 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr',
        gap: '24px',
        padding: '24px',
        height: '100%',
        boxSizing: 'border-box',
        // 載入中時：降低透明度、加上一點點模糊效果、並禁止點擊
        opacity: isLoading ? 0.5 : 1,
        filter: isLoading ? 'blur(3px)' : 'none',
        pointerEvents: isLoading ? 'none' : 'auto',
        transition: 'all 0.4s ease-in-out' 
      }}>
        {/* 左側 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LeftPanel patients={patients} statusFilter={statusFilter} setStatusFilter={handleStatusChange} error={error} />
          <Leftcorner patients={patientsForStats} selectedLevel={selectedLevel} onSelectLevel={setSelectedLevel} />
        </div>

        {/* 中間 */}
        <MiddlePanel patients={filteredPatients} error={error} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} />

        {/* 右側 */}
        <RightPanel patient={selectedPatient} />
      </div>

      {/* 懸浮在正中央的半透明遮罩與心跳動畫 */}
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
          
          {/* 動態心跳外框 */}
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

          {/* 專業的進度提示文字 */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#1E293B', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              載入急診即時數據
            </p>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0, animation: 'fade-text 2s infinite' }}>
              正在連線至資料庫，請稍候...
            </p>
          </div>

          {/* 定義 CSS 動畫關鍵影格 */}
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