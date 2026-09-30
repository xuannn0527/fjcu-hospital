// 顏色常數
export const COLOR_RED = '#EF4444';    // 紅燈：嚴重異常 / 危急
export const COLOR_YELLOW = '#F59E0B'; // 黃燈：輕中度異常 / 警告
export const COLOR_GREEN = '#10B981';  // 綠燈：正常範圍
export const COLOR_GRAY = '#9CA3AF';   // 無資料

/**
 * 依據「生命徵象急診檢傷評估標準表」動態判斷顏色
 */
export const getVitalStatusColor = (label: string, val?: number, age: number = 20): string => {
  if (val === undefined || val === null || isNaN(val)) return COLOR_GRAY;

  // 1. 成人標準 (Age >= 18)
  if (age >= 18) {
    switch (label) {
      case 'T':
        if (val < 35.0 || val > 41.0) return COLOR_RED;
        if ((val >= 35.0 && val < 36.0) || (val >= 38.0 && val <= 40.9)) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'SpO2':
        if (val < 92) return COLOR_RED;
        if (val >= 92 && val <= 94) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'HR':
        if (val < 50 || val > 140) return COLOR_RED;
        if (val > 100 && val <= 140) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'SBP':
        if (val < 90 || val > 220) return COLOR_RED;
        if (val >= 200 && val <= 220) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'DBP':
        if (val > 130) return COLOR_RED;
        if (val >= 110 && val <= 130) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'RR':
        if (val < 10 || val > 25) return COLOR_RED;
        if ((val >= 10 && val < 12) || (val > 20 && val <= 25)) return COLOR_YELLOW;
        return COLOR_GREEN;
      default:
        return COLOR_GREEN;
    }
  }

  // 2. 兒童標準 (> 3 歲)
  if (age > 3) {
    switch (label) {
      case 'T':
        if (val < 35.0 || val > 41.0) return COLOR_RED;
        if ((val >= 35.0 && val < 36.0) || (val >= 38.0 && val <= 40.9)) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'SpO2':
        if (val < 92) return COLOR_RED;
        if (val >= 92 && val <= 94) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'HR':
        if (val < 60 || val > 130) return COLOR_RED;
        return COLOR_GREEN;
      case 'SBP':
        const minSbp = age > 10 ? 90 : 70 + (age * 2);
        if (val < minSbp) return COLOR_RED;
        return COLOR_GREEN;
      case 'RR':
        if (val < 10 || val > 40) return COLOR_RED;
        return COLOR_GREEN;
      default:
        return COLOR_GREEN;
    }
  }

  // 3. 兒童標準 (3個月 ~ 3歲)
  if (age >= 0.25) {
    switch (label) {
      case 'T':
        if (val < 35.0 || val > 41.0) return COLOR_RED;
        if ((val >= 35.0 && val < 36.0) || (val >= 38.0 && val <= 40.9)) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'SpO2':
        if (val < 92) return COLOR_RED;
        if (val >= 92 && val <= 94) return COLOR_YELLOW;
        return COLOR_GREEN;
      case 'HR':
        if (val < 90 || val > 150) return COLOR_RED;
        return COLOR_GREEN;
      case 'SBP':
        if (age >= 1 && val < (70 + age * 2)) return COLOR_RED;
        return COLOR_GREEN;
      case 'RR':
        if (val < 10 || val > 40) return COLOR_RED;
        return COLOR_GREEN;
      default:
        return COLOR_GREEN;
    }
  }

  // 4. 嬰兒 (< 3 個月)
  switch (label) {
    case 'T':
      if (val < 36.0 || val > 38.0) return COLOR_RED;
      return COLOR_GREEN;
    case 'SpO2':
      if (val < 92) return COLOR_RED;
      if (val >= 92 && val <= 94) return COLOR_YELLOW;
      return COLOR_GREEN;
    case 'HR':
      if (val < 110 || val > 170) return COLOR_RED;
      return COLOR_GREEN;
    case 'RR':
      if (val < 10 || val > 60) return COLOR_RED;
      return COLOR_GREEN;
    default:
      return COLOR_GREEN;
  }
};