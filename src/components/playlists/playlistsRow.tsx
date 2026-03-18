import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import type { UserPlaylist } from "@/store/playlists-store";
import { pickBestImageUrl } from "@/types/saavn.type";
import { PlaylistsRowProps } from "@/types/playlists.type";

export function PlaylistsRow({ playlist, onDelete }: PlaylistsRowProps) {
  const router = useRouter();

  const handleLongPress = () => {
    Alert.alert(
      playlist.name,
      "Delete this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => router.push(`/playlist/${playlist.id}` as never)}
      onLongPress={handleLongPress}
    >
      <View style={styles.rowArt}>
        {playlist.songs[0] ? (
          <Image
            source={{ uri: pickBestImageUrl(playlist.songs[0].image, "150x150") }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <Ionicons
            name="musical-notes"
            size={28}
            color={Colors.text.muted}
            style={styles.rowArtIcon}
          />
        )}
      </View>
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.rowSub}>{playlist.songs.length} songs</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderRadius: 8,
  },
  rowPressed: { opacity: 0.6 },
  rowArt: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  rowArtIcon: { opacity: 0.6 },
  rowMeta: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "600", color: Colors.text.primary },
  rowSub: { fontSize: 13, color: Colors.text.muted, marginTop: 2 },
});
