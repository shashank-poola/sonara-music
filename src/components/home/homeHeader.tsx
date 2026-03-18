import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export function HomeHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../../assets/sonara/sonaralogo.png")}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: 14,
  },
  logo: { width: 140, height: 35 },
});
