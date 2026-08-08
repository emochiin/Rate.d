export const rawgGenreSlugs = {
  Action: 'action',
  Indie: 'indie',
  Adventure: 'adventure',
  RPG: 'role-playing-games-rpg',
  Strategy: 'strategy',
  Shooter: 'shooter',
  Casual: 'casual',
  Simulation: 'simulation',
  Puzzle: 'puzzle',
  Arcade: 'arcade',
  Platformer: 'platformer',
  Racing: 'racing',
  Sports: 'sports',
  Fighting: 'fighting',
  Family: 'family',
  Educational: 'educational',
  Card: 'card',
};

export function namesToRawgSlugs(genreNames) {
  return genreNames
    .map((name) => rawgGenreSlugs[name])
    .filter((slug) => slug !== undefined);
}
