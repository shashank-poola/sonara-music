import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Colors } from "@/constants/theme";

type SettingRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value?: string;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
};

function SettingRow({ icon, label, value, toggle, toggled, onToggle }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={18} color={Colors.button.primary} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ true: Colors.button.primary, false: Colors.border.primary }}
          thumbColor={Colors.text.primary}
        />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
        </View>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>Playback</Text>
        <View style={styles.card}>
          <SettingRow
            icon="musical-note"
            label="Audio Quality"
            value="320 kbps"
          />
          <View style={styles.separator} />
          <SettingRow
            icon="cloud-download-outline"
            label="High Quality Streaming"
            toggle
            toggled={highQuality}
            onToggle={setHighQuality}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="wifi-outline"
            label="Offline Mode"
            toggle
            toggled={offlineMode}
            onToggle={setOfflineMode}
          />
        </View>

        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            toggle
            toggled={notifications}
            onToggle={setNotifications}
          />
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <SettingRow icon="information-circle-outline" label="Version" value="1.0.0" />
          <View style={styles.separator} />
          <SettingRow icon="code-slash-outline" label="API" value="JioSaavn (Unofficial)" />
          <View style={styles.separator} />
          <SettingRow icon="document-text-outline" label="Licenses" />
        </View>

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: "hidden",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background.app,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginHorizontal: 16,
  },
});
