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
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-8 border-red-600 pl-4">
                    PHIM SẮP CHIẾU
                </h2>

                <p className="text-gray-500">Không có phim sắp chiếu</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-8 border-red-600 pl-4">
                PHIM SẮP CHIẾU
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {movies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-xl transition cursor-pointer group">

                            {/* poster */}
                            <img
                                src={
                                    movie.posterUrl
                                        ? `http://localhost:8080/images/${movie.posterUrl}`
                                        : "/no-image.jpg"
                                }
                                alt={movie.title}
                                className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition"
                            />

                            {/* title */}
                            <h3 className="font-semibold line-clamp-1">
                                {movie.title}
                            </h3>

                            {/* release date */}
                            {movie.releaseDate && (
                                <p className="text-sm text-gray-500">
                                    Khởi chiếu:{" "}
                                    {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                                </p>
                            )}

                            <span className="text-sm text-red-500 font-medium">
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