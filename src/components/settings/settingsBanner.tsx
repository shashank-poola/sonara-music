import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

export function SettingsBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>About Sonara</Text>
        <Text style={styles.bannerSub}>
          Your personal music companion. Stream millions of songs, create
          playlists, and enjoy offline listening—all in one beautiful app.
        </Text>
        <Pressable style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Learn More</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
  },
  bannerCard: {
    padding: 20,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 8,
  },
  bannerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom: 16,
  },
  bannerBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  bannerBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
});
