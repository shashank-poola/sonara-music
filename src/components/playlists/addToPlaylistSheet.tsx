import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "@/constants/theme";
import type { UserPlaylist } from "@/store/playlists-store";
import type { SaavnSongSearchResult } from "@/types/saavn.type";
import { pickBestImageUrl } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";

type AddToPlaylistSheetProps = {
  visible: boolean;
  currentSong: SaavnSongSearchResult | null;
  playlists: UserPlaylist[];
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
  onCreatePlaylist: () => void;
};

export function AddToPlaylistSheet({
  visible,
  currentSong,
  playlists,
  onClose,
  onAddToPlaylist,
  onCreatePlaylist,
}: AddToPlaylistSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.addToOverlay} onPress={onClose}>
        <Pressable style={styles.addToSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.addToHandle} />
          <Text style={styles.addToTitle}>Add to playlist</Text>
          {currentSong && (
            <View style={styles.addToSongPreview}>
              <Text style={styles.addToSongName} numberOfLines={1}>
                {currentSong.name}
              </Text>
              <Text style={styles.addToSongArtist} numberOfLines={1}>
                {getDisplayArtist(currentSong)}
              </Text>
            </View>
          )}
          {playlists.length === 0 ? (
            <View style={styles.addToEmpty}>
              <Ionicons
                name="musical-notes-outline"
                size={48}
                color={Colors.text.muted}
              />
              <Text style={styles.addToEmptyText}>No playlists yet</Text>
              <Text style={styles.addToEmptySub}>
                Create a playlist first to add songs
              </Text>
              <Pressable style={styles.addToCreateBtn} onPress={onCreatePlaylist}>
                <Text style={styles.addToCreateText}>Create Playlist</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              style={styles.addToPlaylistScroll}
              showsVerticalScrollIndicator={false}
            >
              {playlists.map((p) => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [
                    styles.addToPlaylistItem,
                    pressed && styles.addToPlaylistItemPressed,
                  ]}
                  onPress={() => onAddToPlaylist(p.id)}
                >
                  <View style={styles.addToPlaylistArt}>
                    {p.songs[0] ? (
                      <Image
                        source={{ uri: pickBestImageUrl(p.songs[0].image, "150x150") }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    ) : (
                      <Ionicons
                        name="musical-notes"
                        size={24}
                        color={Colors.text.muted}
                      />
                    )}
                  </View>
                  <View style={styles.addToPlaylistMeta}>
                    <Text style={styles.addToPlaylistName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.addToPlaylistCount}>
                      {p.songs.length} songs
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color={Colors.button.primary} />
                </Pressable>
              ))}
            </ScrollView>
          )}
          <Pressable style={styles.addToCloseBtn} onPress={onClose}>
            <Text style={styles.addToCloseText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  addToOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  addToSheet: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "70%",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border.primary,
  },
  addToHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.text.muted,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  addToTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  addToSongPreview: {
    backgroundColor: Colors.background.app,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  addToSongName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  addToSongArtist: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 4,
  },
  addToEmpty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  addToEmptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  addToEmptySub: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  addToCreateBtn: {
    marginTop: 8,
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addToCreateText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.button.text,
  },
  addToPlaylistScroll: {
    maxHeight: 280,
    marginBottom: 16,
  },
  addToPlaylistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  addToPlaylistItemPressed: { opacity: 0.6 },
  addToPlaylistArt: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.background.app,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  addToPlaylistMeta: { flex: 1 },
  addToPlaylistName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  addToPlaylistCount: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 2,
  },
  addToCloseBtn: {
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  addToCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
