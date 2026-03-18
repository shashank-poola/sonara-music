import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Colors } from "@/constants/theme";
import { SearchInputProps } from "@/types/search.type";

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search songs, albums, artists…",
}: SearchInputProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={16}
          color={Colors.text.muted}
          style={styles.searchIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={Colors.text.muted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { paddingHorizontal: 16, paddingBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text.primary, fontSize: 14 },
});
