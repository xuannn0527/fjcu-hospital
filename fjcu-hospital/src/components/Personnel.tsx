import { useState } from 'react';
import { Search, Filter, UserPlus, Phone, Stethoscope, X } from 'lucide-react';

export default function Personnel() {
  const [staffList, setStaffList] = useState([
    { id: 'D1001', name: '楊子孟', role: '急診主治醫師', status: '值班中', department: '急診醫學部', phone: 'ext. 8101' },
    { id: 'D1002', name: 'Judy', role: '急診住院醫師', status: '值班中', department: '急診醫學部', phone: 'ext. 8102' },
    { id: 'D1003', name: 'Nick', role: '急診總醫師', status: '會議中', department: '急診醫學部', phone: 'ext. 8105' },
    { id: 'D1004', name: 'Amy', role: '急診住院醫師', status: '下班', department: '急診醫學部', phone: 'ext. 8106' },
    { id: 'D1005', name: 'Tim', role: '急診主治醫師', status: '值班中', department: '急診醫學部', phone: 'ext. 8108' },
  ]);

  // 搜尋與篩選狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部');

  // 行內編輯狀態
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  // 新增專用的 Modal 狀態
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    id: '', name: '', role: '急診主治醫師', status: '值班中', department: '急診醫學部', phone: ''
  });

  // --- 邏輯處理區 ---

  const handleOpenAdd = () => {
    setAddFormData({
      id: `D${Math.floor(1000 + Math.random() * 9000)}`,
      name: '', role: '急診主治醫師', status: '值班中', department: '急診醫學部', phone: 'ext. '
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!addFormData.name.trim()) {
      alert('請填寫醫師姓名！');
      return;
    }
    setStaffList([addFormData, ...staffList]);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (staff: any) => {
    setEditingRowId(staff.id);
    setEditRowData({ ...staff });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditRowData({});
  };

  const handleSaveEdit = () => {
    if (!editRowData.name.trim()) {
      alert('請填寫醫師姓名！');
      return;
    }
    setStaffList(staffList.map(staff => staff.id === editingRowId ? editRowData : staff));
    setEditingRowId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除這位醫師嗎？這個動作無法復原。')) {
      setStaffList(staffList.filter(staff => staff.id !== id));
    }
  };

  const displayedStaff = staffList.filter((staff) => {
    const matchSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === '全部' || staff.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '值班中': return { bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0' };
      case '會議中': return { bg: '#FEF9C3', text: '#CA8A04', border: '#FEF08A' };
      case '下班': default: return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
    }
  };

  return (
    <div style={{ padding: '24px', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* 頂部標題與操作區 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1E293B', fontSize: '24px' }}>醫師管理系統</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <Search size={18} color="#94A3B8" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="搜尋姓名或編號..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '14px', width: '180px' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <Filter size={18} color="#475569" style={{ marginRight: '8px' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', padding: '8px 0', color: '#475569', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}
            >
              <option value="全部">全部狀態</option>
              <option value="值班中">值班中</option>
              <option value="會議中">會議中</option>
              <option value="下班">下班</option>
            </select>
          </div>

          <button 
            onClick={handleOpenAdd}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#2563EB', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: '15px' }}
          >
            <UserPlus size={20} strokeWidth={2.5} /> 新增醫師帳號
          </button>
        </div>
      </div>

      {/* 內容區塊：人員資料表 */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '10%' }}>醫師編號</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '15%' }}>姓名</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '15%' }}>職稱</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '15%' }}>部門</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '15%' }}>聯絡分機</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '10%' }}>當前狀態</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px', fontWeight: '600', width: '15%' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {displayedStaff.length > 0 ? (
              displayedStaff.map((staff) => {
                const isEditing = editingRowId === staff.id; 
                const currentStatus = isEditing ? editRowData.status : staff.status;
                const statusStyle = getStatusStyle(currentStatus);

                return (
                  <tr key={staff.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isEditing ? '#F8FAFC' : 'white' }}>
                    
                    {/* 醫師編號 */}
                    <td style={{ padding: '16px 24px', color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                      {staff.id}
                    </td>
                    
                    {/* 姓名 */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                          <Stethoscope size={16} />
                        </div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editRowData.name} 
                            onChange={(e) => setEditRowData({...editRowData, name: e.target.value})}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '14px' }}
                          />
                        ) : (
                          <span style={{ fontWeight: '600', color: '#1E293B' }}>{staff.name}</span>
                        )}
                      </div>
                    </td>
                    
                    {/* ★ 獨立的職稱欄位 */}
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                        <select 
                          value={editRowData.role}
                          onChange={(e) => setEditRowData({...editRowData, role: e.target.value})}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', width: '100%' }}
                        >
                          <option value="急診主治醫師">急診主治醫師</option>
                          <option value="急診住院醫師">急診住院醫師</option>
                          <option value="急診總醫師">急診總醫師</option>
                        </select>
                      ) : (
                        <span style={{ color: '#1E293B', fontSize: '14px', fontWeight: '500' }}>{staff.role}</span>
                      )}
                    </td>

                    {/* ★ 獨立的部門欄位 */}
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                         <input 
                           type="text" 
                           value={editRowData.department}
                           onChange={(e) => setEditRowData({...editRowData, department: e.target.value})}
                           style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '13px' }}
                         />
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '14px' }}>{staff.department}</span>
                      )}
                    </td>
                    
                    {/* 聯絡分機 */}
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editRowData.phone}
                          onChange={(e) => setEditRowData({...editRowData, phone: e.target.value})}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '14px' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
                          <Phone size={14} />{staff.phone}
                        </div>
                      )}
                    </td>
                    
                    {/* 當前狀態 */}
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                        <select 
                          value={editRowData.status}
                          onChange={(e) => setEditRowData({...editRowData, status: e.target.value})}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                        >
                          <option value="值班中">值班中</option>
                          <option value="會議中">會議中</option>
                          <option value="下班">下班</option>
                        </select>
                      ) : (
                        <span style={{ padding: '4px 12px', borderRadius: '6px', backgroundColor: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                          {staff.status}
                        </span>
                      )}
                    </td>
                    
                    {/* 操作按鈕 */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {isEditing ? (
                          <>
                            <button onClick={handleSaveEdit} style={{ backgroundColor: 'transparent', border: 'none', color: '#16A34A', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>儲存</button>
                            <button onClick={handleCancelEdit} style={{ backgroundColor: 'transparent', border: 'none', color: '#64748B', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>取消</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(staff)} style={{ backgroundColor: 'transparent', border: 'none', color: '#3B82F6', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>編輯</button>
                            <button onClick={() => handleDelete(staff.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>刪除</button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                  沒有找到符合條件的醫師資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 新增專用的彈出式表單 */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '400px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B' }}>新增醫師</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>醫師姓名</label>
                <input 
                  type="text" 
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>職稱</label>
                <select 
                  value={addFormData.role}
                  onChange={(e) => setAddFormData({...addFormData, role: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                >
                  <option value="急診主治醫師">急診主治醫師</option>
                  <option value="急診住院醫師">急診住院醫師</option>
                  <option value="急診總醫師">急診總醫師</option>
                </select>
              </div>

              {/* ★ 新增：部門填寫框 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>部門</label>
                <input 
                  type="text" 
                  value={addFormData.department}
                  onChange={(e) => setAddFormData({...addFormData, department: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>聯絡分機</label>
                <input 
                  type="text" 
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({...addFormData, phone: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>當前狀態</label>
                <select 
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({...addFormData, status: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                >
                  <option value="值班中">值班中</option>
                  <option value="會議中">會議中</option>
                  <option value="下班">下班</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: 'white', color: '#475569', cursor: 'pointer', fontWeight: '500' }}
              >
                取消
              </button>
              <button 
                onClick={handleSaveAdd}
                style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer', fontWeight: '500' }}
              >
                確認新增
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}