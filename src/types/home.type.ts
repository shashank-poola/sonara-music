import { SaavnAlbumResult } from "./saavn.type";
import { SaavnArtistResult } from "./saavn.type";
import { HomeCategoryKey } from "@/components/home/homeCategoryPills";
import { SaavnPlaylistResult } from "./saavn.type";
import { SaavnSongSearchResult } from "./saavn.type";

export type HomeAlbumCardProps = {
    album: SaavnAlbumResult;
    variant: "horizontal" | "grid";
    cardSize?: number;
};

export type HomeArtistCardProps = {
    artist: SaavnArtistResult;
    variant: "horizontal" | "grid";
    cardSize?: number;
};

export type HomeCategoryPillsProps = {
    activeKey: HomeCategoryKey;
    onSelect: (key: HomeCategoryKey) => void;
};

export type HomeLoaderErrorProps = {
    loading: boolean;
    error: string | null;
    onRetry: () => void;
};

export type HomePlaylistCardProps = {
    playlist: SaavnPlaylistResult;
    variant: "horizontal" | "grid";
    cardSize?: number;
};

export type HomeSongRowProps = {
    song: SaavnSongSearchResult;
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    onPress: () => void;
};

export type HomeTrendingCarouselProps = {
    songs: SaavnSongSearchResult[];
    onPlaySong: (index: number) => void;
};

export type CategoryTab = {
    key: string;
    label: string;
  };
  
export type CategoryPillsProps = {
    tabs: CategoryTab[];
    activeKey: string;
    onSelect: (key: string) => void;
};