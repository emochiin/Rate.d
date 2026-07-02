import apiFetch from './api.js';

export async function searchAlbum(query) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${process.env.LASTFM_API_KEY}&limit=10&format=json`,
  );
  const data = response.results.albummatches.album;
  const result = data.map((album) => ({
    name: album.name,
    artist: album.artist,
    image: album.image.find((i) => i.size === 'medium')['#text'],
  }));
  return result;
}

export async function searchTrack(query) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${process.env.LASTFM_API_KEY}&limit=10&format=json`,
  );
  const data = response.results.trackmatches.track;
  const result = data.map((track) => ({
    name: track.name,
    artist: track.artist,
    image: track.image.find((i) => i.size === 'medium')['#text'],
  }));
  return result;
}

export async function getAlbumDetails(artist, album) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${artist}&album=${album}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
  );
  const data = response.album;
  return {
    name: data.name,
    artist_name: data.artist.name,
    artist_url: data.artist.url,
    image: data.image?.find((i) => i.size === 'extralarge')?.['#text'],
    genres: data.tags.tag.map((t) => t.name),
    tracks: data.tracks.track.map((t) => ({
      name: t.name,
      duration: t.duration,
    })),
    published_at: data.wiki?.published,
    description: data.wiki?.summary,
  };
}

export async function getTrackDetails(artist, track) {
  const response = await apiFetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&artist=${artist}&track=${track}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
  );
  const data = response.track;
  return {
    name: data.name,
    artist_name: data.artist.name,
    artist_url: data.artist.url,
    album: data.album?.title,
    album_url: data.album?.url,
    image: data.album?.image?.find((i) => i.size === 'extralarge')?.['#text'],
    genres: data.toptags.tag.map((t) => t.name),
    duration: data.duration,
    published_at: data.wiki?.published,
    description: data.wiki?.summary,
  };
}
