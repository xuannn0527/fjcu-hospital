import React, { useId, useState } from 'react';

// SVG 路徑定義
const VITAL_ICONS: Record<string, string> = {
  T: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
  
  // HR: 底部對齊基線（Y = 20.5）的愛心
  HR: "M12 20.5C5 15 3.5 10 3.5 7.5C3.5 4.8 5.7 3.5 8 3.5C9.8 3.5 11.2 4.5 12 6C12.8 4.5 14.2 3.5 16 3.5C18.3 3.5 20.5 4.8 20.5 7.5C20.5 10 19 15 12 20.5Z",
  
  RR: "M12 4c-1.1 0-2 .9-2 2v2.53A4.98 4.98 0 0 0 5 13v5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H7v-3c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v3h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-5a4.98 4.98 0 0 0-5-4.47V6c0-1.1-.9-2-2-2z",
  
  // SPO2: 瘦長型水滴
  SPO2: "M12 2.5C12 2.5 7.2 10.5 7.2 15.2C7.2 17.85 9.35 20 12 20C14.65 20 16.8 17.85 16.8 15.2C16.8 10.5 12 2.5 12 2.5Z"
};

function analyzeVital(label: string, value?: number) {
  let color = '#9CA3AF'; // 未提供數據時預設灰色
  let fillRatio = 0;
  let normalMinRatio = 0; // 正常範圍下限比例
  let normalMaxRatio = 0; // 正常範圍上限比例

  switch (label) {
    case 'T': // 體溫 (°C)
      normalMinRatio = (36.0 - 35) / 5; // 36.0
      normalMaxRatio = (38.0 - 35) / 5; // 38.0
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, (value - 35) / 5));
        if (value < 35.0 || value > 41.0) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if ((value >= 35.0 && value < 36.0) || (value >= 38.0 && value <= 41.0)) {
          color = '#EAB308'; // 黃燈 (警告)
        } else {
          color = '#22C55E'; // 綠燈 (正常)
        }
      }
      break;

    case 'HR': // 心跳 (次/分)
      normalMinRatio = 50 / 150;  // 50
      normalMaxRatio = 100 / 150; // 100
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, value / 150));
        if (value < 50 || value > 140) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if (value > 100 && value <= 140) {
          color = '#EAB308'; // 黃燈 (警告)
        } else {
          color = '#22C55E'; // 綠燈 (正常)
        }
      }
      break;

    case 'RR': // 呼吸次數 (/min)
      normalMinRatio = 12 / 40; // 12
      normalMaxRatio = 20 / 40; // 20
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, value / 40));
        if (value < 10 || value > 25) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if (value >= 12 && value <= 20) {
          color = '#22C55E'; // 綠燈 (正常)
        } else {
          color = '#EAB308'; // 黃燈 (警告)
        }
      }
      break;

    case 'SBP': // 收縮壓 SBP (mmHg)
      normalMinRatio = 90 / 200;  // 90 mmHg (下限虛線)
      normalMaxRatio = 130 / 200; // 130 mmHg (上限虛線)
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, value / 200));
        if (value < 90 || value > 220) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if (value >= 200 && value <= 220) {
          color = '#EAB308'; // 黃燈 (警告)
        } else {
          color = '#22C55E'; // 綠燈 (正常)
        }
      }
      break;

    case 'DBP': // 舒張壓 DBP (mmHg)
      normalMinRatio = 60 / 120;  // 60 mmHg (下限虛線)
      normalMaxRatio = 110 / 120; // 110 mmHg (上限虛線)
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, value / 120));
        if (value > 130) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if (value >= 110 && value <= 130) {
          color = '#EAB308'; // 黃燈 (警告)
        } else {
          color = '#22C55E'; // 綠燈 (正常)
        }
      }
      break;

    case 'SPO2': // 血氧飽和度 SpO2 (%)
      normalMinRatio = (95 - 70) / 30; // 95%
      normalMaxRatio = (100 - 70) / 30; // 100%
      if (value !== undefined && value !== null) {
        fillRatio = Math.min(1, Math.max(0, (value - 70) / 30));
        if (value < 92) {
          color = '#EF4444'; // 紅燈 (危急)
        } else if (value >= 92 && value <= 94) {
          color = '#EAB308'; // 黃燈 (警告)
        } else {
          color = '#22C55E'; // 綠燈 (正常)
        }
      }
      break;
  }

  return { color, fillRatio, normalMinRatio, normalMaxRatio };
}

// Tooltip 內容計算函數
function getTooltipDetails(label: string, value?: number) {
  if (value === undefined || value === null) {
    return { statusText: '無資料', rangeText: '無資料' };
  }

  switch (label) {
    case 'T': {
      let status = '落於正常範圍';
      if (value > 41) status = `超過標準值 +${(value - 41).toFixed(1)}（上限 41）`;
      else if (value >= 38) status = `超過標準值 +${(value - 38).toFixed(1)}（上限 38）`;
      else if (value < 35) status = `低於標準值 -${(35 - value).toFixed(1)}（下限 35）`;
      else if (value < 36) status = `低於標準值 -${(36 - value).toFixed(1)}（下限 36）`;
      return { statusText: status, rangeText: '正常範圍: 36 ~ 38' };
    }

    case 'HR': {
      let status = '落於正常範圍';
      if (value > 140) status = `超過標準值 +${value - 140}（上限 140）`;
      else if (value > 100) status = `超過標準值 +${value - 100}（上限 100）`;
      else if (value < 50) status = `低於標準值 -${50 - value}（下限 50）`;
      return { statusText: status, rangeText: '正常範圍: 50 ~ 100' };
    }

    case 'RR': {
      let status = '落於正常範圍';
      if (value > 25) status = `超過標準值 +${value - 25}（上限 25）`;
      else if (value > 20) status = `超過標準值 +${value - 20}（上限 20）`;
      else if (value < 10) status = `低於標準值 -${10 - value}（下限 10）`;
      else if (value < 12) status = `低於標準值 -${12 - value}（下限 12）`;
      return { statusText: status, rangeText: '正常範圍: 12 ~ 20' };
    }

    case 'SBP': {
      let status = '落於正常範圍';
      if (value > 220) status = `超過標準值 +${value - 220}（上限 220）`;
      else if (value >= 200) status = `超過標準值 +${value - 200}（上限 200）`;
      else if (value < 90) status = `低於標準值 -${90 - value}（下限 90）`;
      return { statusText: status, rangeText: '正常範圍: 90 ~ 199' };
    }

    case 'DBP': {
      let status = '落於正常範圍';
      if (value > 130) status = `超過標準值 +${value - 130}（上限 130）`;
      else if (value >= 110) status = `超過標準值 +${value - 110}（上限 110）`;
      return { statusText: status, rangeText: '正常範圍: < 110' };
    }

    case 'SPO2': {
      let status = '落於正常範圍';
      if (value < 92) status = `低於標準值 -${92 - value}%（下限 92%）`;
      else if (value < 95) status = `低於標準值 -${95 - value}%（下限 95%）`;
      return { statusText: status, rangeText: '正常範圍: ≥ 95%' };
    }

    default:
      return { statusText: '落於正常範圍', rangeText: '' };
  }
}

interface VitalBarProps {
  label: string;
  displayValue: string | number;
  numericValue?: number;
  age?: number;
}

export const VitalBar: React.FC<VitalBarProps> = ({ label, displayValue, numericValue }) => {
  const { color, fillRatio, normalMinRatio, normalMaxRatio } = analyzeVital(label, numericValue);
  const { statusText, rangeText } = getTooltipDetails(label, numericValue);
  const [isHovered, setIsHovered] = useState(false);
  
  const iconPath = VITAL_ICONS[label] || VITAL_ICONS['HR'];
  const clipId = useId(); 

  // 自動為 SPO2 數值加上 % 符號
  const formattedDisplayValue = 
    label === 'SPO2' && displayValue !== undefined && displayValue !== null && !String(displayValue).endsWith('%')
      ? `${displayValue}%`
      : displayValue;

  const svgSize = 24;
  const fillHeight = svgSize * fillRatio;
  const yPos = svgSize - fillHeight;

  // 計算正常範圍上限與下限的 Y 軸座標
  const yMinPos = svgSize - (svgSize * normalMinRatio);
  const yMaxPos = svgSize - (svgSize * normalMaxRatio);

  // 判斷是否使用細長型試管 (SBP 與 DBP)
  const isTestTube = label === 'SBP' || label === 'DBP';
  
  // 試管幾何參數
  const tubeWidth = 6;
  const tubeX = (svgSize - tubeWidth) / 2; // 9
  const tubeRadius = tubeWidth / 2; // 3
  const tubeTopY = 2;
  const tubeBottomY = 22;
  const tubeStraightY = tubeBottomY - tubeRadius; // 19

  // 試管外框 Path
  const testTubePath = `M ${tubeX} ${tubeTopY} v ${tubeStraightY - tubeTopY} a ${tubeRadius} ${tubeRadius} 0 0 0 ${tubeWidth} 0 V ${tubeTopY} Z`;
  const testTubeRimPath = `M ${tubeX} ${tubeTopY} a ${tubeRadius} 1 0 0 0 ${tubeWidth} 0`;

  // 虛線端點位置
  const lineX1 = isTestTube ? tubeX - 3 : -1;
  const lineX2 = isTestTube ? tubeX + tubeWidth + 3 : svgSize + 1;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '6px', 
        width: '48px',
        cursor: 'pointer'
      }}
    >
      {/* 懸停彈出框 (Tooltip) */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '6px',
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          zIndex: 50,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          textAlign: 'left'
        }}>
          {/* 標題與當前數值 */}
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
            {label}: {formattedDisplayValue}
          </div>
          {/* 狀態說明 */}
          <div style={{ color: '#F3F4F6' }}>
            {statusText}
          </div>
          {/* 正常範圍參考 */}
          <div style={{ color: '#9CA3AF' }}>
            {rangeText}
          </div>

          {/* 底部小三角形箭頭 */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #1E293B'
          }} />
        </div>
      )}

      {/* 頂部標籤 */}
      <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 'bold' }}>{label}</div>
      
      {/* 視覺圖示 / 細長試管 */}
      <svg 
        viewBox="0 0 24 24" 
        width="36" 
        height="36" 
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y={yPos} width={svgSize} height={fillHeight} />
          </clipPath>
        </defs>
        
        {isTestTube ? (
          /* 細長試管 (SBP / DBP) */
          <>
            <path 
              d={testTubePath} 
              fill="#F3F4F6" 
              stroke="#D1D5DB" 
              strokeWidth="1.2" 
              strokeLinejoin="round" 
            />
            <path 
              d={testTubePath} 
              fill={color} 
              stroke={color} 
              strokeWidth="1.2" 
              strokeLinejoin="round" 
              clipPath={`url(#${clipId})`} 
            />
            <path 
              d={testTubeRimPath} 
              fill="none" 
              stroke="#9CA3AF" 
              strokeWidth="1" 
            />
          </>
        ) : (
          /* 一般 SVG 圖示 (T, HR, RR, SPO2) */
          <>
            <path 
              d={iconPath} 
              fill="#F3F4F6" 
              stroke="#D1D5DB" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            <path 
              d={iconPath} 
              fill={color} 
              stroke={color} 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
              clipPath={`url(#${clipId})`} 
            />
          </>
        )}

        {/* 正常範圍下限虛線 */}
        {normalMinRatio > 0 && normalMinRatio <= 1 && (
          <line 
            x1={lineX1} 
            y1={yMinPos} 
            x2={lineX2} 
            y2={yMinPos} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
            strokeDasharray="1.5 1.5" 
          />
        )}

        {/* 正常範圍上限虛線 */}
        {normalMaxRatio > 0 && normalMaxRatio <= 1 && (
          <line 
            x1={lineX1} 
            y1={yMaxPos} 
            x2={lineX2} 
            y2={yMaxPos} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
            strokeDasharray="1.5 1.5" 
          />
        )}
      </svg>
      
      {/* 底部數值 */}
      <div style={{ fontSize: '13px', fontWeight: 'bold', color: color }}>
        {formattedDisplayValue}
      </div>
    </div>
  );
};