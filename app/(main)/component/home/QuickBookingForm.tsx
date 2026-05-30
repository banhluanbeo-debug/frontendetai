"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getShowtimesByMovieId } from '@/app/components/services/showtime.service';

interface Movie {
    id: number;
    title: string;
    rating?: string;
    genre?: string;
}

interface QuickBookingFormProps {
    movies: Movie[];
}

const QuickBookingForm: React.FC<QuickBookingFormProps> = ({ movies }) => {
    const router = useRouter();
    const [selectedMovie, setSelectedMovie] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('');

    const [allShowtimes, setAllShowtimes] = useState<any[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<any[]>([]);

    // Lấy showtimes khi chọn phim
    useEffect(() => {
        if (!selectedMovie) {
            setAllShowtimes([]);
            setAvailableDates([]);
            setAvailableTimes([]);
            setSelectedDate('');
            setSelectedShowtimeId('');
            return;
        }

        getShowtimesByMovieId(Number(selectedMovie))
            .then(data => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const maxDate = new Date(today);
                maxDate.setDate(today.getDate() + 4);
                
                // Chỉ lấy lịch chiếu từ hôm nay đến 4 ngày sau (tổng 5 ngày)
                const futureShowtimes = data.filter((st: any) => {
                    const showDate = new Date(st.showDate);
                    showDate.setHours(0, 0, 0, 0);
                    return showDate >= today && showDate <= maxDate;
                });

                setAllShowtimes(futureShowtimes);
                
                const dates = [...new Set(futureShowtimes.map((st: any) => st.showDate))]
                    .sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
                setAvailableDates(dates as string[]);
                
                setSelectedDate('');
                setSelectedShowtimeId('');
                setAvailableTimes([]);
            })
            .catch(console.error);
    }, [selectedMovie]);

    // Cập nhật giờ chiếu khi chọn ngày
    useEffect(() => {
        if (!selectedDate) {
            setAvailableTimes([]);
            setSelectedShowtimeId('');
            return;
        }

        const times = allShowtimes.filter((st: any) => st.showDate === selectedDate);
        
        // Lọc trùng lặp giờ chiếu (nếu cùng giờ thì chỉ lấy 1 cái đầu tiên)
        const uniqueTimes = times.filter((st: any, index: number, self: any[]) => 
            index === self.findIndex((t: any) => t.showTime.slice(0, 5) === st.showTime.slice(0, 5))
        );

        setAvailableTimes(uniqueTimes);
        setSelectedShowtimeId('');
    }, [selectedDate, allShowtimes]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Kiểm tra đăng nhập
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("Vui lòng đăng nhập để đặt vé!");
            router.push("/auth/login");
            return;
        }
        
        if (selectedMovie && selectedShowtimeId) {
            router.push(`/booking/${selectedMovie}?showtimeId=${selectedShowtimeId}`);
        }
    };

    return (
        <div className="bg-transparent text-white py-10 relative">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 uppercase tracking-wider text-white">
                    <span className="text-[#7c4dff]">ĐẶT VÉ</span> NHANH
                </h2>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#f0f0f0] rounded-xl shadow-xl p-4 md:p-6 border border-[#d0d0d0] relative">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                        >
                            <option value="" className="text-gray-500">Chọn Phim</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.id}>{movie.title}</option>
                            ))}
                        </select>

                        <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                            disabled={!selectedMovie || availableDates.length === 0}
                        >
                            <option value="" className="text-gray-500">
                                {!selectedMovie ? "Chọn phim trước" : availableDates.length === 0 ? "Chưa có lịch chiếu" : "Chọn Ngày"}
                            </option>
                            {availableDates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))}
                        </select>

                        <select
                            value={selectedShowtimeId}
                            onChange={(e) => setSelectedShowtimeId(e.target.value)}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                            disabled={!selectedDate || availableTimes.length === 0}
                        >
                            <option value="" className="text-gray-500">
                                {!selectedDate ? "Chọn ngày trước" : availableTimes.length === 0 ? "Hết suất chiếu" : "Chọn Suất"}
                            </option>
                            {availableTimes.map((st) => (
                                <option key={st.id} value={st.id}>{st.showTime.slice(0, 5)}</option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-[#7c4dff] text-white p-3 rounded-lg font-bold hover:bg-[#651fff] transition shadow-[0_4px_15px_rgba(124,77,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedMovie || !selectedShowtimeId}
                        >
                            ĐẶT NGAY
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickBookingForm;