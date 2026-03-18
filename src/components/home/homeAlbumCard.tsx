import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtistForAlbum } from "@/utils/artistDisplay";
import { HomeAlbumCardProps } from "@/types/home.type";

const CARD_SIZE = 140;

export function HomeAlbumCard({ album, variant, cardSize = CARD_SIZE }: HomeAlbumCardProps) {
  const router = useRouter();
  const size = cardSize;

  return (
    <Pressable
      style={[styles.card, variant === "grid" && { width: size }]}
      onPress={() => router.push(`/album/${album.id}` as never)}
    >
      <Image
        source={{ uri: pickBestImageUrl(album.image, "300x300") }}
        style={[styles.art, { width: size, height: size }]}
        contentFit="cover"
      />
      <Text style={[styles.title, { maxWidth: size }]} numberOfLines={2}>
        {album.name}
      </Text>
      <Text style={[styles.sub, { maxWidth: size }]} numberOfLines={1}>
        {getDisplayArtistForAlbum(album)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
  art: {
    borderRadius: 12,
    backgroundColor: Colors.background.card,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
    marginTop: 8,
  },
  sub: {
    fontSize: 11,
    color: Colors.text.muted,
    marginTop: 2,
  },
});
