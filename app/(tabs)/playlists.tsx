import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddToPlaylistButton } from "@/components/playlists/addToPlaylistButton";
import { AddToPlaylistSheet } from "@/components/playlists/addToPlaylistSheet";
import { CreatePlaylistModal } from "@/components/playlists/createPlaylistModal";
import { PlaylistsEmptyState } from "@/components/playlists/playlistsEmptyState";
import { PlaylistsHeader } from "@/components/playlists/playlistsHeader";
import { PlaylistsRow } from "@/components/playlists/playlistsRow";
import { Colors } from "@/constants/theme";
import { usePlaylistsStore } from "@/store/playlists-store";
import { usePlayerStore } from "@/store/player-store";

export default function PlaylistsScreen() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAddTo, setShowAddTo] = useState(false);

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

  const openCreateAndCloseAddTo = () => {
    setShowAddTo(false);
    setNewName("");
    setShowCreate(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <PlaylistsHeader
        onAddPress={() => {
          setNewName("");
          setShowCreate(true);
        }}
      />

      {playlists.length === 0 ? (
        <PlaylistsEmptyState onCreatePress={() => setShowCreate(true)} />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PlaylistsRow
              playlist={item}
              onDelete={() => deletePlaylist(item.id)}
            />
          )}
        />
      )}

      {currentSong && (
        <AddToPlaylistButton
          currentSong={currentSong}
          onPress={() => setShowAddTo(true)}
        />
      )}

      <CreatePlaylistModal
        visible={showCreate}
        value={newName}
        onChangeText={setNewName}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <AddToPlaylistSheet
        visible={showAddTo}
        currentSong={currentSong}
        playlists={playlists}
        onClose={() => setShowAddTo(false)}
        onAddToPlaylist={handleAddCurrentToPlaylist}
        onCreatePlaylist={openCreateAndCloseAddTo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },
  list: { padding: 16, paddingBottom: 100 },
});
