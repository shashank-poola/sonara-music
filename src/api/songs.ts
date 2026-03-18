import { saavnGetJson } from "./client";
import type { SaavnSongDetailsResponse } from "@/types/saavn.type";

export function getSongById(id: string) {
  return saavnGetJson<SaavnSongDetailsResponse>(
    `/api/songs/${encodeURIComponent(id)}`
  );
}

export function getSongSuggestions(id: string) {
  return saavnGetJson<SaavnSongDetailsResponse>(
    `/api/songs/${encodeURIComponent(id)}/suggestions`
  );
}
