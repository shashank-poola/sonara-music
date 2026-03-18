import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

export function SettingsHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
  },
});
