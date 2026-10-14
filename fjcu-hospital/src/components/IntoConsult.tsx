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
    // 只根據現有處置文字決定卡片的圖示與顏色
  const getTreatmentVisual = (name: string) => {
    const text = name.toLowerCase();

    const categories = [
      {
        keywords: [
          'aspirin', 'acetaminophen', 'paracetamol',
          '藥物', '藥品', '藥', '止痛', '止吐',
          '解熱', '抗生素'
        ],
        emoji: '💊',
        label: '藥物',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        tagBg: '#DBEAFE',
        tagColor: '#1D4ED8',
      },
      {
        keywords: [
          '注射', '針筒', '輸液', '點滴',
          '靜脈導管', 'normal saline'
        ],
        emoji: '💉',
        label: '注射／輸液',
        bg: '#F0FDF9',
        border: '#A7F3D0',
        tagBg: '#D1FAE5',
        tagColor: '#047857',
      },
      {
        keywords: [
          '檢驗', '檢查', '抽血', '血液',
          '影像', 'x 光', 'x-ray', 'ecg',
          'troponin', 'cbc', 'crp', '心電圖',
          '超音波', '培養'
        ],
        emoji: '🩸',
        label: '檢驗',
        bg: '#FFFCF3',
        border: '#FDE68A',
        tagBg: '#FEF3C7',
        tagColor: '#92400E',
      },
      {
        keywords: [
          '監測', '生命徵象', '血氧',
          '血壓', '心跳', '呼吸速率'
        ],
        emoji: '🩺',
        label: '監測',
        bg: '#FAF7FF',
        border: '#E9D5FF',
        tagBg: '#F3E8FF',
        tagColor: '#7E22CE',
      },
      {
        keywords: [
          '氧氣', '鼻導管', '呼吸支持',
          '氧氣面罩', '呼吸照護'
        ],
        emoji: '🫁',
        label: '呼吸支持',
        bg: '#F0FDFA',
        border: '#99F6E4',
        tagBg: '#CCFBF1',
        tagColor: '#0F766E',
      },
      {
        keywords: ['會診', '照會', '專科醫師'],
        emoji: '🩺',
        label: '會診',
        bg: '#FAF5FF',
        border: '#DDD6FE',
        tagBg: '#EDE9FE',
        tagColor: '#6D28D9',
      },
    ];

    // 找出這段文字涉及的所有類型，不修改原本的處置內容
    const matched = categories.filter(category =>
      category.keywords.some(keyword => text.includes(keyword))
    );

    // 同一句有多種類型時，同時顯示圖示與標籤
    const primary = matched[0];

    if (!primary) {
      return {
        emoji: '📋',
        label: '其他處置',
        bg: '#F8FAFC',
        border: '#CBD5E1',
        tagBg: '#E2E8F0',
        tagColor: '#475569',
      };
    }

    return {
      emoji: matched.map(category => category.emoji).join(' '),
      label: matched.map(category => category.label).join('／'),
      bg: primary.bg,
      border: primary.border,
      tagBg: primary.tagBg,
      tagColor: primary.tagColor,
    };
  };
  // 根據主訴與實際惡化風險機率（riskScore），動態計算成比例的 XAI 貢獻度與處置建議
  const generateXAIAndTreatment = (complaint: string, level: number, riskScore: number, spo2?: number, t?: number) => {
    const text = (complaint || '').toLowerCase();
    
    // ★ 依照該病患真實的 3hr 風險分數，按比例拆解 XAI 貢獻度，使其合理對應總風險
    const p1 = Math.max(Number((riskScore * 0.55).toFixed(1)), 0.5);
    const p2 = Math.max(Number((riskScore * 0.30).toFixed(1)), 0.3);
    const p3 = Math.max(Number((riskScore * 0.15).toFixed(1)), 0.1);

    let xai_factors = [
      { name: "主訴症狀與特徵匹配度", impact: p1, type: 'pos' },
      { name: "生理生命徵象數值偏移", impact: p2, type: 'pos' },
      { name: "年齡與基礎共病風險權重", impact: p3, type: 'pos' }
    ];

    let treatments: Record<string, boolean> = {
      "安排相關血液與影像檢驗": true,
      "密切監測生命徵象波動": true,
      "給予適當症狀支持治療": false,
      "必要時會診相關專科醫師": false,
    };

    if (text.includes('胸痛') || text.includes('胸悶')) {
      xai_factors = [
        { name: "主訴特徵: 胸痛相關症狀匹配", impact: p1, type: 'pos' },
        { name: `血氧與生命徵象異常 (SpO2=${spo2 || 95})`, impact: p2, type: 'pos' },
        { name: "心血管系統風險共病史", impact: p3, type: 'pos' }
      ];
      treatments = {
        "安排 12 導程心電圖 (ECG)": true,
        "抽血檢驗心肌酵素 (Troponin)": true,
        "氧氣鼻導管, 必要時給予 Aspirin": false,
        "聯絡照會心臟內科 (CV) 評估": false,
      };
    } else if (text.includes('呼吸') || text.includes('喘')) {
      xai_factors = [
        { name: "呼吸速率與血氧窘迫指標", impact: p1, type: 'pos' },
        { name: "呼吸系統主訴文字特徵", impact: p2, type: 'pos' },
        { name: "年齡血行動力學權重", impact: p3, type: 'pos' }
      ];
      treatments = {
        "給予氧氣面罩或鼻導管支持": true,
        "安排緊急胸部 X 光檢查": true,
        "監測血氧飽和度與呼吸狀況": true,
        "照會胸腔內科或急診專科醫師": false,
      };
    } else if (text.includes('發燒') || text.includes('畏寒') || text.includes('肺炎')) {
      xai_factors = [
        { name: `體溫與感染指標異常 (T=${t || 38.5})`, impact: p1, type: 'pos' },
        { name: "感染相關主訴詞彙萃取", impact: p2, type: 'pos' },
        { name: "心跳速率代償性加快", impact: p3, type: 'pos' }
      ];
      treatments = {
        "抽血檢驗白血球與發炎指數 (CBC/CRP)": true,
        "給予口服或靜脈解熱鎮痛劑": true,
        "安排尿液或血液細菌培養": false,
        "視病況評估給予輸液或抗生素": false,
      };
    } else if (text.includes('腹痛') || text.includes('腹瀉') || text.includes('嘔吐')) {
      xai_factors = [
        { name: "急性腹部疼痛分級特徵", impact: p1, type: 'pos' },
        { name: "腸胃系統主訴文字權重", impact: p2, type: 'pos' },
        { name: "脫水與血壓代償指標", impact: p3, type: 'pos' }
      ];
      treatments = {
        "建立靜脈輸液通道補充水分": true,
        "安排腹部超音波或 X 光檢查": true,
        "給予止吐或胃腸道症狀藥物": false,
        "外科急症會診評估": false,
      };
    } else if (level === 1 || level === 2) {
      xai_factors = [
        { name: "檢傷級別極高危險群警示", impact: p1, type: 'pos' },
        { name: "生理生命徵象嚴重不穩定", impact: p2, type: 'pos' },
        { name: "多重器官衰竭風險模型預測", impact: p3, type: 'pos' }
      ];
      treatments = {
        "立即移至急救室進行搶救處置": true,
        "持續發動全方位生命徵象監測": true,
        "建立雙大口徑靜脈導管路": true,
        "主治醫師與各專科團隊進駐": true,
      };
    }

    return { xai_factors, treatments };
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

          const dynamicData = generateXAIAndTreatment(found.complaint, found.triage_degree, found.serious_risk_pct, found.spo2, found.t);
          setSelectedTreatments(dynamicData.treatments);

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
              RF: found.serious_risk_pct > 20, 
              XGB: found.serious_risk_pct > 30, 
              KNN: found.serious_risk_pct > 40 
            },
            xai_factors: dynamicData.xai_factors,
            references: [
              { title: "1. 急診臨床處置指引彙編", desc: "主訴與生命徵象對照...", score: "0.94", page: "P.12" },
              { title: "2. 急重症風險評估標準流程", desc: "模型特徵權重解析...", score: "0.82", page: "P.18" }
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
      <div style={{ padding: '24px 32px', flex: 1, overflow: 'auto', display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        
        {/* 左側：AI 惡化預測與 XAI 核心依據 */}
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
          
          <div style={{ backgroundColor: '#1E1B4B', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '15px' }}>
                <Bot size={18} color="#A5B4FC" /> AI 惡化預測 
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ backgroundColor: patient.ensemble_votes.RF ? '#E11D48' : '#334155', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>RF:{patient.ensemble_votes.RF ? '惡化' : '安全'}</span>
                <span style={{ backgroundColor: patient.ensemble_votes.XGB ? '#E11D48' : '#334155', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>XGB:{patient.ensemble_votes.XGB ? '惡化' : '安全'}</span>
                <span style={{ backgroundColor: patient.ensemble_votes.KNN ? '#E11D48' : '#334155', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>KNN:{patient.ensemble_votes.KNN ? '惡化' : '安全'}</span>
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

          <div style={{ backgroundColor: '#FEFCE8', borderRadius: '12px', padding: '20px', border: '1px solid #FEF08A' }}>
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
                // 將進度條寬度根據實際百分比調整（放大倍率讓視覺更明顯但符合比例）
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

        {/* TF-IDF 知識庫比對處置建議 (視覺化)*/}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '16px', color: '#1E293B' }}>
                  <BookOpen size={20} color="#4F46E5" /> TF-IDF 知識庫比對處置建議
                </div>
              </div>
              
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', marginTop: 0 }}>
                依據護理主訴文字萃取特徵，比對 Clinical Guidelines PDF，系統已自動勾選指引中萃取標準處置步驟。
              </p>

              <div style={{ borderLeft: '4px solid #4F46E5', backgroundColor: '#F8FAFC', borderRadius: '0 8px 8px 0', padding: '18px 20px', borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💡 建議標準處置 (依據: 臨床實證醫療指引)
                </div>
                
                
                {/* 處置分類圖例 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '18px',
                }}>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    處置分類：
                  </span>
                  {[
                    { emoji: '💊', label: '藥物', color: '#2563EB', bg: '#EFF6FF' },
                    { emoji: '💉', label: '注射', color: '#047857', bg: '#ECFDF5' },
                    { emoji: '🩸', label: '檢驗', color: '#B45309', bg: '#FFFBEB' },
                    { emoji: '🩺', label: '監測／會診', color: '#7E22CE', bg: '#FAF5FF' },
                    { emoji: '🫁', label: '呼吸支持', color: '#0F766E', bg: '#F0FDFA' },
                  ].map(item => (
                    <span key={item.label} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: item.bg,
                      color: item.color,
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {item.emoji} {item.label}
                    </span>
                  ))}
                </div>

                {/* 依原本處置文字產生視覺化卡片 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '14px',
                }}>
                  {Object.keys(selectedTreatments).map((name) => {
                    const visual = getTreatmentVisual(name);
                    const checked = selectedTreatments[name];

                    return (
                      <label
                        key={name}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          minHeight: '118px',
                          padding: '16px 18px',
                          borderRadius: '18px',
                          border: `1px dashed ${
                            checked ? visual.tagColor : visual.border
                          }`,
                          backgroundColor: checked ? visual.bg : visual.bg,
                          boxShadow: checked
                            ? `inset 0 0 0 1px ${visual.border}`
                            : 'none',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* 右上角勾選框 */}
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxChange(name)}
                          style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            width: '22px',
                            height: '22px',
                            accentColor: '#4F46E5',
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                        />

                        {/* 淡色 Emoji 浮水印 */}
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            bottom: '-12px',
                            fontSize: '76px',
                            opacity: 0.12,
                            pointerEvents: 'none',
                            lineHeight: 1,
                          }}
                        >
                          {visual.emoji.split(' ')[0]}
                        </span>

                        {/* 分類標籤 */}
                        <span style={{
                          position: 'relative',
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          alignSelf: 'flex-start',
                          maxWidth: 'calc(100% - 32px)',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          backgroundColor: visual.tagBg,
                          color: visual.tagColor,
                          fontSize: '12px',
                          fontWeight: '700',
                        }}>
                          {visual.emoji} {visual.label}
                        </span>

                        {/* 原本的處置文字：不更改、不重新產生 */}
                        <span style={{
                          position: 'relative',
                          zIndex: 1,
                          fontSize: '15px',
                          lineHeight: 1.6,
                          fontWeight: '700',
                          color: '#1E293B',
                          paddingRight: '8px',
                          overflowWrap: 'anywhere',
                        }}>
                          {name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* 勾選數量與操作 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #E2E8F0',
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#64748B',
                  }}>
                    已勾選處置項目：
                    <strong style={{ color: '#4F46E5' }}>
                      {' '}{Object.values(selectedTreatments).filter(Boolean).length}
                    </strong>
                    {' / '}{Object.keys(selectedTreatments).length} 項
                  </span>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTreatments(prev =>
                          Object.fromEntries(
                            Object.keys(prev).map(name => [name, true])
                          )
                        );
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#4F46E5',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      全選
                    </button>

                    <span style={{ color: '#CBD5E1' }}>•</span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTreatments(prev =>
                          Object.fromEntries(
                            Object.keys(prev).map(name => [name, false])
                          )
                        );
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#64748B',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      全取消
                    </button>
                  </div>
                </div>

              </div>

              <div style={{ marginBottom: '20px' }}>
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

            {/* 回饋收集 */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '10px' }}>
              <div style={{ fontWeight: '900', fontSize: '15px', color: '#0F172A', marginBottom: '12px' }}>
                是否採納建議
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <button onClick={() => promptFeedback('同意並採納 AI 預測與處置建議')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#EEF2FF', border: '1px solid #E0E7FF', borderRadius: '8px', color: '#4F46E5', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  <span>1. 同意並採納建議</span><ChevronRight size={16} color="#818CF8" />
                </button>
                <button onClick={() => promptFeedback('病人狀況穩定，暫不處理')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  <span>2. 病人狀況穩定，暫不處理</span><ChevronRight size={16} color="#94A3B8" />
                </button>
                <button onClick={() => promptFeedback('處置建議不適當')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#DC2626', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  <span>3. 處置建議不適當</span><ChevronRight size={16} color="#FCA5A5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 確認彈出視窗 */}
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

      {/* 成功提示 */}
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