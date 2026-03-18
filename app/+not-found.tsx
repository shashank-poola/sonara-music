import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.error("404: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page not found</Text>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/home")} activeOpacity={0.7}>
        <Text style={styles.link}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0F1A",
    gap: 8,
  },
  code: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FACC15",
  },
  title: {
    fontSize: 18,
    color: Colors.background.app,
  },
  link: {
    marginTop: 8,
    fontSize: 15,
    color: "#60a5fa",
    textDecorationLine: "underline",
  },
});
