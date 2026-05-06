"use client";

import { useState, useEffect, useCallback } from "react";
import { getSeats } from "../services/booking.service";
import type { SeatAPI, SelectedSeat } from "../types/booking.type";

const PRICE = { REGULAR: 75000, VIP: 120000, BED: 200000 };

function formatVND(n: number) {
    return n.toLocaleString("vi-VN") + "đ";
}

interface SeatPickerProps {
    onConfirm: (seats: SelectedSeat[]) => void;
}

export default function SeatPicker({ onConfirm }: SeatPickerProps) {
    const [seats, setSeats] = useState<SeatAPI[]>([]);
    const [selected, setSelected] = useState<Record<string, SeatAPI>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSeats()
            .then((data) => {
                console.log("API trả về:", data);
                setSeats(data);
            })
            .catch((err: Error) => {
                console.error("Lỗi fetch:", err.message);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggle = useCallback((seat: SeatAPI) => {
        if (!seat.status) return;
        setSelected((prev) => {
            const next = { ...prev };
            if (next[seat.code]) delete next[seat.code];
            else next[seat.code] = seat;
            return next;
        });
    }, []);

    const rows = seats.reduce<Record<string, SeatAPI[]>>((acc, seat) => {
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
                {Object.entries(rows).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs text-gray-400">{row}</span>
                        {rowSeats.map((seat) => {
                            const isBooked = !seat.status;
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
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-5">
                {[
                    { label: "Trống", cls: "bg-gray-100 border-gray-300" },
                    { label: "Đang chọn", cls: "bg-emerald-600 border-emerald-800" },
                    { label: "Đã đặt", cls: "bg-gray-200 border-gray-300" },
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
                        id: s.code,
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
