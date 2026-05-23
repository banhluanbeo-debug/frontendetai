

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeatPicker from "@/app/components/ui/SeatPicker";
import { getShowtimeById } from "@/app/components/services/showtime.service";
import { SelectedSeat } from "@/app/components/types/booking.type";

export default function BookingDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const showtimeId = Number(searchParams.get("showtimeId"));

    const [movieTitle, setMovieTitle] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "cash" | null>(null);
    const [pendingSeats, setPendingSeats] = useState<SelectedSeat[] | null>(null);

    useEffect(() => {
        if (!showtimeId) return;

        const fetchData = async () => {
            try {
                const data = await getShowtimeById(showtimeId);
                setMovieTitle(data.movieTitle);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [showtimeId]);

    const handleConfirm = (seats: SelectedSeat[]) => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("Bạn cần đăng nhập trước!");
            router.push("/auth/login");
            return;
        }
        
        // Save selected seats to session storage to pass to the next page
        sessionStorage.setItem("booking_seats", JSON.stringify(seats));
        
        // Navigate to the F&B + voucher page
        router.push(`/booking/${showtimeId}/food`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-4">
                {movieTitle || "Đang tải..."}
            </h1>

            {/* ✅ Chỉ render SeatPicker khi đã có showtimeId */}
            {showtimeId ? (
                <SeatPicker showtimeId={showtimeId} onConfirm={handleConfirm} />
            ) : (
                <p className="text-center text-gray-400 py-10">Đang tải...</p>
            )}


        </div>
    );
}