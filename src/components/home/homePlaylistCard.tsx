import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import type { SaavnPlaylistResult } from "@/types/saavn.type";
import { HomePlaylistCardProps } from "@/types/home.type";

const CARD_SIZE = 140;

export function HomePlaylistCard({ playlist, variant, cardSize = CARD_SIZE }: HomePlaylistCardProps) {
  const router = useRouter();
  const size = cardSize;

  return (
    <Pressable
      style={[styles.card, variant === "grid" && { width: size }]}
      onPress={() => router.push(`/playlist/${playlist.id}` as never)}
    >
      <Image
        source={{ uri: pickBestImageUrl(playlist.image, "300x300") }}
        style={[styles.art, { width: size, height: size }]}
        contentFit="cover"
      />
      <Text style={[styles.title, { maxWidth: size }]} numberOfLines={2}>
        {playlist.name}
      </Text>
      <Text style={[styles.sub, { maxWidth: size }]} numberOfLines={1}>
        {playlist.songCount ? `${playlist.songCount} songs` : playlist.language || "Playlist"}
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
