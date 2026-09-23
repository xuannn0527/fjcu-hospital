import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  Clock, 
  Users, 
  Thermometer, 
  HeartPulse, 
  Wind, 
  Droplets, 
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// ==================== 輔助元件：檢傷標籤 ====================
const TriageBadge = ({ level }) => {
  const colors = {
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
      padding: '5px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'translateX(-14px)'
    }}>
      級數 {level}
    </span>
  );
};

// ==================== 輔助元件：簡約風直筒圓柱體 ====================
const VitalBarOnly = ({ value, status, height }) => {
  let fillColor = '#10B981';
  let textColor = '#1E293B';

  if (status === 'warning') {
    fillColor = '#F59E0B';
    textColor = '#D97706';
  } else if (status === 'danger') {
    fillColor = '#EF4444';
    textColor = '#EF4444';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '46px' }}>
      <span style={{ 
        fontSize: '16px', 
        fontWeight: '900', 
        color: textColor,
        fontFamily: 'monospace',
        letterSpacing: '-0.5px'
      }}>
        {value ?? '--'}
      </span>
      
      <div style={{ 
        width: '18px', 
        height: '66px', 
        backgroundColor: '#F8FAFC', 
        borderRadius: '0px 0px 5px 5px', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #CBD5E1' 
      }}>
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-1px',
          right: '-1px',
          height: '6px',
          backgroundColor: '#E2E8F0',
          border: '1px solid #CBD5E1',
          borderRadius: '50%',
          zIndex: 3
        }} />

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height || '50%',
          backgroundColor: fillColor,
          borderRadius: '0px 0px 4px 4px',
          zIndex: 2
        }} />

        <div style={{
          position: 'absolute',
          bottom: `calc(${height || '50%'} - 2px)`,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          zIndex: 4
        }} />
      </div>
    </div>
  );
};

// ==================== 核心邏輯：依照臨床標準判定紅黃綠燈 ====================
const evaluateVitals = (item) => {
  const ageStr = item.age || '45Y';
  const t = item.temperature;
  const hr = item.heart_rate;
  const rr = item.respiratory_rate;
  const sbp = item.blood_pressure_sys;
  const dbp = item.blood_pressure_dia;
  const spo2 = item.spo2;

  let ageNum = parseInt(ageStr) || 20;
  let isMonth = ageStr.includes('M');
  let isDay = ageStr.includes('D');

  let spo2Status = 'normal';
  if (spo2 !== null && spo2 !== undefined) {
    if (spo2 < 92) spo2Status = 'danger';
    else if (spo2 <= 94) spo2Status = 'warning';
  }

  let tStatus = 'normal';
  if (t !== null && t !== undefined) {
    if (isDay || (isMonth && ageNum < 3)) {
      if (t < 36 || t > 38) tStatus = 'danger';
    } else if (ageNum >= 3 && !isMonth && !isDay && ageNum <= 3) {
      if (t < 35 || t > 38) tStatus = 'danger';
      else if ((t >= 35 && t < 36) || (t > 37 && t <= 38)) tStatus = 'warning';
    } else {
      if (t < 35 || t > 41) tStatus = 'danger';
      else if ((t >= 35 && t < 36) || (t > 37 && t <= 40)) tStatus = 'warning';
    }
  }

  let hrStatus = 'normal';
  if (hr !== null && hr !== undefined) {
    if (isDay || (isMonth && ageNum < 3)) {
      if (hr < 110 || hr > 170) hrStatus = 'danger';
    } else if (ageNum <= 3 && !isMonth && !isDay) {
      if (hr < 90 || hr > 150) hrStatus = 'danger';
    } else {
      if (hr < 50 || hr > 140) hrStatus = 'danger';
      else if (hr > 100) hrStatus = 'warning';
    }
  }

  let rrStatus = 'normal';
  if (rr !== null && rr !== undefined) {
    if (isDay || (isMonth && ageNum < 3)) {
      if (rr < 10 || rr > 60) rrStatus = 'danger';
    } else if (ageNum <= 3 && !isMonth && !isDay) {
      if (rr < 10 || rr > 40) rrStatus = 'danger';
    } else {
      if (rr < 10 || rr > 25) rrStatus = 'danger';
      else if (rr > 20) rrStatus = 'warning';
    }
  }

  let sbpStatus = 'normal';
  if (sbp !== null && sbp !== undefined) {
    if (sbp < 90 || sbp > 220) sbpStatus = 'danger';
    else if (sbp > 140) sbpStatus = 'warning';
  }

  let dbpStatus = 'normal';
  if (dbp !== null && dbp !== undefined) {
    if (dbp > 130) dbpStatus = 'danger';
    else if (dbp > 90) dbpStatus = 'warning';
  }

  return {
    t: { value: t, status: tStatus, height: '60%' },
    hr: { value: hr, status: hrStatus, height: '70%' },
    rr: { value: rr, status: rrStatus, height: '55%' },
    sbp: { value: sbp, status: sbpStatus, height: '65%' },
    dbp: { value: dbp, status: dbpStatus, height: '60%' },
    spo2: { value: spo2, status: spo2Status, height: '80%' },
  };
};

// ==================== 主頁面元件 ====================
export default function WaitingList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [timeSortOrder, setTimeSortOrder] = useState('asc');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/patients')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          const formattedData = data.map(item => ({
            id: item.patient_id,
            time: item.measured_at ? item.measured_at.substring(11, 16) : '13:20',
            name: item.name,
            gender: item.gender === 'M' ? '男' : '女',
            age: item.age,
            level: Number(item.final_level) || 3,
            summary: item.chief_complaint || '無主訴紀錄',
            vitals: evaluateVitals(item)
          }));
          setPatients(formattedData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("無法取得病患資料:", err);
        setLoading(false);
      });
  }, []);

  const levelCounts = {
    1: patients.filter(p => p.level === 1).length,
    2: patients.filter(p => p.level === 2).length,
    3: patients.filter(p => p.level === 3).length,
    4: patients.filter(p => p.level === 4).length,
    5: patients.filter(p => p.level === 5).length,
  };

  const toggleTimeSort = () => {
    setTimeSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const displayedPatients = useMemo(() => {
    let result = selectedLevel === null 
      ? [...patients] 
      : patients.filter(p => p.level === selectedLevel);

    result.sort((a, b) => {
      return timeSortOrder === 'asc' 
        ? a.time.localeCompare(b.time) 
        : b.time.localeCompare(a.time);
    });

    return result;
  }, [patients, selectedLevel, timeSortOrder]);

  const triageFilterConfig = [
    { level: 1, label: '一級', bg: '#DC2626', text: '#FFFFFF', border: '#DC2626' },
    { level: 2, label: '二級', bg: '#EA580C', text: '#FFFFFF', border: '#EA580C' },
    { level: 3, label: '三級', bg: '#FACC15', text: '#3F3F46', border: '#EAB308' },
    { level: 4, label: '四級', bg: '#4ADE80', text: '#166534', border: '#4ADE80' },
    { level: 5, label: '五級', bg: '#3B82F6', text: '#FFFFFF', border: '#3B82F6' },
  ];

  const gridLayout = '90px 110px 160px 90px 320px 400px 110px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>

      <div style={{ padding: '24px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* 頂部標題區與分級篩選 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0, flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#DBEAFE', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                <Users color="#2563EB" size={24} />
              </div>
              當前候診名單
            </h1>

            {/* 總人數按鈕 */}
            <button
              onClick={() => setSelectedLevel(null)}
              style={{
                fontSize: '13px',
                backgroundColor: selectedLevel === null ? '#2563EB' : '#EFF6FF',
                color: selectedLevel === null ? '#FFFFFF' : '#2563EB',
                border: '1px solid #BFDBFE',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              全部 {patients.length} 人
            </button>

            {/* 分級篩選按鈕列 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {triageFilterConfig.map((item) => {
                const count = levelCounts[item.level];
                const isSelected = selectedLevel === item.level;

                return (
                  <button
                    key={item.level}
                    onClick={() => setSelectedLevel(isSelected ? null : item.level)}
                    style={{
                      fontSize: '13px',
                      backgroundColor: isSelected ? item.bg : '#FFFFFF',
                      color: isSelected ? item.text : '#475569',
                      border: `1.5px solid ${isSelected ? item.border : '#CBD5E1'}`,
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? item.text : item.bg,
                      display: 'inline-block'
                    }} />
                    <span>{item.label} {count} 人</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

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
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div 
              onClick={toggleTimeSort}
              title={`點擊切換排序 (${timeSortOrder === 'asc' ? '早到晚' : '晚到早'})`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                height: '100%', 
                cursor: 'pointer',
                userSelect: 'none',
                color: '#1E293B'
              }}
            >
              <Clock size={14} style={{ marginRight: '2px', color: '#64748B' }} /> 
              <span>到診</span>
              {timeSortOrder === 'asc' ? (
                <ArrowUp size={14} color="#2563EB" strokeWidth={2.5} />
              ) : (
                <ArrowDown size={14} color="#2563EB" strokeWidth={2.5} />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>病歷號</div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>姓名 / 基本資料</div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>檢傷</div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>護理主訴摘要</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ marginBottom: '6px', fontSize: '13px' }}>生命徵象即時分析</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 46px)', gap: '8px', color: '#475569', fontSize: '12px', justifyItems: 'center', width: '348px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Thermometer size={11} strokeWidth={2.5} /> T</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><HeartPulse size={11} strokeWidth={2.5} /> HR</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Wind size={11} strokeWidth={2.5} /> RR</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Activity size={11} strokeWidth={2.5} /> SBP</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Activity size={11} strokeWidth={2.5} /> DBP</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Droplets size={11} strokeWidth={2.5} /> SpO2</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>操作</div>
          </div>

          {/* 病患列表 */}
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>載入資料中...</div>
            ) : displayedPatients.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                {selectedLevel ? `目前無級數 ${selectedLevel} 的候診病患` : '目前無候診病患資料'}
              </div>
            ) : (
              displayedPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: gridLayout,
                    gap: '16px',
                    padding: '38px 24px',
                    borderBottom: index === displayedPatients.length - 1 ? 'none' : '1px solid #F1F5F9',
                    borderLeft: '4px solid transparent',
                    alignItems: 'center',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderLeftColor = '#3B82F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', height: '100%', fontWeight: '500' }}>
                    {patient.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <a href="#" style={{ color: '#2563EB', textDecoration: 'underline', fontSize: '14px', fontFamily: 'monospace' }}>
                      {patient.id}
                    </a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px', height: '100%' }}>
                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#1E293B' }}>{patient.name}</span>
                    <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{patient.gender}, {patient.age}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <TriageBadge level={patient.level} />
                  </div>
                  <div style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', paddingRight: '12px', display: 'flex', alignItems: 'center', height: '100%', wordBreak: 'break-word' }}>
                    {patient.summary}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', height: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 46px)', gap: '8px', justifyItems: 'center', width: '348px' }}>
                      <VitalBarOnly value={patient.vitals.t.value} status={patient.vitals.t.status} height={patient.vitals.t.height} />
                      <VitalBarOnly value={patient.vitals.hr.value} status={patient.vitals.hr.status} height={patient.vitals.hr.height} />
                      <VitalBarOnly value={patient.vitals.rr.value} status={patient.vitals.rr.status} height={patient.vitals.rr.height} />
                      <VitalBarOnly value={patient.vitals.sbp.value} status={patient.vitals.sbp.status} height={patient.vitals.sbp.height} />
                      <VitalBarOnly value={patient.vitals.dbp.value} status={patient.vitals.dbp.status} height={patient.vitals.dbp.height} />
                      <VitalBarOnly value={patient.vitals.spo2.value} status={patient.vitals.spo2.status} height={patient.vitals.spo2.height} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <button style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #3B82F6, #2563EB)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '11px 0',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}>
                      進入看診 <ChevronRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}