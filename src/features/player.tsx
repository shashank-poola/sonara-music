import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SeekBar } from "@/components/seek-bar";
import { Colors } from "@/constants/theme";
import { audioService } from "@/services/audio-service";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import {
  formatDuration,
  pickBestImageUrl,
  type SaavnSongSearchResult,
} from "@/types/saavn";

type Tab = "player" | "queue";

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
  const removeFromQueue = useQueueStore((s) => s.removeFromQueue);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setCurrentIndex = useQueueStore((s) => s.setCurrentIndex);

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={28} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.emptyPlayer}>
          <Ionicons
            name="musical-notes-outline"
            size={64}
            color={Colors.border.primary}
          />
          <Text style={styles.emptyText}>Nothing is playing</Text>
        </View>
      </SafeAreaView>
    );
  }

  const albumArt = pickBestImageUrl(currentSong.image, "500x500");

  const repeatIcon =
    repeatMode === "one"
      ? "repeat-outline"
      : repeatMode === "all"
        ? "repeat"
        : "repeat";

  const repeatColor =
    repeatMode === "off" ? Colors.text.muted : Colors.button.primary;

  const renderQueueItem = ({
    item,
    index,
  }: {
    item: SaavnSongSearchResult;
    index: number;
  }) => {
    const isActive = index === currentIndex;
    return (
      <Pressable
        style={[styles.queueRow, isActive && styles.queueRowActive]}
        onPress={() => {
          setCurrentIndex(index);
          setCurrentSong(item);
        }}
      >
        <Image
          source={{ uri: pickBestImageUrl(item.image, "150x150") }}
          style={styles.queueArt}
          contentFit="cover"
        />
        <View style={styles.queueMeta}>
          <Text
            style={[styles.queueTitle, isActive && styles.queueTitleActive]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.queueArtist} numberOfLines={1}>
            {item.primaryArtists || "Unknown"}
          </Text>
        </View>
        {isActive ? (
          <Ionicons
            name={isPlaying ? "volume-high" : "pause"}
            size={18}
            color={Colors.button.primary}
          />
        ) : (
          <Pressable
            onPress={() => removeFromQueue(index)}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color={Colors.text.muted} />
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-down" size={28} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Now Playing</Text>
          <Text style={styles.headerAlbum} numberOfLines={1}>
            {currentSong.album?.name ?? ""}
          </Text>
        </View>
        <Pressable hitSlop={8}>
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color={Colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setActiveTab("player")}
          style={[styles.tabBtn, activeTab === "player" && styles.tabBtnActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "player" && styles.tabTextActive,
            ]}
          >
            Player
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("queue")}
          style={[styles.tabBtn, activeTab === "queue" && styles.tabBtnActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "queue" && styles.tabTextActive,
            ]}
          >
            Queue ({queue.length})
          </Text>
        </Pressable>
      </View>

      {activeTab === "player" ? (
        <ScrollView
          contentContainerStyle={styles.playerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Album Art */}
          <View style={styles.artWrapper}>
            <Image
              source={{ uri: albumArt }}
              style={styles.albumArt}
              contentFit="cover"
            />
          </View>

          {/* Song Info */}
          <View style={styles.songInfo}>
            <View style={styles.songInfoLeft}>
              <Text style={styles.songTitle} numberOfLines={2}>
                {currentSong.name}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {currentSong.primaryArtists || "Unknown artist"}
              </Text>
            </View>
            <Pressable hitSlop={8}>
              <Ionicons
                name="heart-outline"
                size={26}
                color={Colors.text.muted}
              />
            </Pressable>
          </View>

          {/* Seek Bar */}
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

          {/* Controls */}
          <View style={styles.controls}>
            {/* Shuffle */}
            <Pressable onPress={toggleShuffle} hitSlop={8}>
              <Ionicons
                name="shuffle"
                size={24}
                color={shuffleMode ? Colors.button.primary : Colors.text.muted}
              />
            </Pressable>

            {/* Prev */}
            <Pressable onPress={() => audioService.playPrev()} hitSlop={8}>
              <Ionicons
                name="play-skip-back"
                size={32}
                color={Colors.text.primary}
              />
            </Pressable>

            {/* Play/Pause */}
            <Pressable
              onPress={() => audioService.togglePlay()}
              style={styles.playBtn}
            >
              <Ionicons
                name={isLoading ? "hourglass" : isPlaying ? "pause" : "play"}
                size={32}
                color={Colors.button.text}
              />
            </Pressable>

            {/* Next */}
            <Pressable onPress={() => audioService.playNext()} hitSlop={8}>
              <Ionicons
                name="play-skip-forward"
                size={32}
                color={Colors.text.primary}
              />
            </Pressable>

            {/* Repeat */}
            <Pressable onPress={cycleRepeat} hitSlop={8}>
              <View>
                <Ionicons name={repeatIcon} size={24} color={repeatColor} />
                {repeatMode === "one" && (
                  <View style={styles.repeatOneDot} />
                )}
              </View>
            </Pressable>
          </View>

          {/* Extra row */}
          <View style={styles.extraRow}>
            <Pressable style={styles.extraBtn} hitSlop={8}>
              <Ionicons
                name="cloud-download-outline"
                size={22}
                color={Colors.text.muted}
              />
              <Text style={styles.extraText}>Download</Text>
            </Pressable>
            <Pressable
              style={styles.extraBtn}
              hitSlop={8}
              onPress={() => setActiveTab("queue")}
            >
              <Ionicons
                name="list-outline"
                size={22}
                color={Colors.text.muted}
              />
              <Text style={styles.extraText}>Queue</Text>
            </Pressable>
            <Pressable style={styles.extraBtn} hitSlop={8}>
              <Ionicons
                name="share-outline"
                size={22}
                color={Colors.text.muted}
              />
              <Text style={styles.extraText}>Share</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          renderItem={renderQueueItem}
          contentContainerStyle={styles.queueList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.queueHeader}>
              {currentIndex + 1} / {queue.length}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.app },
  backBtn: { padding: 16 },
  emptyPlayer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: { fontSize: 16, color: Colors.text.muted },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerAlbum: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: Colors.background.card,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  tabBtn: { flex: 1, paddingVertical: 7, alignItems: "center", borderRadius: 8 },
  tabBtnActive: { backgroundColor: Colors.button.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: Colors.text.muted },
  tabTextActive: { color: Colors.button.text },
  playerContent: { paddingHorizontal: 24, paddingBottom: 32 },
  artWrapper: {
    alignItems: "center",
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: Colors.background.card,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  songInfoLeft: { flex: 1 },
  songTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
    lineHeight: 28,
  },
  songArtist: { fontSize: 15, color: Colors.text.muted, marginTop: 4 },
  seekSection: { marginBottom: 8 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: { fontSize: 12, color: Colors.text.muted },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatOneDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.button.primary,
  },
  extraRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  extraBtn: { alignItems: "center", gap: 6, padding: 8 },
  extraText: { fontSize: 11, color: Colors.text.muted },
  // Queue styles
  queueList: { paddingHorizontal: 16, paddingBottom: 32 },
  queueHeader: {
    fontSize: 13,
    color: Colors.text.muted,
    marginBottom: 12,
    textAlign: "center",
  },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  queueRowActive: { backgroundColor: `${Colors.button.primary}15` },
  queueArt: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: Colors.background.card,
  },
  queueMeta: { flex: 1 },
  queueTitle: { fontSize: 13, fontWeight: "600", color: Colors.text.primary },
  queueTitleActive: { color: Colors.button.primary },
  queueArtist: { fontSize: 11, color: Colors.text.muted, marginTop: 2 },
});
