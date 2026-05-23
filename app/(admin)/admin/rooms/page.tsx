"use client";
import React, { useState, useEffect } from "react";

interface Seat { id: number; code: string; type: string; status: boolean; }
interface Room { id: number; name: string; seats: Seat[]; }

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [isEditRoom, setIsEditRoom] = useState(false);
  const [roomForm, setRoomForm] = useState<any>({ name: "" });
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  // Generate seats modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genRows, setGenRows] = useState(5);
  const [genCols, setGenCols] = useState(8);
  // Seat action menu
  const [actionSeat, setActionSeat] = useState<Seat | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/rooms");
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
      if (selectedRoom) {
        const updated = (data as Room[]).find(r => r.id === selectedRoom.id);
        if (updated) setSelectedRoom(updated);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const close = () => setActionSeat(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg("");
    try {
      const url = isEditRoom ? `http://localhost:8080/api/rooms/${roomForm.id}` : "http://localhost:8080/api/rooms";
      const res = await fetch(url, { method: isEditRoom ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: roomForm.name }) });
      if (res.ok) { setShowRoomModal(false); fetchData(); } else { setErrorMsg("Lưu phòng thất bại"); }
    } catch { setErrorMsg("Lỗi kết nối"); }
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Bạn có chắc xoá phòng này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) { const err = await res.json().catch(() => null); alert(err?.message || "Không thể xoá!"); }
      else { if (selectedRoom?.id === id) setSelectedRoom(null); fetchData(); }
    } catch { }
  };

  const generateSeats = async () => {
    if (!selectedRoom || genRows <= 0 || genCols <= 0) return;
    try {
      const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const promises = [];
      for (let r = 0; r < genRows; r++) {
        for (let c = 1; c <= genCols; c++) {
          promises.push(fetch("http://localhost:8080/api/seats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: rowLabels[r] + c, type: "REGULAR", status: true, room: { id: selectedRoom.id } }) }));
        }
      }
      await Promise.all(promises);
      setShowGenModal(false);
      fetchData();
    } catch { alert("Lỗi khi tạo ghế!"); }
  };

  const updateSeatType = async (seat: Seat, newType: string) => {
    try { await fetch(`http://localhost:8080/api/seats/${seat.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...seat, type: newType, room: { id: selectedRoom?.id } }) }); fetchData(); } catch { }
  };

  const deleteSeat = async (seatId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/seats/${seatId}`, { method: "DELETE" });
      if (!res.ok) { const err = await res.json().catch(() => null); alert(err?.message || "Không thể xoá ghế này!"); }
      else fetchData();
    } catch { }
  };

  const deleteBulkSeats = async () => {
    if (selectedSeatIds.length === 0) return;
    if (!confirm(`Xoá ${selectedSeatIds.length} ghế đã chọn?`)) return;
    try {
      const results = await Promise.allSettled(selectedSeatIds.map(id => fetch(`http://localhost:8080/api/seats/${id}`, { method: "DELETE" })));
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok));
      if (failed.length > 0) alert(`Có ${failed.length} ghế không thể xoá (đã có người đặt).`);
      setSelectedSeatIds([]); setDeleteMode(false); fetchData();
    } catch { alert("Lỗi khi xoá."); }
  };

  const toggleSeatStatus = async (seat: Seat) => {
    try { await fetch(`http://localhost:8080/api/seats/${seat.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...seat, status: !seat.status, room: { id: selectedRoom?.id } }) }); fetchData(); } catch { }
  };

  // Group seats by row
  const groupedRows = selectedRoom ? Object.entries(
    [...(selectedRoom.seats || [])]
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
      .reduce((acc, seat) => { const row = seat.code.charAt(0); if (!acc[row]) acc[row] = []; acc[row].push(seat); return acc; }, {} as Record<string, Seat[]>)
  ) : [];

  // Preview for generate modal
  const previewRows = () => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const result = [];
    for (let r = 0; r < Math.min(genRows, 26); r++) {
      const seats = [];
      for (let c = 1; c <= genCols; c++) seats.push(labels[r] + c);
      result.push({ label: labels[r], seats });
    }
    return result;
  };

  const seatColor = (seat: Seat) => !seat.status ? "#94a3b8" : seat.type === "VIP" ? "#f59e0b" : "#6366f1";
  const seatBorder = (seat: Seat) => !seat.status ? "#64748b" : seat.type === "VIP" ? "#d97706" : "#4f46e5";

  return (
    <div style={{ padding: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#0f172a", minHeight: "100vh", background: "#f8fafc", display: "flex", gap: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* LEFT: ROOM LIST */}
      <div style={{ width: 280, flexShrink: 0, background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, alignSelf: "flex-start" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Phòng chiếu</h2>
          <button onClick={() => { setIsEditRoom(false); setRoomForm({ name: "" }); setShowRoomModal(true); }} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Thêm</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rooms.map(r => (
            <div key={r.id} onClick={() => { setSelectedRoom(r); setDeleteMode(false); setSelectedSeatIds([]); }}
              style={{ padding: 14, border: selectedRoom?.id === r.id ? "2px solid #6366f1" : "1.5px solid #e2e8f0", borderRadius: 12, cursor: "pointer", background: selectedRoom?.id === r.id ? "#eef2ff" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{r.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{r.seats?.length || 0} ghế</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={(e) => { e.stopPropagation(); setIsEditRoom(true); setRoomForm(r); setShowRoomModal(true); }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#e0e7ff", color: "#4f46e5", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Sửa</button>
                <button onClick={(e) => { e.stopPropagation(); deleteRoom(r.id); }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#b91c1c", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Xoá</button>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 20 }}>Chưa có phòng nào.</p>}
        </div>
      </div>

      {/* RIGHT: SEAT MAP */}
      <div style={{ flex: 1, background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, alignSelf: "flex-start", position: "relative" }}>
        {selectedRoom ? (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedRoom.name}</h2>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>{selectedRoom.seats?.length || 0} ghế</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {deleteMode ? (<>
                <button onClick={() => { setDeleteMode(false); setSelectedSeatIds([]); }} style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Huỷ</button>
                <button onClick={deleteBulkSeats} disabled={selectedSeatIds.length === 0} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: selectedSeatIds.length === 0 ? 0.5 : 1 }}>Xoá {selectedSeatIds.length} ghế</button>
              </>) : (<>
                <button onClick={() => setDeleteMode(true)} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>🗑 Xoá nhiều</button>
                <button onClick={() => setShowGenModal(true)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Sinh ghế</button>
              </>)}
            </div>
          </div>

          {/* SCREEN */}
          <div style={{ padding: 24, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ margin: "0 auto 24px", width: "70%", height: 6, background: "linear-gradient(90deg, transparent, #94a3b8, transparent)", borderRadius: 99 }} />
            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", letterSpacing: 3, marginBottom: 20, marginTop: 0 }}>MÀN HÌNH</p>

            {/* SEATS by row - matching SeatPicker style */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {groupedRows.map(([rowLabel, rowSeats]) => {
                // Chunk mỗi 6 ghế thành 1 dòng
                const chunks: Seat[][] = [];
                for (let i = 0; i < rowSeats.length; i += 6) {
                  chunks.push(rowSeats.slice(i, i + 6));
                }
                return chunks.map((chunk, chunkIdx) => (
                  <div key={`${rowLabel}-${chunkIdx}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 18, textAlign: "center", fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                      {chunkIdx === 0 ? rowLabel : ""}
                    </span>
                    {chunk.map(seat => {
                      const selected = deleteMode && selectedSeatIds.includes(seat.id);
                      return (
                        <div key={seat.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (deleteMode) { setSelectedSeatIds(prev => prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id]); return; }
                            setActionSeat(seat); setMenuPos({ x: e.clientX, y: e.clientY });
                          }}
                          style={{
                            width: 36, height: 36, borderRadius: "6px 6px 3px 3px",
                            background: selected ? "#fecaca" : seatColor(seat),
                            border: `1.5px solid ${selected ? "#ef4444" : seatBorder(seat)}`,
                            color: !seat.status ? "#475569" : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 600, cursor: "pointer",
                            transition: "transform 0.1s", opacity: deleteMode && !selected ? 0.5 : 1,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                          title={`${seat.code} — ${seat.type}${!seat.status ? " (Bảo trì)" : ""}`}
                        >{seat.code}</div>
                      );
                    })}
                  </div>
                ))
              })}
              {(selectedRoom.seats?.length || 0) === 0 && <p style={{ color: "#94a3b8", fontSize: 13, padding: 30 }}>Chưa có ghế. Bấm "+ Sinh ghế" để tạo.</p>}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24, paddingTop: 16, borderTop: "1px dashed #e2e8f0" }}>
              {[{ label: "Thường", bg: "#6366f1", bd: "#4f46e5" }, { label: "VIP", bg: "#f59e0b", bd: "#d97706" }, { label: "Bảo trì", bg: "#94a3b8", bd: "#64748b" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 14, background: l.bg, border: `1.5px solid ${l.bd}`, borderRadius: "4px 4px 2px 2px" }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>) : (
          <div style={{ display: "flex", height: 300, alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94a3b8" }}>
            <span style={{ fontSize: 48, marginBottom: 12 }}>💺</span>
            <p style={{ fontSize: 14 }}>Chọn phòng bên trái để quản lý ghế</p>
          </div>
        )}
      </div>

      {/* CONTEXT MENU for single seat */}
      {actionSeat && (
        <div onClick={e => e.stopPropagation()} style={{ position: "fixed", left: menuPos.x, top: menuPos.y, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", padding: 6, zIndex: 2000, minWidth: 160 }}>
          <p style={{ margin: "4px 10px 6px", fontSize: 13, fontWeight: 700, color: "#334155" }}>Ghế {actionSeat.code}</p>
          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "2px 0" }} />
          {[
            { label: "Đặt thành VIP", icon: "⭐", action: () => { updateSeatType(actionSeat, "VIP"); setActionSeat(null); }, show: actionSeat.type !== "VIP" },
            { label: "Đặt thành Thường", icon: "🪑", action: () => { updateSeatType(actionSeat, "REGULAR"); setActionSeat(null); }, show: actionSeat.type !== "REGULAR" },
            { label: actionSeat.status ? "Đánh dấu Bảo trì" : "Kích hoạt lại", icon: actionSeat.status ? "🔧" : "✅", action: () => { toggleSeatStatus(actionSeat); setActionSeat(null); }, show: true },
            { label: "Xoá ghế", icon: "🗑", action: () => { deleteSeat(actionSeat.id); setActionSeat(null); }, show: true, danger: true },
          ].filter(i => i.show).map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, fontSize: 13, color: (item as any).danger ? "#dc2626" : "#334155", textAlign: "left" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >{item.icon} {item.label}</button>
          ))}
        </div>
      )}

      {/* MODAL: Room form */}
      {showRoomModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleSaveRoom} style={{ background: "#fff", padding: 28, borderRadius: 16, width: 380 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>{isEditRoom ? "Sửa Phòng" : "Thêm Phòng"}</h2>
            {errorMsg && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{errorMsg}</div>}
            <input required placeholder="Tên phòng (ví dụ: Room 3)" value={roomForm.name || ""} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowRoomModal(false)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", cursor: "pointer", background: "#f8fafc", fontWeight: 500 }}>Huỷ</button>
              <button type="submit" style={{ flex: 1, padding: 10, borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>Lưu</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Generate seats */}
      {showGenModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 28, borderRadius: 16, width: 500, maxHeight: "85vh", overflow: "auto" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Sinh ghế tự động</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>Cấu hình số hàng và số cột, xem trước rồi bấm Tạo.</p>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Số hàng</label>
                <input type="number" min={1} max={26} value={genRows} onChange={e => setGenRows(Math.min(26, Math.max(1, +e.target.value)))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginTop: 4, boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Số ghế/hàng</label>
                <input type="number" min={1} max={30} value={genCols} onChange={e => setGenCols(Math.min(30, Math.max(1, +e.target.value)))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginTop: 4, boxSizing: "border-box" }} />
              </div>
            </div>

            <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Xem trước ({genRows * genCols} ghế):</p>
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0", marginBottom: 16, maxHeight: 250, overflow: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {previewRows().map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 16, fontSize: 11, color: "#94a3b8", textAlign: "center" }}>{row.label}</span>
                    {row.seats.map(s => (
                      <div key={s} style={{ width: 28, height: 28, borderRadius: "4px 4px 2px 2px", background: "#6366f1", border: "1px solid #4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600 }}>{s}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGenModal(false)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", cursor: "pointer", background: "#f8fafc", fontWeight: 500 }}>Huỷ</button>
              <button onClick={generateSeats} style={{ flex: 1, padding: 10, borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>Tạo {genRows * genCols} ghế</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
