import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useDownloadsStore } from "@/store/downloads-store";
import type { SaavnSongSearchResult } from "@/types/saavn.type";
import { getDisplayArtist } from "@/utils/artistDisplay";

type PlayerExtraRowProps = {
  currentSong: SaavnSongSearchResult | null;
  onShowQueue: () => void;
};

export function PlayerExtraRow({ currentSong, onShowQueue }: PlayerExtraRowProps) {
  const addDownload = useDownloadsStore((s) => s.addDownload);
  const isDownloaded = useDownloadsStore((s) => s.isDownloaded);
  const isDownloading = useDownloadsStore((s) => s.isDownloading);

  const handleDownload = async () => {
    if (!currentSong) return;
    const ok = await addDownload(currentSong);
    if (!ok) {
      Alert.alert("Download failed", "Could not download this song.");
    }
  };

  const handleShare = async () => {
    if (!currentSong) return;
    const artist = getDisplayArtist(currentSong);
    const slug = currentSong.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const shareUrl = `https://www.jiosaavn.com/song/${slug}/${currentSong.id}`;
    const message = `Listen to "${currentSong.name}" by ${artist}\n${shareUrl}`;
    try {
      await Share.share({
        message,
        title: `Share: ${currentSong.name}`,
      });
    } catch {
      // User cancelled
    }
  };

  const downloaded = currentSong ? isDownloaded(currentSong.id) : false;
  const downloading = currentSong && isDownloading === currentSong.id;

  return (
    <View style={styles.extraRow}>
      <Pressable
        style={styles.extraBtn}
        hitSlop={8}
        onPress={handleDownload}
        disabled={!currentSong || downloading}
      >
        <Ionicons
          name={
            downloading
              ? "hourglass-outline"
              : downloaded
                ? "checkmark-circle"
                : "cloud-download-outline"
          }
          size={22}
          color={
            downloaded ? Colors.status.success : Colors.text.muted
          }
        />
        <Text style={styles.extraText}>
          {downloading ? "Downloading…" : downloaded ? "Downloaded" : "Download"}
        </Text>
      </Pressable>
      <Pressable style={styles.extraBtn} hitSlop={8} onPress={onShowQueue}>
        <Ionicons
          name="list-outline"
          size={22}
          color={Colors.text.muted}
        />
        <Text style={styles.extraText}>Queue</Text>
      </Pressable>
      <Pressable
        style={styles.extraBtn}
        hitSlop={8}
        onPress={handleShare}
        disabled={!currentSong}
      >
        <Ionicons
          name="share-outline"
          size={22}
          color={Colors.text.muted}
        />
        <Text style={styles.extraText}>Share</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  extraRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  extraBtn: { alignItems: "center", gap: 6, padding: 8 },
  extraText: { fontSize: 11, color: Colors.text.muted },
});
