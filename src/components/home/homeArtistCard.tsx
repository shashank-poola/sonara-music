import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import { HomeArtistCardProps } from "@/types/home.type";

const CARD_SIZE = 140;

export function HomeArtistCard({ artist, variant, cardSize = CARD_SIZE }: HomeArtistCardProps) {
  const router = useRouter();
  const size = cardSize;

  return (
    <Pressable
      style={[styles.card, variant === "grid" && { width: size }]}
      onPress={() => router.push(`/artist/${artist.id}` as never)}
    >
      <Image
        source={{ uri: pickBestImageUrl(artist.image, "300x300") }}
        style={[styles.art, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
      />
      <Text style={[styles.title, { maxWidth: size }]} numberOfLines={2}>
        {artist.name}
      </Text>
      <Text style={[styles.sub, { maxWidth: size }]} numberOfLines={1}>
        {artist.role || "Artist"}
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
