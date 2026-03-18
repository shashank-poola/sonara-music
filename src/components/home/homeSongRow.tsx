import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { formatDuration, pickBestImageUrl } from "@/types/saavn.type";
import type { SaavnSongSearchResult } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";

type HomeSongRowProps = {
  song: SaavnSongSearchResult;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onPress: () => void;
};

export function HomeSongRow({ song, index, isActive, isPlaying, onPress }: HomeSongRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
        isActive && styles.rowActive,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.index, isActive && styles.indexActive]}>
        {isActive ? (
          <Ionicons
            name={isPlaying ? "volume-high" : "pause"}
            size={14}
            color={Colors.button.primary}
          />
        ) : (
          index + 1
        )}
      </Text>
      <Image
        source={{ uri: pickBestImageUrl(song.image, "150x150") }}
        style={styles.art}
        contentFit="cover"
      />
      <View style={styles.meta}>
        <Text style={[styles.name, isActive && styles.nameActive]} numberOfLines={1}>
          {song.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {getDisplayArtist(song)}
        </Text>
      </View>
      <View style={styles.right}>
        {song.duration ? (
          <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        ) : null}
        <Ionicons
          name={isActive && isPlaying ? "pause-circle" : "play-circle"}
          size={32}
          color={isActive ? Colors.button.primary : Colors.text.muted}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  rowPressed: { opacity: 0.6 },
  rowActive: { backgroundColor: `${Colors.button.primary}20` },
  index: {
    width: 20,
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
  indexActive: { color: Colors.button.primary },
  art: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
  },
  meta: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontWeight: "600", color: Colors.text.primary },
  nameActive: { color: Colors.button.primary },
  artist: { fontSize: 12, color: Colors.text.muted },
  right: { alignItems: "center", gap: 4 },
  duration: { fontSize: 11, color: Colors.text.muted },
});
