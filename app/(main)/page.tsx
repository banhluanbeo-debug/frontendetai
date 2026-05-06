import Home from "./home/Home";

import { getMovies } from "../components/services/movie.service";


export default async function Page() {
  const data = await getMovies();

  // Map lại cho khớp UI (tránh thiếu field)
  const movies = data.map((m: any) => ({
    id: m.id,
    title: m.title,
    rating: m.rating || "T13",
    genre: m.genre || "Đang cập nhật",
    posterUrl: m.posterUrl || "",
  }));

  return <Home movies={movies} />;
}