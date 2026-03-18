import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import type { SaavnSongSearchResult } from "@/types/saavn.type";

type AddToPlaylistButtonProps = {
  currentSong: SaavnSongSearchResult;
  onPress: () => void;
};

export function AddToPlaylistButton({ currentSong, onPress }: AddToPlaylistButtonProps) {
  return (
    <Pressable style={styles.addCurrentBtn} onPress={onPress}>
      <Ionicons name="add-circle" size={24} color={Colors.button.primary} />
      <View style={styles.addCurrentTextCol}>
        <Text style={styles.addCurrentText}>Add to playlist</Text>
        <Text style={styles.addCurrentSub} numberOfLines={1}>
          {currentSong.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addCurrentBtn: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.background.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  addCurrentTextCol: { flex: 1, gap: 2 },
  addCurrentText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  addCurrentSub: {
    fontSize: 12,
    color: Colors.text.muted,
  },
});
