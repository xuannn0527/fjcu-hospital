interface RightAdviceProps {
  recommendations: string[];
  selectedItems: string[];
  showManualInput: boolean;
  manualNote: string;
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
  onCheckboxChange,
  onToggleManualInput,
  onManualNoteChange,
  onSubmit,
}: RightAdviceProps) {
  return (
    <>
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '14px',
        }}
      >
        <h4
          style={{
            fontSize: '13px',
            color: '#1E293B',
            margin: '0 0 10px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>AI 處置建議 (勾選欲採納之項目)</span>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 'normal' }}>
            已選 {selectedItems.length} 項
          </span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recommendations.map((item, idx) => {
            const isChecked = selectedItems.includes(item);
            return (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: isChecked ? '#EFF6FF' : 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${isChecked ? '#93C5FD' : '#E2E8F0'}`,
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: isChecked ? '#1E40AF' : '#334155',
                  fontWeight: isChecked ? 'bold' : 'normal',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onCheckboxChange(item)}
                />
                <span>
                  {idx + 1}. {item}
                </span>
              </label>
            );
          })}
        </div>
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={onToggleManualInput}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: showManualInput ? '#E2E8F0' : '#FFFFFF',
              color: '#3B82F6',
              border: '1px dashed #3B82F6',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {showManualInput ? '▲ 折疊手動輸入' : '手動輸入/補充醫囑'}
          </button>
          {showManualInput && (
            <textarea
              value={manualNote}
              onChange={(e) => onManualNoteChange(e.target.value)}
              placeholder="請在此直接輸入補充之處置建議..."
              style={{
                width: '100%',
                height: '65px',
                marginTop: '8px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          )}
        </div>
      </div>
      <button
        onClick={onSubmit}
        style={{
          width: '100%',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '4px',
        }}
      >
        轉入觀察
      </button>
    </>
  );
}