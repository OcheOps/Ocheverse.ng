const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
  });
  return response.json();
}

export default async function handler(req, res) {
  if (!client_id || !client_secret || !refresh_token) {
    return res.status(200).json({ tracks: [] });
  }

  try {
    const { access_token } = await getAccessToken();
    const timeRange = req.query.range || 'short_term'; // short_term=4weeks, medium_term=6months, long_term=years

    const response = await fetch(
      `${TOP_TRACKS_ENDPOINT}?limit=10&time_range=${timeRange}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!response.ok) {
      return res.status(200).json({ tracks: [] });
    }

    const data = await response.json();

    const tracks = data.items.map((track, i) => ({
      rank: i + 1,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images?.[1]?.url || track.album.images?.[0]?.url,
      songUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      duration: track.duration_ms,
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    return res.status(200).json({ tracks });
  } catch {
    return res.status(200).json({ tracks: [] });
  }
}
