import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { pickBestImageUrl } from "@/types/saavn.type";
import type { SaavnSongSearchResult } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.floor(SCREEN_WIDTH * 0.72);
const CARD_GAP = 12;

type HomeTrendingCarouselProps = {
  songs: SaavnSongSearchResult[];
  onPlaySong: (index: number) => void;
};

export function HomeTrendingCarousel({ songs, onPlaySong }: HomeTrendingCarouselProps) {
  if (songs.length === 0) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Popular & Trending</Text>
      <ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {songs.slice(0, 10).map((item, i) => (
          <Pressable
            key={item.id}
            style={styles.cardWrap}
            onPress={() => onPlaySong(i)}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: pickBestImageUrl(item.image, "500x500") }}
                style={styles.art}
                contentFit="cover"
              />
              <View style={styles.overlay}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {getDisplayArtist(item)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
    paddingBottom: 20,
  },
  cardWrap: { width: CARD_WIDTH, marginRight: CARD_GAP },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.background.card,
  },
  art: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  artist: { fontSize: 13, color: Colors.text.muted, marginTop: 2 },
});
