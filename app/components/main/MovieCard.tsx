"use client";
import React from 'react';
import Link from 'next/link';

interface Movie {
    id: number;
    title: string;
    rating?: string;
    genre?: string;
    image?: string;
}

interface MovieCardProps {
    movie: Movie;
    type?: 'nowShowing' | 'comingSoon';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, type = 'nowShowing' }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
            <Link href={`/phim/${movie.id}`}>
                <div className="relative overflow-hidden cursor-pointer">
                    <div className={`h-64 ${!movie.image ? 'bg-gradient-to-br from-purple-400 to-red-400' : ''}`}>
                        {movie.image && (
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                        )}
                        {movie.rating && type === 'nowShowing' && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold z-10">
                                {movie.rating}
                            </span>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                        {movie.genre && <p className="text-gray-600 mb-3 text-sm">{movie.genre}</p>}
                        <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-red-600 hover:text-white transition font-semibold">
                            {type === 'nowShowing' ? 'MUA VÉ' : 'CHI TIẾT'}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;