import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { CategoryTab, CategoryPillsProps } from "@/types/home.type";

export function CategoryPills({ tabs, activeKey, onSelect }: CategoryPillsProps) {
  return (
    <View style={styles.categoryRow}>
      {tabs.map((t) => {
        const selected = t.key === activeKey;
        return (
          <Pressable
            key={t.key}
            onPress={() => onSelect(t.key)}
            style={({ pressed }) => [
              styles.categoryPill,
              selected && styles.categoryPillActive,
              pressed && styles.categoryPillPressed,
            ]}
          >
            <Text
              style={[styles.categoryText, selected && styles.categoryTextActive]}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  categoryPillActive: {
    backgroundColor: Colors.button.primary,
    borderColor: Colors.button.primary,
  },
  categoryPillPressed: { opacity: 0.75 },
  categoryText: { fontSize: 12, fontWeight: "700", color: Colors.text.primary },
  categoryTextActive: { color: Colors.button.text },
});
