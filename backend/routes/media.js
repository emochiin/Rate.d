import express from 'express';
import pool from '../db/db.js';
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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      external_id,
      media_type,
      title,
      image_url,
      status = 'watchlist',
      rating = null,
      progress = 0,
    } = req.body;
    const user_id = req.user.userId;
    const mediaResult = await pool.query(
      'INSERT INTO media (external_id, media_type, title, image_url) VALUES ($1,$2,$3,$4) ON CONFLICT (external_id, media_type) DO UPDATE SET title = EXCLUDED.title RETURNING id',
      [external_id, media_type, title, image_url],
    );
    const media_id = mediaResult.rows[0].id;
    await pool.query(
      'INSERT INTO user_media_list (user_id, media_id, status, rating, progress) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, media_id) DO NOTHING',
      [user_id, media_id, status, rating, progress],
    );
    res.status(200).json({ message: 'Hinzufügen erfolgreich' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hinzufügen fehlgeschlagen' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const savedMedia = await pool.query(
      `
  SELECT 
    user_media_list.id, 
    user_media_list.status, 
    user_media_list.rating, 
    user_media_list.progress,
    media.title,
    media.image_url,
    media.media_type
  FROM user_media_list
  JOIN media ON user_media_list.media_id = media.id
  WHERE user_media_list.user_id = $1`,
      [user_id],
    );
    return res.json(savedMedia.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const { status, rating, progress } = req.body;
    await pool.query(
      `
    UPDATE user_media_list
    SET status = $1, rating = $2, progress = $3
    WHERE id = $4 AND user_id= $5`,
      [status, rating, progress, id, user_id],
    );
    return res.status(200).json({
      message: 'Update erfolgreich',
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    await pool.query(
      'DELETE FROM user_media_list WHERE id = $1 AND user_id= $2',
      [id, user_id],
    );
    return res.status(200).json({
      message: 'Löschen erfolgreich',
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

export default router;
