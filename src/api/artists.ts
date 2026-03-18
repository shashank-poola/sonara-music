import { saavnGetJson } from "./client";
import type {
  SaavnAlbumDetailsResponse,
  SaavnArtistDetailsResponse,
  SaavnArtistSongsResponse,
} from "@/types/saavn.type";

export function getArtistById(id: string) {
  return saavnGetJson<SaavnArtistDetailsResponse>(
    `/api/artists/${encodeURIComponent(id)}`
  );
}

export function getArtistSongs(
  id: string,
  opts?: { page?: number; sortBy?: string; sortOrder?: string }
) {
  return saavnGetJson<SaavnArtistSongsResponse>(
    `/api/artists/${encodeURIComponent(id)}/songs`,
    {
      page: opts?.page ?? 1,
      sortBy: opts?.sortBy ?? "popularity",
      sortOrder: opts?.sortOrder ?? "desc",
    }
  );
}

export function getArtistAlbums(
  id: string,
  opts?: { page?: number; sortBy?: string; sortOrder?: string }
) {
  return saavnGetJson<SaavnAlbumDetailsResponse>(
    `/api/artists/${encodeURIComponent(id)}/albums`,
    {
      page: opts?.page ?? 1,
      sortBy: opts?.sortBy ?? "popularity",
      sortOrder: opts?.sortOrder ?? "desc",
    }
  );
}
