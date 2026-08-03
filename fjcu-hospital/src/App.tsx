import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css'; // 保留基本的 CSS 引入

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      {/* 左邊：側邊欄 */}
      <Sidebar />
      
      {/* 右邊：一個包含 Header 和 Dashboard 的區塊 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;