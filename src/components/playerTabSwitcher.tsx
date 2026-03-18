import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type Tab = "player" | "queue";

type PlayerTabSwitcherProps = {
  activeTab: Tab;
  queueCount: number;
  onTabChange: (tab: Tab) => void;
};

export function PlayerTabSwitcher({
  activeTab,
  queueCount,
  onTabChange,
}: PlayerTabSwitcherProps) {
  return (
    <View style={styles.tabRow}>
      <Pressable
        onPress={() => onTabChange("player")}
        style={[styles.tabBtn, activeTab === "player" && styles.tabBtnActive]}
      >
        <Text
          style={[styles.tabText, activeTab === "player" && styles.tabTextActive]}
        >
          Player
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onTabChange("queue")}
        style={[styles.tabBtn, activeTab === "queue" && styles.tabBtnActive]}
      >
        <Text
          style={[styles.tabText, activeTab === "queue" && styles.tabTextActive]}
        >
          Queue ({queueCount})
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginBottom: 8,
    backgroundColor: Colors.background.card,
    borderRadius: 60,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 60,
  },
  tabBtnActive: { backgroundColor: Colors.button.primary },
  tabText: { fontSize: 15, fontWeight: "600", color: Colors.text.muted },
  tabTextActive: { color: Colors.button.text },
});
