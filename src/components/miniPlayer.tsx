import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { audioService } from "@/services/audio-service";
import { usePlayerStore } from "@/store/player-store";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";

export const TAB_BAR_HEIGHT = 64;

export function MiniPlayer() {
  const router = useRouter();
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
      style={[styles.container, { bottom: TAB_BAR_HEIGHT }]}
      onPress={() => router.push("/player" as never)}
    >
      <View style={styles.progressWrapper}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
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
            {getDisplayArtist(currentSong)}
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
    left: 10,
    right: 10,
    zIndex: 1000,
    elevation: 20,
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  progressWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 12,
    marginTop: -0.5,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.player.progressInactive,
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.button.primary,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  art: {
    width: 60,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.background.app,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  artist: {
    fontSize: 13,
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
