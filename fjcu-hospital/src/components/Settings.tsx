import { useState } from 'react';
import { User, Bell, Activity, Eye, MapPin, Shield, KeyRound, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function Settings({ isDarkMode, onToggleDarkMode }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');

  // 個人資訊狀態
  const [userInfo, setUserInfo] = useState({
    name: '楊子孟',
    empId: 'D10982',
    department: '急診醫學部',
    title: '主治醫師',
    licenseId: '醫字第 045123 號',
    email: 'yang@fjuh.fju.edu.tw',
    extension: '3502',
  });

  const [alertLevel, setAlertLevel] = useState('high');
  const [dutyArea, setDutyArea] = useState('急救重症區');

  // 深色/淺色動態顏色設定
  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    cardBg: isDarkMode ? '#1E293B' : 'white',
    cardInnerBg: isDarkMode ? '#334155' : '#F8FAFC',
    textPrimary: isDarkMode ? '#F8FAFC' : '#1E293B',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#CBD5E1',
    inputBg: isDarkMode ? '#0F172A' : 'white',
    inputDisabledBg: isDarkMode ? '#1E293B' : '#F1F5F9',
  };

  const tabs = [
    { id: 'profile', label: '個人基本資訊', icon: <User size={18} /> },
    { id: 'notifications', label: '預警與通知', icon: <Bell size={18} /> },
    { id: 'ai', label: 'AI 決策輔助模組', icon: <Activity size={18} /> },
    { id: 'display', label: '介面與顯示', icon: <Eye size={18} /> },
    { id: 'area', label: '班別與責任區', icon: <MapPin size={18} /> },
    { id: 'security', label: '帳號與安全', icon: <Shield size={18} /> },
  ];

  return (
    <div style={{ padding: '32px', backgroundColor: theme.bg, minHeight: '100%', transition: 'all 0.3s' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: theme.textPrimary, marginTop: 0, marginBottom: '24px' }}>
        系統偏好設定
      </h2>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左側選單頁籤 */}
        <div style={{ width: '220px', backgroundColor: theme.cardBg, borderRadius: '12px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? (isDarkMode ? '#2563EB' : '#EFF6FF') : 'transparent',
                color: activeTab === tab.id ? (isDarkMode ? 'white' : '#3B82F6') : theme.textSecondary,
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '4px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 右側設定內容頁面 */}
        <div style={{ flex: 1, backgroundColor: theme.cardBg, borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: theme.textPrimary }}>
          
          {/* 1. 個人基本資訊 */}
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>個人基本資訊</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: theme.cardInnerBg, borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {userInfo.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.textPrimary }}>
                    {userInfo.name} <span style={{ fontSize: '14px', color: '#3B82F6', fontWeight: 'normal', backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>{userInfo.title}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '4px' }}>
                    {userInfo.department} ｜ 員工編號：{userInfo.empId}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E', fontSize: '14px', fontWeight: '500' }}>
                  <CheckCircle2 size={18} /> 醫事憑證卡驗證完成
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>姓名</label>
                  <input 
                    type="text" 
                    value={userInfo.name} 
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>員工編號</label>
                  <input 
                    type="text" 
                    value={userInfo.empId} 
                    disabled 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputDisabledBg, color: theme.textSecondary, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>所屬科別</label>
                  <input 
                    type="text" 
                    value={userInfo.department} 
                    disabled 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputDisabledBg, color: theme.textSecondary, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>醫師執照證號</label>
                  <input 
                    type="text" 
                    value={userInfo.licenseId} 
                    disabled 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputDisabledBg, color: theme.textSecondary, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>院內信箱 Email</label>
                  <input 
                    type="email" 
                    value={userInfo.email} 
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textSecondary, marginBottom: '6px' }}>急診公務機 / 分機號碼</label>
                  <input 
                    type="text" 
                    value={userInfo.extension} 
                    onChange={(e) => setUserInfo({ ...userInfo, extension: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 24px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  儲存修改
                </button>
              </div>
            </div>
          )}

          {/* 4. 介面與顯示（開啟深色模式的地方） */}
          {activeTab === 'display' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>介面與顯示偏好</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '16px' }}>
                <input 
                  type="checkbox" 
                  checked={isDarkMode} 
                  onChange={(e) => onToggleDarkMode(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                開啟夜班深色模式 (Dark Mode)
              </label>
              <p style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '8px', marginLeft: '30px' }}>
                切換後全系統介面將呈現深色調，降低大夜班診間光線對眼睛的刺激。
              </p>
            </div>
          )}

          {/* 其他頁籤簡化示意 */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>預警與通知設定</h3>
              <select value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary }}>
                <option value="high">僅提示高風險（極危急）病患</option>
                <option value="all">提示所有風險（高、中度風險）</option>
              </select>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>AI 決策輔助模組啟用選項</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 敗血症 (Sepsis) 早期預警系統</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 心肌梗塞 (STEMI) 心電圖自動判讀</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 急性中風 (NIHSS) 風險評估</label>
              </div>
            </div>
          )}

          {activeTab === 'area' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>當前值班區域</h3>
              <select value={dutyArea} onChange={(e) => setDutyArea(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary }}>
                <option value="急救重症區">急救重症區</option>
                <option value="內科診間">內科診間</option>
                <option value="外科診間">外科診間</option>
                <option value="留觀區">留觀區</option>
              </select>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '18px' }}>帳號與安全設定</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <input type="password" placeholder="輸入舊密碼" style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary }} />
                <input type="password" placeholder="輸入新密碼" style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textPrimary }} />
                <button style={{ padding: '10px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <KeyRound size={16} /> 更新密碼
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}