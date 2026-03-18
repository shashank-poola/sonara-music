import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { HomeLoaderErrorProps } from "@/types/home.type";


export function HomeLoaderError({ loading, error, onRetry }: HomeLoaderErrorProps) {
  if (loading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={Colors.button.primary} size="large" />
        <Text style={styles.text}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.box}>
        <Ionicons name="alert-circle" size={40} color={Colors.status.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: { fontSize: 14, color: Colors.text.muted },
  errorText: {
    color: Colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: 32,
    fontSize: 14,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: Colors.button.text, fontWeight: "700", fontSize: 14 },
});
