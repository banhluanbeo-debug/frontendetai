"use client";
import React, { useState, useEffect } from "react";

interface MovieStat {
  movieId: number;
  movieTitle: string;
  totalTickets: number;
  totalAmount: number;
}

interface DailyStat {
  showDate: string;
  totalTickets: number;
  totalAmount: number;
}

interface ShowtimeStat {
  showTime: string;
  roomName: string;
  totalTickets: number;
  totalAmount: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) => d.split("-").reverse().join("/");

const COLORS = ["#C084FC", "#60A5FA", "#34D399", "#F97316", "#F472B6", "#A78BFA", "#38BDF8", "#4ADE80"];

export default function DashboardPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [movieStats, setMovieStats] = useState<MovieStat[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieStat | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showtimeStats, setShowtimeStats] = useState<ShowtimeStat[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://backendemo-cbwy.onrender.com/api/statistics/monthly?month=${month}&year=${year}`)
      .then(r => r.json()).then(d => setMovieStats(Array.isArray(d) ? d : [])).catch(console.error);
  }, [month, year]);

  useEffect(() => {
    if (!selectedMovie) return;
    fetch(`https://backendemo-cbwy.onrender.com/api/statistics/movie/${selectedMovie.movieId}/daily?month=${month}&year=${year}`)
      .then(r => r.json()).then(d => setDailyStats(Array.isArray(d) ? d : [])).catch(console.error);
  }, [selectedMovie, month, year]);

  useEffect(() => {
    if (!selectedMovie || !selectedDate) return;
    fetch(`https://backendemo-cbwy.onrender.com/api/statistics/movie/${selectedMovie.movieId}/showtimes?date=${selectedDate}`)
      .then(r => r.json()).then(d => setShowtimeStats(Array.isArray(d) ? d : [])).catch(console.error);
  }, [selectedMovie, selectedDate]);

  const totalRevenue = movieStats.reduce((s, m) => s + m.totalAmount, 0);
  const totalTickets = movieStats.reduce((s, m) => s + m.totalTickets, 0);
  const topMovie = movieStats[0];
  const filteredMovies = movieStats.filter(m => m.movieTitle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#0f172a", minHeight: "100vh", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          {selectedDate && selectedMovie ? (
            <>
              <button onClick={() => setSelectedDate(null)} style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                ← Quay lại
              </button>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{selectedMovie.movieTitle}</h1>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Suất chiếu ngày {fmtDate(selectedDate)}</p>
            </>
          ) : selectedMovie ? (
            <>
              <button onClick={() => setSelectedMovie(null)} style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                ← Quay lại danh sách phim
              </button>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{selectedMovie.movieTitle}</h1>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Lịch chiếu theo ngày — Tháng {month}/{year}</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Doanh thu & Thống kê</h1>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Tháng {month}/{year}</p>
            </>
          )}
        </div>

        {!selectedMovie && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Tìm phim..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "8px 14px 8px 36px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", fontWeight: 400, background: "#fff", color: "#0f172a", width: 200, outline: "none", transition: "border-color .15s" }}
                onFocus={e => (e.target.style.borderColor = "#6366f1")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
              )}
            </div>
            {/* Month / Year */}
            {[
              { label: "Tháng", value: month, setter: setMonth, options: Array.from({ length: 12 }, (_, i) => ({ v: i + 1, l: `Tháng ${i + 1}` })) },
              { label: "Năm", value: year, setter: setYear, options: [2025, 2026, 2027].map(y => ({ v: y, l: `${y}` })) }
            ].map(sel => (
              <select key={sel.label} value={sel.value} onChange={e => sel.setter(Number(e.target.value))}
                style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", fontWeight: 500, background: "#fff", color: "#0f172a", cursor: "pointer" }}>
                {sel.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Màn 3: Suất chiếu */}
      {selectedMovie && selectedDate ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Tổng suất chiếu", value: showtimeStats.length },
              { label: "Vé đã bán", value: showtimeStats.reduce((s, x) => s + x.totalTickets, 0) + " vé" },
              { label: "Doanh thu", value: fmt(showtimeStats.reduce((s, x) => s + x.totalAmount, 0)) },
            ].map(card => (
              <div key={card.label} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px 22px" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{card.value}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
                  {["Giờ chiếu", "Phòng", "Vé bán", "Doanh thu"].map((h, i) => (
                    <th key={h} style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: i >= 2 ? "right" : "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showtimeStats.length > 0 ? showtimeStats.map((st, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, fontSize: 15 }}>{st.showTime.substring(0, 5)}</td>
                    <td style={{ padding: "14px 20px", color: "#475569" }}>{st.roomName}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <span style={{ background: "#f1f5f9", color: "#334155", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>{st.totalTickets} vé</span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "#059669" }}>{fmt(st.totalAmount)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Không có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : selectedMovie ? (
        /* Màn 2: Ngày */
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Tổng vé đã bán", value: selectedMovie.totalTickets + " vé" },
              { label: "Doanh thu tháng này", value: fmt(selectedMovie.totalAmount) },
            ].map(card => (
              <div key={card.label} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px 22px" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{card.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {dailyStats.length > 0 ? dailyStats.map((ds, i) => (
              <div key={i} onClick={() => setSelectedDate(ds.showDate)}
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "border-color .15s, box-shadow .15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#6366f1"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(99,102,241,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#1e293b" }}>{fmtDate(ds.showDate)}</p>
                <p style={{ margin: "10px 0 4px", fontSize: 12, color: "#94a3b8" }}>Vé bán</p>
                <p style={{ margin: 0, fontWeight: 600, color: "#334155" }}>{ds.totalTickets} vé</p>
                <p style={{ margin: "10px 0 4px", fontSize: 12, color: "#94a3b8" }}>Doanh thu</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#059669", fontSize: 15 }}>{fmt(ds.totalAmount)}</p>
              </div>
            )) : (
              <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Chưa có dữ liệu trong tháng này.</p>
            )}
          </div>
        </div>

      ) : (
        /* Màn 1: Tổng tháng */
        <div>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Tổng doanh thu", value: fmt(totalRevenue) },
              { label: "Tổng vé đã bán", value: totalTickets + " vé" },
              { label: "Phim chiếu nhiều nhất", value: topMovie?.movieTitle ?? "—" },
            ].map(card => (
              <div key={card.label} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px 22px" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: card.label === "Phim chiếu nhiều nhất" ? 15 : 22, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
                  {["Tên phim", "Vé bán", "Doanh thu", ""].map((h, i) => (
                    <th key={i} style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: i === 2 ? "right" : "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMovies.length > 0 ? filteredMovies.map((ms, idx) => (
                  <tr key={ms.movieId} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 8, height: 36, borderRadius: 4, background: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}>{ms.movieTitle}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: "#f1f5f9", color: "#334155", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>{ms.totalTickets} vé</span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "#059669", fontSize: 15 }}>{fmt(ms.totalAmount)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <button onClick={() => setSelectedMovie(ms)}
                        style={{ padding: "7px 16px", borderRadius: 9, border: "1.5px solid #6366f1", background: "transparent", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s, color .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#6366f1"; }}>
                        Chi tiết →
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                    {search ? `Không tìm thấy phim "${search}".` : "Không có dữ liệu doanh thu trong tháng này."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}