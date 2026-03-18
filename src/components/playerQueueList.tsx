import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import { pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";
import type { SaavnSongSearchResult } from "@/types/saavn.type";

type PlayerQueueListProps = {
  queue: SaavnSongSearchResult[];
  currentIndex: number;
  onSelectSong: (index: number, song: SaavnSongSearchResult) => void;
};

export function PlayerQueueList({
  queue,
  currentIndex,
  onSelectSong,
}: PlayerQueueListProps) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const removeFromQueue = useQueueStore((s) => s.removeFromQueue);

  const renderItem = ({
    item,
    index,
  }: {
    item: SaavnSongSearchResult;
    index: number;
  }) => {
    const isActive = index === currentIndex;
    return (
      <Pressable
        style={[styles.queueRow, isActive && styles.queueRowActive]}
        onPress={() => onSelectSong(index, item)}
      >
        <Image
          source={{ uri: pickBestImageUrl(item.image, "150x150") }}
          style={styles.queueArt}
          contentFit="cover"
        />
        <View style={styles.queueMeta}>
          <Text
            style={[styles.queueTitle, isActive && styles.queueTitleActive]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.queueArtist} numberOfLines={1}>
            {getDisplayArtist(item)}
          </Text>
        </View>
        {isActive ? (
          <Ionicons
            name={isPlaying ? "volume-high" : "pause"}
            size={18}
            color={Colors.button.primary}
          />
        ) : (
          <Pressable onPress={() => removeFromQueue(index)} hitSlop={8}>
            <Ionicons name="close" size={18} color={Colors.text.muted} />
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={queue}
      keyExtractor={(item, i) => `${item.id}-${i}`}
      renderItem={renderItem}
      contentContainerStyle={styles.queueList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={styles.queueHeader}>
          {currentIndex + 1} / {queue.length}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  queueList: { paddingHorizontal: 16, paddingBottom: 32 },
  queueHeader: {
    fontSize: 13,
    color: Colors.text.muted,
    marginBottom: 12,
    textAlign: "center",
  },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  queueRowActive: { backgroundColor: `${Colors.button.primary}15` },
  queueArt: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: Colors.background.card,
  },
  queueMeta: { flex: 1 },
  queueTitle: { fontSize: 13, fontWeight: "600", color: Colors.text.primary },
  queueTitleActive: { color: Colors.button.primary },
  queueArtist: { fontSize: 11, color: Colors.text.muted, marginTop: 2 },
});
