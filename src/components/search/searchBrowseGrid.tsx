import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { BROWSE_ITEMS } from "@/types/search.type";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 16;
const GRID_GAP = 12;
const NUM_COLUMNS = 2;
const HORIZONTAL_SPACE = GRID_PADDING * 2 + GRID_GAP;
const TILE_SIZE = Math.floor((SCREEN_WIDTH - HORIZONTAL_SPACE) / NUM_COLUMNS);

const TILE_BG = "#F9E4F5";
const TEXT_ICON_COLOR = "#000000";

export function SearchBrowseGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {BROWSE_ITEMS.map((item, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.tile,
              pressed && styles.tilePressed,
            ]}
          >
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.iconWrap}>
              <Ionicons
                name={item.icon}
                size={43}
                color={TEXT_ICON_COLOR}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 10,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: TILE_BG,
    borderRadius: 16,
    padding: 14,
    marginBottom: GRID_GAP,
    justifyContent: "space-between",
  },
  tilePressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: 23,
    fontWeight: "700",
    color: TEXT_ICON_COLOR,
    alignSelf: "flex-start",
  },
  iconWrap: {
    alignSelf: "flex-end",
  },
});
