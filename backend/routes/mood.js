import express from 'express';
import pool from '../db/db.js';
import { moodMapping } from '../data/moodMapping.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  discoverMoviesByGenre,
  discoverSeriesByGenre,
} from '../services/tmdb.js';
import {
  tmdbMovieGenreIds,
  tmdbSeriesGenreIds,
  namesToTmdbIds,
} from '../data/tmdbGenreIds.js';
import { discoverGameByGenre } from '../services/rawg.js';
import { namesToRawgSlugs } from '../data/rawgGenreSlugs.js';
import {
  discoverAnimeByGenre,
  discoverMangaByGenre,
} from '../services/jikan.js';
import { jikanGenreIds, namesToJikanIds } from '../data/jikanGenreIds.js';

const discoverFunctions = {
  movie: discoverMoviesByGenre,
  series: discoverSeriesByGenre,
  game: discoverGameByGenre,
  anime: discoverAnimeByGenre,
  manga: discoverMangaByGenre,
};

const genreConverters = {
  movie: (names) => namesToTmdbIds(names, tmdbMovieGenreIds),
  series: (names) => namesToTmdbIds(names, tmdbSeriesGenreIds),
  game: (names) => namesToRawgSlugs(names),
  anime: (names) => namesToJikanIds(names),
  manga: (names) => namesToJikanIds(names),
};

const ratingNormalizers = {
  movie: (score) => score / 10,
  series: (score) => score / 10,
  game: (score) => score / 5,
  anime: (score) => score / 10,
  manga: (score) => score / 10,
};

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

  if (!discoverFunctions[type]) {
    return res.status(400).json({
      error: 'MoodMatch für diesen Medientyp noch nicht implementiert',
    });
  }

  try {
    const genreNames = moodMapping[type][mood];
    const discoverFunction = discoverFunctions[type];
    const genreIds = genreConverters[type](genreNames);
    const results = await discoverFunction(genreIds);
    const scoredResults = results.map((media) => {
      const matches = media.genre_ids.filter((id) => genreIds.includes(id));
      const matchScoreNormalized = matches.length / genreIds.length;
      const ratingNormalized = ratingNormalizers[type](media.score);
      const finalScore = matchScoreNormalized * 0.4 + ratingNormalized * 0.6;
      return { ...media, finalScore };
    });
    const sorted = scoredResults.sort((a, b) => b.finalScore - a.finalScore);
    return res.json(sorted);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'MoodMatch fehlgeschlagen' });
  }
});

export default router;
