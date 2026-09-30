import React from 'react';
import { getVitalStatusColor } from '../utils/vitalSigns';

interface VitalBarProps {
  label: string;
  displayValue: string | number;
  numericValue?: number;
  age?: number;
}

export const VitalBar: React.FC<VitalBarProps> = ({ 
  label, 
  displayValue, 
  numericValue, 
  age 
}) => {
  const color = getVitalStatusColor(label, numericValue, age);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px' }}>
      <span style={{ fontSize: '12px', fontWeight: 'bold', color: color, marginBottom: '4px' }}>
        {displayValue}
      </span>
      <div style={{ width: '10px', height: '24px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '60%', backgroundColor: color }} />
      </div>
    </div>
  );
};