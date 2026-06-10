import apiFetch from './api.js';

export async function searchMovie(query) {
  const response = await apiFetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    },
  );
  const data = response.results;
  const results = data.map((movie) => ({
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    score: movie.vote_average,
  }));
  return results;
}

export async function searchSeries(query) {
  const response = await apiFetch(
    `https://api.themoviedb.org/3/search/tv?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    },
  );
  const data = response.results;
  const results = data.map((series) => ({
    title: series.name,
    image: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
    score: series.vote_average,
  }));
  return results;
}

export async function getMovieDetails(id) {
  const [details, credits] = await Promise.all([
    apiFetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` },
    }),
    apiFetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` },
    }),
  ]);
  return {
    title: details.title,
    image: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
    score: details.vote_average,
    release_date: details.release_date,
    runtime: details.runtime,
    original_language: details.original_language,
    genres: details.genres.map((genre) => genre.name),
    info: details.overview,
    actors: credits.cast.slice(0, 6).map((actor) => ({
      actor_name: actor.name,
      actor_character: actor.character,
      actor_img: `https://image.tmdb.org/t/p/w500${actor.profile_path}`,
    })),
  };
}
export async function getSeriesDetails(id) {
  const [details, credits] = await Promise.all([
    apiFetch(`https://api.themoviedb.org/3/tv/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` },
    }),
    apiFetch(`https://api.themoviedb.org/3/tv/${id}/credits`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` },
    }),
  ]);
  return {
    title: details.name,
    image: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
    score: details.vote_average,
    first_air_date: details.first_air_date,
    last_air_date: details.last_air_date,
    number_of_seasons: details.number_of_seasons,
    number_of_episodes: details.number_of_episodes,
    original_language: details.original_language,
    genres: details.genres.map((genre) => genre.name),
    info: details.overview,
    actors: credits.cast.slice(0, 6).map((actor) => ({
      actor_name: actor.name,
      actor_character: actor.character,
      actor_img: `https://image.tmdb.org/t/p/w500${actor.profile_path}`,
    })),
  };
}
