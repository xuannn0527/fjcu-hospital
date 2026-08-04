export default function MiddlePanel({ patients, error, selectedPatient, onSelectPatient }: any) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
      <h3>即時風險分流</h3>
      
      <div style={{ marginTop: '16px' }}>
        {Array.isArray(patients) && patients.length > 0 ? (
          patients.map((patient: any) => {
            const isSelected = selectedPatient?.patient_id === patient.patient_id;

            return (
              <div 
                key={patient.patient_id} 
                onClick={() => onSelectPatient(patient)}
                style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                  transition: 'background-color 0.2s'
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong style={{ fontSize: '16px', color: '#1E293B' }}>{patient.patient_id}</strong>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>{patient.chief_complaint}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{patient.arrival_time}</span>
                  
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

                  <strong style={{ color: patient.risk_score >= 80 ? '#EF4444' : '#F59E0B', width: '40px', textAlign: 'right' }}>
                    {patient.risk_score}%
                  </strong>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: '#94A3B8' }}>{error ? "請檢查資料庫設定" : "目前暫無病患資料"}</p>
        )}
      </div>
    </div>
  );
}