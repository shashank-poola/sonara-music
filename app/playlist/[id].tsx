import { useLocalSearchParams } from "expo-router";
import { PlaylistDetailScreen } from "@/features/playlistDetail";

export default function PlaylistPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <PlaylistDetailScreen playlistId={id} />;
}
