import { saavnGetJson } from "./client";
import type { SaavnPlaylistDetailsResponse } from "@/types/saavn.type";

export function getPlaylistById(id: string) {
  return saavnGetJson<SaavnPlaylistDetailsResponse>("/api/playlists", { id });
}
