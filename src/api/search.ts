import { saavnGetJson } from "./client";
import type {
  SaavnSearchAllResponse,
  SaavnSearchAlbumsResponse,
  SaavnSearchArtistsResponse,
  SaavnSearchPlaylistsResponse,
  SaavnSearchSongsResponse,
} from "@/types/saavn";

type PaginationOpts = { page?: number; limit?: number };

export function searchAll(query: string, opts?: PaginationOpts) {
  return saavnGetJson<SaavnSearchAllResponse>("/api/search", {
    query,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 10,
  });
}

export function searchSongs(query: string, opts?: PaginationOpts) {
  return saavnGetJson<SaavnSearchSongsResponse>("/api/search/songs", {
    query,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 20,
  });
}

export function searchAlbums(query: string, opts?: PaginationOpts) {
  return saavnGetJson<SaavnSearchAlbumsResponse>("/api/search/albums", {
    query,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 20,
  });
}

export function searchArtists(query: string, opts?: PaginationOpts) {
  return saavnGetJson<SaavnSearchArtistsResponse>("/api/search/artists", {
    query,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 20,
  });
}

export function searchPlaylists(query: string, opts?: PaginationOpts) {
  return saavnGetJson<SaavnSearchPlaylistsResponse>("/api/search/playlists", {
    query,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 20,
  });
}
