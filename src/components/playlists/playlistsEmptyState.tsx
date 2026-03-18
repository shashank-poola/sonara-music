import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { PlaylistsEmptyStateProps } from "@/types/playlists.type";

export function PlaylistsEmptyState({ onCreatePress }: PlaylistsEmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="musical-notes"
          size={40}
          color={Colors.button.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No playlists yet</Text>
      <Text style={styles.emptyBody}>
        Create a playlist and add your favourite songs.
      </Text>
      <Pressable style={styles.createBtn} onPress={onCreatePress}>
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={Colors.button.text}
        />
        <Text style={styles.createText}>Create Playlist</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  emptyBody: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: "center",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 24,
  },
  createText: {
    color: Colors.button.text,
    fontWeight: "700",
    fontSize: 14,
  },
});
