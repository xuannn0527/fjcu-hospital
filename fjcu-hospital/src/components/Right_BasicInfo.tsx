import type { Patient } from './RightPanel';

interface RightBasicInfoProps {
  patient: Patient;
}

const infoCardStyle = {
  backgroundColor: 'white',
  border: '1px solid #E2E8F0',
  borderRadius: '7px',
  padding: '8px 10px',
};

const vitalCardStyle = {
  backgroundColor: 'white',
  border: '1px solid #E2E8F0',
  padding: '10px 8px',
  borderRadius: '7px',
  textAlign: 'center' as const,
};

const labelStyle = {
  fontSize: '11px',
  color: '#64748B',
  display: 'block',
  marginBottom: '3px',
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
        <span style={{ fontSize: '10px', marginLeft: '2px' }}>kg</span>
      </>,
      '13px',
    ],
    ['出生日期', patient.birth_date || '無紀錄', '13px'],
    ['性別', patient.gender || '無紀錄', '13px'],
    ['過去病史', patient.past_medical_history || '無紀錄', '12px'],
  ];

  const vitals = [
    [
      '體溫',
      <>
        {patient.temperature ?? '--'}
        <span style={{ fontSize: '10px' }}>°C</span>
      </>,
      '15px',
      '#0F172A',
    ],
    [
      '心跳',
      <>
        {patient.heart_rate ?? '--'}
        <span style={{ fontSize: '10px' }}>bpm</span>
      </>,
      '15px',
      '#0F172A',
    ],
    [
      '血壓',
      patient.blood_pressure_sys && patient.blood_pressure_dia
        ? `${patient.blood_pressure_sys}/${patient.blood_pressure_dia}`
        : '--',
      '14px',
      '#0F172A',
    ],
    [
      '血氧',
      <>
        {patient.spo2 ?? '--'}
        <span style={{ fontSize: '10px' }}> %</span>
      </>,
      '15px',
      Number(patient.spo2) < 95 ? '#EF4444' : '#0F172A',
    ],
    [
      '呼吸',
      <>
        {patient.respiratory_rate ?? '--'}
        <span style={{ fontSize: '10px' }}> 次</span>
      </>,
      '15px',
      '#0F172A',
    ],
    [
      '疼痛指數',
      <>
        {patient.pain_score ?? '--'}
        <span style={{ fontSize: '10px' }}> 分</span>
      </>,
      '14px',
      (patient.pain_score ?? 0) >= 7 ? '#EF4444' : '#0F172A',
    ],
    [
      'GCS',
      patient.gcs_eye
        ? `E${patient.gcs_eye}V${patient.gcs_verbal}M${patient.gcs_motor}`
        : '--',
      '13px',
      '#0F172A',
    ],
    [
      '血糖',
      <>
        {patient.blood_sugar ?? '--'}
        <span style={{ fontSize: '10px' }}> mg/dL</span>
      </>,
      '14px',
      '#0F172A',
    ],
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '12px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#334155',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          患者基本資料
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {info.map(([label, value, fontSize]) => (
            <div key={label as string} style={infoCardStyle}>
              <span style={labelStyle}>{label}</span>
              <strong style={{ fontSize: fontSize as string, color: '#334155' }}>
                {value}
              </strong>
            </div>
          ))}

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
                fontSize: '12px',
                color: hasAllergy ? '#991B1B' : '#334155',
              }}
            >
              {allergyInfo}
            </strong>
          </div>

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
            <span
              style={{
                fontSize: '12px',
                color: patient.do_not_treat ? '#9F1239' : '#334155',
                fontWeight: patient.do_not_treat ? 'bold' : 'normal',
              }}
            >
              {patient.do_not_treat || '無紀錄'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '12px',
            color: '#64748B',
            fontWeight: 'bold',
            marginBottom: '7px',
          }}
        >
          主述
        </div>

        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: '1.5',
          }}
        >
          {patient.sentiment || '無紀錄'}
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '12px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#334155',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          生命徵象
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
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
    </>
  );
}