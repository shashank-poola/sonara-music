import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchSongs } from "@/api/saavn";
import { Colors } from "@/constants/theme";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import {
  formatDuration,
  pickBestImageUrl,
  type SaavnSongSearchResult,
} from "@/types/saavn";

const DEFAULT_QUERY = "trending hindi";
const PAGE_SIZE = 20;

const CATEGORIES = [
  { key: "all", label: "All", query: DEFAULT_QUERY },
  { key: "songs", label: "Songs", query: "trending songs" },
  { key: "albums", label: "Album", query: "trending albums" },
  { key: "artists", label: "Artists", query: "trending artists" },
  { key: "playlists", label: "Playlists", query: "trending playlists" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [songs, setSongs] = useState<SaavnSongSearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSongId = usePlayerStore((s) => s.currentSong?.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  const fetchSongs = useCallback(
    async (q: string, p: number, replace: boolean) => {
      try {
        if (p === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);
        const res = await searchSongs(q, { page: p, limit: PAGE_SIZE });
        const results = res.data?.results ?? [];
        setSongs((prev) => (replace ? results : [...prev, ...results]));
        setTotal(res.data?.total ?? 0);
        setPage(p);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to fetch songs");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSongs(activeQuery, 1, true);
  }, [activeQuery, fetchSongs]);

  const handleSelectCategory = (key: CategoryKey) => {
    setActiveCategory(key);
    const next = CATEGORIES.find((c) => c.key === key)?.query ?? DEFAULT_QUERY;
    setActiveQuery(next);
  };

  const handleLoadMore = () => {
    if (!loadingMore && songs.length < total) {
      fetchSongs(activeQuery, page + 1, false);
    }
  };

  const handlePlaySong = (song: SaavnSongSearchResult, index: number) => {
    setQueue(songs, index);
    setCurrentSong(song);
    router.push("/player" as never);
  };

  const renderSong = ({
    item,
    index,
  }: {
    item: SaavnSongSearchResult;
    index: number;
  }) => {
    const isActive = item.id === currentSongId;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.songRow,
          pressed && styles.songRowPressed,
          isActive && styles.songRowActive,
        ]}
        onPress={() => handlePlaySong(item, index)}
      >
        <Text style={[styles.songIndex, isActive && styles.songIndexActive]}>
          {isActive ? (
            <Ionicons
              name={isPlaying ? "volume-high" : "pause"}
              size={14}
              color={Colors.button.primary}
            />
          ) : (
            index + 1
          )}
        </Text>
        <Image
          source={{ uri: pickBestImageUrl(item.image, "150x150") }}
          style={styles.songArt}
          contentFit="cover"
        />
        <View style={styles.songMeta}>
          <Text
            style={[styles.songName, isActive && styles.songNameActive]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {item.primaryArtists || "Unknown artist"}
          </Text>
        </View>
        <View style={styles.songRight}>
          {item.duration ? (
            <Text style={styles.songDuration}>
              {formatDuration(item.duration)}
            </Text>
          ) : null}
          <Ionicons
            name={isActive && isPlaying ? "pause-circle" : "play-circle"}
            size={32}
            color={isActive ? Colors.button.primary : Colors.text.muted}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/sonara/sonaralogo.png")}
          style={styles.logoImage}
          contentFit="contain"
        />
        <Ionicons
          name="notifications-outline"
          size={22}
          color={Colors.text.secondary}
        />
      </View>

      {/* Category tabs */}
      <View style={styles.categoryRow}>
        <View style={styles.categoryCapsule}>
          {CATEGORIES.map((c) => {
            const selected = c.key === activeCategory;
            return (
              <Pressable
                key={c.key}
                onPress={() => handleSelectCategory(c.key)}
                style={({ pressed }) => [
                  styles.categoryPill,
                  selected && styles.categoryPillActive,
                  pressed && styles.categoryPillPressed,
                ]}
                hitSlop={6}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeQuery === DEFAULT_QUERY ? "Trending" : `"${activeQuery}"`}
        </Text>
        {total > 0 && (
          <Text style={styles.totalText}>{total.toLocaleString()} songs</Text>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={Colors.button.primary} size="large" />
          <Text style={styles.loadingText}>Loading songs…</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={40} color={Colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => fetchSongs(activeQuery, 1, true)}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderSong}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color={Colors.button.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="musical-notes-outline"
                size={48}
                color={Colors.border.primary}
              />
              <Text style={styles.emptyText}>No songs found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.app },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoImage: {
    width: 112,
    height: 28,
  },
  categoryRow: { paddingHorizontal: 16, paddingBottom: 12 },
  categoryCapsule: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: 4,
    gap: 4,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  categoryPillActive: {
    backgroundColor: "#FFFFFF",
  },
  categoryPillPressed: { opacity: 0.75 },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text.muted,
  },
  categoryTextActive: {
    color: "#000000",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  totalText: { fontSize: 12, color: Colors.text.muted },
  list: { paddingHorizontal: 16, paddingBottom: 160 },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  songRowPressed: { opacity: 0.6 },
  songRowActive: { backgroundColor: `${Colors.button.primary}10` },
  songIndex: {
    width: 20,
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
  songIndexActive: { color: Colors.button.primary },
  songArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
  },
  songMeta: { flex: 1, gap: 3 },
  songName: { fontSize: 14, fontWeight: "600", color: Colors.text.primary },
  songNameActive: { color: Colors.button.primary },
  songArtist: { fontSize: 12, color: Colors.text.muted },
  songRight: { alignItems: "center", gap: 4 },
  songDuration: { fontSize: 11, color: Colors.text.muted },
  divider: {
    height: 1,
    backgroundColor: Colors.border.primary,
    opacity: 0.4,
  },
  loaderBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: Colors.text.muted },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.text.secondary,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.button.text,
    fontWeight: "700",
    fontSize: 14,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: Colors.text.muted },
  footerLoader: { marginVertical: 16 },
});
