"use client";
import React, { useState, useEffect } from "react";

interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  showDate: string;
  showTime: string;
  price: number;
}

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  duration: number;
  releaseDate: string;
  endDate: string;
  content: string;
  genre: string;
}

interface Room {
  id: number;
  name: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) => {
  if (!d) return "";
  return d.split("-").reverse().join("/");
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null);

  // Modals
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [isEditMovie, setIsEditMovie] = useState(false);
  const [movieForm, setMovieForm] = useState<any>({});

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [isEditShowtime, setIsEditShowtime] = useState(false);
  const [singleForm, setSingleForm] = useState<any>({});

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState<any>({ times: [] });

  const [selectedShowtimes, setSelectedShowtimes] = useState<number[]>([]);

  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [mRes, stRes, rRes] = await Promise.all([
        fetch("https://backendemo-cbwy.onrender.com/api/movies"),
        fetch("https://backendemo-cbwy.onrender.com/api/showtimes"),
        fetch("https://backendemo-cbwy.onrender.com/api/rooms")
      ]);
      setMovies(Array.isArray(await mRes.clone().json()) ? await mRes.json() : []);
      setShowtimes(Array.isArray(await stRes.clone().json()) ? await stRes.json() : []);
      setRooms(Array.isArray(await rRes.clone().json()) ? await rRes.json() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMovies = movies.filter(m => 
    (m.title?.toLowerCase() || "").includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const url = isEditMovie ? `https://backendemo-cbwy.onrender.com/api/movies/${movieForm.id}` : "https://backendemo-cbwy.onrender.com/api/movies";
      const method = isEditMovie ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieForm)
      });
      if (res.ok) {
        setShowMovieModal(false);
        fetchData();
      } else {
        const err = await res.json().catch(()=>null);
        setErrorMsg(err?.message || "Lưu phim thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối máy chủ");
    }
  };

  const deleteMovie = async (id: number) => {
    if(!confirm("Bạn có chắc xoá phim này?")) return;
    try {
      await fetch(`https://backendemo-cbwy.onrender.com/api/movies/${id}`, { method: "DELETE" });
      fetchData();
    } catch(e) {}
  };

  const handleSaveSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const url = isEditShowtime ? `https://backendemo-cbwy.onrender.com/api/showtimes/${singleForm.id}` : "https://backendemo-cbwy.onrender.com/api/showtimes";
      const method = isEditShowtime ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(singleForm)
      });
      if (res.ok) {
        setShowSingleModal(false);
        fetchData();
      } else {
        const err = await res.json().catch(()=>null);
        setErrorMsg(err?.message || "Lưu suất chiếu thất bại (kiểm tra lại giờ, phòng, quá khứ...)");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối");
    }
  };

  const handleSaveBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (bulkForm.times.length === 0) {
      setErrorMsg("Vui lòng chọn ít nhất 1 khung giờ");
      return;
    }
    try {
      const res = await fetch(`https://backendemo-cbwy.onrender.com/api/showtimes/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bulkForm)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Đã tạo thành công: ${data.created} suất.\nBỏ qua (trùng phòng/khác lịch): ${data.skipped} suất.`);
        setShowBulkModal(false);
        fetchData();
      } else {
        setErrorMsg("Tạo hàng loạt thất bại");
      }
    } catch(err) {
      setErrorMsg("Lỗi kết nối");
    }
  };

  const deleteShowtime = async (id: number) => {
    if(!confirm("Xoá suất chiếu này?")) return;
    try {
      const res = await fetch(`https://backendemo-cbwy.onrender.com/api/showtimes/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else {
        const err = await res.json().catch(()=>null);
        alert(err?.message || "Không thể xoá suất đã có người đặt vé!");
      }
    } catch(e) {}
  };

  const deleteBulkShowtimes = async () => {
    if (selectedShowtimes.length === 0) return;
    if (!confirm(`Bạn muốn xoá ${selectedShowtimes.length} suất chiếu đã chọn?`)) return;
    try {
      const res = await fetch(`https://backendemo-cbwy.onrender.com/api/showtimes/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedShowtimes)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Đã xoá: ${data.deleted} suất.\nBỏ qua (không thể xoá do đã có người đặt vé): ${data.failed} suất.`);
        setSelectedShowtimes([]);
        fetchData();
      }
    } catch(e) {}
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#0f172a", minHeight: "100vh", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý Phim & Suất Chiếu</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Tổng số {movies.length} phim</p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Tìm phim..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", width: 260 }}
          />
          <button 
            onClick={() => {
              setIsEditMovie(false);
              setMovieForm({ duration: 120, releaseDate: "", endDate: "", posterUrl: "", title: "", genre: "", content: "" });
              setShowMovieModal(true);
            }}
            style={{ background: "#6366f1", color: "#fff", border: "none", padding: "0 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            + Thêm phim
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "left" }}>PHIM</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "left" }}>THỜI LƯỢNG</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "left" }}>CÔNG CHIẾU</th>
              <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "right" }}>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovies.map((m) => {
              const mShowtimes = showtimes.filter(s => s.movieId === m.id);
              const isExpanded = expandedMovieId === m.id;
              
              return (
                <React.Fragment key={m.id}>
                  <tr style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", background: isExpanded ? "#f8fafc" : "transparent" }}
                      onClick={() => setExpandedMovieId(isExpanded ? null : m.id)}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={m.posterUrl ? (m.posterUrl.startsWith("http") ? m.posterUrl : `https://backendemo-cbwy.onrender.com/images/${m.posterUrl}`) : "https://placehold.co/50x75?text=No+Poster"} alt={m.title} style={{ width: 44, height: 66, borderRadius: 6, objectFit: "cover" }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{m.title}</p>
                          <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 600, color: "#4f46e5", background: "#e0e7ff", padding: "2px 8px", borderRadius: 4 }}>
                            {mShowtimes.length} suất chiếu
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#475569" }}>{m.duration} phút</td>
                    <td style={{ padding: "14px 20px" }}>
                      <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>{fmtDate(m.releaseDate)} - {fmtDate(m.endDate)}</p>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button onClick={(e) => { e.stopPropagation(); setIsEditMovie(true); setMovieForm(m); setShowMovieModal(true); }}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sửa</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteMovie(m.id); }}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xoá</button>
                        <button style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: isExpanded ? "#e2e8f0" : "#f1f5f9", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          Quản lý suất chiếu {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={4} style={{ padding: 0, borderBottom: "1.5px solid #e2e8f0" }}>
                        <div style={{ padding: "20px", background: "#f8fafc", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
                          
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#334155" }}>Suất chiếu của: {m.title}</h4>
                            <div style={{ display: "flex", gap: 8 }}>
                              {selectedShowtimes.length > 0 && (
                                <button onClick={deleteBulkShowtimes} style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                  Xoá ({selectedShowtimes.length}) suất
                                </button>
                              )}
                              <button onClick={() => {
                                  setSingleForm({ movieId: m.id, roomId: rooms[0]?.id, showDate: "", showTime: "19:00", price: 50000 });
                                  setIsEditShowtime(false);
                                  setShowSingleModal(true);
                              }} style={{ padding: "6px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Thêm suất</button>
                              
                              <button onClick={() => {
                                  setBulkForm({ movieId: m.id, roomId: rooms[0]?.id, startDate: "", endDate: "", price: 50000, times: [] });
                                  setShowBulkModal(true);
                              }} style={{ padding: "6px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Tạo hàng loạt</button>
                            </div>
                          </div>

                          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                            {mShowtimes.map(s => {
                               const isPast = new Date(`${s.showDate}T${s.showTime}`) < new Date();
                               return (
                                 <div key={s.id} style={{ background: "#fff", border: selectedShowtimes.includes(s.id) ? "2px solid #ef4444" : "1px solid #cbd5e1", borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                      <input 
                                        type="checkbox" 
                                        style={{ marginTop: 4, cursor: "pointer" }}
                                        checked={selectedShowtimes.includes(s.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) setSelectedShowtimes(prev => [...prev, s.id]);
                                          else setSelectedShowtimes(prev => prev.filter(id => id !== s.id));
                                        }}
                                      />
                                      <div>
                                      <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{s.roomName}</p>
                                      <p style={{ margin: "0 0 4px", fontSize: 13, color: "#475569", fontWeight: 500 }}>{fmtDate(s.showDate)} - <span style={{ color: "#4f46e5", fontWeight: 700 }}>{s.showTime?.substring(0, 5)}</span></p>
                                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#059669" }}>{fmt(s.price)}</p>
                                      {isPast && <span style={{ display: "inline-block", fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#f1f5f9", color: "#64748b", marginTop: 4 }}>Đã chiếu</span>}
                                    </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                      <button onClick={() => { setIsEditShowtime(true); setSingleForm(s); setShowSingleModal(true); }} style={{ padding: "4px 10px", borderRadius: 6, background: "#e0e7ff", color: "#4f46e5", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sửa</button>
                                      <button onClick={() => deleteShowtime(s.id)} style={{ padding: "4px 10px", borderRadius: 6, background: "#fee2e2", color: "#b91c1c", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Xoá</button>
                                    </div>
                                 </div>
                               );
                            })}
                            {mShowtimes.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có suất chiếu nào.</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        
        {totalPages > 1 && (
          <div style={{ padding: "16px 20px", borderTop: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
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

      {/* MODAL PHIM */}
      {showMovieModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "20px 0" }}>
          <form onSubmit={handleSaveMovie} style={{ background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 640 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{isEditMovie ? "Sửa Phim" : "Thêm Phim"}</h2>
            {errorMsg && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 8, marginBottom: 16 }}>{errorMsg}</div>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input required placeholder="Tên phim" value={movieForm.title || ""} onChange={e => setMovieForm({...movieForm, title: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              <textarea placeholder="Mô tả phim" value={movieForm.content || ""} onChange={e => setMovieForm({...movieForm, content: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", minHeight: 60, outline: "none" }} />
              
              <div style={{ display: "flex", gap: 12 }}>
                <input required placeholder="URL Poster" value={movieForm.posterUrl || ""} onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                <input placeholder="URL Backdrop" value={movieForm.backdropUrl || ""} onChange={e => setMovieForm({...movieForm, backdropUrl: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              </div>

              <input placeholder="URL Trailer" value={movieForm.trailerUrl || ""} onChange={e => setMovieForm({...movieForm, trailerUrl: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              
              <div style={{ display: "flex", gap: 12 }}>
                <input required type="number" placeholder="Thời lượng (phút)" value={movieForm.duration || ""} onChange={e => setMovieForm({...movieForm, duration: Number(e.target.value)})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                <input placeholder="Giới hạn độ tuổi (VD: 13+)" value={movieForm.ageLimit || ""} onChange={e => setMovieForm({...movieForm, ageLimit: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                <input placeholder="Thể loại (Action, Comedy...)" value={movieForm.genre || ""} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <input placeholder="Đạo diễn" value={movieForm.director || ""} onChange={e => setMovieForm({...movieForm, director: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                <input placeholder="Diễn viên" value={movieForm.cast || ""} onChange={e => setMovieForm({...movieForm, cast: e.target.value})} style={{ flex: 2, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <input placeholder="Ngôn ngữ" value={movieForm.language || ""} onChange={e => setMovieForm({...movieForm, language: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                <input placeholder="Phụ đề" value={movieForm.subtitle || ""} onChange={e => setMovieForm({...movieForm, subtitle: e.target.value})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "#64748b" }}>Ngày công chiếu</label>
                  <input required type="date" value={movieForm.releaseDate || ""} onChange={e => setMovieForm({...movieForm, releaseDate: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "#64748b" }}>Ngày kết thúc</label>
                  <input required type="date" value={movieForm.endDate || ""} onChange={e => setMovieForm({...movieForm, endDate: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setShowMovieModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", cursor: "pointer", background: "#f8fafc" }}>Huỷ</button>
              <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>Lưu Phim</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1 SUẤT CHIẾU */}
      {showSingleModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleSaveSingle} style={{ background: "#fff", padding: 32, borderRadius: 20, width: 400 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{isEditShowtime ? "Sửa Suất" : "Thêm 1 Suất"}</h2>
            {errorMsg && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 8, marginBottom: 16 }}>{errorMsg}</div>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <select required value={singleForm.roomId || ""} onChange={e => setSingleForm({...singleForm, roomId: Number(e.target.value)})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <input required type="date" value={singleForm.showDate || ""} onChange={e => setSingleForm({...singleForm, showDate: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
              
              <div style={{ display: "flex", gap: 8 }}>
                <select value={singleForm.showTime ? singleForm.showTime.split(':')[0] : '19'} onChange={e => setSingleForm({...singleForm, showTime: `${e.target.value}:${singleForm.showTime?.split(':')[1] || '00'}`})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  {Array.from({length:24}).map((_, i) => <option key={i} value={i.toString().padStart(2,'0')}>{i.toString().padStart(2,'0')} giờ</option>)}
                </select>
                <select value={singleForm.showTime ? singleForm.showTime.split(':')[1] : '00'} onChange={e => setSingleForm({...singleForm, showTime: `${singleForm.showTime?.split(':')[0] || '19'}:${e.target.value}`})} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  {Array.from({length:12}).map((_, i) => <option key={i} value={(i*5).toString().padStart(2,'0')}>{(i*5).toString().padStart(2,'0')} phút</option>)}
                </select>
              </div>

              <input required type="number" placeholder="Giá vé" value={singleForm.price ?? ""} onChange={e => setSingleForm({...singleForm, price: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setShowSingleModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1" }}>Huỷ</button>
              <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 8, background: "#10b981", color: "#fff", border: "none" }}>Lưu Suất</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL TẠO HÀNG LOẠT */}
      {showBulkModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleSaveBulk} style={{ background: "#fff", padding: 32, borderRadius: 20, width: 460 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>Tạo Hàng Loạt</h2>
            {errorMsg && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 8, marginBottom: 16 }}>{errorMsg}</div>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <select required value={bulkForm.roomId || ""} onChange={e => setBulkForm({...bulkForm, roomId: Number(e.target.value)})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12 }}>Từ ngày</label>
                  <input required type="date" value={bulkForm.startDate || ""} onChange={e => setBulkForm({...bulkForm, startDate: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12 }}>Đến ngày</label>
                  <input required type="date" value={bulkForm.endDate || ""} onChange={e => setBulkForm({...bulkForm, endDate: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Chọn khung giờ chiếu (mỗi ngày):</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {["09:00", "13:00", "16:00", "19:00", "22:00"].map(t => (
                    <label key={t} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input type="checkbox" checked={bulkForm.times.includes(t)} onChange={(e) => {
                         let newTimes = [...bulkForm.times];
                         if (e.target.checked) newTimes.push(t);
                         else newTimes = newTimes.filter(x => x !== t);
                         setBulkForm({...bulkForm, times: newTimes});
                      }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <input required type="number" placeholder="Giá vé chung" value={bulkForm.price ?? ""} onChange={e => setBulkForm({...bulkForm, price: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setShowBulkModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1" }}>Huỷ</button>
              <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 8, background: "#3b82f6", color: "#fff", border: "none" }}>Tạo Hàng Loạt</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
