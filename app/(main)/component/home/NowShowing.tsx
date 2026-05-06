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
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-l-8 border-red-600 pl-4">
                PHIM ĐANG CHIẾU
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.slice(0, 4).map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group">
                            <div className="aspect-[4/5] relative">
                                <img
                                    src={`http://localhost:8080/images/${movie.posterUrl}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                {movie.rating && (
                                    <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                                        {movie.rating}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                                {movie.genre && (
                                    <p className="text-gray-600 mb-3">{movie.genre}</p>
                                )}
                                <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
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
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Xem thêm
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default NowShowing;