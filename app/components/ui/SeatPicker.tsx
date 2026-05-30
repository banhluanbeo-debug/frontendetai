
"use client";

import { useState, useEffect, useCallback } from "react";
import { getSeats } from "../services/booking.service";
import type { SeatAPI, SelectedSeat } from "../types/booking.type";

const PRICE = { REGULAR: 120000, VIP: 150000, BED: 200000 };

function formatVND(n: number) {
    return n.toLocaleString("vi-VN") + "đ";
}

interface SeatPickerProps {
    showtimeId: number;
    onConfirm: (seats: SelectedSeat[]) => void;
}

export default function SeatPicker({ showtimeId, onConfirm }: SeatPickerProps) {
    const [seats, setSeats] = useState<SeatAPI[]>([]);
    const [selected, setSelected] = useState<Record<string, SeatAPI>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedSeatIds, setBookedSeatIds] = useState<number[]>([]);

    useEffect(() => {
        if (!showtimeId) return;
        setLoading(true);
        fetch(`https://backendemo-cbwy.onrender.com/api/seats/showtime-seats?showtimeId=${showtimeId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Không thể lấy dữ liệu ghế");
                return res.json();
            })
            .then((data: any[]) => {
                const mappedSeats: SeatAPI[] = data.map((ss: any) => ({
                    id: ss.seat.id,
                    code: ss.seat.code,
                    type: ss.seat.type,
                    status: ss.seat.status,
                    createdAt: ss.seat.createdAt || ""
                }));
                setSeats(mappedSeats);
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [showtimeId]); // ✅ Fetch seats specific to this showtime's room

    // Tự động refresh danh sách ghế đã đặt mỗi 30s
    useEffect(() => {
        if (!showtimeId) return;

        const fetchUnavailable = () => {
            fetch(`https://backendemo-cbwy.onrender.com/api/seats/unavailable?showtimeId=${showtimeId}`)
                .then(res => res.json())
                .then(data => {
                    const ids = Array.isArray(data)
                        ? data.map((item: any) =>
                            typeof item === "number" ? item : item.seatId ?? item.id ?? item.seat_id
                        )
                        : [];
                    setBookedSeatIds(ids);
                })
                .catch(err => console.error("Failed to fetch unavailable seats:", err));
        };

        fetchUnavailable(); // gọi ngay lần đầu

        const interval = setInterval(fetchUnavailable, 30000); // 30 giây refresh 1 lần

        return () => clearInterval(interval); // cleanup khi unmount
    }, [showtimeId]);

    const toggle = useCallback((seat: SeatAPI) => {
        if (!seat.status) return;
        if (bookedSeatIds.includes(seat.id)) return;
        setSelected((prev) => {
            const next = { ...prev };
            if (next[seat.code]) delete next[seat.code];
            else next[seat.code] = seat;
            return next;
        });
    }, [bookedSeatIds]);

    const rows = [...seats]
        .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
        .reduce<Record<string, SeatAPI[]>>((acc, seat) => {
            const row = seat.code[0];
            if (!acc[row]) acc[row] = [];
            acc[row].push(seat);
            return acc;
        }, {});

    const selectedList = Object.values(selected);
    const total = selectedList.reduce((acc, s) => acc + PRICE[s.type], 0);

    if (loading) return <p className="text-center text-gray-400 py-10">Đang tải sơ đồ ghế...</p>;
    if (error) return <p className="text-center text-red-400 py-10">{error}</p>;

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="h-2 mx-5 mb-1 rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <p className="text-center text-[11px] text-gray-400 tracking-[3px] mb-6">MÀN HÌNH</p>

            <div className="flex flex-col items-center gap-2">
                {Object.entries(rows).map(([row, rowSeats]) => {
                    const chunks: SeatAPI[][] = [];
                    for (let i = 0; i < rowSeats.length; i += 6) {
                        chunks.push(rowSeats.slice(i, i + 6));
                    }
                    return chunks.map((chunk, chunkIdx) => (
                        <div key={`${row}-${chunkIdx}`} className="flex items-center gap-2">
                            <span className="w-5 text-center text-xs text-gray-400">
                                {chunkIdx === 0 ? row : ""}
                            </span>
                            {chunk.map((seat) => {
                                const isBooked = !seat.status || bookedSeatIds.includes(seat.id);
                                const isSel = !!selected[seat.code];
                                const typeClass =
                                    isBooked ? "bg-red-200 border-red-400 text-red-400 cursor-not-allowed"
                                        : isSel ? "bg-emerald-600 border-emerald-800 text-white"
                                            : seat.type === "VIP" ? "bg-amber-50 border-amber-400 text-amber-900 hover:scale-110"
                                                : seat.type === "BED" ? "bg-violet-50 border-violet-300 text-violet-900 hover:scale-110"
                                                    : "bg-gray-100 border-gray-300 text-gray-600 hover:scale-110";

                                return (
                                    <div
                                        key={seat.id}
                                        title={isBooked ? "Đã đặt" : `${seat.code} — ${formatVND(PRICE[seat.type])}`}
                                        onClick={() => toggle(seat)}
                                        className={`flex items-center justify-center w-9 h-9 rounded-t-md rounded-b-sm border-[1.5px] text-[10px] font-medium select-none transition-transform duration-100 cursor-pointer ${typeClass}`}
                                    >
                                        {seat.code}
                                    </div>
                                );
                            })}
                        </div>
                    ));
                })}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-5">
                {[
                    { label: "Trống", cls: "bg-gray-100 border-gray-300" },
                    { label: "Đang chọn", cls: "bg-emerald-600 border-emerald-800" },
                    { label: "Đã đặt", cls: "bg-red-200 border-red-400" },
                    { label: "VIP", cls: "bg-amber-50 border-amber-400" },
                ].map(({ label, cls }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`h-[18px] w-[18px] border-[1.5px] rounded ${cls}`} />
                        <span className="text-xs text-gray-500">{label}</span>
                    </div>
                ))}
            </div>

            <div className="mt-5 text-center">
                {selectedList.length === 0 ? (
                    <p className="text-sm text-gray-400 mb-3">Chưa chọn ghế nào</p>
                ) : (
                    <p className="text-sm text-gray-500 mb-3">
                        Đã chọn: <strong className="text-gray-800">{selectedList.map(s => s.code).join(", ")}</strong>
                        {" | "}
                        Tổng: <strong className="text-emerald-600">{formatVND(total)}</strong>
                    </p>
                )}
                <button
                    disabled={!selectedList.length}
                    onClick={() => onConfirm(selectedList.map(s => ({
                        id: s.id,
                        type: s.type.toLowerCase() as SelectedSeat["type"],
                        price: PRICE[s.type]
                    })))}
                    className={`px-7 py-2.5 rounded-lg border text-sm font-medium transition-colors ${selectedList.length
                        ? "border-gray-300 text-gray-800 hover:bg-gray-50 cursor-pointer"
                        : "border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                >
                    Xác nhận chọn ghế →
                </button>
            </div>
        </div>
    );
}