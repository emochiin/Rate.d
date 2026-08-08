import apiFetch from './api.js';

export async function searchMovie(query) {
  const response = await apiFetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    },
  );
  const data = response.results.slice(0, 10);
  const results = data.map((movie) => ({
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    score: movie.vote_average,
  }));
  return results;
}

export async function searchSeries(query) {
  const response = await apiFetch(
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    },
  );
  const data = response.results.slice(0, 10);
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
      headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
    }),
    apiFetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
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
      headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
    }),
    apiFetch(`https://api.themoviedb.org/3/tv/${id}/credits`, {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
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

export async function discoverMoviesByGenre(genreIds) {
  const genreString = genreIds.join('|');

  const movies = await Promise.all([
    apiFetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=1`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
    apiFetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=2`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
    apiFetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=3`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
  ]);
  const allResults = movies.flatMap((page) => page.results);
  return allResults.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    score: movie.vote_average,
    genre_ids: movie.genre_ids,
  }));
}

export async function discoverSeriesByGenre(genreIds) {
  const genreString = genreIds.join('|');

  const series = await Promise.all([
    apiFetch(
      `https://api.themoviedb.org/3/discover/tv?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=1`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
    apiFetch(
      `https://api.themoviedb.org/3/discover/tv?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=2`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
    apiFetch(
      `https://api.themoviedb.org/3/discover/tv?with_genres=${genreString}&sort_by=vote_average.desc&vote_count.gte=5000&page=3`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      },
    ),
  ]);
  const allResults = series.flatMap((page) => page.results);
  return allResults.map((show) => ({
    id: show.id,
    title: show.name,
    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
    score: show.vote_average,
    genre_ids: show.genre_ids,
  }));
}
