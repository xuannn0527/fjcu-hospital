import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bot, 
  BrainCircuit, 
  BookOpen, 
  ChevronRight, 
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function IntoConsult() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<any>(null);

  // Modal 與 Toast 狀態管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 處置項目的勾選狀態
  const [selectedTreatments, setSelectedTreatments] = useState<Record<string, boolean>>({
    "安排 12 導程心電圖 (ECG)": true,
    "抽血檢驗心肌酵素 (Troponin)": true,
    "氧氣鼻導管, 開立 Aspirin": false,
    "聯絡照會心臟內科 (CV) 評估": false,
  });

  const handleCheckboxChange = (treatmentName: string) => {
    setSelectedTreatments(prev => ({
      ...prev,
      [treatmentName]: !prev[treatmentName]
    }));
  };

  // 從後端 API 獲取真實資料庫數據
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/predictions')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any, index: number) => {
          const generatedId = p.medicalRecordNo || `00${8877665 + index}J`;
          return String(p.prediction_id) === id || generatedId === id;
        });

        if (found) {
          let disposition = '急診留觀 / 出院';
          try {
            const distObj = typeof found.admit_distribution === 'string' 
              ? JSON.parse(found.admit_distribution) 
              : found.admit_distribution;
            
            if (distObj['ICU']) {
              disposition = 'ICU 病房';
            } else if (distObj['Ward']) {
              disposition = '一般病房';
            }
          } catch (e) {
            console.error("解析動向失敗", e);
          }

          setPatient({
            id: found.medicalRecordNo || `00${8877665 + data.indexOf(found)}J`,
            name: found.patient_name,
            gender: found.gender,
            age: found.age,
            level: found.triage_degree,
            summary: found.complaint || '無特殊主訴紀錄',
            ai_risk_score: found.serious_risk_pct,
            ai_disposition: disposition,
            ensemble_votes: { 
              RF: true, 
              XGB: true, 
              KNN: found.serious_risk_pct > 40 
            },
            xai_factors: [
              { name: "主訴特徵: 胸痛延伸左臂、冒冷汗", impact: 35, type: 'pos' },
              { name: `血氧偏低 (SpO2=${found.spo2 || 91})`, impact: 15, type: 'pos' },
              { name: "生命徵象波動與心跳異常", impact: 12, type: 'pos' }
            ],
            references: [
              { title: "1. 急性心肌梗塞初期指引", desc: "胸痛, 冒冷汗...", score: "0.94", page: "P.12" },
              { title: "2. 不穩定型心絞痛流程", desc: "胸痛, 延伸左臂...", score: "0.82", page: "P.18" }
            ]
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('讀取病患詳細資料失敗:', err);
        setLoading(false);
      });
  }, [id]);

  const promptFeedback = (reason: string) => {
    setPendingFeedback(reason);
    setIsModalOpen(true);
  };

  const confirmSubmitFeedback = () => {
    if (pendingFeedback === '同意並採納 AI 預測與處置建議') {
      const checkedItems = Object.entries(selectedTreatments)
        .filter(([_, isChecked]) => isChecked)
        .map(([name]) => name);

      console.log('【儲存資料】病患 ID:', patient.id);
      console.log('【儲存資料】採納原因:', pendingFeedback);
      console.log('【儲存資料】已勾選之處置項目:', checkedItems);
    }

    setIsModalOpen(false);
    setToastMessage('已成功送出並儲存勾選的處置項目！');
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>載入診間資料中...</div>;
  }

  if (!patient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#F8FAFC' }}>
        <div style={{ fontSize: '18px', color: '#EF4444', marginBottom: '16px', fontWeight: 'bold' }}>找不到該名病患資料 (ID: {id})</div>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>返回候診名單</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* ==================== 頂部導覽列與病患資訊 ==================== */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, zIndex: 10 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}
            title="返回名單"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ height: '24px', width: '1px', backgroundColor: '#CBD5E1' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: 0 }}>{patient.name}</h1>
            <span style={{ fontSize: '14px', color: '#64748B' }}>{patient.gender}, {patient.age}歲</span>
            <span style={{ fontSize: '14px', color: '#CBD5E1' }}>|</span>
            <span style={{ fontSize: '14px', color: '#94A3B8', fontFamily: 'monospace' }}>{patient.id}</span>
            <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #E2E8F0' }}>
              檢傷 {patient.level} 級
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '6px 12px', borderRadius: '8px', color: '#166534', fontSize: '13px', fontWeight: 'bold' }}>
          <Bot size={16} className="text-emerald-500" />
          <span>模型狀態: 正常</span>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%', marginLeft: '4px', boxShadow: '0 0 0 2px #BBF7D0' }}></div>
        </div>
      </div>

      {/* ==================== 主要內容區塊 ==================== */}
      <div style={{ padding: '24px 32px', flex: 1, overflow: 'auto', display: 'flex', gap: '24px' }}>
        
        {/* 左側：AI 惡化預測與 XAI 核心依據 */}
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
          
          <div style={{ backgroundColor: '#1E1B4B', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '15px' }}>
                <Bot size={18} color="#A5B4FC" /> AI 惡化預測 
                <span style={{ fontSize: '12px', color: '#818CF8', fontWeight: 'normal' }}>(多數決 Ensemble)</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ backgroundColor: '#E11D48', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>RF:惡化</span>
                <span style={{ backgroundColor: '#E11D48', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>XGB:惡化</span>
                <span style={{ backgroundColor: '#334155', color: '#94A3B8', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>KNN:安全</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#A5B4FC', marginBottom: '6px' }}>3小時內嚴重惡化機率</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: 'white', lineHeight: '1', marginBottom: '8px' }}>
                  {patient.ai_risk_score} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#312E81', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(patient.ai_risk_score, 100)}%`, height: '100%', backgroundColor: '#EF4444', borderRadius: '3px', transition: 'width 1s ease' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: '#A5B4FC', marginBottom: '6px' }}>系統預測病患轉歸動向</div>
                <div style={{ backgroundColor: '#4338CA', borderRadius: '8px', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', border: '1px solid #4F46E5', color: '#FFF' }}>
                  {patient.ai_disposition}
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FEFCE8', borderRadius: '12px', padding: '20px', border: '1px solid #FEF08A', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '15px', color: '#854D0E' }}>
                <BrainCircuit size={18} color="#CA8A04" /> AI 判斷核心依據 (XAI)
              </div>
              <span style={{ backgroundColor: '#FEF08A', color: '#A16207', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                特徵貢獻度
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {patient.xai_factors.map((factor: any, index: number) => {
                const isPos = factor.type === 'pos';
                const barColor = isPos ? '#F43F5E' : '#10B981';
                const textColor = isPos ? '#BE123C' : '#047857';
                const bgColor = isPos ? '#FFF1F2' : '#ECFDF5';
                const borderColor = isPos ? '#FECDD3' : '#A7F3D0';
                const sign = isPos ? '+' : '';
                const width = Math.min(Math.abs(factor.impact) * 2.5, 100);

                return (
                  <div key={index} style={{ 
                    display: 'flex', flexDirection: 'column', padding: '12px 14px', borderRadius: '10px', 
                    border: `2px solid ${borderColor}`, backgroundColor: bgColor, 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '14px' }}>{factor.name}</span>
                      <span style={{ color: textColor, fontWeight: '900', fontFamily: 'monospace', fontSize: '16px' }}>{sign}{factor.impact}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', height: '10px', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(226,232,240,0.5)' }}>
                      <div style={{ backgroundColor: barColor, height: '100%', borderRadius: '999px', width: `${width}%`, transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* 右側：TF-IDF 知識庫比對與回饋收集 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '16px', color: '#1E293B' }}>
                <BookOpen size={20} color="#4F46E5" /> TF-IDF 知識庫比對處置建議
              </div>
            </div>
            
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', marginTop: 0 }}>
              依據護理主訴文字萃取特徵，比對 Clinical Guidelines PDF，系統已自動勾選指引中萃取標準處置步驟。
            </p>

            {/* ★ 處置項目改為一行一個，且字體放大至 16px */}
            <div style={{ borderLeft: '4px solid #4F46E5', backgroundColor: '#F8FAFC', borderRadius: '0 8px 8px 0', padding: '18px 20px', borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 建議標準處置 (依據: 急性心肌梗塞初期指引)
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Object.keys(selectedTreatments).map((name) => (
                  <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#1E293B' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTreatments[name]} 
                      onChange={() => handleCheckboxChange(name)}
                      style={{ width: '18px', height: '18px', accentColor: '#4F46E5', cursor: 'pointer' }} 
                    /> 
                    {name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <FileText size={14} /> 參考文獻比對來源 (PDF)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {patient.references.map((ref: any, idx: number) => (
                  <div key={idx} style={{ padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '2px' }}>{ref.title}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{ref.desc}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '40px' }}>
                      <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '13px' }}>{ref.score}</span>
                      <span style={{ color: '#94A3B8', fontSize: '10px' }}>{ref.page}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '900', fontSize: '15px', color: '#0F172A' }}>是否採納 AI 建議原因 (回饋收集)</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => promptFeedback('同意並採納 AI 預測與處置建議')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 18px', backgroundColor: '#EEF2FF', border: '1px solid #E0E7FF', borderRadius: '8px', color: '#4F46E5', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                <span>1. 同意並採納 AI 預測與處置建議</span><ChevronRight size={18} color="#818CF8" />
              </button>
              <button onClick={() => promptFeedback('病人狀況穩定，暫不處理')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                <span>2. 病人狀況穩定，暫不處理</span><ChevronRight size={18} color="#94A3B8" />
              </button>
              <button onClick={() => promptFeedback('處置建議不適當')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 18px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#DC2626', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                <span>3. 處置建議不適當</span><ChevronRight size={18} color="#FCA5A5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== 確認彈出視窗 (Feedback Modal) ==================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#F59E0B' }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0F172A' }}>確認提交回饋</h3>
            </div>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>
              您選擇了 <strong style={{ color: '#0F172A' }}>"{pendingFeedback}"</strong>。<br/>
              提交後將納入模型再訓練參考，是否確認送出？
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                取消
              </button>
              <button onClick={confirmSubmitFeedback} style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
                確認送出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 成功提示 (Toast) ==================== */}
      <div style={{ 
        position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1E293B', color: 'white', 
        padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex', alignItems: 'center', gap: '8px', zIndex: 100, fontSize: '14px', fontWeight: '500',
        transform: toastMessage ? 'translateY(0)' : 'translateY(100px)',
        opacity: toastMessage ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <CheckCircle2 size={20} color="#34D399" />
        {toastMessage}
      </div>

    </div>
  );
}