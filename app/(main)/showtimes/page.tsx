"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MovieSchedule {
    id: number;
    title: string;
    rating: string;
    genre: string;
    duration: number;
    country: string;
    language: string;
    description: string;
    poster: string;
    isShowing: boolean;
    cinemas: {
        id: number;
        name: string;
        address: string;
        showtimes: string[];
    }[];
}

interface FormData {
    theater: string;
    movie: string;
    date: string;
    showtime: string;
}

const LichChieuPage = () => {
    const [formData, setFormData] = useState<FormData>({
        theater: '',
        movie: '',
        date: '',
        showtime: ''
    });
    const [filteredResults, setFilteredResults] = useState<MovieSchedule[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const theaters = ['Luncinemas Hai Bà Trưng', 'Luncinemas Quốc Thanh', 'Luncinemas Sinh Viên', 'Luncinemas Cộng Hòa'];
    const dates = ['19/03', '20/03', '21/03', '22/03', '23/03'];
    const showtimes = ['10:00', '13:30', '16:45', '19:30', '22:15'];

    const nowShowingMovies = [
        { id: 1, title: 'KUNG FU QUẢI CHƯỞNG' },
        { id: 2, title: 'QUỶ NHẬP TRÀNG 2' },
        { id: 3, title: 'TỨ HỔ ĐẠI NÁO' }
    ];

    const moviesSchedule: MovieSchedule[] = [
        {
            id: 1,
            title: 'KUNG FU QUẢI CHƯỞNG',
            rating: 'T18',
            genre: 'Hài, Hành Động',
            duration: 127,
            country: 'Hong Kong',
            language: 'Lồng Tiếng',
            description: 'Phim dành cho khán giả từ đủ 18 tuổi trở lên (18+)',
            poster: 'https://picsum.photos/id/104/300/400',
            isShowing: true,
            cinemas: [
                {
                    id: 1,
                    name: 'Luncinemas Hai Bà Trưng',
                    address: '52 Nguyễn Trãi, Q.1, TP.HCM',
                    showtimes: ['10:00', '13:30', '16:45', '19:30', '22:15']
                },
                {
                    id: 2,
                    name: 'Luncinemas Quốc Thanh',
                    address: '12 Quốc Thanh, Q.1, TP.HCM',
                    showtimes: ['10:30', '14:00', '17:15', '20:00']
                },
                {
                    id: 3,
                    name: 'Luncinemas Sinh Viên',
                    address: '234 Lê Duẩn, Q.1, TP.HCM',
                    showtimes: ['11:00', '15:30', '18:45', '21:30']
                }
            ]
        },
        {
            id: 2,
            title: 'QUỶ NHẬP TRÀNG 2',
            rating: 'T18',
            genre: 'Kinh dị',
            duration: 110,
            country: 'Việt Nam',
            language: 'Tiếng Việt',
            description: 'Phim dành cho khán giả từ đủ 18 tuổi trở lên (18+)',
            poster: 'https://picsum.photos/id/106/300/400',
            isShowing: true,
            cinemas: [
                {
                    id: 1,
                    name: 'Luncinemas Hai Bà Trưng',
                    address: '52 Nguyễn Trãi, Q.1, TP.HCM',
                    showtimes: ['12:00', '15:00', '18:00', '21:00']
                },
                {
                    id: 4,
                    name: 'Luncinemas Cộng Hòa',
                    address: '123 Cộng Hòa, Q.Tân Bình, TP.HCM',
                    showtimes: ['13:00', '16:00', '19:00', '22:00']
                }
            ]
        },
        {
            id: 3,
            title: 'CHÚNG SẼ ĐOẠT MẠNG',
            rating: 'T16',
            genre: 'Kinh dị, Tâm lý',
            duration: 95,
            country: 'Mỹ',
            language: 'Phụ đề',
            description: 'Phim dành cho khán giả từ đủ 16 tuổi trở lên (16+)',
            poster: 'https://picsum.photos/id/107/300/400',
            isShowing: false,
            cinemas: []
        },
        {
            id: 4,
            title: 'TỨ HỔ ĐẠI NÁO',
            rating: 'T16',
            genre: 'Hài, Hành động',
            duration: 120,
            country: 'Việt Nam',
            language: 'Tiếng Việt',
            description: 'Phim dành cho khán giả từ đủ 16 tuổi trở lên (16+)',
            poster: 'https://picsum.photos/id/108/300/400',
            isShowing: true,
            cinemas: [
                {
                    id: 2,
                    name: 'Luncinemas Quốc Thanh',
                    address: '12 Quốc Thanh, Q.1, TP.HCM',
                    showtimes: ['09:30', '12:30', '15:30', '18:30', '21:30']
                },
                {
                    id: 3,
                    name: 'Luncinemas Sinh Viên',
                    address: '234 Lê Duẩn, Q.1, TP.HCM',
                    showtimes: ['10:30', '13:30', '16:30', '19:30']
                }
            ]
        }
    ];

    useEffect(() => {
        const { theater, movie } = formData;
        if (!theater && !movie) {
            setFilteredResults([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);

        const results = moviesSchedule
            .filter(m => m.isShowing)
            .filter(m => !movie || m.title === movie)
            .map(m => ({
                ...m,
                cinemas: m.cinemas.filter(c => !theater || c.name === theater)
            }))
            .filter(m => m.cinemas.length > 0);

        setFilteredResults(results);
    }, [formData.theater, formData.movie]);

    // Component card phim dùng chung
    const MovieCard = ({ movie }: { movie: MovieSchedule }) => (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-64 flex-shrink-0">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-80 md:h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-6">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{movie.title}</h3>
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                {movie.rating}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{movie.genre}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span>⏱ {movie.duration} phút</span>
                            <span>🌍 {movie.country}</span>
                            <span>🎬 {movie.language}</span>
                        </div>
                        <p className="text-xs text-gray-400">{movie.description}</p>
                    </div>

                    {movie.cinemas.length > 0 ? (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <span>🎥</span> Các rạp đang chiếu:
                            </h4>
                            <div className="space-y-3">
                                {movie.cinemas.map((cinema) => (
                                    <div
                                        key={cinema.id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="mb-2">
                                            <div className="font-semibold text-gray-800">{cinema.name}</div>
                                            <div className="text-xs text-gray-500">{cinema.address}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {cinema.showtimes.map((time, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={`/dat-ve?movie=${movie.id}&cinema=${cinema.id}&time=${time}`}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-600 hover:text-white transition"
                                                >
                                                    {time}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <p className="text-yellow-700">
                                🎬 Phim chưa có lịch chiếu. Vui lòng quay lại sau!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">LỊCH CHIẾU PHIM</h1>
                    <p className="text-gray-600 mt-2">Cập nhật lịch chiếu mới nhất tại các rạp</p>
                </div>

                {/* FORM ĐẶT VÉ NHANH */}
                <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-xl shadow-2xl mb-8 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">ĐẶT VÉ NHANH</h2>

                        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select
                                    value={formData.theater}
                                    onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                >
                                    <option value="">Chọn Phim</option>
                                    {nowShowingMovies.map((movie) => (
                                        <option key={movie.id} value={movie.title}>{movie.title}</option>
                                    ))}
                                </select>

                                <select
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                >
                                    <option value="">Chọn Suất</option>
                                    {showtimes.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KẾT QUẢ TÌM KIẾM — hiện ngay dưới form khi có filter */}
                {hasSearched && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            🔍 Kết quả tìm kiếm ({filteredResults.length} phim)
                        </h2>
                        {filteredResults.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-700">
                                Không tìm thấy suất chiếu phù hợp. Thử chọn rạp hoặc phim khác!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredResults.map(movie => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Danh sách phim đầy đủ */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🎬 Tất cả phim đang chiếu</h2>
                    <div className="space-y-6">
                        {moviesSchedule.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LichChieuPage;