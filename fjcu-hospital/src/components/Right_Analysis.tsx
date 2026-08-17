import type { Patient } from './RightPanel';

interface RightAnalysisProps {
  patient: Patient;
  riskColor: string;
  xaiData: { name: string; impact: number }[];
}

export default function RightAnalysis({
  patient,
  riskColor,
  xaiData,
}: RightAnalysisProps) {
  const backgroundColor =
    patient.risk_score >= 80
      ? '#FEF2F2'
      : patient.risk_score >= 50
      ? '#FFFBEB'
      : '#ECFDF5';
  const borderColor =
    patient.risk_score >= 80
      ? '#FCA5A5'
      : patient.risk_score >= 50
      ? '#FDE68A'
      : '#A7F3D0';

  return (
    <>
      <div
        style={{
          backgroundColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          padding: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: riskColor,
            }}
          >
            XAI惡化風險預測值
          </span>
          <strong style={{ fontSize: '22px', color: riskColor }}>
            {patient.risk_score || 0}%
          </strong>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          {xaiData.map((item, idx) => (
            <div key={idx}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#334155',
                  marginBottom: '2px',
                }}
              >
                <span>• {item.name}</span>
                <span style={{ fontWeight: 'bold', color: riskColor }}>
                  +{item.impact}%
                </span>
              </div>
              <div
                style={{
                  height: '5px',
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.impact}%`,
                    height: '100%',
                    backgroundColor: riskColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <div style={{ marginBottom: '6px' }}>
          <strong style={{ fontSize: '12px', color: '#0369A1' }}>
            過去 3 小時相似案例 ({patient.similar_cases?.count ?? (patient.risk_score > 60 ? 4 : 12)} 例)
          </strong>
        </div>
        <p
          style={{
            fontSize: '12px',
            color: '#0C4A6E',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          {patient.similar_cases?.treatment_summary ||
            (patient.risk_score >= 80
              ? '85% 案例採高流量氧氣治療並優先排床入住 ICU/急救室，平均處置時間 12 分鐘。'
              : '90% 案例維持留觀追蹤，施以口服藥物控制後症狀緩解離院。')}
        </p>
      </div>
    </>
  );
}