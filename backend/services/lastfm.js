import apiFetch from './api.js';

export async function searchAlbum(query) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&limit=10&format=json`,
  );
  const data = response.results.albummatches.album;
  const result = data.map((album) => ({
    name: album.name,
    artist: album.artist,
    image: (album.image ?? []).find((i) => i.size === 'medium')?.['#text'],
  }));
  return result;
}

export async function searchTrack(query) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&limit=10&format=json`,
  );
  const data = response.results.trackmatches.track;
  const result = data.map((track) => ({
    name: track.name,
    artist: track.artist,
    image: (track.image ?? []).find((i) => i.size === 'medium')?.['#text'],
  }));
  return result;
}

export async function getAlbumDetails(artist, album) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
  );
  const data = response.album;
  return {
    name: data.name,
    artist_name: data.artist.name,
    artist_url: data.artist.url,
    image: data.image?.find((i) => i.size === 'extralarge')?.['#text'],
    genres: (data.tags?.tag ?? []).map((t) => t.name),
    tracks: (data.tracks?.track ?? []).map((t) => ({
      name: t.name,
      duration: t.duration,
    })),
    published_at: data.wiki?.published,
    description: data.wiki?.summary,
  };
}

export async function getTrackDetails(artist, track) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
  );
  const data = response.track;
  return {
    name: data.name,
    artist_name: data.artist.name,
    artist_url: data.artist.url,
    album: data.album?.title,
    album_url: data.album?.url,
    image: data.album?.image?.find((i) => i.size === 'extralarge')?.['#text'],
    genres: (data.toptags?.tag ?? []).map((t) => t.name),
    duration: data.duration,
    published_at: data.wiki?.published,
    description: data.wiki?.summary,
  };
}

export async function discoverTracksByTags(tags) {
  const promises = tags.map((tag) =>
    apiFetch(
      `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=10`,
    ),
  );
  const pages = await Promise.all(promises);
  const allResults = pages.flatMap((page) => page.tracks.track);

  const trackCounts = {};
  const trackData = {};

  allResults.forEach((track) => {
    const key = `${track.artist.name}-${track.name}`;
    trackCounts[key] = (trackCounts[key] || 0) + 1;
    trackData[key] = track;
  });

  return Object.keys(trackCounts).map((key) => ({
    id: key,
    title: trackData[key].name,
    artist: trackData[key].artist.name,
    image: trackData[key].image?.find((i) => i.size === 'extralarge')?.[
      '#text'
    ],
    score: 100 - Number(trackData[key]['@attr']?.rank || 100),
    matchCount: trackCounts[key],
  }));
}

export async function discoverAlbumByTags(tags) {
  const promises = tags.map((tag) =>
    apiFetch(
      `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${tag}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=10`,
    ),
  );
  const pages = await Promise.all(promises);
  const allResults = pages.flatMap((page) => page.albums.album);

  const albumCounts = {};
  const albumData = {};

  allResults.forEach((album) => {
    const key = `${album.artist.name}-${album.name}`;
    albumCounts[key] = (albumCounts[key] || 0) + 1;
    albumData[key] = album;
  });

  return Object.keys(albumCounts).map((key) => ({
    id: key,
    title: albumData[key].name,
    image: albumData[key].image?.find((i) => i.size === 'extralarge')?.[
      '#text'
    ],
    score: 100 - Number(albumData[key]['@attr']?.rank || 100),
    matchCount: albumCounts[key],
  }));
}
