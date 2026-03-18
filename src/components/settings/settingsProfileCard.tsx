import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

export function SettingsProfileCard() {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>
      </View>
      <View style={styles.profileText}>
        <Text style={styles.profileTitle}>Hi there!</Text>
        <Text style={styles.profileSub}>Enjoy your music with Sonara</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.button.text,
  },
  profileText: { flex: 1 },
  profileTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  profileSub: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 2,
  },
});
