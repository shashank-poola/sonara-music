import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { PlayerSongInfoProps } from "@/types/player.type";

export function PlayerSongInfo({ title, artist, onAddToPlaylist }: PlayerSongInfoProps) {
  return (
    <View style={styles.songInfo}>
      <View style={styles.songInfoLeft}>
        <Text style={styles.songTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {artist}
        </Text>
      </View>
      <Pressable onPress={onAddToPlaylist} hitSlop={8}>
        <MaterialIcons
          name="queue-music"
          size={26}
          color={Colors.text.muted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
