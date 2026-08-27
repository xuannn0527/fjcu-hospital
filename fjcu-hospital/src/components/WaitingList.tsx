import { useState } from 'react';
import { ChevronRight, Clock, Users,} from 'lucide-react';

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

// ==================== 輔助元件：檢傷標籤 ====================
const TriageBadge = ({ level }: { level: number }) => {
  const colors: Record<number, { bg: string, border: string, text: string }> = {
    1: { bg: '#FEF2F2', border: '#FCA5A5', text: '#EF4444' }, 
    2: { bg: '#FFF7ED', border: '#FDBA74', text: '#F97316' }, 
    3: { bg: '#FEFCE8', border: '#FDE047', text: '#EAB308' }, 
    4: { bg: '#F0FDF4', border: '#86EFAC', text: '#22C55E' }, 
    5: { bg: '#EFF6FF', border: '#93C5FD', text: '#3B82F6' }, 
  };
  const current = colors[level] || colors[5];

  return (
    <span style={{
      backgroundColor: current.bg,
      color: current.text,
      border: `1px solid ${current.border}`,
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '56px'
    }}>
      {level} 級
    </span>
  );
};

// ==================== 輔助元件：精緻版生命徵象直條 ====================
const VitalBar = ({ label, value, status, height }: { label: string, value: number, status: string, height: string }) => {
  const isAbnormal = status === 'high' || status === 'low';
  const barColor = isAbnormal ? '#EF4444' : (status === 'normal' ? '#10B981' : '#6EE7B7'); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '900', 
        color: isAbnormal ? '#EF4444' : '#334155',
        fontFamily: 'monospace'
      }}>
        {value}
      </span>
      
      <div style={{ 
        width: '6px', 
        height: '36px', 
        backgroundColor: '#E2E8F0', 
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          backgroundColor: barColor,
          borderRadius: '4px',
          boxShadow: isAbnormal ? '0 0 4px rgba(239, 68, 68, 0.4)' : 'none'
        }} />
      </div>

      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>{label}</span>
    </div>
  );
};

// ==================== 主頁面元件 ====================
export default function WaitingList() {
  const [patients] = useState(mockPatients);

  // 表格 Grid 排版比例 (優化留白比例)
  const gridLayout = '70px 110px 140px 70px 1fr 340px 120px';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      backgroundColor: '#F8FAFC',
      fontFamily: 'sans-serif'
    }}>
      
      {/* 頁面內容區塊 */}
      <div style={{ padding: '24px 32px', flex: 1, overflow: 'auto' }}>
        
        {/* 頂部標題區 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users color="#3B82F6" size={26} /> 當前候診名單
            </h3>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
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
            borderBottom: '2px solid #E2E8F0',
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
            <div style={{ textAlign: 'center' }}>生命徵象監測 (T ‧ HR ‧ RR ‧ BP ‧ SpO2)</div>
            <div style={{ textAlign: 'center' }}>操作</div>
          </div>

          {/* 病患列表 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {patients.map((patient, index) => (
              <div key={patient.id} style={{
                display: 'grid',
                gridTemplateColumns: gridLayout,
                gap: '16px',
                padding: '20px 24px',
                borderBottom: index === patients.length - 1 ? 'none' : '1px solid #F1F5F9',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* 1. 到診時間 */}
                <div style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{patient.time}</div>

                {/* 2. 病歷號 */}
                <div>
                  <span style={{ 
                    color: '#475569', 
                    fontSize: '13px', 
                    fontFamily: 'monospace',
                    backgroundColor: '#F1F5F9',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0'
                  }}>
                    {patient.id}
                  </span>
                </div>

                {/* 3. 姓名與基本資料 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0F172A', letterSpacing: '0.5px' }}>{patient.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>{patient.gender} · {patient.age}</span>
                </div>

                {/* 4. 檢傷級數 */}
                <div>
                  <TriageBadge level={patient.level} />
                </div>

                {/* 5. 護理主訴 */}
                <div style={{ 
                  fontSize: '13px', 
                  color: '#334155', 
                  lineHeight: '1.6', 
                  paddingRight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {patient.summary}
                </div>

                {/* 6. 生命徵象視覺化 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                  <VitalBar label="體溫" value={patient.vitals.t.value} status={patient.vitals.t.status} height={patient.vitals.t.height} />
                  <VitalBar label="心跳" value={patient.vitals.hr.value} status={patient.vitals.hr.status} height={patient.vitals.hr.height} />
                  <VitalBar label="呼吸" value={patient.vitals.rr.value} status={patient.vitals.rr.status} height={patient.vitals.rr.height} />
                  <VitalBar label="收縮壓" value={patient.vitals.bps.value} status={patient.vitals.bps.status} height={patient.vitals.bps.height} />
                  <VitalBar label="舒張壓" value={patient.vitals.bpd.value} status={patient.vitals.bpd.status} height={patient.vitals.bpd.height} />
                  <VitalBar label="血氧" value={patient.vitals.spo2.value} status={patient.vitals.spo2.status} height={patient.vitals.spo2.height} />
                </div>

                {/* 7. 操作按鈕 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <button 
                    style={{
                      width: '100%',
                      backgroundColor: '#3B82F6',
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
                      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    進入看診 <ChevronRight size={16} strokeWidth={2.5} />
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