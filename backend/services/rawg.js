import apiFetch from './api.js';

export async function searchGame(query) {
  const response = await apiFetch(
    `https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${process.env.RAWG_API_KEY}&page_size=10`,
  );
  const data = response.results;
  const results = data.map((game) => ({
    name: game.name,
    background_image: game.background_image,
    rating: game.rating,
  }));
  return results;
}

export async function getGameDetails(id) {
  const [details, series] = await Promise.all([
    apiFetch(
      `https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_API_KEY}`,
    ),
    apiFetch(
      `https://api.rawg.io/api/games/${id}/game-series?key=${process.env.RAWG_API_KEY}`,
    ),
  ]);
  return {
    name: details.name,
    background_image: details.background_image,
    description: details.description_raw,
    rating: details.metacritic_platforms?.[0]?.metascore,
    genres: (details.genres ?? []).map((g) => g.name),
    platforms: (details.parent_platforms ?? []).map((p) => p.platform.name),
    developers: (details.developers ?? []).map((d) => d.name),
    age_restriction: details.esrb_rating?.name,
    release_date: details.released,
    tags: (details.tags ?? []).map((t) => t.name),
    related_games: series.results.map((g) => g.name),
  };
}

export async function discoverGameByGenre(genreIds) {
  const genreString = genreIds.join(',');

  const games = await apiFetch(
    `https://api.rawg.io/api/games?genres=${genreString}&key=${process.env.RAWG_API_KEY}&ordering=-rating&page_size=60&metacritic=50,100`,
  );
  return games.results.map((game) => ({
    id: game.id,
    title: game.name,
    image: game.background_image,
    score: game.rating,
    genre_ids: game.genres.map((g) => g.slug),
  }));
}
