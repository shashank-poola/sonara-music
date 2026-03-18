import { Audio, type AVPlaybackStatus } from "expo-av";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import { pickBestStreamUrl } from "@/types/saavn.type";
import type { SaavnSongSearchResult } from "@/types/saavn.type";
import { getSongById } from "@/api/songs";

// Singleton audio controller — import audioService anywhere to control playback.
class AudioService {
  private sound: Audio.Sound | null = null;
  private isLoadingSound = false;

  async init() {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn("[AudioService] init failed:", e);
    }
  }

  async loadAndPlay(song: SaavnSongSearchResult) {
    if (this.isLoadingSound) return;
    this.isLoadingSound = true;

    const { setIsLoading, setIsPlaying, setPosition, setDuration } =
      usePlayerStore.getState();

    setIsLoading(true);
    setPosition(0);
    setDuration(0);

    try {
      // Unload previous
      if (this.sound) {
        this.sound.setOnPlaybackStatusUpdate(null);
        await this.sound.unloadAsync();
        this.sound = null;
      }

      let songToPlay = song;
      if (!pickBestStreamUrl(song.downloadUrl)) {
        try {
          const res = await getSongById(song.id);
          const full = res.data?.[0];
          if (full) {
            songToPlay = {
              ...song,
              downloadUrl: full.downloadUrl,
              image: full.image ?? song.image,
            };
          }
        } catch (e) {
          console.warn("[AudioService] Failed to fetch song details:", e);
        }
      }

      const streamUrl = pickBestStreamUrl(songToPlay.downloadUrl);
      if (!streamUrl) {
        console.error("[AudioService] No stream URL for:", song.name);
        setIsLoading(false);
        setIsPlaying(false);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        this.onStatus
      );

      this.sound = sound;
      setIsPlaying(true);
    } catch (e) {
      console.error("[AudioService] loadAndPlay error:", e);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
      this.isLoadingSound = false;
    }
  }

  private onStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const { setPosition, setDuration, setIsLoading } =
      usePlayerStore.getState();

    setPosition(status.positionMillis);
    if (status.durationMillis) setDuration(status.durationMillis);
    setIsLoading(status.isBuffering && !status.isPlaying);

    if (status.didJustFinish) {
      this.handleSongEnd();
    }
  };

  private handleSongEnd() {
    const { repeatMode, getNextIndex, queue, setCurrentIndex } =
      useQueueStore.getState();

    if (repeatMode === "one") {
      this.sound?.replayAsync();
      return;
    }

    const nextIdx = getNextIndex();
    if (nextIdx !== null) {
      setCurrentIndex(nextIdx);
      usePlayerStore.getState().setCurrentSong(queue[nextIdx]);
    } else {
      usePlayerStore.getState().setIsPlaying(false);
    }
  }

  async togglePlay() {
    if (!this.sound) return;
    const { isPlaying, setIsPlaying } = usePlayerStore.getState();
    if (isPlaying) {
      await this.sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await this.sound.playAsync();
      setIsPlaying(true);
    }
  }

  async seekTo(positionMillis: number) {
    usePlayerStore.getState().setPosition(positionMillis);
    await this.sound?.setPositionAsync(positionMillis);
  }

  async playNext() {
    const { getNextIndex, queue, setCurrentIndex } = useQueueStore.getState();
    const nextIdx = getNextIndex();
    if (nextIdx !== null) {
      setCurrentIndex(nextIdx);
      usePlayerStore.getState().setCurrentSong(queue[nextIdx]);
    }
  }

  async playPrev() {
    const { position } = usePlayerStore.getState();
    // If > 3s in, restart current song
    if (position > 3000) {
      await this.seekTo(0);
      return;
    }
    const { getPrevIndex, queue, setCurrentIndex } = useQueueStore.getState();
    const prevIdx = getPrevIndex();
    if (prevIdx !== null) {
      setCurrentIndex(prevIdx);
      usePlayerStore.getState().setCurrentSong(queue[prevIdx]);
    }
  }

  async cleanup() {
    if (this.sound) {
      this.sound.setOnPlaybackStatusUpdate(null);
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const audioService = new AudioService();
