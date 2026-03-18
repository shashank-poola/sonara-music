import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
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
import { HomeAlbumCard } from "@/components/home/homeAlbumCard";
import { HomeArtistCard } from "@/components/home/homeArtistCard";
import {
  HomeCategoryPills,
  type HomeCategoryKey,
} from "@/components/home/homeCategoryPills";
import { HomeHeader } from "@/components/home/homeHeader";
import { HomeLoaderError } from "@/components/home/homeLoaderError";
import { HomePlaylistCard } from "@/components/home/homePlaylistCard";
import { HomeSongRow } from "@/components/home/homeSongRow";
import { HomeTrendingCarousel } from "@/components/home/homeTrendingCarousel";
import { Colors } from "@/constants/theme";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import type {
  SaavnAlbumResult,
  SaavnArtistResult,
  SaavnPlaylistResult,
  SaavnSongSearchResult,
} from "@/types/saavn.type";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const GRID_PADDING = 16;
const NUM_COLUMNS = 2;
const HORIZONTAL_CARD_SIZE = 140;
const GRID_CARD_SIZE = Math.floor((SCREEN_WIDTH - GRID_PADDING * 2 - CARD_GAP) / NUM_COLUMNS);

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<HomeCategoryKey>("all");

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

  const fetchByCategory = useCallback(async (key: HomeCategoryKey) => {
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

  const handlePlaySong = (list: SaavnSongSearchResult[], song: SaavnSongSearchResult, index: number) => {
    setQueue(list, index);
    setCurrentSong(song);
    router.push("/player" as never);
  };

  const showSongsOnly = activeCategory === "songs";
  const showAlbumsOnly = activeCategory === "albums";
  const showArtistsOnly = activeCategory === "artists";
  const showPlaylistsOnly = activeCategory === "playlists";

  const loaderError = loading || error;
  if (loaderError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <HomeHeader />
        <HomeCategoryPills activeKey={activeCategory} onSelect={setActiveCategory} />
        <HomeLoaderError
          loading={loading}
          error={error}
          onRetry={() => fetchByCategory(activeCategory)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <HomeHeader />
      <HomeCategoryPills activeKey={activeCategory} onSelect={setActiveCategory} />

      {showSongsOnly ? (
        <FlatList
          data={allSongs}
          keyExtractor={(i) => i.id}
          renderItem={({ item, index }) => (
            <HomeSongRow
              song={item}
              index={index}
              isActive={item.id === currentSongId}
              isPlaying={isPlaying}
              onPress={() => handlePlaySong(allSongs, item, index)}
            />
          )}
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
        <FlatList
          data={albums}
          keyExtractor={(i) => i.id}
          numColumns={NUM_COLUMNS}
          key="albums"
          ListHeaderComponent={<Text style={styles.sectionTitle}>Albums</Text>}
          contentContainerStyle={styles.gridList}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <HomeAlbumCard album={item} variant="grid" cardSize={GRID_CARD_SIZE} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : showArtistsOnly ? (
        <FlatList
          data={artists}
          keyExtractor={(i) => i.id}
          numColumns={NUM_COLUMNS}
          key="artists"
          ListHeaderComponent={<Text style={styles.sectionTitle}>Artists</Text>}
          contentContainerStyle={styles.gridList}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <HomeArtistCard artist={item} variant="grid" />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : showPlaylistsOnly ? (
        <FlatList
          data={playlists}
          keyExtractor={(i) => i.id}
          numColumns={NUM_COLUMNS}
          key="playlists"
          ListHeaderComponent={<Text style={styles.sectionTitle}>Playlists</Text>}
          contentContainerStyle={styles.gridList}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <HomePlaylistCard playlist={item} variant="grid" cardSize={GRID_CARD_SIZE} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.mainScroll}
          showsVerticalScrollIndicator={false}
        >
          <HomeTrendingCarousel
            songs={trendingSongs}
            onPlaySong={(i) => handlePlaySong(trendingSongs, trendingSongs[i], i)}
          />

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
                    <HomeAlbumCard album={item} variant="horizontal" cardSize={HORIZONTAL_CARD_SIZE} />
                  </View>
                ))}
              </ScrollView>
            </>
          )}

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
                    <HomePlaylistCard playlist={item} variant="horizontal" cardSize={HORIZONTAL_CARD_SIZE} />
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {allSongs.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>All Songs</Text>
              <View style={styles.songsSection}>
                {allSongs.map((item, index) => (
                  <View key={item.id}>
                    <HomeSongRow
                      song={item}
                      index={index}
                      isActive={item.id === currentSongId}
                      isPlaying={isPlaying}
                      onPress={() => handlePlaySong(allSongs, item, index)}
                    />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mainScroll: { paddingBottom: 180 },
  horizontalList: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
    paddingBottom: 20,
  },
  gridList: { paddingHorizontal: 16, paddingBottom: 180 },
  gridRow: { gap: CARD_GAP, marginBottom: CARD_GAP },
  songsSection: { paddingHorizontal: 16, paddingBottom: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 180 },
  divider: {
    height: 1,
    backgroundColor: Colors.border.primary,
    opacity: 0.4,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: Colors.text.muted },
});
