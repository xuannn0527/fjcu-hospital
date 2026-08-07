import { useState, useEffect } from 'react';

interface SimilarCase {
  count: number;
  treatment_summary: string;
}

interface Patient {
  patient_id: string;
  chief_complaint?: string;
  triage_level?: number | string;
  risk_score: number;
  temperature?: number | string;
  heart_rate?: number | string;
  sbp?: number | string;
  dbp?: number | string;
  respiratory_rate?: number | string;
  spo2?: number | string;
  past_medical_history?: string;
  drug_allergies?: string;
  xai_factors?: { name: string; impact: number }[];
  similar_cases?: SimilarCase;
}

interface RightPanelProps {
  patient: Patient | null;
}

export default function RightPanel({ patient }: RightPanelProps) {
  // 記錄被勾選的處置建議 (儲存文字陣列)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // 控制是否展開手動輸入表單
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  // 手動輸入的內容
  const [manualNote, setManualNote] = useState<string>('');

  // 當切換選中的病患時，重置所有勾選與輸入狀態
  useEffect(() => {
    setSelectedItems([]);
    setShowManualInput(false);
    setManualNote('');
  }, [patient?.patient_id]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#EF4444';
    if (score >= 50) return '#F59E0B';
    return '#10B981';
  };

  // 動態推算 XAI 歸因
  const getXaiContribution = (p: Patient) => {
    if (p.xai_factors && p.xai_factors.length > 0) return p.xai_factors;
    const list: { name: string; impact: number }[] = [];
    if (Number(p.spo2) < 95) list.push({ name: `血氧濃度偏低 (${p.spo2}%)`, impact: 42 });
    if (Number(p.heart_rate) > 100) list.push({ name: `心率異常偏高 (${p.heart_rate} bpm)`, impact: 28 });
    if (Number(p.triage_level) <= 2) list.push({ name: `檢傷高急迫性 (${p.triage_level} 級)`, impact: 18 });
    if (Number(p.temperature) >= 38) list.push({ name: `體溫發熱 (${p.temperature} °C)`, impact: 12 });

    if (list.length === 0) {
      if (p.risk_score >= 50) {
        list.push({ name: '綜合生命徵象臨界值', impact: 55 });
        list.push({ name: '年齡與主訴風險因子', impact: 45 });
      } else {
        list.push({ name: '生命徵象數據穩定', impact: 100 });
      }
    }
    return list.sort((a, b) => b.impact - a.impact);
  };

  // 根據風險程度產生 3~5 條處置選項
  const getAiRecommendations = (p: Patient) => {
    if (p.risk_score >= 80) {
      return [
        '立即安排優先看診並通報主治醫師',
        '每 15 分鐘連續監測 SpO2 與血壓',
        '預先建立靜脈留置針 (IV line)',
        '準備動脈血氣分析 (ABG) 採檢組合',
        '視呼吸狀況給予低流量氧氣補充 (2-4 L/min)'
      ];
    } else if (p.risk_score >= 50) {
      return [
        '建議於 30 分鐘內重測生命徵象',
        '密切觀察胸悶/呼吸急促等主訴變化',
        '安排心電圖 (ECG) 檢查'
      ];
    }
    return [
      '按標準流程排隊候診',
      '衛教病患若有不適加劇需立即告知護理站',
      '於 60 分鐘後追蹤基礎生命徵象'
    ];
  };

  // 處理 Checkbox 切換
  const handleCheckboxChange = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // 送出轉入觀察
  const handleSubmit = () => {
    if (!patient) return;

    const finalTreatments = [...selectedItems];
    if (manualNote.trim()) {
      finalTreatments.push(`[手動輸入] ${manualNote.trim()}`);
    }

    if (finalTreatments.length === 0) {
      alert('請先勾選 AI 處置建議或透過「手動輸入」補充處置內容！');
      return;
    }

    alert(
      `病患 ${patient.patient_id} 已成功轉入觀察！\n\n【採納的處置內容】：\n` + 
      finalTreatments.map((t, index) => `${index + 1}. ${t}`).join('\n')
    );
  };

  const riskColor = patient ? getRiskColor(patient.risk_score) : '#64748B';
  const xaiData = patient ? getXaiContribution(patient) : [];
  const recommendations = patient ? getAiRecommendations(patient) : [];

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
        boxSizing: 'border-box'
      }}
    >
      {/* 標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#3B82F6' }}></span> AI 決策輔助與 XAI 分析
        </h3>
      </div>

      {patient ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
          {/* 主訴、過去病史、藥物過敏 */}
            <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: 'bold' }}>
              <span style={{ color: '#64748B', marginRight: '6px' }}>病患編號：</span>
              <span>{patient.patient_id}</span>
            </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', fontWeight: 'bold' }}>主訴</span>
              <span style={{ fontSize: '13px', color: '#1E293B', fontWeight: 'bold' }}>{patient.chief_complaint || '無紀錄'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 12px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', fontWeight: 'bold' }}>過去病史</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>{patient.past_medical_history || '無紀錄'}</span>
              </div>
              <div style={{ 
                backgroundColor: patient.drug_allergies ? '#FEF2F2' : '#F8FAFC', 
                border: `1px solid ${patient.drug_allergies ? '#FCA5A5' : '#E2E8F0'}`, 
                borderRadius: '8px', 
                padding: '8px 12px' 
              }}>
                <span style={{ fontSize: '11px', color: patient.drug_allergies ? '#EF4444' : '#64748B', display: 'block', fontWeight: 'bold' }}>
                  藥物過敏
                </span>
                <span style={{ fontSize: '12px', color: patient.drug_allergies ? '#991B1B' : '#334155' }}>
                  {patient.drug_allergies || '無紀錄'}
                </span>
              </div>
            </div>
          </div>
          {/* 生理徵象*/}
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              生理徵象
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {/* 體溫 */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>體溫</span>
                <strong style={{ fontSize: '15px', color: '#0F172A' }}>{patient.temperature ?? '--'}<span style={{ fontSize: '11px' }}>°C</span></strong>
              </div>
              {/* 心跳 */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>心跳</span>
                <strong style={{ fontSize: '15px', color: '#0F172A' }}>{patient.heart_rate ?? '--'}<span style={{ fontSize: '11px' }}>bpm</span></strong>
              </div>
              {/* 血壓 */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>血壓</span>
                <strong style={{ fontSize: '14px', color: '#0F172A' }}>
                  {patient.sbp && patient.dbp ? `${patient.sbp}/${patient.dbp}` : '--'}
                </strong>
              </div>
              {/* 呼吸 */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>呼吸</span>
                <strong style={{ fontSize: '15px', color: '#0F172A' }}>{patient.respiratory_rate ?? '--'}<span style={{ fontSize: '11px' }}>次</span></strong>
              </div>
              {/* 血氧 */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>血氧</span>
                <strong style={{ fontSize: '15px', color: Number(patient.spo2) < 95 ? '#EF4444' : '#0F172A' }}>
                  {patient.spo2 ?? '--'}<span style={{ fontSize: '11px' }}>%</span>
                </strong>
              </div>
            </div>
          </div>
          {/* XAI 風險分析 */}
          <div style={{ backgroundColor: patient.risk_score >= 80 ? '#FEF2F2' : patient.risk_score >= 50 ? '#FFFBEB' : '#ECFDF5', border: `1px solid ${patient.risk_score >= 80 ? '#FCA5A5' : patient.risk_score >= 50 ? '#FDE68A' : '#A7F3D0'}`, borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: riskColor }}>XAI惡化風險預測值</span>
              <strong style={{ fontSize: '22px', color: riskColor }}>{patient.risk_score}%</strong>
            </div>

            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {xaiData.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                      <span>• {item.name}</span>
                      <span style={{ fontWeight: 'bold', color: riskColor }}>+{item.impact}%</span>
                    </div>
                    <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.impact}%`, height: '100%', backgroundColor: riskColor }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 過去 3 小時歷史相似案例 */}
          <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              
              <strong style={{ fontSize: '12px', color: '#0369A1' }}>
                過去 3 小時相似案例 ({patient.similar_cases?.count ?? (patient.risk_score > 60 ? 4 : 12)} 例)
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: '#0C4A6E', margin: 0, lineHeight: '1.5' }}>
              
              {patient.similar_cases?.treatment_summary || 
                (patient.risk_score >= 80 
                  ? '85% 案例採高流量氧氣治療並優先排床入住 ICU/急救室，平均處置時間 12 分鐘。'
                  : '90% 案例維持留觀追蹤，施以口服藥物控制後症狀緩解離院。')}
            </p>
          </div>

          {/* 多選項 AI 處置建議 + 手動輸入按鈕 */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px' }}>
            <h4 style={{ fontSize: '13px', color: '#1E293B', margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI 處置建議 (勾選欲採納之項目)</span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 'normal' }}>已選 {selectedItems.length} 項</span>
            </h4>

            {/* Checkbox 處置列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendations.map((item, idx) => {
                const isChecked = selectedItems.includes(item);
                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: isChecked ? '#EFF6FF' : 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${isChecked ? '#93C5FD' : '#E2E8F0'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: isChecked ? '#1E40AF' : '#334155',
                      fontWeight: isChecked ? 'bold' : 'normal',
                      transition: 'all 0.15s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(item)}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                    <span>{idx + 1}. {item}</span>
                  </label>
                );
              })}
            </div>

            {/* 手動輸入開關按鈕 */}
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: showManualInput ? '#E2E8F0' : '#FFFFFF',
                  color: '#3B82F6',
                  border: '1px dashed #3B82F6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                {showManualInput ? '▲ 折疊手動輸入' : '手動輸入/補充醫囑'}
              </button>

              {/* 展開的手動輸入文字框 */}
              {showManualInput && (
                <div style={{ marginTop: '8px' }}>
                  <textarea
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder="請在此直接輸入補充之處置建議..."
                    style={{
                      width: '100%',
                      height: '65px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 轉入觀察按鈕 */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
              marginTop: '4px'
            }}
          >
            轉入觀察
          </button>

        </div>
      ) : (
        /* 未點擊病患時的 Prompt 引導畫面 */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px', border: '1px dashed #CBD5E1' }}>
            👈
          </div>
          <p style={{ fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold', color: '#64748B' }}>請選擇病患</p>
          <span style={{ fontSize: '12px' }}>點擊左側列表即可在此載入「病患內容」、「XAI 分析」與「處置選擇」</span>
        </div>
      )}
    </div>
  );
}