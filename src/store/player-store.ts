import { create } from "zustand";
import type { SaavnSongSearchResult } from "@/types/saavn";

interface PlayerState {
  currentSong: SaavnSongSearchResult | null;
  isPlaying: boolean;
  isLoading: boolean;
  /** Current playback position in milliseconds */
  position: number;
  /** Total duration in milliseconds */
  duration: number;
  isPlayerVisible: boolean;

  // Actions
  setCurrentSong: (song: SaavnSongSearchResult | null) => void;
  setIsPlaying: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  setPosition: (v: number) => void;
  setDuration: (v: number) => void;
  setPlayerVisible: (v: boolean) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  isPlayerVisible: false,

  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setIsLoading: (v) => set({ isLoading: v }),
  setPosition: (v) => set({ position: v }),
  setDuration: (v) => set({ duration: v }),
  setPlayerVisible: (v) => set({ isPlayerVisible: v }),
  reset: () =>
    set({
      currentSong: null,
      isPlaying: false,
      isLoading: false,
      position: 0,
      duration: 0,
    }),
}));
