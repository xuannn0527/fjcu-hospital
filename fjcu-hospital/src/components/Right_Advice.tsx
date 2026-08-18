import { useState, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';

interface RightAdviceProps {
  recommendations: string[];
  selectedItems: string[];
  showManualInput: boolean;
  manualNote: string;
  isSubmitting?: boolean;
  currentStatus?: string;
  onCheckboxChange: (item: string) => void;
  onToggleManualInput: () => void;
  onManualNoteChange: (note: string) => void;
  onSubmit: () => void;
}

export default function RightAdvice({
  recommendations,
  selectedItems,
  showManualInput,
  manualNote,
  isSubmitting = false,
  currentStatus = '未處理',
  onCheckboxChange,
  onToggleManualInput,
  onManualNoteChange,
  onSubmit,
}: RightAdviceProps) {
  
  const isObserving = currentStatus === '觀察中';

  // 本地狀態管理
  const [originalRecsStr, setOriginalRecsStr] = useState<string>('');
  const [localRecs, setLocalRecs] = useState<string[]>([]);
  
  // 全局編輯模式狀態
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [editRecs, setEditRecs] = useState<string[]>([]);

  // 當切換不同病患時，重置本地的編輯狀態
  useEffect(() => {
    const currentStr = JSON.stringify(recommendations);
    if (currentStr !== originalRecsStr) {
      setOriginalRecsStr(currentStr);
      setLocalRecs(recommendations);
      setIsEditingAll(false);
    }
  }, [recommendations, originalRecsStr]);

  // 開啟全局編輯
  const startEditAll = () => {
    setEditRecs([...localRecs]);
    setIsEditingAll(true);
  };

  // 儲存全局編輯
  const saveEditAll = () => {
    const filteredRecs = editRecs.map(r => r.trim()).filter(r => r !== '');

    const oldSelectedIndices = localRecs
      .map((rec, i) => selectedItems.includes(rec) ? i : -1)
      .filter(i => i !== -1);

    setLocalRecs(filteredRecs);
    setIsEditingAll(false);

    oldSelectedIndices.forEach(idx => {
      if (idx < filteredRecs.length) {
        const oldText = localRecs[idx];
        const newText = filteredRecs[idx];
        if (oldText !== newText && selectedItems.includes(oldText)) {
          onCheckboxChange(oldText); 
          onCheckboxChange(newText); 
        }
      }
    });
  };

  const handleEditChange = (idx: number, value: string) => {
    const updated = [...editRecs];
    updated[idx] = value;
    setEditRecs(updated);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '16px',
          opacity: isObserving ? 0.6 : 1,
          pointerEvents: isObserving ? 'none' : 'auto'
        }}
      >
        {/* ==================== 標題區塊 ==================== */}
        <h4
          style={{
            fontSize: '14px',
            color: '#1E293B',
            margin: '0 0 14px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '28px' // ★ 確保標題列有足夠的高度
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>AI 處置建議 (勾選欲採納之項目)</span>
            
            {/* ★ 編輯按鈕區塊：高度與外觀統一 */}
            {!isObserving && !isSubmitting && (
              !isEditingAll ? (
                <button
                  onClick={startEditAll}
                  style={{
                    height: '28px', // ★ 鎖定高度
                    width: '36px',  // ★ 給予固定寬度，讓它不會太瘦小
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // 內容置中
                    background: '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#3B82F6';
                    e.currentTarget.style.backgroundColor = '#DBEAFE';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.backgroundColor = '#E2E8F0';
                  }}
                  title="編輯建議"
                >
                  <Pencil size={15} />
                </button>
              ) : (
                <button
                  onClick={saveEditAll}
                  style={{
                    height: '28px', // ★ 鎖定與鉛筆相同的高度
                    padding: '0 12px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '6px', 
                    border: '1px solid #6EE7B7', 
                    background: '#D1FAE5', 
                    color: '#059669', 
                    cursor: 'pointer', 
                    borderRadius: '6px', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#A7F3D0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1FAE5';
                  }}
                >
                  <Check size={15} strokeWidth={2.5} /> 完成
                </button>
              )
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal', backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
            已選 {selectedItems.length} 項
          </span>
        </h4>
        
        {/* ==================== 清單區塊 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {localRecs.map((item, idx) => {
            const isChecked = selectedItems.includes(item);
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: isChecked ? '#EFF6FF' : 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isChecked ? '#93C5FD' : '#E2E8F0'}`,
                  fontSize: '14px',
                  color: isChecked ? '#1E40AF' : '#334155',
                  boxShadow: isChecked ? '0 1px 2px rgba(59, 130, 246, 0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                  minHeight: '44px',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => { if (!isEditingAll) onCheckboxChange(item); }}
                  disabled={isSubmitting || isObserving || isEditingAll}
                  style={{ cursor: (isObserving || isEditingAll) ? 'default' : 'pointer', margin: 0 }}
                />
                
                {isEditingAll ? (
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#94A3B8', width: '18px', textAlign: 'right' }}>
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={editRecs[idx]}
                      onChange={(e) => handleEditChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditAll();
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #93C5FD',
                        outlineColor: '#3B82F6',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#0F172A',
                        backgroundColor: '#F8FAFC',
                        margin: 0,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => { if (!isObserving && !isEditingAll) onCheckboxChange(item); }}
                    style={{ flex: 1, cursor: isObserving ? 'default' : 'pointer' }}
                  >
                    <span style={{ lineHeight: '1.5', fontWeight: isChecked ? 'bold' : 'normal' }}>
                      {idx + 1}. {item}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ==================== 手動輸入/補充醫囑 ==================== */}
        <div style={{ marginTop: '14px' }}>
          <button
            onClick={onToggleManualInput}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: showManualInput ? '#F1F5F9' : '#FFFFFF',
              color: showManualInput ? '#475569' : '#3B82F6',
              border: showManualInput ? '1px solid #CBD5E1' : '1px dashed #3B82F6',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {showManualInput ? '▲ 折疊手動輸入' : '+ 手動輸入/補充醫囑'}
          </button>
          
          {showManualInput && (
            <textarea
              value={manualNote}
              onChange={(e) => onManualNoteChange(e.target.value)}
              placeholder="請在此直接輸入額外補充之處置建議..."
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '70px',
                marginTop: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                boxSizing: 'border-box',
                resize: 'vertical',
                backgroundColor: isSubmitting ? '#F1F5F9' : 'white',
                outlineColor: '#3B82F6'
              }}
            />
          )}
        </div>
      </div>
      
      {/* ==================== 底部按鈕 ==================== */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%',
          backgroundColor: isSubmitting ? '#94A3B8' : (isObserving ? '#F59E0B' : '#3B82F6'), 
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          marginTop: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        {isSubmitting ? '處理中...' : (isObserving ? '取消觀察 (轉回待處理)' : '確定轉入觀察')}
      </button>
    </>
  );
}