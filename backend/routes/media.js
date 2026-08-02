import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  searchAnime,
  searchManga,
  getAnimeDetails,
  getMangaDetails,
} from '../services/jikan.js';
import {
  searchTrack,
  searchAlbum,
  getAlbumDetails,
  getTrackDetails,
} from '../services/lastfm.js';
import { searchGame, getGameDetails } from '../services/rawg.js';
import {
  searchMovie,
  searchSeries,
  getMovieDetails,
  getSeriesDetails,
} from '../services/tmdb.js';
import { searchBook, getBookDetails } from '../services/openlibrary.js';
import apiFetch from '../services/api.js';

const router = express.Router();

const searchFunctions = {
  anime: searchAnime,
  manga: searchManga,
  track: searchTrack,
  album: searchAlbum,
  game: searchGame,
  movie: searchMovie,
  series: searchSeries,
  book: searchBook,
};

const getFunctions = {
  anime: getAnimeDetails,
  manga: getMangaDetails,
  track: getTrackDetails,
  album: getAlbumDetails,
  game: getGameDetails,
  movie: getMovieDetails,
  series: getSeriesDetails,
  book: getBookDetails,
};

router.get('/search', authMiddleware, async (req, res) => {
  const { q, type } = req.query;
  if (!q || !type) {
    return res.status(400).json({ error: 'Falsches Query-Format' });
  }
  if (!searchFunctions[type]) {
    return res.status(400).json({ error: 'Medientyp nicht supported' });
  }
  try {
    const calledFunction = searchFunctions[type];
    const results = await calledFunction(q);
    return res.json(results);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Funktionsaufruf ist schiefgelaufen' });
  }
});

router.get('/info', authMiddleware, async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) {
    return res.status(400).json({ error: 'Falsches Query Format' });
  }

  if (!getFunctions[type]) {
    return res.status(400).json({ error: 'Medientyp nicht supported' });
  }

  try {
    const calledFunction = getFunctions[type];
    const results = await calledFunction(id);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Funktionsaufruf fehlgeschlagen' });
  }
});

export default router;
