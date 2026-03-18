import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SaavnSongSearchResult } from "@/types/saavn.type";

export type RepeatMode = "off" | "one" | "all";

interface QueueState {
  queue: SaavnSongSearchResult[];
  currentIndex: number;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  /** Original order before shuffle, used to restore */
  originalQueue: SaavnSongSearchResult[];

  // Queue operations
  setQueue: (songs: SaavnSongSearchResult[], startIndex?: number) => void;
  addToQueue: (song: SaavnSongSearchResult) => void;
  addNext: (song: SaavnSongSearchResult) => void;
  removeFromQueue: (index: number) => void;
  moveInQueue: (from: number, to: number) => void;
  clearQueue: () => void;
  setCurrentIndex: (index: number) => void;

  // Playback modes
  toggleShuffle: () => void;
  cycleRepeat: () => void;

  // Navigation helpers (return next/prev index or null)
  getNextIndex: () => number | null;
  getPrevIndex: () => number | null;
}

function buildShuffledQueue(
  songs: SaavnSongSearchResult[],
  currentIndex: number
): SaavnSongSearchResult[] {
  const current = songs[currentIndex];
  const rest = songs.filter((_, i) => i !== currentIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [current, ...rest];
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: 0,
      shuffleMode: false,
      repeatMode: "off",
      originalQueue: [],

      setQueue: (songs, startIndex = 0) => {
        const { shuffleMode } = get();
        if (shuffleMode) {
          const shuffled = buildShuffledQueue(songs, startIndex);
          set({ queue: shuffled, originalQueue: songs, currentIndex: 0 });
        } else {
          set({ queue: songs, originalQueue: songs, currentIndex: startIndex });
        }
      },

      addToQueue: (song) => {
        set((s) => ({ queue: [...s.queue, song] }));
      },

      addNext: (song) => {
        set((s) => {
          const next = s.currentIndex + 1;
          const newQueue = [...s.queue];
          newQueue.splice(next, 0, song);
          return { queue: newQueue };
        });
      },

      removeFromQueue: (index) => {
        set((s) => {
          const newQueue = s.queue.filter((_, i) => i !== index);
          const newIndex =
            index < s.currentIndex
              ? s.currentIndex - 1
              : Math.min(s.currentIndex, newQueue.length - 1);
          return { queue: newQueue, currentIndex: Math.max(0, newIndex) };
        });
      },

      moveInQueue: (from, to) => {
        set((s) => {
          const newQueue = [...s.queue];
          const [item] = newQueue.splice(from, 1);
          newQueue.splice(to, 0, item);
          let newIndex = s.currentIndex;
          if (s.currentIndex === from) newIndex = to;
          else if (from < s.currentIndex && to >= s.currentIndex)
            newIndex = s.currentIndex - 1;
          else if (from > s.currentIndex && to <= s.currentIndex)
            newIndex = s.currentIndex + 1;
          return { queue: newQueue, currentIndex: newIndex };
        });
      },

      clearQueue: () =>
        set({ queue: [], originalQueue: [], currentIndex: 0 }),

      setCurrentIndex: (index) => set({ currentIndex: index }),

      toggleShuffle: () => {
        const { shuffleMode, queue, currentIndex, originalQueue } = get();
        if (!shuffleMode) {
          // Enable shuffle: build shuffled queue starting from current
          const shuffled = buildShuffledQueue(queue, currentIndex);
          set({
            shuffleMode: true,
            originalQueue: queue,
            queue: shuffled,
            currentIndex: 0,
          });
        } else {
          // Disable shuffle: restore original order, keep current song
          const current = queue[currentIndex];
          const origIdx = originalQueue.findIndex((s) => s.id === current?.id);
          set({
            shuffleMode: false,
            queue: originalQueue,
            originalQueue: [],
            currentIndex: Math.max(0, origIdx),
          });
        }
      },

      cycleRepeat: () => {
        const modes: RepeatMode[] = ["off", "all", "one"];
        const { repeatMode } = get();
        const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        set({ repeatMode: next });
      },

      getNextIndex: () => {
        const { queue, currentIndex, repeatMode, shuffleMode } = get();
        if (queue.length === 0) return null;
        if (repeatMode === "one") return currentIndex;
        if (shuffleMode && queue.length > 1) {
          let next: number;
          do {
            next = Math.floor(Math.random() * queue.length);
          } while (next === currentIndex);
          return next;
        }
        const next = currentIndex + 1;
        if (next >= queue.length) {
          return repeatMode === "all" ? 0 : null;
        }
        return next;
      },

      getPrevIndex: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return null;
        const prev = currentIndex - 1;
        return prev < 0 ? 0 : prev;
      },
    }),
    {
      name: "lokal-queue",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the queue and modes, not transient UI state
      partialize: (s) => ({
        queue: s.queue,
        currentIndex: s.currentIndex,
        shuffleMode: s.shuffleMode,
        repeatMode: s.repeatMode,
        originalQueue: s.originalQueue,
      }),
    }
  )
);
