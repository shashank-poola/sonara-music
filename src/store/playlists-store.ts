import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SaavnSongSearchResult } from "@/types/saavn.type";

const STORAGE_KEY = "lokal-user-playlists";

export type UserPlaylist = {
  id: string;
  name: string;
  songs: SaavnSongSearchResult[];
  createdAt: number;
};

interface PlaylistsState {
  playlists: UserPlaylist[];
  createPlaylist: (name: string) => UserPlaylist;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: SaavnSongSearchResult) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylistById: (id: string) => UserPlaylist | undefined;
  renamePlaylist: (id: string, name: string) => void;
}

function generateId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const usePlaylistsStore = create<PlaylistsState>()(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: (name) => {
        const playlist: UserPlaylist = {
          id: generateId(),
          name: name.trim() || "Untitled",
          songs: [],
          createdAt: Date.now(),
        };
        set((s) => ({ playlists: [...s.playlists, playlist] }));
        return playlist;
      },

      deletePlaylist: (id) => {
        set((s) => ({
          playlists: s.playlists.filter((p) => p.id !== id),
        }));
      },

      addSongToPlaylist: (playlistId, song) => {
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  songs: p.songs.some((x) => x.id === song.id)
                    ? p.songs
                    : [...p.songs, song],
                }
              : p
          ),
        }));
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, songs: p.songs.filter((x) => x.id !== songId) }
              : p
          ),
        }));
      },

      getPlaylistById: (id) => {
        return get().playlists.find((p) => p.id === id);
      },

      renamePlaylist: (id, name) => {
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
