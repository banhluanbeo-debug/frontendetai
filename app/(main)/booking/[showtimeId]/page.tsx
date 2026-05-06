"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeatPicker from "@/app/components/ui/SeatPicker";
import { getShowtimeById } from "@/app/components/services/showtime.service";

export default function BookingDetailPage() {
    const params = useParams();
    const showtimeId = Number(params.showtimeId);

    const [movieTitle, setMovieTitle] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getShowtimeById(showtimeId);
                setMovieTitle(data.movieTitle);
            } catch (err) {
                console.error(err);
            }
        };

        if (showtimeId) fetchData();
    }, [showtimeId]);
    console.log("showtimeId:", showtimeId);
    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-4">
                {movieTitle || "Đang tải..."}
            </h1>

            <SeatPicker
                onConfirm={(seats) =>
                    console.log("Showtime:", showtimeId, "Seats:", seats)
                }
            />
        </div>
    );
}