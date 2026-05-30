"use client";
import React from "react";
import Link from "next/link";

interface ComingSoonMovie {
    id: number;
    title: string;
    posterUrl?: string;
    releaseDate?: string;
}

interface ComingSoonProps {
    movies: ComingSoonMovie[];
}

const ComingSoon: React.FC<ComingSoonProps> = ({ movies }) => {
    if (!movies || movies.length === 0) {
        return (
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6 text-white border-l-8 border-[#7c4dff] pl-4">
                    PHIM SẮP CHIẾU
                </h2>

                <p className="text-gray-400">Không có phim sắp chiếu</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-white border-l-8 border-[#7c4dff] pl-4">
                PHIM SẮP CHIẾU
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {movies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="bg-[#1a237e]/40 backdrop-blur-md border border-white/10 rounded-lg shadow p-4 text-center hover:shadow-xl hover:shadow-[#7c4dff]/30 transition cursor-pointer group">

                            {/* poster */}
                            <img
                                src={
                                    movie.posterUrl
                                        ? movie.posterUrl.startsWith('http')
                                            ? movie.posterUrl
                                            : `https://backendemo-cbwy.onrender.com/images/${movie.posterUrl}`
                                        : "/no-image.jpg"
                                }
                                alt={movie.title}
                                className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition"
                            />

                            {/* title */}
                            <h3 className="font-semibold line-clamp-1 text-white mt-3">
                                {movie.title}
                            </h3>

                            {/* release date */}
                            {movie.releaseDate && (
                                <p className="text-sm text-gray-400 mt-1">
                                    Khởi chiếu:{" "}
                                    {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                                </p>
                            )}

                            <span className="text-sm text-[#7c4dff] font-medium mt-2 inline-block">
                                Sắp ra mắt
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ComingSoon;