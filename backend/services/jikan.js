import apiFetch from './api.js';

export async function searchAnime(query) {
  let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;
  const response = await apiFetch(url);
  const animes = response.data;
  const results = animes.map((anime) => ({
    title: anime.title,
    image: anime.images.webp.image_url,
    score: anime.score,
    status: anime.status,
  }));
  return results;
}

export async function getAnimeDetails(id) {
  const response = await apiFetch(`https://api.jikan.moe/v4/anime/${id}`);
  const data = response.data;
  const result = {
    title: data.title,
    image: data.images.webp.image_url,
    info: data.synopsis,
    aired_from: data.aired.from,
    aired_to: data.aired.to,
    rating: data.rating,
    score: data.score,
    genre: data.genres.map((genre) => genre.name),
    scored_by: data.scored_by,
    status: data.status,
  };
  return result;
}

export async function searchManga(query) {
  let url = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`;
  const response = await apiFetch(url);
  const mangas = response.data;
  const results = mangas.map((manga) => ({
    title: manga.title,
    image: manga.images.webp.image_url,
    score: manga.score,
    status: manga.status,
  }));
  return results;
}

export async function getMangaDetails(id) {
  const response = await apiFetch(`https://api.jikan.moe/v4/manga/${id}`);
  const data = response.data;
  const result = {
    title: data.title,
    image: data.images.webp.image_url,
    info: data.synopsis,
    published_from: data.published.from,
    published_to: data.published.to,
    author: data.authors.map((author) => author.name),
    score: data.score,
    genre: data.genres.map((genre) => genre.name),
    scored_by: data.scored_by,
    status: data.status,
  };
  return result;
}

export async function discoverAnimeByGenre(genreIds) {
  const genreString = genreIds.join(',');

  const animes = await Promise.all([
    apiFetch(
      `https://api.jikan.moe/v4/anime?genres=${genreString}&order_by=score&sort=desc&limit=20&page=1`,
    ),
    apiFetch(
      `https://api.jikan.moe/v4/anime?genres=${genreString}&order_by=score&sort=desc&limit=20&page=2`,
    ),
    apiFetch(
      `https://api.jikan.moe/v4/anime?genres=${genreString}&order_by=score&sort=desc&limit=20&page=3`,
    ),
  ]);
  const allResults = animes.flatMap((page) => page.data);
  return allResults.map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    score: anime.score,
    genre_ids: anime.genres.map((g) => g.mal_id),
  }));
}

export async function discoverMangaByGenre(genreIds) {
  const genreString = genreIds.join(',');

  const mangas = await Promise.all([
    apiFetch(
      `https://api.jikan.moe/v4/manga?genres=${genreString}&order_by=score&sort=desc&limit=20&page=1`,
    ),
    apiFetch(
      `https://api.jikan.moe/v4/manga?genres=${genreString}&order_by=score&sort=desc&limit=20&page=2`,
    ),
    apiFetch(
      `https://api.jikan.moe/v4/manga?genres=${genreString}&order_by=score&sort=desc&limit=20&page=3`,
    ),
  ]);
  const allResults = mangas.flatMap((page) => page.data);
  return allResults.map((manga) => ({
    id: manga.mal_id,
    title: manga.title,
    image: manga.images.webp.image_url,
    score: manga.score,
    genre_ids: manga.genres.map((g) => g.mal_id),
  }));
}
