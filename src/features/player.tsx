import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PlayerAlbumArt } from "@/components/playerAlbumArt";
import { PlayerControls } from "@/components/playerControls";
import { PlayerEmptyState } from "@/components/playerEmptyState";
import { PlayerExtraRow } from "@/components/playerExtraRow";
import { PlayerHeader } from "@/components/player/playerHeader";
import { PlayerQueueList } from "@/components/playerQueueList";
import { PlayerSongInfo } from "@/components/playerSongInfo";
import { PlayerTabSwitcher } from "@/components/playerTabSwitcher";
import { SeekBar } from "@/components/seekBar";
import { Colors } from "@/constants/theme";
import { audioService } from "@/services/audio-service";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import { formatDuration, pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";
import { Tab } from "@/types/player.type";


export default function PlayerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("player");

  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);

  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const shuffleMode = useQueueStore((s) => s.shuffleMode);
  const repeatMode = useQueueStore((s) => s.repeatMode);
  const toggleShuffle = useQueueStore((s) => s.toggleShuffle);
  const cycleRepeat = useQueueStore((s) => s.cycleRepeat);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setCurrentIndex = useQueueStore((s) => s.setCurrentIndex);

  if (!currentSong) {
    return (
      <PlayerEmptyState onBack={() => router.back()} />
    );
  }

  const albumArt = pickBestImageUrl(currentSong.image, "500x500");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <PlayerHeader
        albumName={currentSong.album?.name}
        onBack={() => router.back()}
      />

      <PlayerTabSwitcher
        activeTab={activeTab}
        queueCount={queue.length}
        onTabChange={setActiveTab}
      />

      {activeTab === "player" ? (
        <ScrollView
          contentContainerStyle={styles.playerContent}
          showsVerticalScrollIndicator={false}
        >
          <PlayerAlbumArt imageUri={albumArt} />
          <PlayerSongInfo
            title={currentSong.name}
            artist={getDisplayArtist(currentSong)}
          />
          <View style={styles.seekSection}>
            <SeekBar
              position={position}
              duration={duration}
              onSeek={(ms) => audioService.seekTo(ms)}
              trackHeight={4}
              thumbSize={16}
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatDuration(position / 1000)}</Text>
              <Text style={styles.timeText}>{formatDuration(duration / 1000)}</Text>
            </View>
          </View>
          <PlayerControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            shuffleMode={shuffleMode}
            repeatMode={repeatMode}
            onTogglePlay={() => audioService.togglePlay()}
            onPrev={() => audioService.playPrev()}
            onNext={() => audioService.playNext()}
            onShuffle={toggleShuffle}
            onRepeat={cycleRepeat}
          />
          <PlayerExtraRow onShowQueue={() => setActiveTab("queue")} />
        </ScrollView>
      ) : (
        <PlayerQueueList
          queue={queue}
          currentIndex={currentIndex}
          onSelectSong={(index, song) => {
            setCurrentIndex(index);
            setCurrentSong(song);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.app },
  playerContent: { paddingHorizontal: 24, paddingBottom: 32 },
  seekSection: { marginBottom: 8 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: { fontSize: 12, color: Colors.text.muted },
});
