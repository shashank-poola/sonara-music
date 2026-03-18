import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

export const HOME_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "songs", label: "Songs" },
  { key: "albums", label: "Album" },
  { key: "artists", label: "Artists" },
  { key: "playlists", label: "Playlists" },
] as const;

export type HomeCategoryKey = (typeof HOME_CATEGORIES)[number]["key"];

type HomeCategoryPillsProps = {
  activeKey: HomeCategoryKey;
  onSelect: (key: HomeCategoryKey) => void;
};

export function HomeCategoryPills({ activeKey, onSelect }: HomeCategoryPillsProps) {
  return (
    <View style={styles.row}>
      {HOME_CATEGORIES.map((c) => {
        const selected = c.key === activeKey;
        return (
          <Pressable
            key={c.key}
            onPress={() => onSelect(c.key)}
            style={({ pressed }) => [
              styles.pill,
              selected && styles.pillActive,
              pressed && styles.pillPressed,
            ]}
            hitSlop={6}
          >
            <Text style={[styles.text, selected && styles.textActive]}>
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  pillActive: {
    backgroundColor: Colors.button.primary,
    borderColor: Colors.button.primary,
  },
  pillPressed: { opacity: 0.75 },
  text: { fontSize: 12, fontWeight: "700", color: Colors.text.primary },
  textActive: { color: Colors.button.text },
});
