import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerHeaderProps } from "@/types/player.type";
import { Colors } from "@/constants/theme";

export function PlayerHeader({ albumName, onBack, onMore }: PlayerHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={8}>
        <Ionicons name="chevron-down" size={28} color={Colors.text.primary} />
      </Pressable>
      <View style={styles.headerCenter}>
        <Text style={styles.headerLabel}>Now Playing</Text>
        <Text style={styles.headerAlbum} numberOfLines={1}>
          {albumName ?? ""}
        </Text>
      </View>
      <Pressable onPress={onMore} hitSlop={8}>
        <Ionicons
          name="ellipsis-horizontal"
          size={22}
          color={Colors.text.secondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});
