export type SaavnImage = {
  quality: string;
  link?: string;
  url?: string;
};

export type SaavnDownloadUrl = {
  quality: string;
  link?: string;
  url?: string;
};

// Songs

export type SaavnSongSearchResult = {
  id: string;
  name: string;
  duration?: string;
  year?: string;
  language?: string;
  primaryArtists?: string;
  url?: string;
  image?: SaavnImage[];
  downloadUrl?: SaavnDownloadUrl[];
  album?: {
    id: string;
    name: string;
    url?: string;
  };
  artistMap?: {
    artists?: { id: string; name: string; role?: string }[];
  };
};

export type SaavnSearchSongsResponse = {
  status: string;
  data: {
    results: SaavnSongSearchResult[];
    total: number;
    start: number;
  };
};

export type SaavnSongDetails = {
  id: string;
  name: string;
  duration: number;
  language?: string;
  album?: { id: string; name: string };
  artists?: {
    primary?: { id: string; name: string }[];
  };
  image?: SaavnImage[];
  downloadUrl?: SaavnDownloadUrl[];
};

export type SaavnSongDetailsResponse = {
  success: boolean;
  data: SaavnSongDetails[];
};

// Albums

export type SaavnAlbumResult = {
  id: string;
  name: string;
  type?: string;
  year?: string;
  language?: string;
  url?: string;
  image?: SaavnImage[];
  artist?: string;
  primaryArtists?: string;
  artistMap?: {
    artists?: { id: string; name: string; role?: string }[];
  };
};

export type SaavnSearchAlbumsResponse = {
  status: string;
  data: {
    results: SaavnAlbumResult[];
    total: number;
    start: number;
  };
};

export type SaavnAlbumDetails = {
  id: string;
  name: string;
  year?: string;
  language?: string;
  image?: SaavnImage[];
  primaryArtists?: string;
  artists?: { primary?: { id: string; name: string }[] };
  songs?: SaavnSongDetails[];
};

export type SaavnAlbumDetailsResponse = {
  status: string;
  data: SaavnAlbumDetails;
};

// Artists

export type SaavnArtistResult = {
  id: string;
  name: string;
  type?: string;
  image?: SaavnImage[];
  url?: string;
  role?: string;
};

export type SaavnSearchArtistsResponse = {
  status: string;
  data: {
    results: SaavnArtistResult[];
    total: number;
    start: number;
  };
};

export type SaavnArtistDetails = {
  id: string;
  name: string;
  image?: SaavnImage[];
  followerCount?: number;
  fanCount?: string;
  isVerified?: boolean;
  dominantLanguage?: string;
  dominantType?: string;
  bio?: string;
  topSongs?: SaavnSongDetails[];
  topAlbums?: SaavnAlbumDetails[];
};

export type SaavnArtistDetailsResponse = {
  status: string;
  data: SaavnArtistDetails;
};

export type SaavnArtistSongsResponse = {
  status: string;
  data: {
    total: number;
    songs: SaavnSongDetails[];
  };
};

// Playlists

export type SaavnPlaylistResult = {
  id: string;
  name: string;
  type?: string;
  image?: SaavnImage[];
  url?: string;
  songCount?: number;
  language?: string;
};

export type SaavnSearchPlaylistsResponse = {
  status: string;
  data: {
    results: SaavnPlaylistResult[];
    total: number;
    start: number;
  };
};


export type SaavnPlaylistDetails = {
  id: string;
  name: string;
  songCount?: number;
  language?: string;
  image?: SaavnImage[];
  songs?: SaavnSongDetails[];
};

export type SaavnPlaylistDetailsResponse = {
  status: string;
  data: SaavnPlaylistDetails;
};

// ─── General search ───────────────────────────────────────────────────────────

export type SaavnSearchAllResponse = {
  status: string;
  data: {
    songs?: { results: SaavnSongSearchResult[]; position: number };
    albums?: { results: SaavnAlbumResult[]; position: number };
    artists?: { results: SaavnArtistResult[]; position: number };
    playlists?: { results: SaavnPlaylistResult[]; position: number };
  };
};


export function pickBestImageUrl(images?: SaavnImage[], preferredQuality = "500x500") {
  if (!images || images.length === 0) return undefined;
  const exact = images.find((i) => i.quality === preferredQuality);
  const best = exact ?? images[images.length - 1];
  return best?.url ?? best?.link;
}

export function pickBestStreamUrl(urls?: SaavnDownloadUrl[], preferredQuality = "320kbps") {
  if (!urls || urls.length === 0) return undefined;
  const exact = urls.find((u) => u.quality === preferredQuality);
  const best = exact ?? urls[urls.length - 1];
  return best?.url ?? best?.link;
}

export function formatDuration(seconds?: string | number): string {
  const s = typeof seconds === "string" ? parseInt(seconds, 10) : (seconds ?? 0);
  const totalSec = Math.floor(Number(s));
  const m = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
