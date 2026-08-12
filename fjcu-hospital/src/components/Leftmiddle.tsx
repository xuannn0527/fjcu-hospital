import { useState } from 'react';

// 定義突發警示的資料型別
export interface ObservationAlert {
  id: string;
  patientId: string;        // 病患編號 (例如 P1014)
  medicalNumber: string;    // 病歷號 (例如 V20260811-0014)
  alertMessage: string;     // 警示內容
}

interface LeftmiddleProps {
  alerts: ObservationAlert[];
  onSelectPatient?: (patientId: string) => void;
}

export default function Leftmiddle({ alerts = [], onSelectPatient }: LeftmiddleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!alerts || alerts.length === 0) {
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

  const currentAlert = alerts[currentIndex] || alerts[0];
  const totalAlerts = alerts.length;

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
      {/* 標題列：左側紅點與標題，右側分頁按鈕 */}
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

        {/* 右上角切換上一頁 / 下一頁控制組 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '2px 8px', borderRadius: '20px', border: '1px solid #F3C6C6' }}>
          <button 
            onClick={handlePrev}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748B', padding: '2px 4px' }}
          >
            &#10094;
          </button>
          
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', minWidth: '40px', textAlign: 'center' }}>
            {currentIndex + 1} / {totalAlerts}
          </span>

          <button 
            onClick={handleNext}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748B', padding: '2px 4px' }}
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* 單筆病患突發資訊卡片 */}
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