export const jikanGenreIds = {
  Action: 1,
  Adventure: 2,
  'Avant Garde': 5,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  'Boys Love': 28,
  'Girls Love': 26,
  Gourmet: 47,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  'Sci-Fi': 24,
  'Slice of Life': 36,
  Sports: 30,
  Supernatural: 37,
  Historical: 13,
  Isekai: 62,
  Mecha: 18,
  Military: 38,
  Music: 19,
  Mythology: 6,
  Psychological: 40,
  School: 23,
  Survival: 76,
  'Time Travel': 78,
  Vampire: 32,
  Workplace: 48,
  Josei: 43,
  Kids: 15,
  Seinen: 42,
  Shoujo: 25,
  Shounen: 27,
};

export function namesToJikanIds(genreNames) {
  return genreNames
    .map((name) => jikanGenreIds[name])
    .filter((id) => id !== undefined);
}
