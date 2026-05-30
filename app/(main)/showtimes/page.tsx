"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getNowShowingMovies } from '@/app/components/services/movie.service';

interface ShowtimeInfo {
    id: number;
    showDate: string;
    showTime: string;
    price: number;
    roomId: number;
    roomName: string;
}

interface Cinema {
    id: number;
    name: string;
    address: string;
    showtimes: ShowtimeInfo[];
}

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
    cinemas: Cinema[];
}

interface FormData {
    theater: string;
    movie: string;
    date: string;
    showtime: string;
}

const LichChieuPageContent = () => {
    const searchParams = useSearchParams();
    const timeParam = searchParams.get('time');

    const [formData, setFormData] = useState<FormData>({
        theater: '',
        movie: '',
        date: '',
        showtime: timeParam || ''
    });

    const [moviesSchedule, setMoviesSchedule] = useState<MovieSchedule[]>([]);
    const [filteredResults, setFilteredResults] = useState<MovieSchedule[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Extracted filter options
    const [allRooms, setAllRooms] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [showtimesList, setShowtimesList] = useState<string[]>([]);
    const [moviesList, setMoviesList] = useState<string[]>([]);
    
    // Fetch rooms from backend
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backendemo-cbwy.onrender.com';
                if (!backendUrl) {
                    console.error('NEXT_PUBLIC_BACKEND_URL is not set');
                    setAllRooms([]);
                    return;
                }
                const res = await fetch(`${backendUrl}/api/rooms`);
                if (!res.ok) {
                    console.error('Failed to fetch rooms, status:', res.status);
                    setAllRooms([]);
                    return;
                }
                const data = await res.json();
                // Assuming each room has a 'name' property
                const roomNames = data.map((r: any) => r.name || r.title || `${r.id}`);
                setAllRooms(roomNames);
            } catch (err) {
                console.error('Error fetching rooms', err);
                setAllRooms([]);
            }
        };
        fetchRooms();
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getNowShowingMovies();
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const maxDate = new Date(today);
                maxDate.setDate(today.getDate() + 4);
                maxDate.setHours(23, 59, 59, 999);
                
                // Format the fetched MovieDTOs into MovieSchedule format
                const formatted: MovieSchedule[] = data.map((m: any) => {
                    const cinemasMap = new Map<string, Cinema>();
                    
                    if (m.showtimes && Array.isArray(m.showtimes)) {
                        m.showtimes.forEach((st: any) => {
                            const showDate = new Date(st.showDate);
                            showDate.setHours(0, 0, 0, 0);
                            // Only include showtimes within the next 5 days
                            if (showDate >= today && showDate <= maxDate) {
                                const roomName = st.roomName || 'Phòng chiếu';
                                if (!cinemasMap.has(roomName)) {
                                    cinemasMap.set(roomName, {
                                        id: st.roomId || 0,
                                        name: roomName,
                                        address: 'Cơ sở Luncinemas', // Mock address for now
                                        showtimes: []
                                    });
                                }
                                // Store the showtime information
                                cinemasMap.get(roomName)?.showtimes.push({
                                    id: st.id,
                                    showDate: st.showDate,
                                    showTime: st.showTime, // assume this is like "10:30:00"
                                    price: st.price,
                                    roomId: st.roomId,
                                    roomName: st.roomName
                                });
                            }
                        });
                    }
                    
                    // Sort showtimes by date and time
                    cinemasMap.forEach((cinema) => {
                        cinema.showtimes.sort((a, b) => {
                            const dateA = new Date(a.showDate).getTime();
                            const dateB = new Date(b.showDate).getTime();
                            if (dateA !== dateB) return dateA - dateB;
                            return a.showTime.localeCompare(b.showTime);
                        });
                    });
                    
                    return {
                        id: m.id,
                        title: m.title,
                        rating: m.ageLimit || 'P',
                        genre: m.genre,
                        duration: m.duration,
                        country: 'N/A', // or add if available
                        language: m.language,
                        description: m.content || '',
                        poster: m.posterUrl?.startsWith('http') ? m.posterUrl : `https://backendemo-cbwy.onrender.com/images/${m.posterUrl}`,
                        isShowing: true,
                        cinemas: Array.from(cinemasMap.values())
                    };
                });
                
                setMoviesSchedule(formatted);
                
                // Extract filter options dynamically
                const allDates = new Set<string>();
                const allShowtimes = new Set<string>();
                const allMovies = new Set<string>();
                
                formatted.forEach(m => {
                    if (m.cinemas.length > 0) allMovies.add(m.title);
                    m.cinemas.forEach(c => {
                        c.showtimes.forEach(st => {
                            allDates.add(st.showDate);
                            const timeStr = st.showTime?.slice(0, 5) || '';
                            if (timeStr) allShowtimes.add(timeStr);
                        });
                    });
                });
                
                setDates(Array.from(allDates).sort());
                setShowtimesList(Array.from(allShowtimes).sort());
                setMoviesList(Array.from(allMovies));
                
            } catch (err) {
                console.error("Failed to fetch showtimes", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (timeParam) {
            setFormData(prev => ({ ...prev, showtime: timeParam }));
        }
    }, [timeParam]);

    useEffect(() => {
        const { theater, movie, date, showtime } = formData;

        // If initial load and a timeParam is present, we still want to filter. 
        if (!theater && !movie && !date && !showtime) {
            setFilteredResults([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);

        const results = moviesSchedule
            .filter(m => m.isShowing)
            .filter(m => !movie || m.title === movie)
            .map(m => {
                const filteredCinemas = m.cinemas
                    .filter(c => !theater || c.name === theater)
                    .map(c => {
                        const filteredShowtimes = c.showtimes.filter(t => {
                            const matchDate = !date || t.showDate === date;
                            const tTime = t.showTime?.slice(0, 5) || '';
                            const matchTime = !showtime || tTime === showtime;
                            return matchDate && matchTime;
                        });

                        return {
                            ...c,
                            showtimes: filteredShowtimes
                        };
                    })
                    .filter(c => c.showtimes.length > 0);

                return {
                    ...m,
                    cinemas: filteredCinemas
                };
            })
            .filter(m => m.cinemas.length > 0);

        setFilteredResults(results);
    }, [formData, moviesSchedule]);

    // Component card phim dùng chung
    const MovieCard = ({ movie }: { movie: MovieSchedule }) => (
        <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
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
                            <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                            <span className="bg-[#7c4dff] text-white px-2 py-1 rounded text-xs font-bold">
                                {movie.rating}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{movie.genre}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                            <span>⏱ {movie.duration} phút</span>
                            {/* <span>🌍 {movie.country}</span> */}
                            <span>🎬 {movie.language}</span>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-2">{movie.description}</p>
                    </div>

                    {movie.cinemas.length > 0 ? (
                        <div>
                            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <span>🎥</span> Các thời gian đang chiếu:
                            </h4>
                            <div className="space-y-3">
                                {movie.cinemas.map((cinema) => (
                                    <div
                                        key={cinema.name}
                                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                                    >
                                        <div className="mb-2">
                                            <div className="font-semibold text-white">{cinema.name}</div>
                                            <div className="text-xs text-gray-400">{cinema.address}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {cinema.showtimes.map((st) => (
                                                <Link
                                                    key={st.id}
                                                    href={`/booking/${movie.id}?showtimeId=${st.id}`}
                                                    className="px-3 py-1 bg-[#3b3f8c]/60 text-white border border-white/10 rounded-lg text-sm hover:bg-[#7c4dff] hover:border-transparent transition"
                                                >
                                                    {st.showTime?.slice(0, 5)} - {st.showDate}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                            <p className="text-yellow-400">
                                🎬 Phim chưa có lịch chiếu. Vui lòng quay lại sau!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white py-8">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white">LỊCH CHIẾU PHIM</h1>
                    <p className="text-gray-400 mt-2">Cập nhật lịch chiếu mới nhất tại các rạp</p>
                </div>

                {/* FORM ĐẶT VÉ NHANH */}
                <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl mb-8 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-yellow-300">TÌM CHUYẾN NHANH</h2>

                        <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select
                                    value={formData.theater}
                                    onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
                                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] transition [&>option]:text-black"
                                >
                                    <option value="">Chọn Phòng</option>
                                    {allRooms.map((room, index) => (
                                        <option key={index} value={room}>{room}</option>
                                    ))}
                                </select>

                                <select
                                    value={formData.movie}
                                    onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] transition [&>option]:text-black"
                                >
                                    <option value="">Chọn Phim</option>
                                    {moviesList.map((movie, index) => (
                                        <option key={index} value={movie}>{movie}</option>
                                    ))}
                                </select>

                                <select
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] transition [&>option]:text-black"
                                >
                                    <option value="">Chọn Ngày</option>
                                    {dates.map((date, index) => (
                                        <option key={index} value={date}>{date}</option>
                                    ))}
                                </select>

                                <select
                                    value={formData.showtime}
                                    onChange={(e) => setFormData({ ...formData, showtime: e.target.value })}
                                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff] transition [&>option]:text-black"
                                >
                                    <option value="">Chọn Suất</option>
                                    {showtimesList.map((time, index) => (
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
                        <h2 className="text-xl font-bold text-yellow-300 mb-4">
                            🔍 Kết quả tìm kiếm ({filteredResults.length} phim)
                        </h2>
                        {filteredResults.length === 0 ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center text-yellow-400">
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
                    <h2 className="text-xl font-bold text-white mb-4">🎬 Tất cả phim đang chiếu</h2>
                    {moviesSchedule.length === 0 ? (
                        <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-md text-center text-gray-300">
                            Đang tải lịch chiếu...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {moviesSchedule.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const LichChieuPage = () => {
    return (
        <Suspense fallback={<div className="p-10 text-center text-xl">Loading...</div>}>
            <LichChieuPageContent />
        </Suspense>
    );
};

export default LichChieuPage;