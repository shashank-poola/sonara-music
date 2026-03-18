import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Colors } from "@/constants/theme";
import { useDownloadsStore } from "@/store/downloads-store";

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
};

function SettingRow({
  icon,
  label,
  value,
  toggle,
  toggled,
  onToggle,
  onPress,
}: SettingRowProps) {
  const content = (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{icon}</View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{
            true: Colors.button.primary,
            false: Colors.border.primary,
          }}
          thumbColor={Colors.text.primary}
        />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.rowPressed]}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const iconProps = { size: 20, color: Colors.button.primary };

export default function SettingsScreen() {
  const router = useRouter();
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const downloads = useDownloadsStore((s) => s.downloads);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.banner}>
          <View style={styles.bannerGradient}>
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

        <View style={styles.settingsList}>
          <SettingRow
            icon={<MaterialIcons name="credit-card" {...iconProps} />}
            label="Subscriptions"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Ionicons name="people-outline" {...iconProps} />}
            label="Your Community Space"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Ionicons name="download-outline" {...iconProps} />}
            label="Import Your Playlist"
            onPress={() => {}}
          />
          <SettingRow
            icon={<MaterialCommunityIcons name="translate" {...iconProps} />}
            label="Languages"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Ionicons name="musical-notes-outline" {...iconProps} />}
            label="Audio Quality"
            value="320 kbps"
          />
          <SettingRow
            icon={<Ionicons name="cellular-outline" {...iconProps} />}
            label="Data Saver"
            toggle
            toggled={!highQuality}
            onToggle={(v) => setHighQuality(!v)}
          />
          <SettingRow
            icon={<Ionicons name="musical-note-outline" {...iconProps} />}
            label="Music Playback"
            onPress={() => {}}
          />
          <SettingRow
            icon={<Ionicons name="download-outline" {...iconProps} />}
            label="Downloads"
            value={downloads.length > 0 ? `${downloads.length} songs` : undefined}
            onPress={() => {}}
          />
          <SettingRow
            icon={<Ionicons name="notifications-outline" {...iconProps} />}
            label="Notifications"
            toggle
            toggled={notifications}
            onToggle={setNotifications}
          />
        </View>

        <Pressable
          style={styles.footerBtn}
          onPress={() => router.replace("/(tabs)/home/index")}
        >
          <Text style={styles.footerBtnText}>Explore Sonara</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
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
  banner: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
  },
  bannerGradient: {
    padding: 20,
    backgroundColor: "#7C3AED",
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
    color: "#7C3AED",
  },
  settingsList: {
    backgroundColor: Colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowPressed: { opacity: 0.6 },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,181,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowValue: {
    fontSize: 13,
    color: Colors.text.muted,
  },
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
