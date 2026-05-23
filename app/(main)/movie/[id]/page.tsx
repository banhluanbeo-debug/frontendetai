"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from "react";
import { getShowtimesByMovieId } from '@/app/components/services/showtime.service';

// Định nghĩa types
interface MovieDetail {
    id: number;
    title: string;
    originalTitle?: string;
    rating?: string;
    genre: string;
    duration: number;
    releaseDate: string;
    director: string;
    cast: string | string[];  // API trả string, có thể là array
    content: string;
    trailerUrl: string;
    posterUrl: string;
    backdropUrl: string;
    language: string;
    subtitle: string;
    ageLimit?: string;   // API dùng ageLimit
    ageRating?: string;  // fallback
    showtimes: Showtime[];
}

interface Showtime {
    id: number;
    date: string;
    times: {
        time: string;
        type: string;
        available: boolean;
        price: number;
    }[];
}

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
}

const MovieDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'showtimes' | 'reviews' | 'trailer'>('info');
    const [reviewText, setReviewText] = useState('');
    const [userRating, setUserRating] = useState(0);
    // Mock data - Trong thực tế sẽ gọi API
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [showtimes, setShowtimes] = useState<any[]>([]);

    useEffect(() => {
        if (!params?.id || Array.isArray(params.id)) return;

        fetch(`http://localhost:8080/api/movies/${params.id}`)
            .then(res => res.json())
            .then(data =>

                setMovieDetail(data))

            .catch(err => console.error(err));
    }, [params.id]);



    useEffect(() => {
        if (!params?.id || Array.isArray(params.id)) return;

        getShowtimesByMovieId(Number(params.id))
            .then(data => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const maxDate = new Date(today);
                maxDate.setDate(today.getDate() + 4);
                maxDate.setHours(23, 59, 59, 999);

                const filtered = data.filter((st: any) => {
                    const showDate = new Date(st.showDate);
                    showDate.setHours(0, 0, 0, 0);
                    return showDate >= today && showDate <= maxDate;
                });

                setShowtimes(filtered);
                if (filtered.length > 0) {
                    const sortedDates = [...new Set(filtered.map((st: any) => st.showDate))]
                        .sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
                    setSelectedDate(sortedDates[0] as string);
                }
            })
            .catch(err => console.error(err));
    }, [params.id]);

    // Lọc các ngày và sắp xếp tăng dần (đã được filter từ lúc set state)
    const dates = [...new Set(showtimes.map((st: any) => st.showDate))]
        .sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());

    const rooms = [...new Set(showtimes.map((st: any) => st.roomName))];

    if (!movieDetail) {
        return <div className="p-10 text-2xl">Loading...</div>;
    }

    // 👇 Thêm block này ngay sau
    if (movieDetail.releaseDate && new Date(movieDetail.releaseDate) > new Date()) {
        return (
            <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
                <div className="text-center px-6">
                    <div className="relative h-[400px] w-full max-w-md mx-auto rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                        <img
                            src={`http://localhost:8080/images/${movieDetail.posterUrl}`}
                            alt={movieDetail.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                            <span className="text-6xl mb-4">🎬</span>
                            <span className="bg-[#7c4dff] text-white text-xl font-bold px-6 py-2 rounded-full shadow-[0_4px_15px_rgba(124,77,255,0.4)]">
                                SẮP RA MẮT
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2">{movieDetail.title}</h1>
                    <p className="text-gray-300 text-lg mb-2">{movieDetail.originalTitle}</p>
                    <p className="text-[#7c4dff] font-semibold text-lg mb-6">
                        📅 Khởi chiếu: {movieDetail.releaseDate}
                    </p>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        Phim chưa được công chiếu. Hãy quay lại sau để xem thông tin chi tiết và đặt vé!
                    </p>

                    <Link
                        href="/movie"
                        className="inline-block bg-[#7c4dff] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#651fff] transition text-lg shadow-[0_4px_15px_rgba(124,77,255,0.4)]"
                    >
                        ← Quay lại danh sách phim
                    </Link>
                </div>
            </div>
        );
    }
    const handleBooking = (theater: string, showtime: any) => {
        router.push(`/booking/${movieDetail.id}?theater=${encodeURIComponent(theater)}&time=${showtime.time}&date=${selectedDate}`);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewText.trim() && userRating > 0) {
            console.log('Review submitted:', { rating: userRating, comment: reviewText });
            setReviewText('');
            setUserRating(0);
            alert('Cảm ơn bạn đã đánh giá phim!');
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white">
            {/* Hero Section with Backdrop */}
            <div className="relative h-[750px] overflow-hidden mt-0">
                <video
                    key={movieDetail.id}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src={movieDetail.backdropUrl || "http://localhost:8080/video/default.mp4"}
                        type="video/mp4"
                    />
                </video>
                {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/30 to-transparent"></div> */}
                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            <img
                                src={`http://localhost:8080/images/${movieDetail.posterUrl}`}
                                alt={movieDetail.title}
                                className="w-48 h-72 object-cover rounded-xl shadow-2xl hidden md:block"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-[#7c4dff] text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
                                        {movieDetail.ageLimit ?? movieDetail.ageRating ?? 'PG'}
                                    </span>
                                    {movieDetail.rating && (
                                        <span className="text-yellow-400 text-lg">★ {movieDetail.rating}/10</span>
                                    )}
                                    <span className="text-gray-300 text-base">{movieDetail.duration} phút</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-2">{movieDetail.title}</h1>
                                <p className="text-2xl text-gray-300 mb-4">{movieDetail.originalTitle}</p>
                                <div className="flex flex-wrap gap-4 text-base mb-6">
                                    <span>🎬 {movieDetail.genre}</span>
                                    <span>📅 {movieDetail.releaseDate}</span>
                                    <span>🗣️ {movieDetail.language}</span>
                                    <span>📝 {movieDetail.subtitle}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveTab('showtimes')}
                                        className="bg-[#7c4dff] px-8 py-3 rounded-lg font-bold hover:bg-[#651fff] transition transform hover:scale-105 text-lg shadow-[0_4px_15px_rgba(124,77,255,0.4)]"
                                    >
                                        MUA VÉ NGAY
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('info');
                                            setTimeout(() => {
                                                document.getElementById('trailer-section')
                                                    ?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition text-lg"
                                    >
                                        ▶ XEM TRAILER
                                    </button>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="container mx-auto px-4 mt-8">
                <div className="border-b border-white/10">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`pb-4 px-2 font-semibold transition relative text-xl ${activeTab === 'info'
                                ? 'text-[#7c4dff] border-b-2 border-[#7c4dff]'
                                : 'text-gray-400 hover:text-[#7c4dff]'
                                }`}
                        >
                            THÔNG TIN PHIM
                        </button>
                        <button
                            onClick={() => setActiveTab('showtimes')}
                            className={`pb-4 px-2 font-semibold transition relative text-xl ${activeTab === 'showtimes'
                                ? 'text-[#7c4dff] border-b-2 border-[#7c4dff]'
                                : 'text-gray-400 hover:text-[#7c4dff]'
                                }`}
                        >
                            LỊCH CHIẾU
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 px-2 font-semibold transition relative text-xl ${activeTab === 'reviews'
                                ? 'text-[#7c4dff] border-b-2 border-[#7c4dff]'
                                : 'text-gray-400 hover:text-[#7c4dff]'
                                }`}
                        >
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Info Tab */}
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 mb-6">
                                <h2 className="text-3xl font-bold mb-4 text-white">Nội dung phim</h2>
                                <p className="text-gray-200 leading-relaxed whitespace-pre-line text-base">
                                    {movieDetail.content || 'Nội dung đang được cập nhật...'}
                                </p>
                            </div>

                            <div id="trailer-section" className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                                <h2 className="text-3xl font-bold mb-4 text-white">Trailer</h2>

                                <div className="aspect-w-16 aspect-h-9">
                                    {movieDetail.trailerUrl ? (
                                        <iframe
                                            src={movieDetail.trailerUrl}
                                            title="Movie Trailer"
                                            className="w-full h-[400px] rounded-lg"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-lg">Chưa có trailer</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-2xl font-bold mb-4 text-white">Thông tin chi tiết</h3>
                                <div className="space-y-3 text-base">
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Đạo diễn:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.director || 'Đang cập nhật'}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Diễn viên:</span>
                                        <p className="text-gray-200 text-base mt-1">
                                            {Array.isArray(movieDetail.cast)
                                                ? movieDetail.cast.join(', ')
                                                : (movieDetail.cast || 'Không có diễn viên')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Thể loại:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.genre}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Thời lượng:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.duration} phút</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Ngày khởi chiếu:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.releaseDate}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Ngôn ngữ:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.language}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 text-lg">Phụ đề:</span>
                                        <p className="text-gray-200 text-base mt-1">{movieDetail.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Showtimes Tab */}
                {activeTab === 'showtimes' && (
                    <div>
                        {/* Date Selector */}
                        <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-3xl font-bold mb-4 text-white">Chọn ngày chiếu</h2>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {dates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap text-base ${selectedDate === date
                                            ? 'bg-[#7c4dff] text-white shadow-md'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Showtimes by Theater */}
                        {selectedDate && (
                            <div className="space-y-6">
                                {rooms.map((room) => {
                                    const filtered = showtimes.filter(
                                        st => st.showDate === selectedDate && st.roomName === room
                                    );

                                    return (
                                        <div key={room} className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                                            <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                                <span>🏠</span> {room}
                                            </h3>
                                            {filtered.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                    {filtered.map((st) => (
                                                        <button
                                                            key={st.id}
                                                            onClick={() => router.push(`/booking/${movieDetail.id}?showtimeId=${st.id}`)}
                                                            className="p-3 rounded-lg text-center bg-[#3b3f8c]/60 border border-white/10 hover:bg-[#7c4dff] hover:border-transparent text-white transition cursor-pointer"
                                                        >
                                                            <div className="font-bold text-base">{st.showTime.slice(0, 5)}</div>
                                                            <div className="text-sm font-semibold mt-1">
                                                                {st.price.toLocaleString()}đ
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-center py-8 text-lg">
                                                    Chưa có lịch chiếu cho ngày này
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Tab */}

            </div>

            {/* Related Movies Section */}

        </div >
    );
};

export default MovieDetailPage;