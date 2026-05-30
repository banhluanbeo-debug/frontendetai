const BASE_URL = "https://backendemo-cbwy.onrender.com/api/showtimes";

export const getShowtimesByMovieId = async (movieId: number) => {
    const res = await fetch(`${BASE_URL}?movieId=${movieId}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch showtimes");

    const data = await res.json();
    return data.filter((st: any) => st.movieId === movieId);
};
export const getShowtimeById = async (id: number) => {
    const res = await fetch(`https://backendemo-cbwy.onrender.com/api/showtimes/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch showtime");

    return res.json();
};