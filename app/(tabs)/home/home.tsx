import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  searchAlbums,
  searchArtists,
  searchPlaylists,
  searchSongs,
} from "@/api/saavn";
import { Colors } from "@/constants/theme";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import {
  formatDuration,
  pickBestImageUrl,
  type SaavnAlbumResult,
  type SaavnArtistResult,
  type SaavnPlaylistResult,
  type SaavnSongSearchResult,
} from "@/types/saavn.type";
import { getDisplayArtist, getDisplayArtistForAlbum } from "@/utils/artistDisplay";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRENDING_CARD_WIDTH = Math.floor(SCREEN_WIDTH * 0.72);
const HORIZONTAL_CARD_SIZE = 140;
const CARD_GAP = 12;

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "songs", label: "Songs" },
  { key: "albums", label: "Album" },
  { key: "artists", label: "Artists" },
  { key: "playlists", label: "Playlists" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const [trendingSongs, setTrendingSongs] = useState<SaavnSongSearchResult[]>([]);
  const [albums, setAlbums] = useState<SaavnAlbumResult[]>([]);
  const [artists, setArtists] = useState<SaavnArtistResult[]>([]);
  const [playlists, setPlaylists] = useState<SaavnPlaylistResult[]>([]);
  const [allSongs, setAllSongs] = useState<SaavnSongSearchResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSongId = usePlayerStore((s) => s.currentSong?.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [songsRes, albumsRes, playlistsRes] = await Promise.all([
        searchSongs("trending hindi", { page: 1, limit: 30 }),
        searchAlbums("trending", { page: 1, limit: 20 }),
        searchPlaylists("trending", { page: 1, limit: 20 }),
      ]);
      setTrendingSongs(songsRes.data?.results ?? []);
      setAllSongs(songsRes.data?.results ?? []);
      setAlbums(albumsRes.data?.results ?? []);
      setPlaylists(playlistsRes.data?.results ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(async (key: CategoryKey) => {
    if (key === "all") {
      fetchHomeData();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (key === "songs") {
        const res = await searchSongs("trending hindi", { page: 1, limit: 50 });
        setAllSongs(res.data?.results ?? []);
        setTrendingSongs([]);
        setAlbums([]);
        setArtists([]);
        setPlaylists([]);
      } else if (key === "albums") {
        const res = await searchAlbums("trending", { page: 1, limit: 30 });
        setAlbums(res.data?.results ?? []);
        setTrendingSongs([]);
        setAllSongs([]);
        setArtists([]);
        setPlaylists([]);
      } else if (key === "artists") {
        const res = await searchArtists("trending", { page: 1, limit: 30 });
        setArtists(res.data?.results ?? []);
        setTrendingSongs([]);
        setAlbums([]);
        setAllSongs([]);
        setPlaylists([]);
      } else {
        const res = await searchPlaylists("trending", { page: 1, limit: 30 });
        setPlaylists(res.data?.results ?? []);
        setTrendingSongs([]);
        setAlbums([]);
        setArtists([]);
        setAllSongs([]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [fetchHomeData]);

  useEffect(() => {
    fetchByCategory(activeCategory);
  }, [activeCategory, fetchByCategory]);

  const handleSelectCategory = (key: CategoryKey) => {
    setActiveCategory(key);
  };

  const handlePlaySong = (list: SaavnSongSearchResult[], song: SaavnSongSearchResult, index: number) => {
    setQueue(list, index);
    setCurrentSong(song);
    router.push("/player" as never);
  };

  const renderTrendingCard = ({ item, index }: { item: SaavnSongSearchResult; index: number }) => (
    <Pressable
      style={styles.trendingCard}
      onPress={() => handlePlaySong(trendingSongs, item, index)}
    >
      <Image
        source={{ uri: pickBestImageUrl(item.image, "500x500") }}
        style={styles.trendingArt}
        contentFit="cover"
      />
      <View style={styles.trendingOverlay}>
        <Text style={styles.trendingTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.trendingArtist} numberOfLines={1}>
          {getDisplayArtist(item)}
        </Text>
      </View>
    </Pressable>
  );

  const renderHorizontalAlbum = ({ item }: { item: SaavnAlbumResult }) => (
    <Pressable style={styles.horizontalCard} onPress={() => router.push(`/album/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "300x300") }}
        style={styles.horizontalArt}
        contentFit="cover"
      />
      <Text style={styles.horizontalTitle} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.horizontalSub} numberOfLines={1}>
        {getDisplayArtistForAlbum(item)}
      </Text>
    </Pressable>
  );

  const renderHorizontalPlaylist = ({ item }: { item: SaavnPlaylistResult }) => (
    <Pressable style={styles.horizontalCard} onPress={() => router.push(`/playlist/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "300x300") }}
        style={styles.horizontalArt}
        contentFit="cover"
      />
      <Text style={styles.horizontalTitle} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.horizontalSub} numberOfLines={1}>
        {item.songCount ? `${item.songCount} songs` : item.language || "Playlist"}
      </Text>
    </Pressable>
  );

  const renderHorizontalArtist = ({ item }: { item: SaavnArtistResult }) => (
    <Pressable style={styles.horizontalCard} onPress={() => router.push(`/artist/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "300x300") }}
        style={[styles.horizontalArt, styles.horizontalArtCircle]}
        contentFit="cover"
      />
      <Text style={styles.horizontalTitle} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.horizontalSub} numberOfLines={1}>
        {item.role || "Artist"}
      </Text>
    </Pressable>
  );

  const renderSongRow = ({
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
        onPress={() => handlePlaySong(allSongs, item, index)}
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
            {getDisplayArtist(item)}
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

  const showSongsOnly = activeCategory === "songs";
  const showAlbumsOnly = activeCategory === "albums";
  const showArtistsOnly = activeCategory === "artists";
  const showPlaylistsOnly = activeCategory === "playlists";

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

      {/* Category pills */}
      <View style={styles.categoryRow}>
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

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={Colors.button.primary} size="large" />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={40} color={Colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => fetchByCategory(activeCategory)} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : showSongsOnly ? (
        <FlatList
          data={allSongs}
          keyExtractor={(i) => i.id}
          renderItem={renderSongRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListHeaderComponent={<Text style={styles.sectionTitle}>Songs</Text>}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No songs found</Text>
            </View>
          }
        />
      ) : showAlbumsOnly ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Albums</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {albums.map((item) => (
              <View key={item.id}>
                {renderHorizontalAlbum({ item })}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      ) : showArtistsOnly ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Artists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {artists.map((item) => (
              <View key={item.id}>
                {renderHorizontalArtist({ item })}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      ) : showPlaylistsOnly ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Playlists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {playlists.map((item) => (
              <View key={item.id}>
                {renderHorizontalPlaylist({ item })}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.mainScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Trending - big posters */}
          {trendingSongs.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Popular & Trending</Text>
              <ScrollView
                horizontal
                pagingEnabled={false}
                snapToInterval={TRENDING_CARD_WIDTH + CARD_GAP}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingList}
              >
                {trendingSongs.slice(0, 10).map((item, i) => (
                  <View key={item.id} style={styles.trendingCardWrap}>
                    {renderTrendingCard({ item, index: i })}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Albums - horizontal rounded cards */}
          {albums.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Albums</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {albums.map((item) => (
                  <View key={item.id}>
                    {renderHorizontalAlbum({ item })}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Playlists - horizontal */}
          {playlists.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Playlists</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {playlists.map((item) => (
                  <View key={item.id}>
                    {renderHorizontalPlaylist({ item })}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* All Songs - vertical list */}
          {allSongs.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>All Songs</Text>
              <View style={styles.songsSection}>
                {allSongs.map((item, index) => (
                  <View key={item.id}>
                    {renderSongRow({ item, index })}
                    {index < allSongs.length - 1 ? <View style={styles.divider} /> : null}
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
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
  logoImage: { width: 112, height: 28 },
  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  categoryPillActive: {
    backgroundColor: Colors.button.primary,
    borderColor: Colors.button.primary,
  },
  categoryPillPressed: { opacity: 0.75 },
  categoryText: { fontSize: 12, fontWeight: "700", color: Colors.text.primary },
  categoryTextActive: { color: Colors.button.text },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  mainScroll: { paddingBottom: 180 },
  scrollContent: { paddingBottom: 180 },

  trendingList: {
    paddingHorizontal: 20,
    gap: CARD_GAP,
    paddingBottom: 20,
  },
  trendingCardWrap: { width: TRENDING_CARD_WIDTH, marginRight: CARD_GAP },
  trendingCard: {
    width: TRENDING_CARD_WIDTH,
    height: TRENDING_CARD_WIDTH,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.background.card,
  },
  trendingArt: {
    width: "100%",
    height: "100%",
  },
  trendingOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  trendingTitle: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  trendingArtist: { fontSize: 13, color: Colors.text.muted, marginTop: 2 },

  horizontalList: {
    paddingHorizontal: 20,
    gap: CARD_GAP,
    paddingBottom: 20,
  },
  horizontalCard: { width: HORIZONTAL_CARD_SIZE },
  horizontalArt: {
    width: HORIZONTAL_CARD_SIZE,
    height: HORIZONTAL_CARD_SIZE,
    borderRadius: 12,
    backgroundColor: Colors.background.card,
  },
  horizontalArtCircle: { borderRadius: HORIZONTAL_CARD_SIZE / 2 },
  horizontalTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
    marginTop: 8,
    maxWidth: HORIZONTAL_CARD_SIZE,
  },
  horizontalSub: {
    fontSize: 11,
    color: Colors.text.muted,
    marginTop: 2,
    maxWidth: HORIZONTAL_CARD_SIZE,
  },

  songsSection: { paddingHorizontal: 16, paddingBottom: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 180 },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  songRowPressed: { opacity: 0.6 },
  songRowActive: { backgroundColor: `${Colors.button.primary}20` },
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
});
