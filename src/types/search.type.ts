import type { SaavnAlbumResult, SaavnArtistResult, SaavnPlaylistResult, SaavnSongSearchResult } from "@/types/saavn.type";

export type SearchEmptyStateProps = {
    title: string;
    body: string;
};

export type SearchResultItem =
  | { type: "song"; data: SaavnSongSearchResult }
  | { type: "album"; data: SaavnAlbumResult }
  | { type: "artist"; data: SaavnArtistResult }
  | { type: "playlist"; data: SaavnPlaylistResult };

export const SEARCH_TABS = [
  { key: "all" as const, label: "All" },
  { key: "songs" as const, label: "Songs" },
  { key: "albums" as const, label: "Album" },
  { key: "artists" as const, label: "Artists" },
  { key: "playlists" as const, label: "Playlists" },
];

export const BROWSE_ITEMS = [
    { label: "Songs", icon: "musical-notes" as const },
    { label: "Albums", icon: "disc" as const },
    { label: "Artists", icon: "mic" as const },
    { label: "Playlists", icon: "folder-open" as const },
];

export type SearchInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export type SongRowProps = {
    song: SaavnSongSearchResult;
    onPress: () => void;
};