import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "@/constants/theme";

export function SettingsFooter() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.footerBtn}
      onPress={() => router.replace("/(tabs)/home")}
    >
      <Text style={styles.footerBtnText}>Explore Sonara</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footerBtn: {
    marginTop: 24,
    backgroundColor: Colors.button.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  footerBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.button.text,
  },
});
