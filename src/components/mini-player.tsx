import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { audioService } from "@/services/audio-service";
import { usePlayerStore } from "@/store/player-store";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn";

export const TAB_BAR_HEIGHT = 64;

export function MiniPlayer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);

  if (!currentSong) return null;

  const progress = duration > 0 ? position / duration : 0;
  const albumArt = pickBestImageUrl(currentSong.image, "150x150");

  return (
    <Pressable
      style={[
        styles.container,
        { bottom: TAB_BAR_HEIGHT + insets.bottom },
      ]}
      onPress={() => router.push("/player")}
    >
      {/* Progress line at top */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        {/* Album art */}
        <Image
          source={{ uri: albumArt }}
          style={styles.art}
          contentFit="cover"
        />

        {/* Song info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.primaryArtists || "Unknown artist"}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              audioService.togglePlay();
            }}
            hitSlop={8}
            style={styles.controlBtn}
          >
            {isLoading ? (
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={Colors.text.primary}
              />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={24}
                color={Colors.text.primary}
              />
            )}
          </Pressable>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              audioService.playNext();
            }}
            hitSlop={8}
            style={styles.controlBtn}
          >
            <Ionicons
              name="play-skip-forward"
              size={22}
              color={Colors.text.primary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.player.progressInactive,
    width: "100%",
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.button.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  art: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: Colors.background.app,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  artist: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  controlBtn: {
    padding: 6,
  },
});
