import { User, Activity } from 'lucide-react';
import type { Patient } from './RightPanel';

interface RightBasicInfoProps {
  patient: Patient;
}

// 統一的區塊外框樣式
const sectionContainerStyle = {
  backgroundColor: '#F8FAFC',
  border: '1px solid #F1F5F9',
  borderRadius: '12px',
  padding: '16px',
};

// 放大的標題樣式 (加入 gap 讓 Icon 跟文字保持距離)
const sectionTitleStyle = {
  fontSize: '15px',
  color: '#1E293B',
  fontWeight: 'bold',
  marginBottom: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

// 基本資料卡片樣式
const infoCardStyle = {
  backgroundColor: 'white',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  padding: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
};

// 生命徵象卡片樣式
const vitalCardStyle = {
  backgroundColor: 'white',
  border: '1px solid #E2E8F0',
  padding: '12px 8px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
};

// 標籤樣式
const labelStyle = {
  fontSize: '11px',
  color: '#64748B',
  display: 'block',
  marginBottom: '4px',
  fontWeight: '500',
};

export default function RightBasicInfo({ patient }: RightBasicInfoProps) {
  const allergyInfo =
    patient.drug_allergy && patient.drug_allergy !== '無'
      ? patient.drug_allergy
      : patient.allergy || '無';

  const hasAllergy = allergyInfo !== '無' && allergyInfo !== '無紀錄';

  const info = [
    [
      '體重',
      <>
        {patient.weight ?? '--'}
        <span style={{ fontSize: '11px', marginLeft: '2px', color: '#64748B' }}>kg</span>
      </>,
      '14px',
    ],
    ['出生日期', patient.birth_date || '無紀錄', '14px'],
    ['性別', patient.gender || '無紀錄', '14px'],
    ['過去病史', patient.past_medical_history || '無紀錄', '13px'],
  ];

  const vitals = [
    [
      '體溫',
      <>
        {patient.temperature ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>°C</span>
      </>,
      '16px',
      '#0F172A',
    ],
    [
      '心跳',
      <>
        {patient.heart_rate ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>bpm</span>
      </>,
      '16px',
      '#0F172A',
    ],
    [
      '血壓',
      patient.blood_pressure_sys && patient.blood_pressure_dia
        ? `${patient.blood_pressure_sys}/${patient.blood_pressure_dia}`
        : '--',
      '15px',
      '#0F172A',
    ],
    [
      '血氧',
      <>
        {patient.spo2 ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>%</span>
      </>,
      '16px',
      Number(patient.spo2) < 95 ? '#EF4444' : '#0F172A',
    ],
    [
      '呼吸',
      <>
        {patient.respiratory_rate ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>次</span>
      </>,
      '16px',
      '#0F172A',
    ],
    [
      '疼痛指數',
      <>
        {patient.pain_score ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>分</span>
      </>,
      '15px',
      (patient.pain_score ?? 0) >= 7 ? '#EF4444' : '#0F172A',
    ],
    [
      'GCS',
      patient.gcs_eye
        ? `E${patient.gcs_eye}V${patient.gcs_verbal}M${patient.gcs_motor}`
        : '--',
      '14px',
      '#0F172A',
    ],
    [
      '血糖',
      <>
        {patient.blood_sugar ?? '--'}
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>mg/dL</span>
      </>,
      '15px',
      '#0F172A',
    ],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ==================== 患者基本資料 ==================== */}
      <div style={sectionContainerStyle}>
        <div style={sectionTitleStyle}>
          <User size={18} color="#3B82F6" strokeWidth={2.5} />
          <span>患者基本資料</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {info.map(([label, value, fontSize]) => (
            <div key={label as string} style={infoCardStyle}>
              <span style={labelStyle}>{label}</span>
              <strong style={{ fontSize: fontSize as string, color: '#1E293B' }}>
                {value}
              </strong>
            </div>
          ))}

          {/* 藥物過敏 (特殊樣式) */}
          <div
            style={{
              ...infoCardStyle,
              backgroundColor: hasAllergy ? '#FEF2F2' : 'white',
              border: `1px solid ${hasAllergy ? '#FCA5A5' : '#E2E8F0'}`,
            }}
          >
            <span
              style={{
                ...labelStyle,
                color: hasAllergy ? '#EF4444' : '#64748B',
                fontWeight: 'bold',
              }}
            >
              藥物過敏
            </span>
            <strong
              style={{
                fontSize: '13px',
                color: hasAllergy ? '#991B1B' : '#1E293B',
              }}
            >
              {allergyInfo}
            </strong>
          </div>

          {/* 禁治療 (特殊樣式) */}
          <div
            style={{
              ...infoCardStyle,
              backgroundColor: patient.do_not_treat ? '#FFF1F2' : 'white',
              border: `1px solid ${
                patient.do_not_treat ? '#FECDD3' : '#E2E8F0'
              }`,
            }}
          >
            <span
              style={{
                ...labelStyle,
                color: patient.do_not_treat ? '#E11D48' : '#64748B',
                fontWeight: 'bold',
              }}
            >
              禁治療
            </span>
            <strong
              style={{
                fontSize: '13px',
                color: patient.do_not_treat ? '#9F1239' : '#1E293B',
              }}
            >
              {patient.do_not_treat || '無紀錄'}
            </strong>
          </div>
        </div>
      </div>

{/* ==================== 主述 ==================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          fontSize: '15px',
          color: '#1E293B',
          fontWeight: 'bold',
          paddingLeft: '2px',
          letterSpacing: '0.5px' 
        }}>
          主述
        </div>

        <div
          style={{
            width: 'fit-content', // ★ 核心修改：寬度跟著文字內容自動縮放
            maxWidth: '100%',     // ★ 確保文字太多時不會撐破畫面
            wordBreak: 'break-word', // ★ 太長時允許自動換行
            backgroundColor: '#F5F3FF', 
            border: '1px solid #EDE9FE', 
            borderRadius: '8px',
            padding: '10px 14px', 
            fontSize: '14px', 
            color: '#334155',
            lineHeight: '1.5', 
            boxShadow: '0 2px 6px rgba(139, 92, 246, 0.04)', 
          }}
        >
          「 {patient.sentiment || '無主述紀錄'} 」
        </div>
      </div>

      {/* ==================== 生命徵象 ==================== */}
      <div style={sectionContainerStyle}>
        <div style={sectionTitleStyle}>
          <Activity size={18} color="#FF0308" strokeWidth={2.5} />
          <span>生命徵象</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}
        >
          {vitals.map(([label, value, fontSize, color]) => (
            <div key={label as string} style={vitalCardStyle}>
              <span style={labelStyle}>{label}</span>
              <strong
                style={{
                  fontSize: fontSize as string,
                  color: color as string,
                }}
              >
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}