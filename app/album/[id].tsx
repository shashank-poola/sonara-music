import { useLocalSearchParams } from "expo-router";
import { AlbumDetailScreen } from "@/features/albumDetail";

export default function AlbumPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <AlbumDetailScreen albumId={id} />;
}
