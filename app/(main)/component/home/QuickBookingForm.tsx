"use client";
import React, { useState } from 'react';

interface FormData {
    theater: string;
    movie: string;
    date: string;
    showtime: string;
}

interface Movie {
    id: number;
    title: string;
    rating?: string;
    genre?: string;
}

interface QuickBookingFormProps {
    theaters: string[];
    movies: Movie[];
    dates: string[];
    showtimes: string[];
    onSubmit: (data: FormData) => void;
}

const QuickBookingForm: React.FC<QuickBookingFormProps> = ({
    theaters,
    movies,
    dates,
    showtimes,
    onSubmit
}) => {
    const [formData, setFormData] = useState<FormData>({
        theater: '',
        movie: '',
        date: '',
        showtime: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-transparent text-white py-10 relative">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 uppercase tracking-wider text-white">
                    <span className="text-[#7c4dff]">ĐẶT VÉ</span> NHANH
                </h2>

                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-[#f0f0f0] rounded-xl shadow-xl p-4 md:p-6 border border-[#d0d0d0] relative">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <select
                            value={formData.theater}
                            onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                        >
                            <option value="" className="text-gray-500">Chọn Rạp</option>
                            {theaters.map((theater, index) => (
                                <option key={index} value={theater}>{theater}</option>
                            ))}
                        </select>

                        <select
                            value={formData.movie}
                            onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                        >
                            <option value="" className="text-gray-500">Chọn Phim</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.title}>{movie.title}</option>
                            ))}
                        </select>

                        <select
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                        >
                            <option value="" className="text-gray-500">Chọn Ngày</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))}
                        </select>

                        <select
                            value={formData.showtime}
                            onChange={(e) => setFormData({ ...formData, showtime: e.target.value })}
                            className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff] transition"
                            required
                        >
                            <option value="" className="text-gray-500">Chọn Suất</option>
                            {showtimes.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-[#7c4dff] text-white p-3 rounded-lg font-bold hover:bg-[#651fff] transition shadow-[0_4px_15px_rgba(124,77,255,0.4)]"
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