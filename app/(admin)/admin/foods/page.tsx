"use client";

import { useState, useEffect } from "react";
import { FoodItem, getAllFoods, createFood, updateFood, deleteFood } from "@/app/components/services/food.service";

export default function AdminFoodsPage() {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        isActive: true,
    });

    const loadData = async () => {
        setLoading(true);
        const data = await getAllFoods();
        setFoods(data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openAddModal = () => {
        setFormData({ name: "", price: "", description: "", imageUrl: "", isActive: true });
        setIsEditing(false);
        setCurrentId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (food: FoodItem) => {
        setFormData({
            name: food.name,
            price: food.price.toString(),
            description: food.description || "",
            imageUrl: food.imageUrl || "",
            isActive: food.isActive,
        });
        setCurrentId(food.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                imageUrl: formData.imageUrl,
                isActive: formData.isActive,
            };
            if (isEditing && currentId) {
                await updateFood(currentId, payload);
            } else {
                await createFood(payload);
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            console.error(err);
            alert("Đã có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa món này?")) return;
        setDeletingId(id);
        try {
            await deleteFood(id);
            loadData();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xóa");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = foods.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = foods.filter(f => f.isActive).length;
    const inactiveCount = foods.length - activeCount;

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
                .toggle-track {
                    width: 44px; height: 24px;
                    border-radius: 999px;
                    position: relative;
                    cursor: pointer;
                    transition: background 0.2s;
                    border: none;
                    padding: 0;
                    flex-shrink: 0;
                }
                .toggle-thumb {
                    position: absolute;
                    top: 3px; left: 3px;
                    width: 18px; height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    transition: transform 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.18);
                }
            `}</style>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý đồ ăn & nước uống</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý toàn bộ thực đơn bán kèm tại rạp</p>
                    </div>
                    <button onClick={openAddModal} className="btn-primary shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        Thêm món mới
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                        { label: "Tổng món", value: foods.length, color: "#4f46e5", bg: "#eef2ff" },
                        { label: "Đang bán", value: activeCount, color: "#059669", bg: "#ecfdf5" },
                        { label: "Ngừng bán", value: inactiveCount, color: "#dc2626", bg: "#fef2f2" },
                    ].map(stat => (
                        <div key={stat.label} style={{ background: stat.bg, borderRadius: 14, padding: "16px 20px" }}>
                            <p style={{ fontSize: 12, color: stat.color, fontWeight: 600, marginBottom: 4, opacity: 0.8 }}>{stat.label.toUpperCase()}</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: 36 }}
                />
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
                            <path d="M14 26c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="15.5" cy="18" r="1.5" fill="#9ca3af" />
                            <circle cx="24.5" cy="18" r="1.5" fill="#9ca3af" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Không có món nào phù hợp</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                                {["Món", "Giá", "Trạng thái", ""].map((h, i) => (
                                    <th key={i} style={{
                                        padding: "12px 20px",
                                        textAlign: i === 3 ? "right" : "left",
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
                            {filtered.map((food, idx) => (
                                <tr
                                    key={food.id}
                                    className="row-anim"
                                    style={{
                                        borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                                        animationDelay: `${idx * 0.04}s`,
                                        transition: "background 0.12s",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                                >
                                    {/* Món */}
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            {food.imageUrl ? (
                                                <img
                                                    src={food.imageUrl}
                                                    alt={food.name}
                                                    style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: "1px solid #f3f4f6", flexShrink: 0 }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: 10,
                                                    background: "#f3f4f6", display: "flex", alignItems: "center",
                                                    justifyContent: "center", flexShrink: 0, fontSize: 20,
                                                }}>🍿</div>
                                            )}
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 2 }}>{food.name}</p>
                                                {food.description && (
                                                    <p style={{ fontSize: 12, color: "#9ca3af", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        {food.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Giá */}
                                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>
                                            {food.price.toLocaleString("vi-VN")}
                                        </span>
                                        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 2 }}>₫</span>
                                    </td>

                                    {/* Trạng thái */}
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 6,
                                            padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                                            background: food.isActive ? "#ecfdf5" : "#fef2f2",
                                            color: food.isActive ? "#059669" : "#dc2626",
                                        }}>
                                            <span style={{
                                                width: 6, height: 6, borderRadius: "50%",
                                                background: food.isActive ? "#10b981" : "#ef4444",
                                                display: "inline-block",
                                            }} />
                                            {food.isActive ? "Đang bán" : "Ngừng bán"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                        <div style={{ display: "inline-flex", gap: 8 }}>
                                            <button
                                                onClick={() => openEditModal(food)}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                                                    border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151",
                                                    cursor: "pointer", transition: "all 0.13s",
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 2L11 4L5 10H3V8L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food.id)}
                                                disabled={deletingId === food.id}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                                                    border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626",
                                                    cursor: "pointer", transition: "all 0.13s", opacity: deletingId === food.id ? 0.5 : 1,
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M5.5 5.5v4M7.5 5.5v4M3 3.5l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Footer count */}
                {!loading && filtered.length > 0 && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>
                            Hiển thị <strong style={{ color: "#374151" }}>{filtered.length}</strong> / {foods.length} món
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 50,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                >
                    <div
                        className="modal-anim"
                        style={{
                            background: "#fff", borderRadius: 20, padding: 32,
                            width: "100%", maxWidth: 480,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                        }}
                    >
                        {/* Modal header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                                    {isEditing ? "Cập nhật món" : "Thêm món mới"}
                                </h2>
                                <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
                                    {isEditing ? "Chỉnh sửa thông tin món ăn" : "Điền thông tin để thêm món vào thực đơn"}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
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

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                                {/* Tên món */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                        Tên món <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="VD: Popcorn bơ size L"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                {/* Giá */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                        Giá (VNĐ) <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="input-field"
                                            style={{ paddingRight: 40 }}
                                        />
                                        <span style={{
                                            position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                                            fontSize: 13, color: "#9ca3af", fontWeight: 600,
                                        }}>₫</span>
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mô tả</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Mô tả ngắn về món ăn..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        style={{ resize: "none", lineHeight: 1.6 }}
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>URL hình ảnh</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="input-field"
                                    />
                                    {formData.imageUrl && (
                                        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                                            <img
                                                src={formData.imageUrl}
                                                alt="preview"
                                                style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                            />
                                            <span style={{ fontSize: 12, color: "#9ca3af" }}>Xem trước hình ảnh</span>
                                        </div>
                                    )}
                                </div>

                                {/* Toggle trạng thái */}
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "14px 16px", background: "#f9fafb", borderRadius: 12,
                                    border: "1.5px solid #e5e7eb",
                                }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 }}>Hiển thị để bán</p>
                                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginTop: 2 }}>Món sẽ xuất hiện trong danh sách đặt hàng</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="toggle-track"
                                        style={{ background: formData.isActive ? "#4f46e5" : "#e5e7eb" }}
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        aria-label="Toggle trạng thái"
                                    >
                                        <span className="toggle-thumb" style={{ transform: formData.isActive ? "translateX(20px)" : "translateX(0)" }} />
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-ghost"
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <circle cx="7" cy="7" r="5.5" stroke="#ffffff55" strokeWidth="2" />
                                                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : isEditing ? "Lưu thay đổi" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}