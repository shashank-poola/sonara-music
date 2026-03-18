import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { formatDuration, pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtist, getDisplayArtistForAlbum } from "@/utils/artistDisplay";
import type {
  SaavnAlbumResult,
  SaavnArtistResult,
  SaavnPlaylistResult,
  SaavnSongSearchResult,
} from "@/types/saavn.type";

type SongRowProps = {
  song: SaavnSongSearchResult;
  onPress: () => void;
};

export function SearchSongRow({ song, onPress }: SongRowProps) {
  return (
    <Pressable style={styles.songRow} onPress={onPress}>
      <Image
        source={{ uri: pickBestImageUrl(song.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {song.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {getDisplayArtist(song)}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {song.duration ? (
          <Text style={styles.rowTime}>{formatDuration(song.duration)}</Text>
        ) : null}
        <Ionicons name="play-circle" size={30} color={Colors.text.primary} />
      </View>
    </Pressable>
  );
}

type AlbumRowProps = {
  album: SaavnAlbumResult;
  onPress: () => void;
};

export function SearchAlbumRow({ album, onPress }: AlbumRowProps) {
  return (
    <Pressable style={styles.genericRow} onPress={onPress}>
      <Image
        source={{ uri: pickBestImageUrl(album.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {getDisplayArtistForAlbum(album)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );
}

type ArtistRowProps = {
  artist: SaavnArtistResult;
  onPress: () => void;
};

export function SearchArtistRow({ artist, onPress }: ArtistRowProps) {
  return (
    <Pressable style={styles.genericRow} onPress={onPress}>
      <Image
        source={{ uri: pickBestImageUrl(artist.image, "150x150") }}
        style={[styles.rowArt, { borderRadius: 999 }]}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {artist.role || "Artist"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );
}

type PlaylistRowProps = {
  playlist: SaavnPlaylistResult;
  onPress: () => void;
};

export function SearchPlaylistRow({ playlist, onPress }: PlaylistRowProps) {
  return (
    <Pressable style={styles.genericRow} onPress={onPress}>
      <Image
        source={{ uri: pickBestImageUrl(playlist.image, "150x150") }}
        style={styles.rowArt}
        contentFit="cover"
      />
      <View style={styles.rowMeta}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {playlist.songCount
            ? `${playlist.songCount} songs`
            : playlist.language || "Playlist"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
