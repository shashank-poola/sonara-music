import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getSongById } from "@/api/songs";
import { pickBestStreamUrl } from "@/types/saavn.type";
import type { SaavnSongSearchResult } from "@/types/saavn.type";

const DOWNLOADS_KEY = "sonara-downloads";
const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

export type DownloadedSong = SaavnSongSearchResult & { localPath: string };

interface DownloadsState {
  downloads: DownloadedSong[];
  isDownloading: string | null;

  addDownload: (song: SaavnSongSearchResult) => Promise<boolean>;
  removeDownload: (songId: string) => Promise<void>;
  getDownloadPath: (songId: string) => string | null;
  isDownloaded: (songId: string) => boolean;
}

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
  }
}

export const useDownloadsStore = create<DownloadsState>()(
  persist(
    (set, get) => ({
      downloads: [],
      isDownloading: null,

      addDownload: async (song) => {
        const { downloads, isDownloading } = get();
        if (isDownloading || downloads.some((d) => d.id === song.id)) return false;

        let songToUse = song;
        if (!pickBestStreamUrl(song.downloadUrl)) {
          try {
            const res = await getSongById(song.id);
            const full = res.data?.[0];
            if (full) {
              songToUse = {
                ...song,
                downloadUrl: full.downloadUrl,
                image: full.image ?? song.image,
              };
            }
          } catch {
            return false;
          }
        }

        const url = pickBestStreamUrl(songToUse.downloadUrl);
        if (!url) return false;

        set({ isDownloading: song.id });
        try {
          await ensureDir();
          const ext = url.includes(".mp4") ? "mp4" : "m4a";
          const localPath = `${DOWNLOADS_DIR}${song.id}.${ext}`;

          await FileSystem.downloadAsync(url, localPath);
          const next: DownloadedSong = { ...songToUse, localPath };
          set((s) => ({
            downloads: [...s.downloads.filter((d) => d.id !== song.id), next],
            isDownloading: null,
          }));
          return true;
        } catch {
          set({ isDownloading: null });
          return false;
        }
      },

      removeDownload: async (songId) => {
        const { downloads } = get();
        const item = downloads.find((d) => d.id === songId);
        if (item) {
          try {
            await FileSystem.deleteAsync(item.localPath, { idempotent: true });
          } catch {
            // ignore
          }
          set((s) => ({
            downloads: s.downloads.filter((d) => d.id !== songId),
          }));
        }
      },

      getDownloadPath: (songId) => {
        const d = get().downloads.find((x) => x.id === songId);
        return d?.localPath ?? null;
      },

      isDownloaded: (songId) =>
        get().downloads.some((d) => d.id === songId),
    }),
    {
      name: DOWNLOADS_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    }
  )
);
