import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡未來可以替換成呼叫後端 API 進行帳號密碼驗證
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC' // 呼應你 App.tsx 與 Dashboard 的背景色
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#3B82F6',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Users size={36} color="white" />
        </div>
        
        <h2 style={{ margin: '0 0 8px 0', color: '#1E293B' }}>急診臨床決策輔助系統</h2>
        <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#64748B' }}>EMERGENCY CLINICAL DECISION SUPPORT</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>帳號 / 員工編號</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', outline: 'none' }}
              placeholder="請輸入帳號"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>密碼</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', outline: 'none' }}
              placeholder="請輸入密碼"
            />
          </div>
          <button 
            type="submit" 
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '14px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            登入
          </button>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>忘記密碼？請聯絡系統管理員</span>
          </div>
        </form>
      </div>
    </div>
  );
}