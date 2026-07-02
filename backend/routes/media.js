import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { searchAnime, searchManga } from '../services/jikan.js';
import { searchTrack, searchAlbum } from '../services/lastfm.js';
import { searchGame } from '../services/rawg.js';
import { searchMovie, searchSeries } from '../services/tmdb.js';
import { searchBook } from '../services/openlibrary.js';

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

export default router;
