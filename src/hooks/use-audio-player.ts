import { useEffect, useRef } from "react";
import { audioService } from "@/services/audio-service";
import { usePlayerStore } from "@/store/player-store";

export function useAudioPlayer() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const prevSongIdRef = useRef<string | null>(null);

  // Initialise audio mode for background playback
  useEffect(() => {
    audioService.init();
    return () => {
      audioService.cleanup();
    };
  }, []);

  // Load new song whenever currentSong.id changes
  useEffect(() => {
    if (!currentSong) return;
    if (currentSong.id === prevSongIdRef.current) return;
    prevSongIdRef.current = currentSong.id;
    audioService.loadAndPlay(currentSong);
  }, [currentSong?.id, currentSong]);
}
