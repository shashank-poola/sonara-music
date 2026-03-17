import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { searchAll, searchAlbums, searchArtists, searchPlaylists, searchSongs } from "@/api/saavn";
import { useDebounce } from "@/hooks/use-debounce";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import {
  formatDuration,
  pickBestImageUrl,
  type SaavnAlbumResult,
  type SaavnArtistResult,
  type SaavnPlaylistResult,
  type SaavnSongSearchResult,
} from "@/types/saavn";

export default function SearchScreen() {
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 450);
  const [activeTab, setActiveTab] = useState<"all" | "songs" | "albums" | "artists" | "playlists">(
    "all"
  );

  const [songs, setSongs] = useState<SaavnSongSearchResult[]>([]);
  const [albums, setAlbums] = useState<SaavnAlbumResult[]>([]);
  const [artists, setArtists] = useState<SaavnArtistResult[]>([]);
  const [playlists, setPlaylists] = useState<SaavnPlaylistResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      { key: "all" as const, label: "All" },
      { key: "songs" as const, label: "Songs" },
      { key: "albums" as const, label: "Album" },
      { key: "artists" as const, label: "Artists" },
      { key: "playlists" as const, label: "Playlists" },
    ],
    []
  );

  const runSearch = useCallback(async () => {
    const q = debouncedQuery;
    if (!q) {
      setSongs([]);
      setAlbums([]);
      setArtists([]);
      setPlaylists([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (activeTab === "all") {
        const res = await searchAll(q, { page: 1, limit: 10 });
        setSongs(res.data?.songs?.results ?? []);
        setAlbums(res.data?.albums?.results ?? []);
        setArtists(res.data?.artists?.results ?? []);
        setPlaylists(res.data?.playlists?.results ?? []);
        return;
      }

      if (activeTab === "songs") {
        const res = await searchSongs(q, { page: 1, limit: 30 });
        setSongs(res.data?.results ?? []);
        return;
      }
      if (activeTab === "albums") {
        const res = await searchAlbums(q, { page: 1, limit: 30 });
        setAlbums(res.data?.results ?? []);
        return;
      }
      if (activeTab === "artists") {
        const res = await searchArtists(q, { page: 1, limit: 30 });
        setArtists(res.data?.results ?? []);
        return;
      }

      const res = await searchPlaylists(q, { page: 1, limit: 30 });
      setPlaylists(res.data?.results ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedQuery]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handlePlaySong = (list: SaavnSongSearchResult[], song: SaavnSongSearchResult, index: number) => {
    setQueue(list, index);
    setCurrentSong(song);
    router.push("/player" as never);
  };

  const renderSong = ({ item, index }: { item: SaavnSongSearchResult; index: number }) => (
    <Pressable style={styles.songRow} onPress={() => handlePlaySong(songs, item, index)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {item.primaryArtists || "Unknown artist"}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {item.duration ? <Text style={styles.rowTime}>{formatDuration(item.duration)}</Text> : null}
        <Ionicons name="play-circle" size={30} color={Colors.text.primary} />
      </View>
    </Pressable>
  );

  const renderAlbum = ({ item }: { item: SaavnAlbumResult }) => (
    <Pressable style={styles.genericRow} onPress={() => router.push(`/album/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {item.primaryArtists || item.artist || "Album"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );

  const renderArtist = ({ item }: { item: SaavnArtistResult }) => (
    <Pressable style={styles.genericRow} onPress={() => router.push(`/artist/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "150x150") }}
        style={[styles.rowArt, { borderRadius: 999 }]}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {item.role || "Artist"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );

  const renderPlaylist = ({ item }: { item: SaavnPlaylistResult }) => (
    <Pressable style={styles.genericRow} onPress={() => router.push(`/playlist/${item.id}` as never)}>
      <Image
        source={{ uri: pickBestImageUrl(item.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {item.songCount ? `${item.songCount} songs` : item.language || "Playlist"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );

  const content =
    activeTab === "songs"
      ? { data: songs, renderItem: renderSong, key: "songs" }
      : activeTab === "albums"
      ? { data: albums, renderItem: renderAlbum, key: "albums" }
      : activeTab === "artists"
      ? { data: artists, renderItem: renderArtist, key: "artists" }
      : activeTab === "playlists"
      ? { data: playlists, renderItem: renderPlaylist, key: "playlists" }
      : { data: songs, renderItem: renderSong, key: "all" };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={Colors.text.muted} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search songs, albums, artists…"
            placeholderTextColor={Colors.text.muted}
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={Colors.text.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.tabRow}>
        <View style={styles.tabCapsule}>
          {tabs.map((t) => {
            const selected = t.key === activeTab;
            return (
              <Pressable
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={({ pressed }) => [
                  styles.tabPill,
                  selected && styles.tabPillActive,
                  pressed && styles.tabPillPressed,
                ]}
              >
                <Text style={[styles.tabText, selected && styles.tabTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!debouncedQuery ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Type to search</Text>
          <Text style={styles.emptyBody}>Results will appear as you type (debounced to reduce API calls).</Text>
        </View>
      ) : loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.button.primary} />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyBody}>{error}</Text>
        </View>
      ) : activeTab === "all" ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionLabel}>Songs</Text>
          <FlatList
            data={songs}
            keyExtractor={(i) => i.id}
            renderItem={renderSong}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={styles.list}
          />
          {albums.length ? <Text style={styles.sectionLabel}>Albums</Text> : null}
          {albums.length ? (
            <FlatList
              data={albums}
              keyExtractor={(i) => i.id}
              renderItem={renderAlbum}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={styles.list}
            />
          ) : null}
          {artists.length ? <Text style={styles.sectionLabel}>Artists</Text> : null}
          {artists.length ? (
            <FlatList
              data={artists}
              keyExtractor={(i) => i.id}
              renderItem={renderArtist}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={styles.list}
            />
          ) : null}
          {playlists.length ? <Text style={styles.sectionLabel}>Playlists</Text> : null}
          {playlists.length ? (
            <FlatList
              data={playlists}
              keyExtractor={(i) => i.id}
              renderItem={renderPlaylist}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={[styles.list, { paddingBottom: 160 }]}
            />
          ) : null}
        </View>
      ) : (
        <FlatList
          data={content.data as never[]}
          key={content.key}
          keyExtractor={(i: any) => i.id}
          renderItem={content.renderItem as any}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={[styles.list, { paddingBottom: 160 }]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No results</Text>
              <Text style={styles.emptyBody}>Try a different search term.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  searchRow: { paddingHorizontal: 16, paddingBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text.primary, fontSize: 14 },

  tabRow: { paddingHorizontal: 16, paddingBottom: 10 },
  tabCapsule: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: 4,
    gap: 4,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabPillActive: { backgroundColor: Colors.button.primary },
  tabPillPressed: { opacity: 0.75 },
  tabText: { fontSize: 12, fontWeight: "700", color: Colors.text.primary },
  tabTextActive: { color: Colors.button.text },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text.muted,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },

  list: { paddingHorizontal: 16 },
  divider: { height: 1, backgroundColor: Colors.border.primary, opacity: 0.35 },

  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  genericRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  rowArt: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.background.card,
  },
  rowMeta: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 14, fontWeight: "700", color: Colors.text.primary },
  rowSub: { fontSize: 12, color: Colors.text.muted },
  rowRight: { alignItems: "flex-end" },
  rowTime: { fontSize: 11, color: Colors.text.muted, marginBottom: 2 },

  loader: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  loadingText: { color: Colors.text.muted, fontSize: 13 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  emptyBody: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});

