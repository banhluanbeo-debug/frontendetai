"use client";
import React from 'react';
import Link from 'next/link';

interface Movie {
    id: number;
    title: string;
    rating?: string;
    genre?: string;
    posterUrl?: string;
}

interface NowShowingProps {
    movies: Movie[];
}

const NowShowing: React.FC<NowShowingProps> = ({ movies }) => {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-white border-l-8 border-[#7c4dff] pl-4">
                PHIM ĐANG CHIẾU
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.slice(0, 4).map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-[#7c4dff]/30 transition cursor-pointer group">
                            <div className="aspect-[4/5] relative">
                                <img
                                    src={movie.posterUrl?.startsWith('http') ? movie.posterUrl : `https://backendemo-cbwy.onrender.com/images/${movie.posterUrl}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                {movie.rating && (
                                    <span className="absolute top-2 right-2 bg-[#7c4dff] text-white px-2 py-1 rounded text-sm font-bold shadow-md">
                                        {movie.rating}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 text-white">{movie.title}</h3>
                                {movie.genre && (
                                    <p className="text-gray-400 mb-3">{movie.genre}</p>
                                )}
                                <button className="w-full bg-[#3b3f8c]/60 border border-white/10 text-white py-2 rounded-lg group-hover:bg-[#7c4dff] group-hover:border-transparent transition">
                                    MUA VÉ
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Đưa ra ngoài grid để căn giữa đúng */}
            <div className="flex justify-center mt-8">
                <Link href="/movie">
                    <button className="px-6 py-2 bg-[#7c4dff] text-white rounded-lg hover:bg-[#651fff] transition shadow-[0_4px_15px_rgba(124,77,255,0.4)]">
                        Xem thêm
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default NowShowing;