import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";
import { PlayerAlbumArtProps } from "@/types/player.type";

export function PlayerAlbumArt({ imageUri }: PlayerAlbumArtProps) {
  if (!imageUri) return null;

  return (
    <View style={styles.artWrapper}>
      <Image
        source={{ uri: imageUri }}
        style={styles.albumArt}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artWrapper: {
    alignItems: "center",
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: Colors.background.card,
  },
});
