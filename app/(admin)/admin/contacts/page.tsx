"use client";

import { useState, useEffect } from "react";

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const BASE_URL = "https://backendemo-cbwy.onrender.com/api/contacts";

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setContacts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const updateStatus = async (id: number, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`${BASE_URL}/${id}/status?status=${status}`, { method: "PUT" });
            if (!res.ok) throw new Error("Failed");
            loadData();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi cập nhật trạng thái");
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = contacts.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.phone || "").includes(searchQuery);
        const matchStatus = filterStatus === "ALL" || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const newCount = contacts.filter(c => c.status === "NEW").length;
    const inProgressCount = contacts.filter(c => c.status === "IN_PROGRESS").length;
    const resolvedCount = contacts.filter(c => c.status === "RESOLVED").length;

    const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
        NEW: { label: "Mới", color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
        IN_PROGRESS: { label: "Đang xử lý", color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
        RESOLVED: { label: "Đã xử lý", color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.97) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .row-anim {
                    animation: fadeIn 0.25s ease both;
                }
                .modal-anim {
                    animation: modalIn 0.22s ease both;
                }
                .input-field {
                    width: 100%;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 9px 13px;
                    font-size: 14px;
                    color: #000;
                    font-weight: 500;
                    background: #fff;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    outline: none;
                }
                .input-field:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .input-field::placeholder { color: #9ca3af; }
                .btn-primary {
                    background: #4f46e5;
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    padding: 10px 22px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                }
                .btn-primary:hover { background: #4338ca; }
                .btn-primary:active { transform: scale(0.98); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-ghost {
                    background: transparent;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 9px 18px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                    font-weight: 500;
                }
                .btn-ghost:hover { background: #f3f4f6; border-color: #d1d5db; }
                .filter-btn {
                    padding: 7px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1.5px solid #e5e7eb;
                    background: #fff;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .filter-btn:hover { border-color: #d1d5db; background: #f9fafb; }
                .filter-btn.active {
                    background: #4f46e5;
                    color: #fff;
                    border-color: #4f46e5;
                }
            `}</style>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý liên hệ</h1>
                        <p className="text-sm text-gray-500 mt-1">Xem và xử lý các yêu cầu liên hệ từ khách hàng</p>
                    </div>
                    <button onClick={loadData} className="btn-ghost shrink-0" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7a5.5 5.5 0 0 1 9.9-3.3M12.5 7a5.5 5.5 0 0 1-9.9 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M11.5 1v3h-3M2.5 13v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Làm mới
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {[
                        { label: "Tổng liên hệ", value: contacts.length, color: "#4f46e5", bg: "#eef2ff" },
                        { label: "Mới", value: newCount, color: "#2563eb", bg: "#eff6ff" },
                        { label: "Đang xử lý", value: inProgressCount, color: "#d97706", bg: "#fffbeb" },
                        { label: "Đã xử lý", value: resolvedCount, color: "#059669", bg: "#ecfdf5" },
                    ].map(stat => (
                        <div key={stat.label} style={{ background: stat.bg, borderRadius: 14, padding: "16px 20px" }}>
                            <p style={{ fontSize: 12, color: stat.color, fontWeight: 600, marginBottom: 4, opacity: 0.8 }}>{stat.label.toUpperCase()}</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, SĐT, chủ đề..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: 36 }}
                    />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {[
                        { key: "ALL", label: "Tất cả" },
                        { key: "NEW", label: "Mới" },
                        { key: "IN_PROGRESS", label: "Đang xử lý" },
                        { key: "RESOLVED", label: "Đã xử lý" },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`filter-btn ${filterStatus === f.key ? "active" : ""}`}
                            onClick={() => setFilterStatus(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                        <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm">Đang tải dữ liệu...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="10" fill="#f3f4f6" />
                            <path d="M12 17h16M12 23h10" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Không có liên hệ nào</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                                {["Khách hàng", "Chủ đề", "Trạng thái", "Ngày gửi", ""].map((h, i) => (
                                    <th key={i} style={{
                                        padding: "12px 20px",
                                        textAlign: i === 4 ? "right" : "left",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#6b7280",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        whiteSpace: "nowrap",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((contact, idx) => {
                                const sc = statusConfig[contact.status] || statusConfig["NEW"];
                                return (
                                    <tr
                                        key={contact.id}
                                        className="row-anim"
                                        style={{
                                            borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                                            animationDelay: `${idx * 0.04}s`,
                                            transition: "background 0.12s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "")}
                                    >
                                        {/* Khách hàng */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: 10,
                                                    background: "#eef2ff", display: "flex", alignItems: "center",
                                                    justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 700,
                                                    color: "#4f46e5",
                                                }}>
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 2 }}>{contact.name}</p>
                                                    <p style={{ fontSize: 12, color: "#9ca3af" }}>{contact.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Chủ đề */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <p style={{ fontWeight: 500, fontSize: 14, color: "#374151", marginBottom: 2 }}>{contact.subject}</p>
                                            <p style={{ fontSize: 12, color: "#9ca3af", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {contact.message}
                                            </p>
                                        </td>

                                        {/* Trạng thái */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: 6,
                                                padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                                                background: sc.bg, color: sc.color,
                                            }}>
                                                <span style={{
                                                    width: 6, height: 6, borderRadius: "50%",
                                                    background: sc.dot, display: "inline-block",
                                                }} />
                                                {sc.label}
                                            </span>
                                        </td>

                                        {/* Ngày gửi */}
                                        <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                            <span style={{ fontSize: 13, color: "#6b7280" }}>{formatDate(contact.createdAt)}</span>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: 8 }}>
                                                <button
                                                    onClick={() => setSelectedContact(contact)}
                                                    style={{
                                                        display: "inline-flex", alignItems: "center", gap: 5,
                                                        padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                                                        border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151",
                                                        cursor: "pointer", transition: "all 0.13s",
                                                    }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.4" /><path d="M1 6.5S3.5 2 6.5 2 12 6.5 12 6.5 9.5 11 6.5 11 1 6.5 1 6.5Z" stroke="currentColor" strokeWidth="1.4" /></svg>
                                                    Xem
                                                </button>
                                                {contact.status !== "RESOLVED" && (
                                                    <button
                                                        onClick={() => updateStatus(contact.id, contact.status === "NEW" ? "IN_PROGRESS" : "RESOLVED")}
                                                        disabled={updatingId === contact.id}
                                                        style={{
                                                            display: "inline-flex", alignItems: "center", gap: 5,
                                                            padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                                                            border: "1.5px solid #c7d2fe", background: "#fff", color: "#4f46e5",
                                                            cursor: "pointer", transition: "all 0.13s",
                                                            opacity: updatingId === contact.id ? 0.5 : 1,
                                                        }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eef2ff"; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        {contact.status === "NEW" ? "Xử lý" : "Hoàn tất"}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Footer count */}
                {!loading && filtered.length > 0 && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>
                            Hiển thị <strong style={{ color: "#374151" }}>{filtered.length}</strong> / {contacts.length} liên hệ
                        </p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedContact && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 50,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setSelectedContact(null); }}
                >
                    <div
                        className="modal-anim"
                        style={{
                            background: "#fff", borderRadius: 20, padding: 32,
                            width: "100%", maxWidth: 520,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                        }}
                    >
                        {/* Modal header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                                    Chi tiết liên hệ
                                </h2>
                                <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
                                    #{selectedContact.id} · {formatDate(selectedContact.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", color: "#6b7280",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Status Badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {(() => {
                                    const sc = statusConfig[selectedContact.status] || statusConfig["NEW"];
                                    return (
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 6,
                                            padding: "5px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                                            background: sc.bg, color: sc.color,
                                        }}>
                                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                            {sc.label}
                                        </span>
                                    );
                                })()}
                            </div>

                            {/* Detail fields */}
                            {[
                                { label: "Họ tên", value: selectedContact.name, icon: "👤" },
                                { label: "Email", value: selectedContact.email, icon: "📧" },
                                { label: "Số điện thoại", value: selectedContact.phone || "Không có", icon: "📞" },
                                { label: "Chủ đề", value: selectedContact.subject, icon: "📌" },
                            ].map(field => (
                                <div key={field.label} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "10px 14px", background: "#f9fafb", borderRadius: 10,
                                }}>
                                    <span style={{ fontSize: 18 }}>{field.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{field.label}</p>
                                        <p style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{field.value}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Message */}
                            <div style={{
                                padding: "14px 16px", background: "#f9fafb", borderRadius: 12,
                                border: "1.5px solid #e5e7eb",
                            }}>
                                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>💬 Nội dung</p>
                                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedContact.message}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 }}>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="btn-ghost"
                            >
                                Đóng
                            </button>
                            {selectedContact.status !== "RESOLVED" && (
                                <button
                                    className="btn-primary"
                                    disabled={updatingId === selectedContact.id}
                                    onClick={() => {
                                        const nextStatus = selectedContact.status === "NEW" ? "IN_PROGRESS" : "RESOLVED";
                                        updateStatus(selectedContact.id, nextStatus);
                                        setSelectedContact({ ...selectedContact, status: nextStatus });
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5l3.5 3.5 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    {selectedContact.status === "NEW" ? "Chuyển sang xử lý" : "Đánh dấu hoàn tất"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
