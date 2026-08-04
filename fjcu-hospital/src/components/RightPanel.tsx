export default function RightPanel({ patient }: any) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3>AI 決策輔助</h3>
      
      {patient ? (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontWeight: 'bold', color: '#3B82F6' }}>
            分析中：{patient.patient_id} ({patient.chief_complaint})
          </p>
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: '#334155' }}>
              體溫：{patient.temperature} °C <br/>
              心跳：{patient.heart_rate} bpm <br/>
              血氧：{patient.spo2} %
            </p>
            <hr style={{ borderTop: '1px solid #E2E8F0', margin: '12px 0' }} />
            <p style={{ fontSize: '14px', color: '#EF4444', fontWeight: 'bold' }}>
              ⚠️ AI 建議：此病患惡化風險達 {patient.risk_score}%，請優先關注其生命徵象變化。
            </p>
          </div>
        </div>
      ) : (
        <p style={{ color: '#64748B', marginTop: '16px' }}>
          請點擊左側病患清單以分析風險成因...
        </p>
      )}
    </div>
  );
}