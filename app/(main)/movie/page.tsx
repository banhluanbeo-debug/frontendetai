
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMovies } from "@/app/components/services/movie.service";

interface Movie {
    id: number;
    title: string;
    originalTitle?: string;
    rating?: string;
    genre?: string;
    posterUrl?: string;
    duration?: number;
    ageLimit?: string;
    releaseDate?: string;
    status?: "NOW_SHOWING" | "COMING";
}

const IMAGE_BASE = "http://localhost:8080/images";

const AGE_COLORS: Record<string, string> = {
    P: "bg-green-100 text-green-800 border-green-300",
    C13: "bg-yellow-100 text-yellow-800 border-yellow-300",
    C16: "bg-orange-100 text-orange-800 border-orange-300",
    C18: "bg-red-100 text-red-800 border-red-300",
};

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Tất cả");
    const [sortBy, setSortBy] = useState<"default" | "rating" | "duration">("default");

    useEffect(() => {
        getMovies()
            .then(setMovies)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // 🔥 FIX: tách phim theo status
    const nowShowingMovies = movies.filter(
        (m) => m.status === "NOW_SHOWING"
    );

    const comingSoonMovies = movies.filter(
        (m) => m.status === "COMING"
    );

    // Genre list
    const genres = [
        "Tất cả",
        ...Array.from(
            new Set(
                nowShowingMovies
                    .flatMap((m) => m.genre?.split(",").map((g) => g.trim()) ?? [])
            )
        ).filter(Boolean),
    ];

    // 🔥 FILTER ONLY NOW SHOWING
    const filtered = nowShowingMovies
        .filter((m) => {
            const matchSearch =
                m.title.toLowerCase().includes(search.toLowerCase()) ||
                (m.originalTitle ?? "").toLowerCase().includes(search.toLowerCase());

            const matchGenre =
                selectedGenre === "Tất cả" ||
                (m.genre ?? "")
                    .split(",")
                    .map((g) => g.trim())
                    .includes(selectedGenre);

            return matchSearch && matchGenre;
        })
        .sort((a, b) => {
            if (sortBy === "rating")
                return parseFloat(b.rating ?? "0") - parseFloat(a.rating ?? "0");

            if (sortBy === "duration")
                return (b.duration ?? 0) - (a.duration ?? 0);

            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4">

                    <div className="flex flex-col md:flex-row md:items-center gap-3">

                        <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-red-600 pl-3">
                            TẤT CẢ PHIM
                        </h1>

                        {/* SEARCH */}
                        <div className="relative flex-1 max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm phim..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg bg-gray-50 text-sm"
                            />
                        </div>

                        {/* SORT */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm bg-gray-50"
                        >
                            <option value="default">Mặc định</option>
                            <option value="rating">Đánh giá cao nhất</option>
                            <option value="duration">Thời lượng</option>
                        </select>
                    </div>

                    {/* GENRES */}
                    <div className="flex gap-2 overflow-x-auto mt-3">
                        {genres.map((g) => (
                            <button
                                key={g}
                                onClick={() => setSelectedGenre(g)}
                                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${selectedGenre === g
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* BODY */}
            <div className="container mx-auto px-4 py-8">

                {/* COUNT */}
                {!loading && (
                    <p className="text-sm text-gray-500 mb-6">
                        Hiển thị{" "}
                        <span className="font-medium text-gray-800">
                            {filtered.length}
                        </span>{" "}
                        phim đang chiếu
                    </p>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-3" />
                                <div className="h-4 bg-gray-200 mb-2 rounded" />
                                <div className="h-3 bg-gray-200 w-1/2 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl">🎬</p>
                        <p className="text-gray-500 mt-2">Không tìm thấy phim</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedGenre("Tất cả");
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Reset
                        </button>
                    </div>
                )}

                {/* GRID */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                        {filtered.map((movie) => (
                            <Link key={movie.id} href={`/movie/${movie.id}`}>
                                <div className="group cursor-pointer">

                                    {/* POSTER */}
                                    <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-200">

                                        <img
                                            src={
                                                movie.posterUrl
                                                    ? `${IMAGE_BASE}/${movie.posterUrl}`
                                                    : "/no-image.jpg"
                                            }
                                            alt={movie.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />

                                        {/* overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                            <span className="bg-red-600 text-white px-3 py-2 rounded">
                                                MUA VÉ
                                            </span>
                                        </div>

                                        {/* AGE */}
                                        {movie.ageLimit && (
                                            <span
                                                className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded border ${AGE_COLORS[movie.ageLimit] ??
                                                    "bg-gray-100"
                                                    }`}
                                            >
                                                {movie.ageLimit}
                                            </span>
                                        )}

                                        {/* RATING */}
                                        {movie.rating && (
                                            <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-yellow-400 px-2 py-0.5 rounded">
                                                ★ {movie.rating}
                                            </span>
                                        )}
                                    </div>

                                    {/* INFO */}
                                    <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                                        {movie.title}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        {movie.genre?.split(",")[0]}
                                        {movie.duration && ` · ${movie.duration} phút`}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}