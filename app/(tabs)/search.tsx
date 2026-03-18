import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryPills } from "@/components/categoryPills";
import { SearchAlbumRow, SearchArtistRow, SearchPlaylistRow, SearchSongRow } from "@/components/searchResultRow";
import { SearchEmptyState } from "@/components/search/searchEmptyState";
import { SearchInput } from "@/components/searchInput";
import { Colors } from "@/constants/theme";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch, type SearchTab } from "@/hooks/useSearch";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import type { SaavnAlbumResult, SaavnArtistResult, SaavnPlaylistResult, SaavnSongSearchResult } from "@/types/saavn.type";
import type { SearchResultItem } from "@/types/search.type";
import { SEARCH_TABS } from "@/types/search.type";


export default function SearchScreen() {
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 450);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");

  const { songs, albums, artists, playlists, loading, error } = useSearch(
    debouncedQuery,
    activeTab
  );

  const handlePlaySong = (
    list: SaavnSongSearchResult[],
    song: SaavnSongSearchResult,
    index: number
  ) => {
    setQueue(list, index);
    setCurrentSong(song);
    router.push("/player" as never);
  };

  const combinedList: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];
    const maxPer = Math.max(
      songs.length,
      albums.length,
      artists.length,
      playlists.length
    );
    for (let i = 0; i < maxPer; i++) {
      if (songs[i]) items.push({ type: "song", data: songs[i] });
      if (albums[i]) items.push({ type: "album", data: albums[i] });
      if (artists[i]) items.push({ type: "artist", data: artists[i] });
      if (playlists[i]) items.push({ type: "playlist", data: playlists[i] });
    }
    return items;
  }, [songs, albums, artists, playlists]);

  const renderCombinedItem = ({ item }: { item: SearchResultItem }) => {
    if (item.type === "song") {
      return (
        <SearchSongRow
          song={item.data}
          onPress={() =>
            handlePlaySong(songs, item.data, songs.indexOf(item.data))
          }
        />
      );
    }
    if (item.type === "album") {
      return (
        <SearchAlbumRow
          album={item.data}
          onPress={() => router.push(`/album/${item.data.id}` as never)}
        />
      );
    }
    if (item.type === "artist") {
      return (
        <SearchArtistRow
          artist={item.data}
          onPress={() => router.push(`/artist/${item.data.id}` as never)}
        />
      );
    }
    return (
      <SearchPlaylistRow
        playlist={item.data}
        onPress={() => router.push(`/playlist/${item.data.id}` as never)}
      />
    );
  };

  const getKey = (item: SearchResultItem) => `${item.type}-${item.data.id}`;

  const content =
    activeTab === "songs"
      ? { data: songs, key: "songs", keyExtractor: (i: SaavnSongSearchResult) => i.id }
      : activeTab === "albums"
      ? { data: albums, key: "albums", keyExtractor: (i: SaavnAlbumResult) => i.id }
      : activeTab === "artists"
      ? { data: artists, key: "artists", keyExtractor: (i: SaavnArtistResult) => i.id }
      : activeTab === "playlists"
      ? { data: playlists, key: "playlists", keyExtractor: (i: SaavnPlaylistResult) => i.id }
      : null;

  const renderSong = ({
    item,
    index,
  }: {
    item: SaavnSongSearchResult;
    index: number;
  }) => (
    <SearchSongRow
      song={item}
      onPress={() => handlePlaySong(songs, item, index)}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <SearchInput value={query} onChangeText={setQuery} />

      <CategoryPills
        tabs={SEARCH_TABS}
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k as SearchTab)}
      />

      {!debouncedQuery ? (
        <SearchEmptyState
          title="Start searching"
          body="Find songs, albums, artists, and playlists."
        />
      ) : loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.button.primary} />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      ) : error ? (
        <SearchEmptyState
          title="Something went wrong"
          body={error}
        />
      ) : activeTab === "all" ? (
        <FlatList
          data={combinedList}
          key="all"
          keyExtractor={getKey}
          renderItem={renderCombinedItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={[styles.list, { paddingBottom: 160 }]}
          ListEmptyComponent={
            <SearchEmptyState
              title="No results"
              body="Try a different search term."
            />
          }
        />
      ) : content ? (
        <FlatList
          data={content.data}
          key={content.key}
          keyExtractor={content.keyExtractor}
          renderItem={({ item, index }) =>
            activeTab === "songs" ? (
              renderSong({ item: item as SaavnSongSearchResult, index })
            ) : activeTab === "albums" ? (
              <SearchAlbumRow
                album={item as SaavnAlbumResult}
                onPress={() => router.push(`/album/${(item as SaavnAlbumResult).id}` as never)}
              />
            ) : activeTab === "artists" ? (
              <SearchArtistRow
                artist={item as SaavnArtistResult}
                onPress={() => router.push(`/artist/${(item as SaavnArtistResult).id}` as never)}
              />
            ) : (
              <SearchPlaylistRow
                playlist={item as SaavnPlaylistResult}
                onPress={() => router.push(`/playlist/${(item as SaavnPlaylistResult).id}` as never)}
              />
            )
          }
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={[styles.list, { paddingBottom: 160 }]}
          ListEmptyComponent={
            <SearchEmptyState
              title="No results"
              body="Try a different search term."
            />
          }
        />
      ) : null}
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
  list: { paddingHorizontal: 16 },
  divider: { height: 1, backgroundColor: Colors.border.primary, opacity: 0.35 },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: { color: Colors.text.muted, fontSize: 13 },
});
