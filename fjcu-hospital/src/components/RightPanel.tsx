import { useEffect, useState } from 'react';
import RightAdvice from './Right_Advice';
import RightAnalysis from './Right_Analysis';
import RightBasicInfo from './Right_BasicInfo';

export interface SimilarCase {
  count: number;
  treatment_summary: string;
}

export interface Patient {
  patient_id: string;
  name?: string;
  triage_id?: string;
  medical_number?: string;
  gender?: string;
  birth_date?: string;
  sentiment?: string;
  past_medical_history_y?: string;
  do_not_treat?: string;
  final_level?: number | string;
  risk_score: number;
  temperature?: number | string;
  heart_rate?: number | string;
  spo2?: number | string;
  respiratory_rate?: number | string;
  weight?: number | string;
  blood_pressure_sys?: number | string;
  blood_pressure_dia?: number | string;
  blood_sugar?: number | string;
  gcs_eye?: number;
  gcs_verbal?: number;
  gcs_motor?: number;
  past_medical_history?: string;
  pain_score?: number;
  drug_allergy?: string;
  allergy?: string;
  xai_factors?: { name: string; impact: number }[];
  similar_cases?: SimilarCase;
}

interface RightPanelProps {
  patient: Patient | null;
}

const getRiskColor = (score: number) =>
  score >= 80 ? '#EF4444' : score >= 50 ? '#F59E0B' : '#10B981';

const getXaiContribution = (patient: Patient) => {
  if (patient.xai_factors?.length) return patient.xai_factors;
  const factors: { name: string; impact: number }[] = [];
  if (Number(patient.spo2) < 95)
    factors.push({ name: `血氧濃度偏低 (${patient.spo2}%)`, impact: 42 });
  if (Number(patient.heart_rate) > 100)
    factors.push({ name: `心率異常偏高 (${patient.heart_rate} bpm)`, impact: 28 });
  if (Number(patient.final_level) <= 2)
    factors.push({ name: `檢傷高急迫性 (${patient.final_level} 級)`, impact: 18 });
  if (Number(patient.temperature) >= 38)
    factors.push({ name: `體溫發熱 (${patient.temperature} °C)`, impact: 12 });
  if (!factors.length)
    factors.push(
      ...(patient.risk_score >= 50
        ? [
            { name: '綜合生命徵象臨界值', impact: 55 },
            { name: '年齡與主訴風險因子', impact: 45 },
          ]
        : [{ name: '生命徵象數據穩定', impact: 100 }])
    );
  return factors.sort((a, b) => b.impact - a.impact);
};

const getAiRecommendations = (patient: Patient) =>
  patient.risk_score >= 80
    ? [
        '立即安排優先看診並通報主治醫師',
        '每 15 分鐘連續監測 SpO2 與血壓',
        '預先建立靜脈留置針 (IV line)',
        '準備動脈血氣分析 (ABG) 採檢組合',
        '視呼吸狀況給予低流量氧氣補充 (2-4 L/min)',
      ]
    : patient.risk_score >= 50
    ? [
        '建議於 30 分鐘內重測生命徵象',
        '密切觀察胸悶/呼吸急促等主訴變化',
        '安排心電圖 (ECG) 檢查',
      ]
    : [
        '按標準流程排隊候診',
        '衛教病患若有不適加劇需立即告知護理站',
        '於 60 分鐘後追蹤基礎生命徵象',
      ];

export default function RightPanel({ patient }: RightPanelProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualNote, setManualNote] = useState('');

  useEffect(() => {
    setSelectedItems([]);
    setShowManualInput(false);
    setManualNote('');
  }, [patient?.patient_id]);

  const handleSubmit = () => {
    if (!patient) return;
    const treatments = [
      ...selectedItems,
      ...(manualNote.trim() ? [`[手動輸入] ${manualNote.trim()}`] : []),
    ];
    if (!treatments.length) {
      alert('請先勾選 AI 處置建議或透過「手動輸入」補充處置內容！');
      return;
    }
    alert(
      `病患 ${patient.patient_id} 已成功轉入觀察！\n\n【採納的處置內容】：\n${treatments
        .map((item, index) => `${index + 1}. ${item}`)
        .join('\n')}`
    );
  };

  const header = [
    ['患者 ID', patient?.patient_id ?? '--'],
    ['姓名', patient?.name || (patient ? '未提供姓名' : '--')],
    ['就診序號', patient?.triage_id ?? (patient ? '無序號' : '--')],
  ];

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          marginBottom: '14px',
          paddingBottom: '12px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {header.map(([label, value]) => (
          <div key={label}>
            <span
              style={{
                fontSize: '11px',
                color: '#64748B',
                display: 'block',
                marginBottom: '3px',
              }}
            >
              {label}
            </span>
            <strong style={{ fontSize: '14px', color: '#1E293B' }}>
              {value}
            </strong>
          </div>
        ))}
      </div>

      {patient ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            paddingRight: '2px',
          }}
        >
          <RightBasicInfo patient={patient} />
          <RightAnalysis
            patient={patient}
            riskColor={getRiskColor(patient.risk_score)}
            xaiData={getXaiContribution(patient)}
          />
          <RightAdvice
            recommendations={getAiRecommendations(patient)}
            selectedItems={selectedItems}
            showManualInput={showManualInput}
            manualNote={manualNote}
            onCheckboxChange={(item) =>
              setSelectedItems((items) =>
                items.includes(item)
                  ? items.filter((value) => value !== item)
                  : [...items, item]
              )
            }
            onToggleManualInput={() => setShowManualInput((value) => !value)}
            onManualNoteChange={setManualNote}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#94A3B8',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '12px',
              border: '1px dashed #CBD5E1',
            }}
          >
            👈
          </div>
          <p
            style={{
              fontSize: '14px',
              margin: '0 0 4px 0',
              fontWeight: 'bold',
              color: '#64748B',
            }}
          >
            請選擇病患
          </p>
          <span style={{ fontSize: '12px' }}>
            點擊左側列表即可在此載入「病患內容」、「XAI 分析」與「處置選擇」
          </span>
        </div>
      )}
    </div>
  );
}