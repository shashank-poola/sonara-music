import { saavnGetJson } from "./client";
import type { SaavnAlbumDetailsResponse } from "@/types/saavn";

export function getAlbumById(id: string) {
  return saavnGetJson<SaavnAlbumDetailsResponse>(
    `/api/albums/${encodeURIComponent(id)}`
  );
}
