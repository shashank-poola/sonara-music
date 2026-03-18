import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import { HomeArtistCardProps } from "@/types/home.type";

const CARD_SIZE = 140;

function ArtistImagePlaceholder({ size }: { size: number }) {
  return (
    <View style={[styles.art, styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="person" size={size * 0.4} color={Colors.text.muted} />
    </View>
  );
}

export function HomeArtistCard({ artist, variant, cardSize = CARD_SIZE }: HomeArtistCardProps) {
  const router = useRouter();
  const size = cardSize;
  const imageUrl = pickBestImageUrl(artist.image, "300x300");
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !imageUrl || imageError;

  return (
    <Pressable
      style={[styles.card, variant === "grid" && { width: size }]}
      onPress={() => router.push(`/artist/${artist.id}` as never)}
    >
      {showPlaceholder ? (
        <ArtistImagePlaceholder size={size} />
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.art, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          onError={() => setImageError(true)}
        />
      )}
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
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
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
