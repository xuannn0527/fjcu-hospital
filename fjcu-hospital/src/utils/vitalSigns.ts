// 顏色常數
export const COLOR_RED = '#EF4444';    // 紅燈：嚴重異常 / 危急
export const COLOR_YELLOW = '#F59E0B'; // 黃燈：輕中度異常 / 警告
export const COLOR_GREEN = '#10B981';  // 綠燈：正常範圍
export const COLOR_GRAY = '#9CA3AF';   // 無資料

export interface VitalStatus {
  color: string;
  detail: string;
}

export interface NormalRange {
  min?: number;
  max?: number;
}

const formatDifference = (difference: number): string =>
  Number.isInteger(difference) ? String(difference) : difference.toFixed(1);

const belowStandard = (value: number, boundary: number, color = COLOR_RED): VitalStatus => ({
  color,
  detail: `低於標準值 -${formatDifference(boundary - value)}（下限 ${boundary}）`,
});

const aboveStandard = (value: number, boundary: number, color = COLOR_RED): VitalStatus => ({
  color,
  detail: `超過標準值 +${formatDifference(value - boundary)}（上限 ${boundary}）`,
});

const normalStatus: VitalStatus = {
  color: COLOR_GREEN,
  detail: '落於正常範圍',
};

const unavailableStatus: VitalStatus = {
  color: COLOR_GRAY,
  detail: '無有效數值，無法判斷',
};

const getAdultOrChildTemperatureStatus = (value: number): VitalStatus => {
  if (value < 35) return belowStandard(value, 35);
  if (value > 41) return aboveStandard(value, 41);
  if (value < 36) return belowStandard(value, 36, COLOR_YELLOW);
  if (value >= 38) return aboveStandard(value, 38, COLOR_YELLOW);
  return normalStatus;
};

const getOxygenStatus = (value: number): VitalStatus => {
  if (value < 92) return belowStandard(value, 92);
  if (value < 95) return belowStandard(value, 95, COLOR_YELLOW);
  return normalStatus;
};

/**
 * 依據生命徵象急診檢傷標準與年齡判斷顏色及提示內容。
 * 顏色與 Tooltip 共用同一個結果，避免顯示狀態不一致。
 */
export const getVitalStatus = (label: string, val?: number, age: number = 20): VitalStatus => {
  if (val === undefined || val === null || !Number.isFinite(val)) return unavailableStatus;

  const key = label.trim().toUpperCase();

  // 成人標準 (Age >= 18)
  if (age >= 18) {
    switch (key) {
      case 'T':
        return getAdultOrChildTemperatureStatus(val);
      case 'SPO2':
        return getOxygenStatus(val);
      case 'HR':
        if (val < 50) return belowStandard(val, 50);
        if (val > 140) return aboveStandard(val, 140);
        if (val > 100) return aboveStandard(val, 100, COLOR_YELLOW);
        return normalStatus;
      case 'SBP':
        if (val < 90) return belowStandard(val, 90);
        if (val > 220) return aboveStandard(val, 220);
        if (val >= 200) return aboveStandard(val, 200, COLOR_YELLOW);
        return normalStatus;
      case 'DBP':
        if (val > 130) return aboveStandard(val, 130);
        if (val >= 110) return aboveStandard(val, 110, COLOR_YELLOW);
        return normalStatus;
      case 'RR':
        if (val < 10) return belowStandard(val, 10);
        if (val > 25) return aboveStandard(val, 25);
        if (val < 12) return belowStandard(val, 12, COLOR_YELLOW);
        if (val > 20) return aboveStandard(val, 20, COLOR_YELLOW);
        return normalStatus;
      default:
        return normalStatus;
    }
  }

  // 兒童標準 (> 3 歲)
  if (age > 3) {
    switch (key) {
      case 'T':
        return getAdultOrChildTemperatureStatus(val);
      case 'SPO2':
        return getOxygenStatus(val);
      case 'HR':
        if (val < 60) return belowStandard(val, 60);
        if (val > 130) return aboveStandard(val, 130);
        return normalStatus;
      case 'SBP': {
        const minSbp = age > 10 ? 90 : 70 + (age * 2);
        if (val < minSbp) return belowStandard(val, minSbp);
        return normalStatus;
      }
      case 'RR':
        if (val < 10) return belowStandard(val, 10);
        if (val > 40) return aboveStandard(val, 40);
        return normalStatus;
      default:
        return normalStatus;
    }
  }

  // 兒童標準 (3 個月 ~ 3 歲)
  if (age >= 0.25) {
    switch (key) {
      case 'T':
        return getAdultOrChildTemperatureStatus(val);
      case 'SPO2':
        return getOxygenStatus(val);
      case 'HR':
        if (val < 90) return belowStandard(val, 90);
        if (val > 150) return aboveStandard(val, 150);
        return normalStatus;
      case 'SBP':
        if (age >= 1 && val < (70 + age * 2)) return belowStandard(val, 70 + age * 2);
        return normalStatus;
      case 'RR':
        if (val < 10) return belowStandard(val, 10);
        if (val > 40) return aboveStandard(val, 40);
        return normalStatus;
      default:
        return normalStatus;
    }
  }

  // 嬰兒 (< 3 個月)
  switch (key) {
    case 'T':
      if (val < 36) return belowStandard(val, 36);
      if (val > 38) return aboveStandard(val, 38);
      return normalStatus;
    case 'SPO2':
      return getOxygenStatus(val);
    case 'HR':
      if (val < 110) return belowStandard(val, 110);
      if (val > 170) return aboveStandard(val, 170);
      return normalStatus;
    case 'RR':
      if (val < 10) return belowStandard(val, 10);
      if (val > 60) return aboveStandard(val, 60);
      return normalStatus;
    default:
      return normalStatus;
  }
};

/**
 * 依據生命徵象急診檢傷評估標準表動態判斷顏色。
 */
export const getVitalStatusColor = (label: string, val?: number, age: number = 20): string =>
  getVitalStatus(label, val, age).color;

/** 回傳綠燈範圍邊界，供長條圖標示；需與 getVitalStatus 的規則保持一致。 */
export const getNormalRange = (label: string, age: number = 20): NormalRange | undefined => {
  const key = label.trim().toUpperCase();

  if (key === 'SPO2') return { min: 95 };

  if (age >= 18) {
    switch (key) {
      case 'T': return { min: 36, max: 38 };
      case 'HR': return { min: 50, max: 100 };
      case 'SBP': return { min: 90, max: 200 };
      case 'DBP': return { max: 110 };
      case 'RR': return { min: 12, max: 20 };
      default: return undefined;
    }
  }

  if (age > 3) {
    switch (key) {
      case 'T': return { min: 36, max: 38 };
      case 'HR': return { min: 60, max: 130 };
      case 'SBP': return { min: age > 10 ? 90 : 70 + age * 2 };
      case 'RR': return { min: 10, max: 40 };
      default: return undefined;
    }
  }

  if (age >= 0.25) {
    switch (key) {
      case 'T': return { min: 36, max: 38 };
      case 'HR': return { min: 90, max: 150 };
      case 'SBP': return age >= 1 ? { min: 70 + age * 2 } : undefined;
      case 'RR': return { min: 10, max: 40 };
      default: return undefined;
    }
  }

  switch (key) {
    case 'T': return { min: 36, max: 38 };
    case 'HR': return { min: 110, max: 170 };
    case 'RR': return { min: 10, max: 60 };
    default: return undefined;
  }
};

/** 格式化綠燈範圍，供 Tooltip 顯示。 */
export const formatRange = (range?: NormalRange): string | undefined => {
  if (!range) return undefined;
  if (range.min !== undefined && range.max !== undefined) return `${range.min} ~ ${range.max}`;
  if (range.min !== undefined) return `≥ ${range.min}`;
  if (range.max !== undefined) return `< ${range.max}`;
  return undefined;
};
