import { saavnGetJson } from "./client";
import type { SaavnPlaylistDetailsResponse } from "@/types/saavn";

export function getPlaylistById(id: string) {
  return saavnGetJson<SaavnPlaylistDetailsResponse>(
    `/api/playlists/${encodeURIComponent(id)}`
  );
}
