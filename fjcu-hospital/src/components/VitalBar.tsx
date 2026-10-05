import React from 'react';
import { getVitalStatusColor } from '../utils/vitalSigns';

interface VitalBarProps {
  label: string;
  displayValue: string | number;
  numericValue?: number;
  age?: number;
}

// 根據項目與數值動態計算百分比高度 (10% ~ 100%)
const getVitalHeight = (label: string, val?: number): number => {
  if (val === undefined || val === null) return 50;
  
  const key = label.trim().toUpperCase();
  switch (key) {
    case 'T': // 體溫 (35°C ~ 41°C)
      return Math.min(100, Math.max(10, ((val - 35) / (41 - 35)) * 100));
    case 'HR': // 心跳 (40 ~ 160)
      return Math.min(100, Math.max(10, ((val - 40) / (160 - 40)) * 100));
    case 'RR': // 呼吸頻率 (10 ~ 40)
      return Math.min(100, Math.max(10, ((val - 10) / (40 - 10)) * 100));
    case 'SBP': // 收縮壓 (70 ~ 190)
      return Math.min(100, Math.max(10, ((val - 70) / (190 - 70)) * 100));
    case 'DBP': // 舒張壓 (40 ~ 120)
      return Math.min(100, Math.max(10, ((val - 40) / (120 - 40)) * 100));
    case 'SPO2': // 血氧 (0% ~ 100%)
      return Math.min(100, Math.max(10, val));
    default:
      return 60;
  }
};

export const VitalBar: React.FC<VitalBarProps> = ({ 
  label, 
  displayValue, 
  numericValue, 
  age 
}) => {
  const color = getVitalStatusColor(label, numericValue, age);
  const barHeight = getVitalHeight(label, numericValue); // 計算動態高度

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px' }}>
      <span style={{ fontSize: '12px', fontWeight: 'bold', color: color, marginBottom: '4px' }}>
        {displayValue}
      </span>
      <div style={{ width: '10px', height: '24px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            width: '100%', 
            height: `${barHeight}%`, // 使用動態高度
            backgroundColor: color,
            transition: 'height 0.3s ease'
          }} 
        />
      </div>
    </div>
  );
};