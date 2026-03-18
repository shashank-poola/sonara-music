import type { SaavnAlbumResult, SaavnSongSearchResult } from "@/types/saavn.type";

/**
 * Extracts display artist from a song, trying multiple API fields.
 * Some endpoints return primaryArtists, others artistMap.
 */
export function getDisplayArtist(song: SaavnSongSearchResult): string {
  const primary = song.primaryArtists?.trim();
  if (primary) return primary;

  const map = song.artistMap?.artists;
  if (map && map.length > 0) {
    return map.map((a) => a.name).join(", ");
  }

  if (song.album?.name) {
    return `From ${song.album.name}`;
  }

  return "Unknown artist";
}

/**
 * Extracts display artist for albums/playlists.
 */
export function getDisplayArtistForAlbum(album: SaavnAlbumResult): string {
  const primary = album.primaryArtists?.trim();
  if (primary) return primary;

  const artist = album.artist?.trim();
  if (artist) return artist;

  const map = album.artistMap?.artists;
  if (map && map.length > 0) {
    return map.map((a) => a.name).join(", ");
  }

  return "Album";
}
