import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsBanner } from "@/components/settings/settingsBanner";
import { SettingsFooter } from "@/components/settings/settingsFooter";
import { SettingsHeader } from "@/components/settings/settingsHeader";
import { SettingsProfileCard } from "@/components/settings/settingsProfileCard";
import { SettingsRow } from "@/components/settings/settingsRow";
import { Colors } from "@/constants/theme";
import { useDownloadsStore } from "@/store/downloads-store";

const iconProps = { size: 20, color: Colors.button.primary };

export default function SettingsScreen() {
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const downloads = useDownloadsStore((s) => s.downloads);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <SettingsHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard />
        <SettingsBanner />

        <View style={styles.settingsList}>
          <SettingsRow
            icon={<MaterialIcons name="credit-card" {...iconProps} />}
            label="Subscriptions"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Ionicons name="people-outline" {...iconProps} />}
            label="Your Community Space"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Ionicons name="download-outline" {...iconProps} />}
            label="Import Your Playlist"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="translate" {...iconProps} />}
            label="Languages"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Ionicons name="musical-notes-outline" {...iconProps} />}
            label="Audio Quality"
            value="320 kbps"
          />
          <SettingsRow
            icon={<Ionicons name="cellular-outline" {...iconProps} />}
            label="Data Saver"
            toggle
            toggled={!highQuality}
            onToggle={(v) => setHighQuality(!v)}
          />
          <SettingsRow
            icon={<Ionicons name="musical-note-outline" {...iconProps} />}
            label="Music Playback"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Ionicons name="download-outline" {...iconProps} />}
            label="Downloads"
            value={downloads.length > 0 ? `${downloads.length} songs` : undefined}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Ionicons name="notifications-outline" {...iconProps} />}
            label="Notifications"
            toggle
            toggled={notifications}
            onToggle={setNotifications}
          />
        </View>

        <SettingsFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  settingsList: {
    backgroundColor: Colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: "hidden",
  },
});
