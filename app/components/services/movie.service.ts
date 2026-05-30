const BASE_URL = "https://backendemo-cbwy.onrender.com/api/movies";

export const getMovies = async () => {
    const res = await fetch(BASE_URL, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch movies");

    return res.json();
};

export const getMovieById = async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) throw new Error("Failed");

    return res.json();
};

// 👇 NEW
export const getComingSoonMovies = async () => {
    const res = await fetch(`${BASE_URL}/coming-soon`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed");

    return res.json();
};

// 👇 NEW
export const getNowShowingMovies = async () => {
    const res = await fetch(`${BASE_URL}/now-showing`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed");

    return res.json();
};