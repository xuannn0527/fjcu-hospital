export default function LeftPanel({ totalCount, error }: any) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3>候診概況</h3>
      {error ? (
         <p style={{color: 'red'}}>連線問題: {error}</p>
      ) : (
         <p>總候診人數: <strong style={{ fontSize: '24px', color: '#EF4444' }}>{totalCount}</strong> 人</p>
      )}
    </div>
  );
}