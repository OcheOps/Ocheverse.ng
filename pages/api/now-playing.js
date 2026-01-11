import { getNowPlaying } from '../../lib/spotify';

export default async function handler(req, res) {
    // If keys are missing, mock response for demo purposes (so user sees UI)
    if (!process.env.SPOTIFY_REFRESH_TOKEN) {
        return res.status(200).json({
            isPlaying: true, // Fake playing for demo
            title: "Demo Mode (Add Keys)",
            artist: "Ocheverse Band",
            album: "Greatest Hits",
            albumImageUrl: "", // Empty or a placeholder if you have one
            songUrl: "https://spotify.com"
        });
    }

    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
        return res.status(200).json({ isPlaying: false });
    }

    const song = await response.json();

    if (song.item === null) {
        return res.status(200).json({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=30'
    );

    return res.status(200).json({
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
    });
}
