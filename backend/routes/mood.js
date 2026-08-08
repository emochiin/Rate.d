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
import {
  discoverTracksByTags,
  discoverAlbumByTags,
} from '../services/lastfm.js';
import { discoverBooksBySubjects } from '../services/openlibrary.js';

const discoverFunctions = {
  movie: discoverMoviesByGenre,
  series: discoverSeriesByGenre,
  game: discoverGameByGenre,
  anime: discoverAnimeByGenre,
  manga: discoverMangaByGenre,
  track: discoverTracksByTags,
  album: discoverAlbumByTags,
  book: discoverBooksBySubjects,
};

const genreConverters = {
  movie: (names) => namesToTmdbIds(names, tmdbMovieGenreIds),
  series: (names) => namesToTmdbIds(names, tmdbSeriesGenreIds),
  game: (names) => namesToRawgSlugs(names),
  anime: (names) => namesToJikanIds(names),
  manga: (names) => namesToJikanIds(names),
  album: (names) => names,
  track: (names) => names,
  book: (names) => names,
};

const ratingNormalizers = {
  movie: (score) => score / 10,
  series: (score) => score / 10,
  game: (score) => score / 5,
  anime: (score) => score / 10,
  manga: (score) => score / 10,
  album: (score, maxScore) => score / maxScore,
  track: (score, maxScore) => score / maxScore,
  book: (score, maxScore) => score / maxScore,
};

const matchScoreCalculators = {
  movie: (media, genreIds) =>
    media.genre_ids.filter((id) => genreIds.includes(id)).length /
    genreIds.length,
  series: (media, genreIds) =>
    media.genre_ids.filter((id) => genreIds.includes(id)).length /
    genreIds.length,
  game: (media, genreIds) =>
    media.genre_ids.filter((id) => genreIds.includes(id)).length /
    genreIds.length,
  anime: (media, genreIds) =>
    media.genre_ids.filter((id) => genreIds.includes(id)).length /
    genreIds.length,
  manga: (media, genreIds) =>
    media.genre_ids.filter((id) => genreIds.includes(id)).length /
    genreIds.length,
  album: (media, genreIds) => media.matchCount / genreIds.length,
  track: (media, genreIds) => media.matchCount / genreIds.length,
  book: (media, genreIds) => media.matchCount / genreIds.length,
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
    const maxScore = Math.max(...results.map((r) => r.score));
    const scoredResults = results.map((media) => {
      const matchScoreNormalized = matchScoreCalculators[type](media, genreIds);
      const ratingNormalized = ratingNormalizers[type](media.score, maxScore);
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
