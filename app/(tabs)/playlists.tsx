import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

export default function PlaylistsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
        <Pressable style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.button.text} />
        </Pressable>
      </View>
      <View style={styles.empty}>
        <View style={styles.iconCircle}>
          <Ionicons name="musical-notes" size={40} color={Colors.button.primary} />
        </View>
        <Text style={styles.emptyTitle}>No playlists yet</Text>
        <Text style={styles.emptyBody}>
          Create a playlist and add your favourite songs.
        </Text>
        <Pressable style={styles.createBtn}>
          <Ionicons name="add-circle-outline" size={18} color={Colors.button.text} />
          <Text style={styles.createText}>Create Playlist</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
  },
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
    lineHeight: 20,
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
