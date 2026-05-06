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
        <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">ĐẶT VÉ NHANH</h2>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <select
                            value={formData.theater}
                            onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Chọn Rạp</option>
                            {theaters.map((theater, index) => (
                                <option key={index} value={theater}>{theater}</option>
                            ))}
                        </select>

                        <select
                            value={formData.movie}
                            onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Chọn Phim</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.title}>{movie.title}</option>
                            ))}
                        </select>

                        <select
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Chọn Ngày</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))}
                        </select>

                        <select
                            value={formData.showtime}
                            onChange={(e) => setFormData({ ...formData, showtime: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Chọn Suất</option>
                            {showtimes.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition transform hover:scale-105"
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