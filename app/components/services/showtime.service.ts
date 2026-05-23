const BASE_URL = "http://localhost:8080/api/showtimes";

export const getShowtimesByMovieId = async (movieId: number) => {
    const res = await fetch(`${BASE_URL}?movieId=${movieId}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch showtimes");

    const data = await res.json();
    return data.filter((st: any) => st.movieId === movieId);
};
export const getShowtimeById = async (id: number) => {
    const res = await fetch(`http://localhost:8080/api/showtimes/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch showtime");

    return res.json();
};