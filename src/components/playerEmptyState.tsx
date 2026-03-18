import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlayerEmptyStateProps } from "@/types/player.type";
import { Colors } from "@/constants/theme";

export function PlayerEmptyState({ onBack }: PlayerEmptyStateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Ionicons name="chevron-down" size={28} color={Colors.text.primary} />
      </Pressable>
      <View style={styles.emptyPlayer}>
        <Ionicons
          name="musical-notes-outline"
          size={64}
          color={Colors.border.primary}
        />
        <Text style={styles.emptyText}>Nothing is playing</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: 16 },
  emptyPlayer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: { fontSize: 16, color: Colors.text.muted },
});
