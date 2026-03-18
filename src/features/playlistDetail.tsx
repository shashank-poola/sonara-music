import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlaylistById } from "@/api/playlists";
import { Colors } from "@/constants/theme";
import { usePlaylistsStore } from "@/store/playlists-store";
import { usePlayerStore } from "@/store/player-store";
import { useQueueStore } from "@/store/queue-store";
import { PlaylistDetailScreenProps, PlaylistData } from "@/types/playlists.type";
import {
  formatDuration,
  pickBestImageUrl,
  type SaavnSongDetails,
} from "@/types/saavn.type";

function songToSearchResult(s: SaavnSongDetails) {
  return {
    id: s.id,
    name: s.name,
    duration: String(s.duration ?? 0),
    primaryArtists: s.artists?.primary?.map((a) => a.name).join(", "),
    image: s.image,
    downloadUrl: s.downloadUrl,
    album: s.album,
  };
}

export function PlaylistDetailScreen({ playlistId }: PlaylistDetailScreenProps) {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = useQueueStore((s) => s.setQueue);
  const getPlaylistByIdLocal = usePlaylistsStore((s) => s.getPlaylistById);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (playlistId.startsWith("local-")) {
        const local = getPlaylistByIdLocal(playlistId);
        if (local) {
          const asDetails: SaavnSongDetails[] = local.songs.map((s) => ({
            id: s.id,
            name: s.name,
            duration: s.duration ? parseInt(s.duration, 10) : 0,
            artists: s.primaryArtists
              ? { primary: [{ id: "", name: s.primaryArtists }] }
              : undefined,
            image: s.image,
            downloadUrl: s.downloadUrl,
            album: s.album,
          }));
          setPlaylist({
            name: local.name,
            songs: asDetails,
            coverUrl: pickBestImageUrl(local.songs[0]?.image, "500x500"),
          });
        } else {
          setError("Playlist not found");
        }
      } else {
        const res = await getPlaylistById(playlistId);
        const data = res.data;
        setPlaylist({
          name: data.name,
          songs: data.songs ?? [],
          coverUrl: pickBestImageUrl(data.image, "500x500"),
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  }, [playlistId, getPlaylistByIdLocal]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePlaySong = (song: SaavnSongDetails, index: number) => {
    const songs = playlist?.songs ?? [];
    const list = songs.map(songToSearchResult);
    setQueue(list, index);
    setCurrentSong(songToSearchResult(song));
    router.push("/player" as never);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.button.primary} size="large" />
          <Text style={styles.loadingText}>Loading playlist…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !playlist) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? "Playlist not found"}</Text>
          <Pressable onPress={load} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const coverUrl =
    playlist.coverUrl ?? pickBestImageUrl(playlist.songs[0]?.image, "500x500");
  const songs = playlist.songs ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {playlist.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            contentFit="cover"
          />
          <Text style={styles.title}>{playlist.name}</Text>
          <Text style={styles.subtitle}>
            {songs.length} songs
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Songs</Text>
        {songs.map((song, index) => (
          <Pressable
            key={song.id}
            style={({ pressed }) => [
              styles.songRow,
              pressed && styles.songRowPressed,
            ]}
            onPress={() => handlePlaySong(song, index)}
          >
            <Text style={styles.songIndex}>{index + 1}</Text>
            <Image
              source={{ uri: pickBestImageUrl(song.image, "150x150") }}
              style={styles.songArt}
              contentFit="cover"
            />
            <View style={styles.songMeta}>
              <Text style={styles.songName} numberOfLines={1}>
                {song.name}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {song.artists?.primary?.map((a) => a.name).join(", ") ??
                  "Unknown artist"}
              </Text>
            </View>
            <Text style={styles.songDuration}>
              {formatDuration(song.duration)}
            </Text>
            <Ionicons name="play-circle" size={28} color={Colors.text.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.app },
  backBtn: { padding: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: Colors.text.muted, fontSize: 14 },
  errorText: { color: Colors.text.secondary, textAlign: "center", padding: 20 },
  retryBtn: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: Colors.button.text, fontWeight: "700", fontSize: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  scroll: { paddingBottom: 120 },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.background.card,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  songRowPressed: { opacity: 0.6 },
  songIndex: {
    width: 24,
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
  songArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
  },
  songMeta: { flex: 1, gap: 2 },
  songName: { fontSize: 14, fontWeight: "600", color: Colors.text.primary },
  songArtist: { fontSize: 12, color: Colors.text.muted },
  songDuration: { fontSize: 11, color: Colors.text.muted },
});
