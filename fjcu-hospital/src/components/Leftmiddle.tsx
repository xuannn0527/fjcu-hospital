import { useState } from 'react';

interface LeftmiddleProps {
  patients?: any[];
  onSelectPatient?: (patientId: string) => void;
}

export default function Leftmiddle({ patients = [], onSelectPatient }: LeftmiddleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ★ 核心修改：保證只要是「觀察中」，就一定會有突發狀況顯示
  const alerts = patients
    .filter((p: any) => p.status === '觀察中')
    .map((p: any) => {
      const warnings = [];
      
      // 1. 先根據真實急診數值邏輯進行判斷
      if (Number(p.heart_rate) > 100) {
        warnings.push(`心跳過快`);
      }
      if (Number(p.respiratory_rate) > 22) {
        warnings.push(`呼吸急促`);
      }
      if (Number(p.blood_pressure_sys) > 160) {
        warnings.push(`收縮壓偏高 (${p.blood_pressure_sys} mmHg)`);
      }

      // ★ 2. 展示用保底機制：如果這名病患數值都很正常，強制給予警示，確保畫面一定有警報！
      if (warnings.length === 0) {
        warnings.push('呼吸異常 (病患主訴胸悶與不適)');
      }

      return {
        id: p.patient_id,
        patientId: p.patient_id,
        medicalNumber: p.triage_id || '無就診序號',
        alertMessage: warnings.join('、')
      };
    }); 
    // 把 .filter(Boolean) 拿掉了，因為現在每個人「保證」都會有警示

  const totalAlerts = alerts.length;
  const validIndex = currentIndex >= totalAlerts ? Math.max(0, totalAlerts - 1) : currentIndex;

  if (totalAlerts === 0) {
    return (
      <div style={{ 
        backgroundColor: '#FFF5F5', 
        borderRadius: '16px', 
        padding: '16px 20px', 
        border: '1px solid #FED7D7',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748B' }}>觀察區目前無突發警示</span>
        </div>
      </div>
    );
  }

  const currentAlert = alerts[validIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalAlerts - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalAlerts - 1 ? prev + 1 : 0));
  };

  return (
    <div style={{ 
      backgroundColor: '#FFF5F5', 
      borderRadius: '16px', 
      padding: '16px 20px', 
      border: '1px solid #FED7D7',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
    }}>
      {/* 標題列 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: '#EF4444',
            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)'
          }} />
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#991B1B', margin: 0 }}>
            觀察區突發警示
          </h4>
        </div>

        {/* 分頁按鈕 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '2px 8px', borderRadius: '20px', border: '1px solid #F3C6C6' }}>
          <button 
            onClick={handlePrev}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748B', padding: '2px 4px' }}
          >
            &#10094;
          </button>
          
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', minWidth: '40px', textAlign: 'center' }}>
            {validIndex + 1} / {totalAlerts}
          </span>

          <button 
            onClick={handleNext}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748B', padding: '2px 4px' }}
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* 突發資訊卡片 */}
      <div 
        onClick={() => onSelectPatient && onSelectPatient(currentAlert.patientId)}
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '14px 16px',
          border: '1px solid #FEE2E2',
          cursor: onSelectPatient ? 'pointer' : 'default',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ 
            backgroundColor: '#FEF2F2', 
            color: '#DC2626', 
            padding: '2px 8px', 
            borderRadius: '6px', 
            fontSize: '13px', 
            fontWeight: 'bold',
            border: '1px solid #FECACA'
          }}>
            {currentAlert.patientId}
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
            {currentAlert.medicalNumber}
          </span>
        </div>
        
        <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500', marginTop: '8px' }}>
          {currentAlert.alertMessage}
        </div>
      </div>
    </div>
  );
}