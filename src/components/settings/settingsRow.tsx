import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  label,
  value,
  toggle,
  toggled,
  onToggle,
  onPress,
}: SettingsRowProps) {
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

const styles = StyleSheet.create({
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
});
