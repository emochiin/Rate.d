import express from 'express';
import pool from '../db/db.js';
import { moodMapping } from '../data/moodMapping.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { discoverMoviesByGenre } from '../services/tmdb.js';
import { tmdbMovieGenreIds, namesToTmdbIds } from '../data/tmdbGenreIds.js';

const router = express.Router();

router.get('/recommend', authMiddleware, async (req, res) => {
  const { mood, type } = req.query;
  if (!mood || !type) {
    return res.status(400).json({ error: 'Mood und Type erforderlich' });
  }
  if (!moodMapping[type]) {
    return res.status(400).json({ error: 'Medientyp nicht supported' });
  }
  if (!moodMapping[type][mood]) {
    return res.status(400).json({ error: 'Mood nicht supported' });
  }
  const genreNames = moodMapping[type][mood];
  try {
    const genreIds = namesToTmdbIds(genreNames, tmdbMovieGenreIds);
    const results = await discoverMoviesByGenre(genreIds);
    const scoredResults = results.map((movie) => {
      const matches = movie.genre_ids.filter((id) => genreIds.includes(id));
      const matchScoreNormalized = matches.length / genreIds.length;
      const ratingNormalized = movie.score / 10;
      const finalScore = matchScoreNormalized * 0.4 + ratingNormalized * 0.6;
      return { ...movie, finalScore };
    });
    const sorted = scoredResults.sort((a, b) => b.finalScore - a.finalScore);
    return res.json(sorted);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'MoodMatch fehlgeschlagen' });
  }
});

export default router;
