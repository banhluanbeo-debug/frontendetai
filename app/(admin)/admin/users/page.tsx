"use client";
import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  dob: string | null;
  role: string;
  status: boolean;
  password?: string;
  createdAt: string;
}

interface UserHistory {
  movieTitle: string;
  posterUrl: string;
  showDate: string;
  showTime: string;
  ticketCount: number;
  totalAmount: number;
  status: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) => {
  if (!d) return "Chưa cập nhật";
  return d.split("-").reverse().join("/");
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Modal Thêm User
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "", role: "USER" });

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    fetch(`http://localhost:8080/api/statistics/user/${selectedUser.id}/history`)
      .then(r => r.json())
      .then(d => setHistory(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, [selectedUser]);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.phone?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleToggleStatus = async (e: React.MouseEvent, u: User) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc muốn ${u.status ? "khoá" : "mở khoá"} tài khoản ${u.email}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...u, status: !u.status })
      });
      if (res.ok) fetchUsers();
      else alert("Cập nhật thất bại!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn xoá người dùng ${name} vĩnh viễn?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedUser?.id === id) setSelectedUser(null);
        fetchUsers();
      } else {
        alert("Xoá thất bại!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ name: "", email: "", phone: "", password: "", role: "USER" });
        fetchUsers();
      } else {
        alert("Thêm thất bại!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#0f172a", minHeight: "100vh", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {selectedUser ? (
        /* Màn hình 2: Chi tiết Lịch sử Khách hàng */
        <div>
          <button onClick={() => setSelectedUser(null)} style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
            ← Quay lại danh sách khách hàng
          </button>

          {/* User Info Header */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: 24 }}>
            <img 
              src={selectedUser.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedUser.name) + "&background=6366f1&color=fff"} 
              alt={selectedUser.name} 
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #f1f5f9" }} 
            />
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 12 }}>
                {selectedUser.name}
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: selectedUser.role === "ADMIN" ? "#fef08a" : "#e2e8f0", color: selectedUser.role === "ADMIN" ? "#854d0e" : "#475569" }}>{selectedUser.role}</span>
              </h1>
              <div style={{ display: "flex", gap: 16, color: "#64748b", fontSize: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📧 {selectedUser.email}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📞 {selectedUser.phone || "Chưa cập nhật"}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🎂 {fmtDate(selectedUser.dob!)}</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 20, textAlign: "right" }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Tổng số đơn</p>
                <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{history.length} đơn</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Tổng chi tiêu</p>
                <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#059669" }}>{fmt(history.reduce((s, h) => s + h.totalAmount, 0))}</p>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1e293b" }}>Lịch sử Đặt vé</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, overflow: "hidden", display: "flex" }}>
                <img 
                  src={h.posterUrl ? `http://localhost:8080/images/${h.posterUrl}` : "https://placehold.co/100x150?text=No+Poster"} 
                  alt={h.movieTitle} 
                  style={{ width: 100, objectFit: "cover", backgroundColor: "#f1f5f9" }} 
                />
                <div style={{ padding: 16, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{h.movieTitle}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, 
                      background: h.status === "PAID" ? "#dcfce7" : "#f1f5f9", 
                      color: h.status === "PAID" ? "#166534" : "#475569" }}>
                      {h.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: "0 0 4px", fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                    📆 {fmtDate(h.showDate)} • ⏰ {h.showTime?.substring(0,5)}
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <span style={{ background: "#f8fafc", padding: "4px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>
                      {h.ticketCount} vé
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
                      {fmt(h.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: "1/-1", background: "#fff", border: "1.5px dashed #cbd5e1", borderRadius: 16, padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                Khách hàng này chưa đặt vé nào.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Màn hình 1: Danh sách Khách hàng */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý Khách hàng</h1>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Tổng số {users.length} người dùng trên hệ thống</p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Tìm tên, email, SĐT..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{ padding: "10px 14px 10px 36px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", fontWeight: 400, background: "#fff", width: 260, outline: "none", transition: "border-color .15s" }}
                  onFocus={e => (e.target.style.borderColor = "#6366f1")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                style={{ background: "#6366f1", color: "#fff", border: "none", padding: "0 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                + Thêm người dùng
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
                  {["Người dùng", "Liên hệ", "Vai trò", "Trạng thái", "Hành động"].map((h, i) => (
                    <th key={i} style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: i === 4 ? "right" : "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? paginatedUsers.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background .15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                      onClick={() => setSelectedUser(u)}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img 
                          src={u.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name) + "&background=f1f5f9&color=475569"} 
                          alt={u.name} 
                          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", filter: u.status ? "none" : "grayscale(100%) opacity(0.6)" }} 
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: u.status ? "#1e293b" : "#94a3b8" }}>{u.name}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>ID: {u.id} • Sinh: {fmtDate(u.dob)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: u.status ? "#334155" : "#94a3b8" }}>{u.email}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>{u.phone || "—"}</p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: u.role === "ADMIN" ? "#fef08a" : "#f1f5f9", color: u.role === "ADMIN" ? "#854d0e" : "#475569" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: u.status ? "#dcfce7" : "#fee2e2", color: u.status ? "#166534" : "#991b1b" }}>
                        {u.status ? "Hoạt động" : "Đã khoá"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={(e) => handleToggleStatus(e, u)}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = u.status ? "#f87171" : "#34d399"; (e.currentTarget as HTMLButtonElement).style.color = u.status ? "#ef4444" : "#10b981"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}>
                        {u.status ? "Khoá" : "Mở khoá"}
                      </button>
                      <button onClick={(e) => handleDeleteUser(e, u.id, u.name)}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fecaca"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; }}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                    Không tìm thấy khách hàng nào.
                  </td></tr>
                )}
              </tbody>
            </table>
            
            {/* Phân trang */}
            {totalPages > 1 && (
              <div style={{ padding: "16px 20px", borderTop: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>Trang {page} / {totalPages}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: page === 1 ? "#cbd5e1" : "#475569", cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: 600 }}>Trang trước</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: page === totalPages ? "#cbd5e1" : "#475569", cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: 600 }}>Trang sau</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Thêm người dùng */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleAddUser} style={{ background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Thêm Người Dùng</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 24, color: "#94a3b8", cursor: "pointer", padding: 0 }}>×</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Họ và tên</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Số điện thoại</label>
                <input type="text" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Mật khẩu</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Vai trò</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none" }}>
                  <option value="USER">Người dùng (USER)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>
            </div>

            <button type="submit" style={{ width: "100%", padding: "12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Xác nhận Thêm mới
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
