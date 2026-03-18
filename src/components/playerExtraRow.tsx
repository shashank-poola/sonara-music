import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type PlayerExtraRowProps = {
  onShowQueue: () => void;
};

export function PlayerExtraRow({ onShowQueue }: PlayerExtraRowProps) {
  return (
    <View style={styles.extraRow}>
      <Pressable style={styles.extraBtn} hitSlop={8}>
        <Ionicons
          name="cloud-download-outline"
          size={22}
          color={Colors.text.muted}
        />
        <Text style={styles.extraText}>Download</Text>
      </Pressable>
      <Pressable style={styles.extraBtn} hitSlop={8} onPress={onShowQueue}>
        <Ionicons
          name="list-outline"
          size={22}
          color={Colors.text.muted}
        />
        <Text style={styles.extraText}>Queue</Text>
      </Pressable>
      <Pressable style={styles.extraBtn} hitSlop={8}>
        <Ionicons
          name="share-outline"
          size={22}
          color={Colors.text.muted}
        />
        <Text style={styles.extraText}>Share</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  extraRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  extraBtn: { alignItems: "center", gap: 6, padding: 8 },
  extraText: { fontSize: 11, color: Colors.text.muted },
});
