import React, { useId } from 'react';
import { formatRange, getNormalRange, getVitalStatus } from '../utils/vitalSigns';
import './VitalBar.css';

interface VitalBarProps {
  label: string;
  displayValue: string | number;
  numericValue?: number;
  age?: number;
}

const VITAL_SCALES: Record<string, { min: number; max: number }> = {
  T: { min: 32, max: 42 },
  HR: { min: 40, max: 150 },
  RR: { min: 5, max: 30 },
  SBP: { min: 60, max: 240 },
  DBP: { min: 30, max: 140 },
  SPO2: { min: 80, max: 100 },
};

const getVitalScale = (label: string): { min: number; max: number } | undefined =>
  VITAL_SCALES[label.trim().toUpperCase()];

const getRawPercent = (label: string, val: number): number | undefined => {
  const scale = getVitalScale(label);
  if (!scale || !Number.isFinite(val)) return undefined;
  return ((val - scale.min) / (scale.max - scale.min)) * 100;
};

const getVitalHeight = (label: string, val: number | undefined): number => {
  if (val === undefined || val === null || !Number.isFinite(val)) return 50;
  const percent = getRawPercent(label, val);
  if (percent === undefined) return 60;
  return Math.min(100, Math.max(10, percent));
};

export const VitalBar: React.FC<VitalBarProps> = ({
  label,
  displayValue,
  numericValue,
  age = 20,
}) => {
  const { color, detail } = getVitalStatus(label, numericValue, age);
  const barHeight = getVitalHeight(label, numericValue);
  const range = getNormalRange(label, age);
  const rangeText = formatRange(range);
  const tooltipId = useId();
  const markers = [range?.min, range?.max]
    .filter((value): value is number => value !== undefined)
    .map((value) => getRawPercent(label, value))
    .filter((percent): percent is number => percent !== undefined && percent > 0 && percent < 100);

  return (
    <div
      className="vital-bar"
      tabIndex={0}
      aria-describedby={tooltipId}
      aria-label={`${label}: ${displayValue}，${detail}${rangeText ? `，正常範圍 ${rangeText}` : ''}`}
    >
      <span className="vital-bar__value" style={{ color }}>
        {displayValue}
      </span>
      <div className="vital-bar__chart" aria-hidden="true">
        <div className="vital-bar__track">
          <div
            className="vital-bar__fill"
            style={{
              height: `${barHeight}%`,
              backgroundColor: color,
            }}
          />
        </div>
        {markers.map((percent) => (
          <div key={percent} className="vital-bar__limit" style={{ bottom: `${percent}%` }} />
        ))}
      </div>
      <span id={tooltipId} role="tooltip" className="vital-bar__tooltip">
        <strong>{label}: {displayValue}</strong>
        <span>{detail}</span>
        {rangeText && <span>正常範圍: {rangeText}</span>}
      </span>
    </div>
  );
};
