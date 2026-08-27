import { useState } from 'react';
import { ChevronRight, Clock, Users,  Thermometer, HeartPulse, Wind, Droplets, Activity } from 'lucide-react';

// ==================== 假資料 ====================
const mockPatients = [
  {
    id: '001248831A',
    time: '13:20',
    name: '王大明',
    gender: '男',
    age: '45Y',
    level: 2,
    summary: '胸痛，壓迫感，延伸至左臂，伴隨冒冷汗。持續約30分鐘未緩解。',
    vitals: {
      t: { value: 36.8, status: 'normal', height: '40%' },
      hr: { value: 115, status: 'high', height: '80%' },
      rr: { value: 24, status: 'high', height: '70%' },
      bps: { value: 180, status: 'high', height: '90%' },
      bpd: { value: 95, status: 'high', height: '80%' },
      spo2: { value: 92, status: 'low', height: '40%' },
    }
  },
  {
    id: '009988223C',
    time: '13:45',
    name: '陳小寶',
    gender: '男',
    age: '3Y',
    level: 3,
    summary: '發燒兩天，最高至39.5度，食慾下降，有輕微咳嗽。家屬表示早上有熱痙攣情形約1分鐘。',
    vitals: {
      t: { value: 39.2, status: 'high', height: '90%' },
      hr: { value: 140, status: 'high', height: '90%' },
      rr: { value: 30, status: 'high', height: '85%' },
      bps: { value: 95, status: 'low', height: '30%' },
      bpd: { value: 60, status: 'low', height: '25%' },
      spo2: { value: 97, status: 'normal', height: '75%' },
    }
  },
  {
    id: '004561239B',
    time: '14:05',
    name: '林梅',
    gender: '女',
    age: '82Y',
    level: 1,
    summary: '意識不清，叫喚無反應，家屬發現倒臥於浴室。GCS E1V1M4。',
    vitals: {
      t: { value: 35.5, status: 'low', height: '20%' },
      hr: { value: 45, status: 'low', height: '25%' },
      rr: { value: 8, status: 'low', height: '15%' },
      bps: { value: 80, status: 'low', height: '20%' },
      bpd: { value: 40, status: 'low', height: '15%' },
      spo2: { value: 88, status: 'low', height: '30%' },
    }
  },
];

// ==================== 輔助元件：檢傷標籤 (還原為實心膠囊) ====================
const TriageBadge = ({ level }: { level: number }) => {
  const colors: Record<number, { bg: string, text: string }> = {
    1: { bg: '#DC2626', text: 'white' }, // 紅
    2: { bg: '#EA580C', text: 'white' }, // 橘
    3: { bg: '#FACC15', text: '#3F3F46' }, // 黃
    4: { bg: '#4ADE80', text: '#3F3F46' }, // 綠
    5: { bg: '#3B82F6', text: 'white' }, // 藍
  };
  const current = colors[level] || colors[5];

  return (
    <span style={{
      backgroundColor: current.bg,
      color: current.text,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      display: 'inline-block'
    }}>
      級數 {level}
    </span>
  );
};

// ==================== 輔助元件：生命徵象直條 (保留升級版) ====================
const VitalBar = ({ label, value, status, height, Icon }: { label: string, value: number, status: string, height: string, Icon: any }) => {
  const isAbnormal = status === 'high' || status === 'low';
  
  const bgGradient = isAbnormal 
    ? 'linear-gradient(to top, #F87171, #EF4444)' 
    : 'linear-gradient(to top, #34D399, #10B981)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '900', 
        color: isAbnormal ? '#EF4444' : '#1E293B',
        fontFamily: 'monospace',
        letterSpacing: '-0.5px'
      }}>
        {value}
      </span>
      
      <div style={{ 
        width: '8px', 
        height: '40px', 
        backgroundColor: '#F1F5F9', 
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #E2E8F0' 
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          background: bgGradient,
          borderRadius: '3px',
          boxShadow: isAbnormal ? '0 0 8px rgba(239, 68, 68, 0.4)' : 'none'
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#64748B' }}>
        <Icon size={10} strokeWidth={2.5} />
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{label}</span>
      </div>
    </div>
  );
};

// ==================== 主頁面元件 ====================
export default function WaitingList() {
  const [patients] = useState(mockPatients);

  // 表格 Grid 排版比例 (稍微調窄基本資料欄位，配合無頭像設計)
  const gridLayout = '70px 110px 120px 80px 1fr 380px 120px';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      backgroundColor: '#F8FAFC',
      fontFamily: 'sans-serif'
    }}>
      
      {/* 注入 CSS 動畫 (用於 AI 按鈕發光) */}
      <style>
        {`
          @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(139, 92, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
          }
          .ai-button-pulse {
            animation: pulse-glow 2s infinite;
          }
          .patient-row:hover {
            background-color: #F8FAFC !important;
            border-left-color: #3B82F6 !important;
          }
        `}
      </style>

      {/* 頁面內容區塊 */}
      <div style={{ padding: '24px 32px', flex: 1, overflow: 'auto' }}>
        
        {/* 頂部標題區 (加入醒目的候診人數) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '900', 
              color: '#0F172A', 
              margin: '0 0 6px 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <div style={{ backgroundColor: '#DBEAFE', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                <Users color="#2563EB" size={24} />
              </div>
              當前候診名單
              {/* ★ 新增：醒目的候診人數標籤 */}
              <span style={{ 
                fontSize: '14px', 
                backgroundColor: '#EFF6FF', 
                color: '#2563EB', 
                padding: '4px 12px', 
                borderRadius: '20px',
                border: '1px solid #BFDBFE',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                共 {patients.length} 人
              </span>
            </h1>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          
          {/* 表格標頭 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridLayout,
            gap: '16px',
            padding: '16px 24px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#64748B',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 到診</div>
            <div>病歷號</div>
            <div>姓名 / 基本資料</div>
            <div>檢傷</div>
            <div>護理主訴摘要</div>
            <div style={{ textAlign: 'center' }}>生命徵象即時分析</div>
            <div style={{ textAlign: 'center' }}>操作</div>
          </div>

          {/* 病患列表 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {patients.map((patient, index) => (
              <div 
                key={patient.id} 
                className="patient-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridLayout,
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: index === patients.length - 1 ? 'none' : '1px solid #F1F5F9',
                  borderLeft: '4px solid transparent',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  backgroundColor: 'white' // 確保 hover 效果正常運作
                }}
              >
                {/* 1. 到診時間 */}
                <div style={{ fontSize: '14px', color: '#64748B' }}>{patient.time}</div>

                {/* 2. 病歷號 (還原經典藍字底線) */}
                <div>
                  <a href="#" style={{ 
                    color: '#2563EB', 
                    textDecoration: 'underline', 
                    fontSize: '14px',
                    fontFamily: 'monospace' 
                  }}>
                    {patient.id}
                  </a>
                </div>

                {/* 3. 姓名與基本資料 (還原無頭像排版) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B' }}>{patient.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{patient.gender}, {patient.age}</span>
                </div>

                {/* 4. 檢傷級數 (還原實心膠囊) */}
                <div>
                  <TriageBadge level={patient.level} />
                </div>

                {/* 5. 護理主訴 */}
                <div style={{ 
                  fontSize: '13px', 
                  color: '#475569', 
                  lineHeight: '1.6', 
                  paddingRight: '16px',
                }}>
                  {patient.summary}
                </div>

                {/* 6. 生命徵象視覺化 (保留升級圖示版) */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                  <VitalBar label="體溫" value={patient.vitals.t.value} status={patient.vitals.t.status} height={patient.vitals.t.height} Icon={Thermometer} />
                  <VitalBar label="心跳" value={patient.vitals.hr.value} status={patient.vitals.hr.status} height={patient.vitals.hr.height} Icon={HeartPulse} />
                  <VitalBar label="呼吸" value={patient.vitals.rr.value} status={patient.vitals.rr.status} height={patient.vitals.rr.height} Icon={Wind} />
                  <VitalBar label="收縮壓" value={patient.vitals.bps.value} status={patient.vitals.bps.status} height={patient.vitals.bps.height} Icon={Activity} />
                  <VitalBar label="舒張壓" value={patient.vitals.bpd.value} status={patient.vitals.bpd.status} height={patient.vitals.bpd.height} Icon={Activity} />
                  <VitalBar label="血氧" value={patient.vitals.spo2.value} status={patient.vitals.spo2.status} height={patient.vitals.spo2.height} Icon={Droplets} />
                </div>

                {/* 7. 操作按鈕 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  <button 
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #3B82F6, #2563EB)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 0',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    進入看診 <ChevronRight size={16} strokeWidth={3} />
                  </button>
                  
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}