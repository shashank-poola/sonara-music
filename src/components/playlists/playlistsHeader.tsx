import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

type PlaylistsHeaderProps = {
  onAddPress: () => void;
};

export function PlaylistsHeader({ onAddPress }: PlaylistsHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Playlists</Text>
      <Pressable style={styles.addBtn} onPress={onAddPress}>
        <Ionicons name="add" size={22} color={Colors.button.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
});
