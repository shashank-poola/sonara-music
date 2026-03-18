import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { usePlaylistsStore } from "@/store/playlists-store";
import { usePlayerStore } from "@/store/player-store";
import { pickBestImageUrl } from "@/types/saavn.type";

export default function PlaylistsScreen() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const playlists = usePlaylistsStore((s) => s.playlists);
  const createPlaylist = usePlaylistsStore((s) => s.createPlaylist);
  const deletePlaylist = usePlaylistsStore((s) => s.deletePlaylist);
  const addSongToPlaylist = usePlaylistsStore((s) => s.addSongToPlaylist);

  const currentSong = usePlayerStore((s) => s.currentSong);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const p = createPlaylist(name);
    setNewName("");
    setShowCreate(false);
    router.push(`/playlist/${p.id}` as never);
  };

  const handleAddCurrentToPlaylist = (playlistId: string) => {
    if (!currentSong) return;
    addSongToPlaylist(playlistId, currentSong);
    setShowAddTo(false);
  };

  const [showAddTo, setShowAddTo] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            setNewName("");
            setShowCreate(true);
          }}
        >
          <Ionicons name="add" size={22} color={Colors.button.text} />
        </Pressable>
      </View>

      {playlists.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="musical-notes"
              size={40}
              color={Colors.button.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>No playlists yet</Text>
          <Text style={styles.emptyBody}>
            Create a playlist and add your favourite songs.
          </Text>
          <Pressable
            style={styles.createBtn}
            onPress={() => setShowCreate(true)}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={Colors.button.text}
            />
            <Text style={styles.createText}>Create Playlist</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => router.push(`/playlist/${item.id}` as never)}
              onLongPress={() => {
                Alert.alert(
                  item.name,
                  "Delete this playlist?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deletePlaylist(item.id),
                    },
                  ]
                );
              }}
            >
              <View style={styles.rowArt}>
                {item.songs[0] ? (
                  <Image
                    source={{ uri: pickBestImageUrl(item.songs[0].image, "150x150") }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                ) : (
                  <Ionicons
                    name="musical-notes"
                    size={28}
                    color={Colors.text.muted}
                    style={styles.rowArtIcon}
                  />
                )}
              </View>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.rowSub}>
                  {item.songs.length} songs
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
            </Pressable>
          )}
        />
      )}

      {currentSong && (
        <Pressable
          style={styles.addCurrentBtn}
          onPress={() => setShowAddTo(true)}
        >
          <Ionicons name="add-circle" size={20} color={Colors.button.primary} />
          <Text style={styles.addCurrentText}>
            {`Add "${currentSong.name}" to playlist`}
          </Text>
        </Pressable>
      )}

      <Modal
        visible={showCreate}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreate(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCreate(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Playlist name"
              placeholderTextColor={Colors.text.muted}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleCreate}
              >
                <Text style={styles.modalBtnTextConfirm}>Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showAddTo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddTo(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddTo(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Add to playlist</Text>
            {playlists.length === 0 ? (
              <Text style={styles.modalSubtext}>
                Create a playlist first from the Playlists tab.
              </Text>
            ) : (
              <View style={styles.playlistList}>
                {playlists.map((p) => (
                  <Pressable
                    key={p.id}
                    style={({ pressed }) => [
                      styles.playlistOption,
                      pressed && styles.rowPressed,
                    ]}
                    onPress={() => handleAddCurrentToPlaylist(p.id)}
                  >
                    <Text style={styles.playlistOptionText}>{p.name}</Text>
                    <Text style={styles.playlistOptionSub}>
                      {p.songs.length} songs
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            <Pressable
              style={[styles.modalBtn, styles.modalBtnCancel]}
              onPress={() => setShowAddTo(false)}
            >
              <Text style={styles.modalBtnTextCancel}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.primary,
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
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 24,
  },
  createText: {
    color: Colors.button.text,
    fontWeight: "700",
    fontSize: 14,
  },
  list: { padding: 16, paddingBottom: 100 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderRadius: 8,
  },
  rowPressed: { opacity: 0.6 },
  rowArt: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  rowArtIcon: { opacity: 0.6 },
  rowMeta: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "600", color: Colors.text.primary },
  rowSub: { fontSize: 13, color: Colors.text.muted, marginTop: 2 },
  addCurrentBtn: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.background.card,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  addCurrentText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  modalSubtext: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.background.app,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: Colors.background.app,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modalBtnConfirm: {
    backgroundColor: Colors.button.primary,
  },
  modalBtnTextCancel: { color: Colors.text.primary, fontWeight: "600" },
  modalBtnTextConfirm: { color: Colors.button.text, fontWeight: "700" },
  playlistList: { marginBottom: 16, maxHeight: 240 },
  playlistOption: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  playlistOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  playlistOptionSub: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
});
