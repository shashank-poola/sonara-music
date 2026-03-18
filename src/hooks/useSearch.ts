import {
  searchAll,
  searchAlbums,
  searchArtists,
  searchPlaylists,
  searchSongs,
} from "@/api/saavn";
import { useCallback, useEffect, useState } from "react";
import type {
  SaavnAlbumResult,
  SaavnArtistResult,
  SaavnPlaylistResult,
  SaavnSongSearchResult,
} from "@/types/saavn.type";

export type SearchTab = "all" | "songs" | "albums" | "artists" | "playlists";

export function useSearch(debouncedQuery: string, activeTab: SearchTab) {
  const [songs, setSongs] = useState<SaavnSongSearchResult[]>([]);
  const [albums, setAlbums] = useState<SaavnAlbumResult[]>([]);
  const [artists, setArtists] = useState<SaavnArtistResult[]>([]);
  const [playlists, setPlaylists] = useState<SaavnPlaylistResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async () => {
    const q = debouncedQuery;
    if (!q) {
      setSongs([]);
      setAlbums([]);
      setArtists([]);
      setPlaylists([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (activeTab === "all") {
        const res = await searchAll(q, { page: 1, limit: 15 });
        setSongs(res.data?.songs?.results ?? []);
        setAlbums(res.data?.albums?.results ?? []);
        setArtists(res.data?.artists?.results ?? []);
        setPlaylists(res.data?.playlists?.results ?? []);
        return;
      }

      if (activeTab === "songs") {
        const res = await searchSongs(q, { page: 1, limit: 30 });
        setSongs(res.data?.results ?? []);
        setAlbums([]);
        setArtists([]);
        setPlaylists([]);
        return;
      }
      if (activeTab === "albums") {
        const res = await searchAlbums(q, { page: 1, limit: 30 });
        setAlbums(res.data?.results ?? []);
        setSongs([]);
        setArtists([]);
        setPlaylists([]);
        return;
      }
      if (activeTab === "artists") {
        const res = await searchArtists(q, { page: 1, limit: 30 });
        setArtists(res.data?.results ?? []);
        setSongs([]);
        setAlbums([]);
        setPlaylists([]);
        return;
      }

      const res = await searchPlaylists(q, { page: 1, limit: 30 });
      setPlaylists(res.data?.results ?? []);
      setSongs([]);
      setAlbums([]);
      setArtists([]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedQuery]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  return { songs, albums, artists, playlists, loading, error };
}
